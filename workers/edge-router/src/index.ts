/**
 * Edge Router Worker for hadoku.me
 * 
 * Handles all traffic to hadoku.me/* with intelligent API fallback routing.
 * - API routes (/task/api/*, /watchparty/api/*): Apply fallback logic
 * - Static routes: Proxy to GitHub Pages
 * 
 * Configuration is injected from GitHub Secrets via ROUTE_CONFIG env var.
 */

import { logToAnalytics } from './logging';
import type { LogEntry } from './logging';

interface Env {
  ROUTE_CONFIG: string;
  LOCAL_BASE: string;
  WORKER_BASE: string;
  LAMBDA_BASE: string;
  STATIC_ORIGIN: string;
  TASK_API?: any; // Optional service binding
  ANALYTICS_ENGINE?: any; // Analytics Engine binding
  SESSIONS_KV?: KVNamespace; // Session storage
}

interface RouteConfig {
  global_priority: string;
  task_priority?: string;
  watchparty_priority?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const startTime = Date.now();
    
    let response: Response;
    let backend: LogEntry['backend'];

    // Session management endpoint
    if (path === '/session/create' && request.method === 'POST') {
      response = await handleCreateSession(request, env);
      backend = 'session';
    }
    // API routes: apply fallback logic with key injection
    else if (path.startsWith('/task/api') || path.startsWith('/watchparty/api')) {
      const result = await handleApiRoute(request, path, env);
      response = result.response;
      backend = result.backend;
    } else {
      // Static files: proxy to GitHub Pages
      response = await proxyToGitHubPages(request, path, env);
      backend = 'static';
    }
    
    // Log to Analytics Engine (non-blocking, immediate)
    const duration = Date.now() - startTime;
    logToAnalytics(env, {
      timestamp: new Date().toISOString(),
      path,
      method: request.method,
      backend,
      status: response.status,
      duration,
      userAgent: request.headers.get('user-agent')?.substring(0, 100)
    });
    
    return response;
  }
};

/**
 * Handle API routes with fallback logic and key injection
 */
async function handleApiRoute(
  request: Request, 
  path: string, 
  env: Env
): Promise<{ response: Response; backend: LogEntry['backend'] }> {
  const bases = basesFor(path, env);
  
  // Look up session and inject key if present
  const sessionId = request.headers.get('X-Session-Id');
  const key = sessionId ? await getKeyForSession(sessionId, env) : null;
  
  if (sessionId && !key) {
    console.warn(`Session ${sessionId} not found or expired`);
  }
  
  // Read body once so we can reuse it in fallback attempts
  const bodyBuffer = request.body ? await request.arrayBuffer() : null;
  
  let lastErr: Error | null = null;
  
  for (const base of bases) {
    try {
      const targetUrl = new URL(path, base).toString();
      
      // Clone headers and add loop prevention
      const headers = new Headers(request.headers);
      headers.set('X-No-Fallback', '1');
      
      // Inject the key if we have one from the session
      if (key) {
        headers.set('X-User-Key', key);
        console.log(`Injected key from session ${sessionId} -> ${key.substring(0, 8)}...`);
      }
      
      // Create request with timeout
      const res = await Promise.race([
        fetch(targetUrl, {
          method: request.method,
          headers,
          body: bodyBuffer,
          redirect: 'manual'
        }),
        new Promise<Response>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout after 2500ms')), 2500)
        )
      ]);

      // Fallback on 404 or 5xx errors (but not 401, 403, etc.)
      if (res.status === 404 || res.status >= 500) {
        throw new Error(`Backend returned HTTP ${res.status}`);
      }

      // Success - add tracing header
      const newRes = new Response(res.body, res);
      newRes.headers.set('X-Backend-Source', base);
      
      // Determine backend type for logging
      let backend: LogEntry['backend'];
      if (base === env.LOCAL_BASE) backend = 'tunnel';
      else if (base === env.WORKER_BASE) backend = 'worker';
      else if (base === env.LAMBDA_BASE) backend = 'lambda';
      else backend = 'error';
      
      return { response: newRes, backend };
      
    } catch (e) {
      lastErr = e as Error;
      console.log(`Failed ${base}: ${lastErr.message}`);
      // Continue to next provider
    }
  }

  // All backends failed
  const errorResponse = new Response(
    JSON.stringify({ 
      error: 'All backends failed', 
      details: lastErr?.message,
      attempted: bases
    }),
    { 
      status: 502, 
      headers: { 
        'Content-Type': 'application/json',
        'X-Backend-Source': 'none'
      }
    }
  );
  
  return { response: errorResponse, backend: 'error' };
}

/**
 * Proxy static content to GitHub Pages
 */
async function proxyToGitHubPages(request: Request, path: string, env: Env): Promise<Response> {
  const targetUrl = new URL(path, env.STATIC_ORIGIN).toString();
  
  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      redirect: 'follow'
    });
    
    // Add header to indicate source
    const newRes = new Response(res.body, res);
    newRes.headers.set('X-Backend-Source', 'github-pages');
    return newRes;
    
  } catch (e) {
    return new Response(`Failed to fetch from GitHub Pages: ${(e as Error).message}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Determine ordered list of backend URLs to try based on routing config
 */
function basesFor(path: string, env: Env): string[] {
  const appName = path.split('/')[1]; // "task" or "watchparty"
  
  // Parse ROUTE_CONFIG (injected at deploy time from GitHub Secret)
  let config: RouteConfig;
  try {
    config = JSON.parse(env.ROUTE_CONFIG || '{"global_priority":"12"}');
  } catch (e) {
    console.error('Failed to parse ROUTE_CONFIG, using default:', e);
    config = { global_priority: '12' };
  }
  
  // Check for per-app override, then global default
  const key = config[`${appName}_priority` as keyof RouteConfig] || config.global_priority || '12';
  
  // Provider mapping
  const table: Record<string, string> = {
    '1': env.LOCAL_BASE,    // Cloudflare Tunnel
    '2': env.WORKER_BASE,   // task-api Worker
    '3': env.LAMBDA_BASE    // AWS Lambda (optional)
  };
  
  // Convert priority string to ordered array of base URLs
  return String(key)
    .split('')
    .map(digit => table[digit])
    .filter(Boolean); // Remove undefined values
}

/**
 * Generate a secure random session ID
 */
function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Handle session creation: POST /session/create with { key: "..." }
 * Returns { sessionId: "..." }
 */
async function handleCreateSession(request: Request, env: Env): Promise<Response> {
  if (!env.SESSIONS_KV) {
    return new Response(
      JSON.stringify({ error: 'Session storage not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json() as { key?: string };
    const key = body.key;

    if (!key || typeof key !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid key' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate session ID
    const sessionId = generateSessionId();

    // Store mapping: sessionId -> key (expires in 24 hours)
    await env.SESSIONS_KV.put(`session:${sessionId}`, key, {
      expirationTtl: 86400 // 24 hours
    });

    console.log(`Created session ${sessionId} for key ${key.substring(0, 8)}...`);

    return new Response(
      JSON.stringify({ sessionId }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow from static pages
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (e) {
    console.error('Error creating session:', e);
    return new Response(
      JSON.stringify({ error: 'Failed to create session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Look up the key for a given sessionId
 */
async function getKeyForSession(sessionId: string | null, env: Env): Promise<string | null> {
  if (!sessionId || !env.SESSIONS_KV) {
    return null;
  }

  try {
    const key = await env.SESSIONS_KV.get(`session:${sessionId}`);
    return key;
  } catch (e) {
    console.error('Error fetching session:', e);
    return null;
  }
}
