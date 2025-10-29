#!/usr/bin/env node
/**
 * Copies the @wolffm/themes package files to public/mf/themes
 * so they can be imported as ES modules in the browser
 */
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
  const sourceDir = join(__dirname, '..', 'node_modules', '@wolffm', 'themes', 'dist');
  const targetDir = join(__dirname, '..', 'public', 'mf', 'themes');

  if (!existsSync(sourceDir)) {
    console.error('✗ @wolffm/themes package not found at', sourceDir);
    console.error('  Did you run `pnpm install` with a token that has read:packages?');
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });

  // Copy the main JS file
  const indexFrom = join(sourceDir, 'index.js');
  const indexTo = join(targetDir, 'index.js');
  try {
    if (existsSync(indexFrom)) {
      copyFileSync(indexFrom, indexTo);
      console.log('✓ Copied index.js');
    } else {
      console.error('✗ index.js not found in themes package');
      process.exit(1);
    }
  } catch (err) {
    console.error('✗ Failed to copy index.js:', err.message);
    process.exit(1);
  }

  // Copy CSS file if it exists
  const cssSource = join(__dirname, '..', 'node_modules', '@wolffm', 'themes', 'src', 'themes.css');
  const cssTarget = join(targetDir, 'themes.css');
  try {
    if (existsSync(cssSource)) {
      copyFileSync(cssSource, cssTarget);
      console.log('✓ Copied themes.css');
    } else {
      console.log('ℹ Themes CSS not found (may be included in build)');
    }
  } catch (err) {
    console.log('⚠ Could not copy themes.css:', err.message);
  }

  // Copy theme metadata
  const metadataSource = join(__dirname, '..', 'src', 'config', 'themes.js');
  const metadataTarget = join(targetDir, 'metadata.js');
  try {
    if (existsSync(metadataSource)) {
      copyFileSync(metadataSource, metadataTarget);
      console.log('✓ Copied theme metadata');
    }
  } catch (err) {
    console.log('⚠ Could not copy theme metadata:', err.message);
  }

  console.log('✓ Themes bundle updated');
}

main();