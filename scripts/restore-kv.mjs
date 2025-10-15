#!/usr/bin/env node
/**
 * Restore KV Namespace from JSON Backup
 * 
 * Restores all keys and values from a backup JSON file to TASKS_KV.
 * 
 * Usage:
 *   node scripts/restore-kv.mjs <backup-file>
 * 
 * Example:
 *   node scripts/restore-kv.mjs backups/tasks-kv-backup-2025-10-14T18-30-00.json
 */

import { execSync } from 'child_process';
import fs from 'fs';

const KV_NAMESPACE = 'TASKS_KV';

// Get backup file from command line argument
const backupFile = process.argv[2];

if (!backupFile) {
  console.error('❌ Error: Please provide a backup file path');
  console.log('\nUsage:');
  console.log('  node scripts/restore-kv.mjs <backup-file>');
  console.log('\nExample:');
  console.log('  node scripts/restore-kv.mjs backups/tasks-kv-backup-2025-10-14T18-30-00.json');
  process.exit(1);
}

if (!fs.existsSync(backupFile)) {
  console.error(`❌ Error: Backup file not found: ${backupFile}`);
  process.exit(1);
}

console.log('🔄 Starting KV restore...\n');

try {
  // Load backup file
  console.log(`📂 Loading backup from: ${backupFile}`);
  const backupContent = fs.readFileSync(backupFile, 'utf-8');
  const backup = JSON.parse(backupContent);
  
  console.log(`✅ Backup loaded successfully`);
  console.log(`   Timestamp: ${backup.timestamp}`);
  console.log(`   Namespace: ${backup.namespace}`);
  console.log(`   Key count: ${backup.keyCount}\n`);
  
  if (!backup.data || Object.keys(backup.data).length === 0) {
    console.log('⚠️  No data found in backup file');
    process.exit(0);
  }
  
  // Restore each key-value pair
  console.log('📦 Restoring key-value pairs...');
  const entries = Object.entries(backup.data);
  let count = 0;
  let failed = 0;
  
  for (const [key, value] of entries) {
    try {
      // Convert value to string (JSON if object, otherwise as-is)
      const valueStr = typeof value === 'string' 
        ? value 
        : JSON.stringify(value);
      
      // Escape quotes for shell command
      const escapedValue = valueStr.replace(/"/g, '\\"');
      
      const putCommand = `npx wrangler kv key put "${key}" "${escapedValue}" --binding=${KV_NAMESPACE}`;
      execSync(putCommand, { 
        cwd: 'workers/task-api',
        stdio: 'pipe' // Suppress output
      });
      
      count++;
      process.stdout.write(`\r   Progress: ${count}/${entries.length} keys restored`);
    } catch (error) {
      failed++;
      console.error(`\n❌ Failed to restore key: ${key}`, error.message);
    }
  }
  
  console.log('\n');
  console.log(`✅ Restore completed!`);
  console.log(`   Successfully restored: ${count} keys`);
  if (failed > 0) {
    console.log(`   Failed: ${failed} keys`);
  }
  
  console.log('\n✨ KV namespace restored from backup!');
  
} catch (error) {
  console.error('\n❌ Restore failed:', error.message);
  process.exit(1);
}
