#!/usr/bin/env node
/**
 * Copies UI components from @wolffm/task-ui-components package
 * to public/mf/ui-components so it can be imported in the browser
 */
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
  const sourceDir = join(__dirname, '..', 'node_modules', '@wolffm', 'task-ui-components', 'dist');
  const targetDir = join(__dirname, '..', 'public', 'mf', 'ui-components');

  if (!existsSync(sourceDir)) {
    console.error('✗ @wolffm/task-ui-components package not found at', sourceDir);
    console.error('  Did you run `pnpm install` with a token that has read:packages?');
    process.exit(1);
  }

  // Remove old bundle and create fresh directory
  mkdirSync(targetDir, { recursive: true });

  // Copy entire dist directory (same pattern as other bundles)
  try {
    cpSync(sourceDir, targetDir, { recursive: true });
    console.log('✓ Copied UI components bundle');
  } catch (err) {
    console.error('✗ Failed to copy UI components:', err.message);
    process.exit(1);
  }

  console.log('✓ UI components bundle updated');
}

main();
