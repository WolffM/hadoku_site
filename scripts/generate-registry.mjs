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
      serverOrigin: 'https://api.hadoku.me',
      defaultRoomKey: 'dev-room-1000',
      mediaBase: '/media',
    }
  : {
      serverOrigin: 'http://localhost:8080',
      defaultRoomKey: 'dev-room-1000',
      mediaBase: '/media',
    };

// Task config
const taskConfig = MODE === 'production'
  ? {
      repoOwner: 'WolffM',
      repoName: 'hadoku_site',
      branch: 'main',
      tasksPath: 'task/data/tasks.json',
      statsPath: 'task/data/stats.json',
      apiUrl: 'https://api.hadoku.me',
      environment: 'production'
    }
  : {
      repoOwner: 'WolffM',
      repoName: 'hadoku_site',
      branch: 'main',
      tasksPath: 'task/data/tasks.json',
      statsPath: 'task/data/stats.json',
      apiUrl: 'http://localhost:3000',
      environment: 'development'
    };

// Generate registry
const registry = {
  home: {
    url: '/mf/home/index.js',
    basename: '/',
    props: {}
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
    props: {}
  },
  herodraft: {
    url: '/mf/herodraft/index.js',
    basename: '/herodraft',
    props: {}
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
