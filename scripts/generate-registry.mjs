#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get environment variables
const MODE = process.env.MODE || 'production';
const HADOKU_SITE_TOKEN = process.env.HADOKU_SITE_TOKEN || '';

// Watchparty config
const watchpartyConfig = MODE === 'production' 
  ? {
      serverOrigin: 'https://api.hadoku.me',
      defaultRoomKey: 'dev-room-1000',
      mediaBase: '/media',
      githubPat: HADOKU_SITE_TOKEN,
    }
  : {
      serverOrigin: 'http://localhost:8080',
      defaultRoomKey: 'dev-room-1000',
      mediaBase: '/media',
      githubPat: HADOKU_SITE_TOKEN,
    };

// Task config
const taskConfig = MODE === 'production'
  ? {
      githubPat: HADOKU_SITE_TOKEN,
      repoOwner: 'WolffM',
      repoName: 'hadoku_site',
      branch: 'main',
      tasksPath: 'task/data/tasks.json',
      statsPath: 'task/data/stats.json',
      apiUrl: 'https://api.hadoku.me',
      environment: 'production'
    }
  : {
      githubPat: HADOKU_SITE_TOKEN,
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
