#!/usr/bin/env node
/**
 * Backup KV Namespace to JSON
 * 
 * Dumps all keys and values from TASKS_KV to a timestamped JSON file.
 * Used before flushing KV on package updates to preserve data.
 * 
 * Usage:
 *   node scripts/backup-kv.mjs
 * 
 * Output:
 *   backups/tasks-kv-backup-TIMESTAMP.json
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const KV_NAMESPACE = 'TASKS_KV';
const BACKUP_DIR = 'backups';

console.log('🔍 Starting KV backup...\n');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`✅ Created backup directory: ${BACKUP_DIR}\n`);
}

// Get timestamp for filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupFile = path.join(BACKUP_DIR, `tasks-kv-backup-${timestamp}.json`);

try {
  // Step 1: List all keys in the namespace
  console.log('📋 Listing all KV keys...');
  const listCommand = `npx wrangler kv:key list --namespace-id=${KV_NAMESPACE} --env=production`;
  const keysJson = execSync(listCommand, { 
    cwd: 'workers/task-api',
    encoding: 'utf-8' 
  });
  
  const keys = JSON.parse(keysJson);
  console.log(`✅ Found ${keys.length} keys\n`);
  
  if (keys.length === 0) {
    console.log('⚠️  No keys found in KV namespace. Backup not needed.');
    process.exit(0);
  }
  
  // Step 2: Fetch all values
  console.log('📦 Fetching all key-value pairs...');
  const backup = {};
  let count = 0;
  
  for (const { name: key } of keys) {
    try {
      const getCommand = `npx wrangler kv:key get "${key}" --namespace-id=${KV_NAMESPACE} --env=production`;
      const value = execSync(getCommand, { 
        cwd: 'workers/task-api',
        encoding: 'utf-8' 
      });
      
      // Try to parse as JSON, otherwise store as string
      try {
        backup[key] = JSON.parse(value);
      } catch {
        backup[key] = value;
      }
      
      count++;
      process.stdout.write(`\r   Progress: ${count}/${keys.length} keys`);
    } catch (error) {
      console.error(`\n❌ Failed to get key: ${key}`, error.message);
    }
  }
  
  console.log('\n');
  
  // Step 3: Write backup to file
  console.log('💾 Writing backup to file...');
  const backupData = {
    timestamp: new Date().toISOString(),
    namespace: KV_NAMESPACE,
    keyCount: Object.keys(backup).length,
    data: backup
  };
  
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
  console.log(`✅ Backup saved: ${backupFile}`);
  
  // Output stats
  const fileSize = fs.statSync(backupFile).size;
  const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
  console.log(`📊 Backup size: ${fileSizeMB} MB`);
  console.log(`📊 Total keys backed up: ${Object.keys(backup).length}`);
  
  // Output backup file path for GitHub Actions
  console.log(`\n::set-output name=backup_file::${backupFile}`);
  
  console.log('\n✨ Backup completed successfully!');
  
} catch (error) {
  console.error('\n❌ Backup failed:', error.message);
  process.exit(1);
}
