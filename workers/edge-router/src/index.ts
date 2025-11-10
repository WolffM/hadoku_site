/**
 * Edge Router Worker for hadoku.me
 * 
 * Handles all traffic to hadoku.me/* with intelligent API fallback routing.
 * - API routes (/task/api/*, /watchparty/api/*): Apply fallback logic
 * - Static routes: Proxy to GitHub Pages
 * 
 * Configuration is injected from GitHub Secrets via ROUTE_CONFIG env var.
 */

import { Hono } from 'hono';
import type { Context } from 'hono';
import { logToAnalytics } from './logging';
import type { LogEntry } from './logging';
import { 
  badRequest, 
  serverError, 
  createCorsMiddleware,
  DEFAULT_HADOKU_ORIGINS,
  logRequest,
  logError,
  maskKey,
  maskSessionId
} from '../../util';

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

type AppContext = {
  Bindings: Env;
  Variables: {
    startTime: number;
    backend: LogEntry['backend'];
  };
};

const app = new Hono<AppContext>();

// 1. CORS Middleware - Same configuration as task-api for consistency
app.use('*', createCorsMiddleware({
  origins: DEFAULT_HADOKU_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-User-Key', 'X-Session-Id', 'Content-Type'],
  exposedHeaders: ['X-Backend-Source'],
  credentials: true,
  maxAge: 86400
}));

// 2. Timing middleware
app.use('*', async (c, next) => {
  c.set('startTime', Date.now());
  await next();
});

// 3. Session creation endpoint
app.post('/session/create', async (c) => {
  if (!c.env.SESSIONS_KV) {
    return serverError(c, 'Session storage not configured');
  }

  try {
    // Read key from header (NEVER from body for security)
    const key = c.req.header('X-User-Key');

    if (!key) {
      return badRequest(c, 'Missing X-User-Key header');
    }

    // Generate session ID
    const sessionId = generateSessionId();

    // Store mapping: sessionId -> key (expires in 24 hours)
    await c.env.SESSIONS_KV.put(`session:${sessionId}`, key, {
      expirationTtl: 86400 // 24 hours
    });

    logRequest('POST', '/session/create', { 
      sessionId: maskSessionId(sessionId),
      keyPreview: maskKey(key)
    });

    c.set('backend', 'session');
    return c.json({ sessionId });
  } catch (e) {
    logError('POST', '/session/create', (e as Error).message);
    return serverError(c, 'Failed to create session');
  }
});

// 4. API routes with fallback logic
app.all('/task/api/*', async (c) => handleApiRoute(c));
app.all('/watchparty/api/*', async (c) => handleApiRoute(c));

// 5. Static files - proxy to GitHub Pages
app.all('*', async (c) => proxyToGitHubPages(c));

// 6. Analytics logging (after response)
app.use('*', async (c, next) => {
  await next();
  
  const duration = Date.now() - c.get('startTime');
  logToAnalytics(c.env, {
    timestamp: new Date().toISOString(),
    path: c.req.path,
    method: c.req.method,
    backend: c.get('backend') || 'unknown',
    status: c.res.status,
    duration,
    userAgent: c.req.header('user-agent')?.substring(0, 100)
  });
});

export default app;

/**
 * Handle API routes with fallback logic and key injection
 */
async function handleApiRoute(c: Context<AppContext>): Promise<Response> {
  const bases = basesFor(c.req.path, c.env);
  
  // Look up session and inject key if present
  const sessionId = c.req.header('X-Session-Id');
  const key = sessionId ? await getKeyForSession(sessionId, c.env) : null;
  
  if (sessionId && !key) {
    console.warn(`Session ${sessionId} not found or expired`);
  }
  
  // Read body once so we can reuse it in fallback attempts
  const bodyBuffer = c.req.raw.body ? await c.req.arrayBuffer() : null;
  
  let lastErr: Error | null = null;
  
  for (const base of bases) {
    try {
      const targetUrl = new URL(c.req.path, base).toString();
      
      // Clone headers and add loop prevention
      const headers = new Headers(c.req.raw.headers);
      headers.set('X-No-Fallback', '1');
      
      // Inject the key from session
      if (key) {
        headers.set('X-User-Key', key);
        logRequest(c.req.method, c.req.path, {
          action: 'key_injection',
          sessionId: sessionId ? maskSessionId(sessionId) : 'none',
          keyPreview: maskKey(key)
        });
      }
      
      // Create request with timeout
      const res = await Promise.race([
        fetch(targetUrl, {
          method: c.req.method,
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
      if (base === c.env.LOCAL_BASE) backend = 'tunnel';
      else if (base === c.env.WORKER_BASE) backend = 'worker';
      else if (base === c.env.LAMBDA_BASE) backend = 'lambda';
      else backend = 'error';
      
      c.set('backend', backend);
      return newRes;
      
    } catch (e) {
      lastErr = e as Error;
      logError(c.req.method, c.req.path, `Backend ${base} failed: ${lastErr.message}`);
      // Continue to next provider
    }
  }

  // All backends failed
  c.set('backend', 'error');
  return serverError(c, 'All backends failed', {
    details: lastErr?.message,
    attempted: bases
  });
}

/**
 * Proxy static content to GitHub Pages
 */
async function proxyToGitHubPages(c: Context<AppContext>): Promise<Response> {
  const targetUrl = new URL(c.req.path, c.env.STATIC_ORIGIN).toString();

  try {
    const res = await fetch(targetUrl, {
      method: c.req.method,
      headers: c.req.raw.headers,
      redirect: 'follow'
    });

    const contentType = res.headers.get('content-type') || '';

    // Strip Cloudflare analytics beacon from HTML responses
    if (contentType.includes('text/html')) {
      let html = await res.text();

      // Remove Cloudflare Insights beacon script
      html = html.replace(
        /<script[^>]*src=["'][^"']*cloudflareinsights\.com[^"']*["'][^>]*><\/script>/gi,
        ''
      );

      // Create response with modified HTML
      const newRes = new Response(html, {
        status: res.status,
        statusText: res.statusText,
        headers: new Headers(res.headers)
      });
      newRes.headers.set('X-Backend-Source', 'github-pages');
      newRes.headers.set('X-Beacon-Stripped', 'true');
      
      c.set('backend', 'static');
      return newRes;
    }

    // For non-HTML content, pass through unchanged
    const newRes = new Response(res.body, res);
    newRes.headers.set('X-Backend-Source', 'github-pages');
    
    c.set('backend', 'static');
    return newRes;

  } catch (e) {
    c.set('backend', 'error');
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
    logError('CONFIG', 'basesFor', `Failed to parse ROUTE_CONFIG: ${(e as Error).message}`);
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
    logError('SESSION', 'getKeyForSession', (e as Error).message);
    return null;
  }
}
