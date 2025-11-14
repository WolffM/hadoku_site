import express from 'express';
import { handler as astroHandler } from '../dist/server/entry.mjs';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import chokidar from 'chokidar';
import 'dotenv/config';
import { generateRegistry } from '../scripts/generate-registry.mjs';

const app = express();
const CONFIG_PATH = './route-config.json';

// --- 1. Generate Micro-frontend Registry ---
try {
	generateRegistry();
	console.log('[Registry] Successfully generated mf/registry.json');
} catch (e) {
	console.error('[Registry] Failed to generate mf/registry.json:', e);
	process.exit(1);
}

// --- 2. Load and Watch Config ---
let routeConfig = loadConfig();

chokidar.watch(CONFIG_PATH).on('change', () => {
	console.log('[Router] route-config.json changed, reloading...');
	try {
		routeConfig = loadConfig();
		console.log('[Router] Successfully reloaded config.');
	} catch (e) {
		console.error('[Router] Failed to reload config:', e);
	}
});

// --- 3. Routing Logic ---
function loadConfig() {
	const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
	let config = JSON.parse(fileContent);

	// Substitute environment variables like ${LOCAL_BASE}
	let configString = JSON.stringify(config);
	configString = configString.replace(/\$\{([^}]+)\}/g, (_, envVar) => process.env[envVar] || '');
	config = JSON.parse(configString);

	return config;
}

function resolveBackends(pathname, config) {
	const appName = pathname.split('/')[1]; // "task" from "/task/api/..."
	const routeConfig = config.routes[appName];
	const priority = routeConfig?.priority || config.global_priority || '';
	const providerMap = config.providers;
	return String(priority)
		.split('')
		.map((digit) => providerMap[digit])
		.filter(Boolean);
}

// --- 4. Proxy Middleware ---
app.use(['/task/api', '/watchparty/api'], (req, res, next) => {
	const bases = resolveBackends(req.path, routeConfig);
	if (!bases.length) {
		return res.status(502).json({ error: 'No valid backend providers configured.' });
	}

	let i = 0;
	const tryNext = (err) => {
		if (i >= bases.length) {
			console.error(`[Router] All backends failed for ${req.path}. Last error:`, err);
			return res.status(502).json({ error: 'All backend providers failed.' });
		}

		const target = bases[i++];
		console.log(`[Router] Attempting to proxy ${req.path} to provider #${i}: ${target}`);

		createProxyMiddleware({
			target,
			changeOrigin: true,
			selfHandleResponse: true, // Important: we need to inspect the response
			proxyTimeout: 3000,
			onProxyReq: (proxyReq) => {
				proxyReq.setHeader('x-no-fallback', '1');
			},
			onProxyRes: (proxyRes, req, res) => {
				// Fallback on 404 or any 5xx server error
				if (proxyRes.statusCode === 404 || proxyRes.statusCode >= 500) {
					console.warn(
						`[Router] Backend at ${target} returned ${proxyRes.statusCode}. Trying next...`
					);
					tryNext(new Error(`Backend returned HTTP ${proxyRes.statusCode}`));
				} else {
					// Success! Pipe the response to the client.
					res.writeHead(proxyRes.statusCode, proxyRes.headers);
					proxyRes.pipe(res);
				}
			},
			onError: (err, _req, _res) => {
				// This handles connection errors (e.g., backend is down)
				console.error(`[Router] Proxy error for ${target}:`, err.message);
				tryNext(err);
			},
		})(req, res, next);
	};

	tryNext();
});

// --- 5. Astro Handler ---
// Let Astro handle all other requests (pages, assets, etc.)
app.use(astroHandler);

// --- 6. Start Server ---
const port = process.env.PORT || 4321;
app.listen(port, () => {
	console.log(`[Router] Server listening on http://localhost:${port}`);
});
