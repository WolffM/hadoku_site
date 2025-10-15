#!/usr/bin/env node
/**
 * Flush KV Namespace
 * 
 * Deletes all keys from TASKS_KV namespace.
 * ⚠️  WARNING: This is destructive! Make sure you have a backup first.
 * 
 * Usage:
 *   node scripts/flush-kv.mjs
 * 
 * With confirmation bypass (for CI):
 *   FLUSH_CONFIRM=yes node scripts/flush-kv.mjs
 */

import { execSync } from 'child_process';
import readline from 'readline';

const KV_NAMESPACE = 'TASKS_KV';

console.log('⚠️  KV NAMESPACE FLUSH\n');
console.log('This will DELETE ALL KEYS from the TASKS_KV namespace.');
console.log('Make sure you have created a backup first!\n');

// Check for auto-confirm (for CI)
const autoConfirm = process.env.FLUSH_CONFIRM === 'yes';

async function confirm() {
  if (autoConfirm) {
    console.log('Auto-confirmed via FLUSH_CONFIRM environment variable\n');
    return true;
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Type "FLUSH" to confirm deletion: ', (answer) => {
      rl.close();
      resolve(answer === 'FLUSH');
    });
  });
}

async function main() {
  const confirmed = await confirm();
  
  if (!confirmed) {
    console.log('❌ Flush cancelled');
    process.exit(0);
  }
  
  console.log('\n🔍 Listing keys to delete...');
  
  try {
    // List all keys
    const listCommand = `npx wrangler kv key list --binding=${KV_NAMESPACE}`;
    const keysJson = execSync(listCommand, { 
      cwd: 'workers/task-api',
      encoding: 'utf-8' 
    });
    
    const keys = JSON.parse(keysJson);
    console.log(`✅ Found ${keys.length} keys to delete\n`);
    
    if (keys.length === 0) {
      console.log('✨ KV namespace is already empty');
      process.exit(0);
    }
    
    // Delete each key
    console.log('🗑️  Deleting keys...');
    let count = 0;
    let failed = 0;
    
    for (const { name: key } of keys) {
      try {
        const deleteCommand = `npx wrangler kv key delete "${key}" --binding=${KV_NAMESPACE}`;
        execSync(deleteCommand, { 
          cwd: 'workers/task-api',
          stdio: 'pipe' // Suppress output
        });
        
        count++;
        process.stdout.write(`\r   Progress: ${count}/${keys.length} keys deleted`);
      } catch (error) {
        failed++;
        console.error(`\n❌ Failed to delete key: ${key}`, error.message);
      }
    }
    
    console.log('\n');
    console.log(`✅ Flush completed!`);
    console.log(`   Successfully deleted: ${count} keys`);
    if (failed > 0) {
      console.log(`   Failed: ${failed} keys`);
    }
    
    console.log('\n✨ KV namespace flushed!');
    
  } catch (error) {
    console.error('\n❌ Flush failed:', error.message);
    process.exit(1);
  }
}

main();
