#!/usr/bin/env node
/**
 * Copies the latest @wolffm/task micro-frontend assets (index.js, style.css)
 * from node_modules into public/mf/task so the static site deploy picks up
 * the current UI. Uses the package's proper exports for CSS.
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
	const sourceDir = join(__dirname, '..', 'node_modules', '@wolffm', 'task', 'dist');
	const targetDir = join(__dirname, '..', 'public', 'mf', 'task');

	if (!existsSync(sourceDir)) {
		console.error('✗ @wolffm/task package not found at', sourceDir);
		console.error('  Did you run `pnpm install` with a token that has read:packages?');
		process.exit(1);
	}

	mkdirSync(targetDir, { recursive: true });

	// Copy index.js (frontend bundle)
	const indexFrom = join(sourceDir, 'index.js');
	const indexTo = join(targetDir, 'index.js');
	try {
		if (existsSync(indexFrom)) {
			copyFileSync(indexFrom, indexTo);
			console.log('✓ Copied index.js');
		} else {
			console.error('✗ index.js not found in package');
			process.exit(1);
		}
	} catch (err) {
		console.error('✗ Failed to copy index.js:', err.message);
		process.exit(1);
	}

	// Copy CSS file using the proper export path
	// Package now exports "./style.css" which points to "./dist/task.css"
	const cssFrom = join(sourceDir, 'task.css');
	const cssTo = join(targetDir, 'style.css');
	try {
		if (existsSync(cssFrom)) {
			copyFileSync(cssFrom, cssTo);
			console.log('✓ Copied style.css (from task.css export)');
		} else {
			console.error('✗ CSS file not found in package dist');
			process.exit(1);
		}
	} catch (err) {
		console.error('✗ Failed to copy CSS file:', err.message);
		process.exit(1);
	}
	console.log('✓ Task bundle updated');
}

main();
