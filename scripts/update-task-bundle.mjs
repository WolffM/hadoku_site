#!/usr/bin/env node
/**
 * Copies the latest @wolffm/task micro-frontend assets (index.js, style.css)
 * from node_modules into public/mf/task so the static site deploy picks up
 * the current v2 UI (boards, themes, etc.).
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
    console.error('  Did you run `npm install` with a token that has read:packages?');
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
  console.log('✓ Task bundle updated');
}

main();
