#!/usr/bin/env node
/**
 * Copies the latest @wolffm/watchparty-ui micro-frontend assets (index.js, style.css)
 * from node_modules into public/mf/watchparty so the static site deploy picks up
 * the current UI package.
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
  const sourceDir = join(__dirname, '..', 'node_modules', '@wolffm', 'watchparty-ui', 'dist');
  const targetDir = join(__dirname, '..', 'public', 'mf', 'watchparty');

  if (!existsSync(sourceDir)) {
    console.error('✗ @wolffm/watchparty-ui package not found at', sourceDir);
    console.error('  Did you run `pnpm install` with a token that has read:packages?');
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });

  const files = ['index.js', 'style.css'];
  for (const f of files) {
    const from = join(sourceDir, f);
    const to = join(targetDir, f);
    try {
      copyFileSync(from, to);
      console.log(`✓ Copied ${f}`);
    } catch (err) {
      console.error(`✗ Failed to copy ${f}:`, err.message);
      process.exit(1);
    }
  }
  console.log('✅ Watchparty UI bundle updated successfully');
}

main();
