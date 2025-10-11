/**
 * Cloudflare Pages Function: Task API Handler
 * Handles all /task/api/* routes as a serverless function
 * 
 * Route: /task/api/[[path]].js
 * Matches: /task/api, /task/api/*, /task/api/123/complete, etc.
 */

import { createTaskRouter } from '../lib/router.js';

// Environment configuration for Cloudflare Pages
const getConfig = (env) => ({
  dataPath: env.TASK_DATA_PATH || '/tmp/task-data', // Cloudflare uses /tmp for ephemeral storage
  environment: env.NODE_ENV || 'production'
});

// Authentication middleware adapted for Cloudflare Pages
function authenticate(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key') || 
              request.headers.get('x-admin-key') || 
              request.headers.get('cookie')?.match(/auth=([^;]+)/)?.[1];
  
  let userType = 'public';
  
  if (key) {
    if (key === env.ADMIN_KEY) {
      userType = 'admin';
    } else if (key === env.FRIEND_KEY) {
      userType = 'friend';
    }
  }
  
  console.log(`[Auth] Key: ${key ? key.substring(0, 8) + '...' : 'none'}, UserType: ${userType}`);
  
  return userType;
}

// Convert Express Request to Cloudflare-compatible format
function createExpressLikeRequest(cfRequest, userType) {
  const url = new URL(cfRequest.url);
  
  return {
    method: cfRequest.method,
    url: url.pathname + url.search,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers: Object.fromEntries(cfRequest.headers),
    userType,
    body: null, // Will be populated for POST/PATCH
    get: function(header) {
      return this.headers[header.toLowerCase()];
    }
  };
}

// Convert Express Response to Cloudflare Response
function createExpressLikeResponse() {
  let statusCode = 200;
  let headers = { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-User-Type'
  };
  let body = null;
  
  return {
    status: function(code) {
      statusCode = code;
      return this;
    },
    setHeader: function(name, value) {
      headers[name] = value;
      return this;
    },
    json: function(data) {
      body = JSON.stringify(data);
      return this;
    },
    send: function(data) {
      body = data;
      return this;
    },
    end: function() {
      return this;
    },
    // Build final Response object
    toResponse: function() {
      return new Response(body, {
        status: statusCode,
        headers
      });
    }
  };
}

// Main Cloudflare Pages Function handler
export async function onRequest(context) {
  const { request, env } = context;
  
  console.log(`[CF Function] ${request.method} ${new URL(request.url).pathname}`);
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-User-Type'
      }
    });
  }
  
  try {
    // Authenticate user
    const userType = authenticate(request, env);
    
    // Block public access (they should use localStorage)
    if (userType === 'public') {
      return new Response(JSON.stringify({
        error: 'Public users should use browser storage',
        message: 'API access is only available for authenticated users'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse request body for POST/PATCH/DELETE
    let bodyData = null;
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        bodyData = await request.json();
      }
    }
    
    // Create Express-like request/response objects
    const req = createExpressLikeRequest(request, userType);
    req.body = bodyData;
    req.userType = userType;
    
    const res = createExpressLikeResponse();
    
    // Create task router
    const config = getConfig(env);
    const router = createTaskRouter(config);
    
    // Extract the path after /task/api
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/task/api', '') || '/';
    req.path = apiPath;
    req.url = apiPath + url.search;
    
    console.log(`[Router] Routing to: ${req.method} ${apiPath}`);
    
    // Route the request through Express router
    // Note: This is a simplified router - for complex routing, consider using a proper Express adapter
    await new Promise((resolve, reject) => {
      router.handle(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    return res.toResponse();
    
  } catch (error) {
    console.error('[CF Function Error]', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
