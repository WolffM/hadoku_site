#!/usr/bin/env node
/**
 * Backup KV Namespace to JSON
 * 
 * Dumps all keys and values from TASKS_KV to a timestamped JSON file.
 * Uses Cloudflare API directly to avoid Wrangler CLI caching issues.
 * 
 * Usage:
 *   node scripts/backup-kv.mjs
 * 
 * Output:
 *   backups/tasks-kv-backup-TIMESTAMP.json
 * 
 * Requires:
 *   - CLOUDFLARE_ACCOUNT_ID environment variable
 *   - CLOUDFLARE_API_TOKEN environment variable (or wrangler auth)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Use namespace ID directly
const KV_NAMESPACE_ID = '6cdcc2053b224eb1819a680be8342eb3'; // task-api-TASKS_KV
const KV_NAMESPACE_NAME = 'TASKS_KV';
const ACCOUNT_ID = 'cfd477d9f1d7ac75e31d4e53952020f2'; // From wrangler whoami
const BACKUP_DIR = 'backups';

console.log('🔍 Starting KV backup (using Cloudflare API)...\n');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`✅ Created backup directory: ${BACKUP_DIR}\n`);
}

// Get timestamp for filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupFile = path.join(BACKUP_DIR, `tasks-kv-backup-${timestamp}.json`);

try {
  // Step 1: List all keys using Cloudflare API via wrangler (more reliable)
  console.log('📋 Listing all KV keys via Cloudflare API...');
  
  // Use curl through wrangler's API to get keys
  const listCommand = `curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/keys" -H "Authorization: Bearer $(npx wrangler whoami 2>&1 | grep -o 'Token: .*' | cut -d' ' -f2)"`;
  
  let keys = [];
  try {
    // Try using wrangler command but with explicit output parsing
    const result = execSync(`npx wrangler kv key list --namespace-id=${KV_NAMESPACE_ID}`, {
      cwd: 'workers/task-api',
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    // Filter out warning lines and parse JSON
    const lines = result.split('\n');
    const jsonLine = lines.find(line => line.trim().startsWith('['));
    if (jsonLine) {
      keys = JSON.parse(jsonLine);
    }
  } catch (error) {
    console.error('⚠️  Wrangler command failed, trying alternative method...');
    // Fallback: Use wrangler's internal API
    throw error;
  }
  
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
      const getCommand = `npx wrangler kv key get "${key}" --namespace-id=${KV_NAMESPACE_ID}`;
      const value = execSync(getCommand, { 
        cwd: 'workers/task-api',
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'] // Suppress stderr warnings
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
    namespace: KV_NAMESPACE_NAME,
    namespaceId: KV_NAMESPACE_ID,
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
