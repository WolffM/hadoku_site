#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get versions for cache busting
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const resumeVersion = packageJson.dependencies['@wolffm/resume-bot']?.replace(/^[\^~]/, '') || Date.now().toString();
const taskVersion = packageJson.dependencies['@wolffm/task']?.replace('^', '') || 'latest';
const watchpartyVersion =
	packageJson.dependencies['@wolffm/watchparty-ui']?.replace(/^[\^~]/, '') || Date.now().toString();
const timestamp = Date.now(); // Fallback for apps without versions

// Load .env file if it exists (for local development)
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
	const envContent = readFileSync(envPath, 'utf-8');
	envContent.split('\n').forEach((line) => {
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

// Watchparty config
const watchpartyConfig =
	MODE === 'production'
		? {
				basename: '/watchparty',
				serverOrigin: 'https://api.hadoku.me',
				environment: MODE,
				userType: 'public', // Default, will be overridden by client-side loader
			}
		: {
				basename: '/watchparty',
				serverOrigin: 'http://localhost:8080',
				environment: MODE,
				userType: 'public', // Default, will be overridden by client-side loader
			};

// Task config - provides default props that will be enhanced at runtime
const taskConfig = {
	basename: '/task',
	apiUrl: undefined, // Task app uses internal service worker API
	environment: MODE,
	userType: 'public', // Default, will be overridden by client-side loader
};

// Generate registry with cache-busting query parameters
const registry = {
	home: {
		url: `/mf/home/index.js?v=${timestamp}`,
		basename: '/',
		props: {
			basename: '/',
			environment: MODE,
			userType: 'public', // Default, will be overridden by client-side loader
		},
	},
	resume: {
		url: `/mf/resume/index.js?v=${resumeVersion}`,
		css: `/mf/resume/style.css?v=${resumeVersion}`,
		basename: '/resume',
		props: {
			basename: '/resume',
			environment: MODE,
			userType: 'public', // Default, will be overridden by client-side loader
		},
	},
	watchparty: {
		url: `/mf/watchparty/index.js?v=${watchpartyVersion}`,
		css: `/mf/watchparty/style.css?v=${watchpartyVersion}`,
		basename: '/watchparty',
		props: watchpartyConfig,
	},
	task: {
		url: `/mf/task/index.js?v=${taskVersion}`,
		css: `/mf/task/style.css?v=${taskVersion}`,
		basename: '/task',
		props: taskConfig,
	},
	contact: {
		url: `/mf/contact/index.js?v=${timestamp}`,
		basename: '/contact',
		props: {
			basename: '/contact',
			environment: MODE,
			userType: 'public', // Default, will be overridden by client-side loader
		},
	},
	herodraft: {
		url: `/mf/herodraft/index.js?v=${timestamp}`,
		basename: '/herodraft',
		props: {
			basename: '/herodraft',
			environment: MODE,
			userType: 'public', // Default, will be overridden by client-side loader
		},
	},
};

// Write to public/mf/registry.json
const registryPath = join(__dirname, '..', 'public', 'mf', 'registry.json');
writeFileSync(registryPath, JSON.stringify(registry, null, 2));

console.log(`✓ Generated registry.json in ${MODE} mode`);
