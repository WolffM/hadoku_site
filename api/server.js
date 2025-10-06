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

console.log('🚀 Starting Hadoku Site API Server...');
console.log(`📁 Data path: ${dataPath}`);
console.log(`🌍 Environment: ${environment}`);

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

// Mount task router
const taskRouter = createTaskRouter({
  dataPath,
  environment
});

app.use('/api/task', taskRouter);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Hadoku API',
    version: '1.0.0',
    environment,
    endpoints: {
      health: '/health',
      task: '/api/task'
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