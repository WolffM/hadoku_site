#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file if it exists (for local development)
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Get environment variables
const MODE = process.env.MODE || 'development';
const HADOKU_SITE_TOKEN = process.env.HADOKU_SITE_TOKEN || '';

// Watchparty config
const watchpartyConfig = MODE === 'production' 
  ? {
      basename: '/watchparty',
      serverOrigin: 'https://api.hadoku.me',
      defaultRoomKey: 'dev-room-1000',
      environment: MODE,
      userType: 'public'  // Default, will be overridden by client-side loader
    }
  : {
      basename: '/watchparty',
      serverOrigin: 'http://localhost:8080',
      defaultRoomKey: 'dev-room-1000',
      environment: MODE,
      userType: 'public'  // Default, will be overridden by client-side loader
    };

// Task config - provides default props that will be enhanced at runtime
const taskConfig = {
  basename: '/task',
  apiUrl: undefined,           // Task app uses internal service worker API
  environment: MODE,
  userType: 'public'          // Default, will be overridden by client-side loader
};

// Generate registry
const registry = {
  home: {
    url: '/mf/home/index.js',
    basename: '/',
    props: {
      basename: '/',
      environment: MODE,
      userType: 'public'  // Default, will be overridden by client-side loader
    }
  },
  watchparty: {
    url: '/mf/watchparty/index.js',
    css: '/mf/watchparty/style.css',
    basename: '/watchparty',
    props: watchpartyConfig
  },
  task: {
    url: '/mf/task/index.js',
    css: '/mf/task/style.css',
    basename: '/task',
    props: taskConfig
  },
  contact: {
    url: '/mf/contact/index.js',
    basename: '/contact',
    props: {
      basename: '/contact',
      environment: MODE,
      userType: 'public'  // Default, will be overridden by client-side loader
    }
  },
  herodraft: {
    url: '/mf/herodraft/index.js',
    basename: '/herodraft',
    props: {
      basename: '/herodraft',
      environment: MODE,
      userType: 'public'  // Default, will be overridden by client-side loader
    }
  }
};

// Write to public/mf/registry.json
const registryPath = join(__dirname, '..', 'public', 'mf', 'registry.json');
writeFileSync(registryPath, JSON.stringify(registry, null, 2));

console.log(`✓ Generated registry.json in ${MODE} mode`);
console.log(`  - GitHub PAT: ${HADOKU_SITE_TOKEN ? '✓ Set' : '✗ Not set'}`);
if (!HADOKU_SITE_TOKEN) {
  console.log(`\n⚠️  Warning: No GitHub PAT set. Create a .env file with HADOKU_SITE_TOKEN.`);
  console.log(`   See .env.example for template.\n`);
}
