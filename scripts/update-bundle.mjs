#!/usr/bin/env node
/**
 * Universal bundle updater for @wolffm micro-frontend packages.
 * Copies built assets (index.js, style.css, etc.) from node_modules to public/mf.
 *
 * Usage:
 *   node update-bundle.mjs <package-name> <target-dir> [css-filename]
 *
 * Examples:
 *   node update-bundle.mjs @wolffm/task task task.css
 *   node update-bundle.mjs @wolffm/watchparty-ui watchparty
 *   node update-bundle.mjs @wolffm/resume-bot resume
 */
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Package configurations
const PACKAGE_CONFIGS = {
	'@wolffm/contact-ui': {
		targetDir: 'contact',
		cssSource: 'style.css',
	},
	'@wolffm/task': {
		targetDir: 'task',
		cssSource: 'task.css', // Package exports "./style.css" -> "./dist/task.css"
	},
	'@wolffm/watchparty-ui': {
		targetDir: 'watchparty',
		cssSource: 'style.css',
	},
	'@wolffm/resume-bot': {
		targetDir: 'resume',
		cssSource: 'style.css',
	},
	'@wolffm/themes': {
		targetDir: 'themes',
		copyAll: true, // Copy entire dist + CSS from src
		extraFiles: [
			{ from: 'src/themes.css', to: 'themes.css' },
		],
	},
	'@wolffm/task-ui-components': {
		targetDir: 'ui-components',
		copyAll: true, // Copy entire dist directory
	},
};

function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error('Usage: node update-bundle.mjs <package-name>');
		console.error('\nConfigured packages:');
		Object.keys(PACKAGE_CONFIGS).forEach(pkg => {
			console.error(`  - ${pkg}`);
		});
		process.exit(1);
	}

	const packageName = args[0];
	const config = PACKAGE_CONFIGS[packageName];

	if (!config) {
		console.error(`✗ Unknown package: ${packageName}`);
		console.error('\nConfigured packages:');
		Object.keys(PACKAGE_CONFIGS).forEach(pkg => {
			console.error(`  - ${pkg}`);
		});
		process.exit(1);
	}

	const packageShortName = packageName.split('/')[1];
	const packageRoot = join(__dirname, '..', 'node_modules', ...packageName.split('/'));
	const sourceDir = join(packageRoot, 'dist');
	const targetDir = join(__dirname, '..', 'public', 'mf', config.targetDir);

	if (!existsSync(sourceDir)) {
		console.error(`✗ ${packageName} package not found at`, sourceDir);
		console.error('  Did you run `pnpm install` with a token that has read:packages?');
		process.exit(1);
	}

	mkdirSync(targetDir, { recursive: true });

	// Copy all dist files recursively (for packages that need everything)
	if (config.copyAll) {
		try {
			cpSync(sourceDir, targetDir, { recursive: true });
			console.log('✓ Copied all dist files');
		} catch (err) {
			console.error('✗ Failed to copy dist files:', err.message);
			process.exit(1);
		}
	} else {
		// Copy JavaScript bundle only
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

		// Copy CSS file (if configured)
		if (config.cssSource) {
			const cssFrom = join(sourceDir, config.cssSource);
			const cssTo = join(targetDir, 'style.css');
			try {
				if (existsSync(cssFrom)) {
					copyFileSync(cssFrom, cssTo);
					console.log(`✓ Copied style.css (from ${config.cssSource})`);
				} else {
					console.error(`✗ CSS file not found: ${config.cssSource}`);
					process.exit(1);
				}
			} catch (err) {
				console.error('✗ Failed to copy CSS file:', err.message);
				process.exit(1);
			}
		}
	}

	// Copy extra files (e.g., CSS from src/ for themes)
	if (config.extraFiles) {
		for (const file of config.extraFiles) {
			const from = join(packageRoot, file.from);
			const to = join(targetDir, file.to);
			try {
				if (existsSync(from)) {
					copyFileSync(from, to);
					console.log(`✓ Copied ${file.to} (from ${file.from})`);
				} else {
					console.log(`ℹ ${file.from} not found (may be optional)`);
				}
			} catch (err) {
				console.log(`⚠ Could not copy ${file.from}:`, err.message);
			}
		}
	}

	console.log(`✅ ${packageShortName} bundle updated`);
}

main();
