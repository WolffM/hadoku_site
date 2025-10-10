/**
 * Hadoku Site API Server
 * Hosts both hadoku.me (static Astro site) and api.hadoku.me (Express API)
 */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createTaskRouter } from './apps/task/router.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(__dirname);

const app = express();
const PORT = process.env.PORT || 3000;
const API_PORT = process.env.API_PORT || 3001;

// Environment configuration
const environment = process.env.NODE_ENV || 'development';
const dataPath = process.env.TASK_DATA_PATH || join(rootDir, 'data', 'task');
const adminKey = process.env.ADMIN_KEY || process.env.PUBLIC_ADMIN_KEY;
const friendKey = process.env.FRIEND_KEY || process.env.PUBLIC_FRIEND_KEY;

console.log('🚀 Starting Hadoku Site API Server...');
console.log(`📁 Data path: ${dataPath}`);
console.log(`🌍 Environment: ${environment}`);
console.log(`🔐 Auth keys configured: Admin=${!!adminKey}, Friend=${!!friendKey}`);

// Middleware
app.use(compression());
app.use(cors({
  origin: [
    'https://hadoku.me',
    'https://api.hadoku.me',
    'http://localhost:4321', // Astro dev server
    'http://localhost:3000', // This server
    'http://localhost:3001'  // API server
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

/**
 * Authentication Middleware
 * Validates key from query/header/cookie and sets req.userType
 */
function authenticate(req, res, next) {
  const key = req.query.key || req.headers['x-admin-key'] || req.cookies?.auth;
  
  let userType = 'public'; // Default
  
  if (key) {
    if (key === adminKey) {
      userType = 'admin';
    } else if (key === friendKey) {
      userType = 'friend';
    }
  }
  
  req.userType = userType;
  res.setHeader('X-User-Type', userType);
  
  // Log authentication result
  if (key && userType === 'public') {
    console.log(`⚠️  Invalid key attempt: ${key.substring(0, 8)}...`);
  } else if (userType !== 'public') {
    console.log(`✅ Authenticated as: ${userType}`);
  }
  
  next();
}

/**
 * Middleware to pass authenticated userType to child apps
 * Converts req.userType to formats child apps expect
 */
function passUserType(req, res, next) {
  // Set header for child apps that read x-user-type
  req.headers['x-user-type'] = req.userType;
  
  // Also set as query param for backward compatibility
  // Child apps can read from either req.query.userType or req.headers['x-user-type']
  if (!req.query.userType) {
    req.query.userType = req.userType;
  }
  
  next();
}

/**
 * Mount a micro-app with authentication
 * @param {Express} app - Main Express app
 * @param {string} name - App name (e.g., 'task')
 * @param {Function|string} routerFactory - Router factory function or proxy URL
 */
function mountMicroApp(app, name, routerFactory) {
  const micro = express();
  
  // For local routers (function)
  if (typeof routerFactory === 'function') {
    micro.use('/api', routerFactory());
    app.use(`/${name}`, authenticate, passUserType, micro);
    console.log(`📦 Mounted micro-app: /${name}/api/*`);
  } 
  // For remote APIs (string URL)
  else if (typeof routerFactory === 'string') {
    // TODO: Implement proxy to tunneled API
    micro.use('/api', async (req, res) => {
      res.status(501).json({ error: 'Proxy not yet implemented' });
    });
    app.use(`/${name}`, authenticate, passUserType, micro);
    console.log(`🔗 Mounted proxy: /${name}/api/* → ${routerFactory}`);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment,
    services: {
      api: 'running',
      task: 'running'
    }
  });
});

// Mount micro-apps using nested pattern
// Local JSON-committing Task API
mountMicroApp(app, 'task', () => createTaskRouter({ 
  dataPath, 
  environment 
}));

// Future: Remote Watchparty API (tunneled to home server)
// mountMicroApp(app, 'watchparty', 'https://watchparty-api.hadoku.me');

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Hadoku API',
    version: '1.0.0',
    environment,
    endpoints: {
      health: '/health',
      task: '/task/api/*'
    },
    documentation: 'https://github.com/WolffM/hadoku_site/blob/main/docs/PARENT_INTEGRATION.md'
  });
});

// Serve static Astro build for hadoku.me
if (environment === 'production') {
  const distPath = join(rootDir, 'dist');
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true
  }));
  
  // Fallback for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: environment === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.url,
    message: 'The requested resource was not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('✅ Hadoku Site API Server running!');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📝 Task API: http://localhost:${PORT}/api/task`);
  
  if (environment === 'development') {
    console.log('');
    console.log('🔧 Development mode:');
    console.log('   - Run Astro dev server separately: npm run dev');
    console.log('   - Or run both together: npm run dev:all');
  }
});

export default app;