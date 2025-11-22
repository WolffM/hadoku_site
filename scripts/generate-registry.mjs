#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get versions for cache busting
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const resumeVersion =
	packageJson.dependencies['@wolffm/resume-bot']?.replace(/^[\^~]/, '') || Date.now().toString();
const taskVersion = packageJson.dependencies['@wolffm/task']?.replace('^', '') || 'latest';
const watchpartyVersion =
	packageJson.dependencies['@wolffm/watchparty-ui']?.replace(/^[\^~]/, '') || Date.now().toString();
const contactVersion =
	packageJson.dependencies['@wolffm/contact-ui']?.replace(/^[\^~]/, '') || Date.now().toString();
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

/**
 * Builder function to create registry entries with consistent structure
 * @param {string} name - The app name (e.g., 'resume', 'task')
 * @param {string} version - Version for cache busting
 * @param {object} additionalProps - Additional props specific to this app
 * @param {boolean} hasCSS - Whether this app has a CSS file
 */
function createApp(name, version, additionalProps = {}, hasCSS = true) {
	const path = name === 'home' ? '/' : `/${name}`;

	return {
		url: `/mf/${name}/index.js?v=${version}`,
		...(hasCSS && { css: `/mf/${name}/style.css?v=${version}` }),
		basename: path,
		props: {
			basename: path,
			...additionalProps,
		},
	};
}

// Generate registry with cache-busting query parameters
const registry = {
	home: createApp('home', timestamp, {}, false),
	resume: createApp('resume', resumeVersion, {
		apiUrl: '/resume', // Base URL for resume API endpoints
	}),
	watchparty: createApp('watchparty', watchpartyVersion, {
		serverOrigin: MODE === 'production' ? 'https://api.hadoku.me' : 'http://localhost:8080',
	}),
	task: createApp('task', taskVersion, {
		userType: 'public', // Default, will be overridden by client-side loader
	}),
	contact: createApp('contact', contactVersion),
	herodraft: createApp('herodraft', timestamp, {}, false),
};

// Inject theme to all apps
Object.keys(registry).forEach((key) => {
	registry[key].props.theme = 'default'; // or whatever theme logic you want
});

// Write to public/mf/registry.json
const registryPath = join(__dirname, '..', 'public', 'mf', 'registry.json');
writeFileSync(registryPath, JSON.stringify(registry, null, 2));

console.log(`✓ Generated registry.json in ${MODE} mode`);
