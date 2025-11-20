#!/usr/bin/env node
/**
 * Fetch contact form submissions from the contact API
 *
 * Usage:
 *   node scripts/fetch-contact-submissions.mjs [options]
 *
 * Options:
 *   --limit N    Number of submissions to fetch (default: 10)
 *   --offset N   Offset for pagination (default: 0)
 *   --stats      Show only statistics
 *
 * Requires:
 *   ADMIN_KEYS environment variable (JSON array)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env if it exists
const envPath = join(__dirname, '..', '.env');
try {
	const envContent = readFileSync(envPath, 'utf-8');
	// Handle both Unix (\n) and Windows (\r\n) line endings
	envContent.split(/\r?\n/).forEach((line) => {
		const match = line.match(/^([^#=]+)=(.*)$/);
		if (match) {
			const key = match[1].trim();
			let value = match[2].trim();
			// Only strip quotes if it's a simple quoted string, not JSON array/object
			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				// Don't strip if it looks like JSON (starts with [ or {)
				const innerValue = value.slice(1, -1);
				if (!innerValue.startsWith('[') && !innerValue.startsWith('{')) {
					value = innerValue;
				}
			}
			if (!process.env[key]) {
				process.env[key] = value;
			}
		}
	});
} catch (error) {
	// .env file doesn't exist, that's okay - environment variables may be set elsewhere
	if (error.code !== 'ENOENT') {
		console.warn('Warning: Error reading .env file:', error.message);
	}
}

// Parse ADMIN_KEYS JSON to get the first admin key
const ADMIN_KEYS_JSON = process.env.ADMIN_KEYS;

if (!ADMIN_KEYS_JSON) {
	console.error('❌ ADMIN_KEYS environment variable is required');
	console.error('   Set it in .env file (should be a JSON array like ["key1", "key2"])');
	process.exit(1);
}

let ADMIN_KEY;
try {
	const adminKeys = JSON.parse(ADMIN_KEYS_JSON);
	if (!Array.isArray(adminKeys) || adminKeys.length === 0) {
		console.error('❌ ADMIN_KEYS must be a non-empty JSON array');
		process.exit(1);
	}
	ADMIN_KEY = adminKeys[0]; // Use the first admin key
} catch (error) {
	console.error('❌ Failed to parse ADMIN_KEYS JSON:', error.message);
	console.error('   ADMIN_KEYS value:', ADMIN_KEYS_JSON);
	process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const limit = parseInt(args.find((arg) => arg.startsWith('--limit='))?.split('=')[1]) || 10;
const offset = parseInt(args.find((arg) => arg.startsWith('--offset='))?.split('=')[1]) || 0;
const statsOnly = args.includes('--stats');

async function fetchSubmissions() {
	const url = `https://hadoku.me/contact/api/admin/submissions?limit=${limit}&offset=${offset}`;

	const response = await fetch(url, {
		headers: {
			'X-User-Key': ADMIN_KEY,
		},
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Failed to fetch submissions: ${response.status} ${response.statusText}\n${text}`
		);
	}

	return response.json();
}

async function fetchStats() {
	const response = await fetch('https://hadoku.me/contact/api/admin/stats', {
		headers: {
			'X-User-Key': ADMIN_KEY,
		},
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}\n${text}`);
	}

	return response.json();
}

async function main() {
	try {
		if (statsOnly) {
			console.log('📊 Fetching statistics...');
			const data = await fetchStats();

			console.log('\n=== Contact Form Statistics ===');
			console.log(`Total submissions: ${data.data.submissions.total}`);
			console.log(`Unread: ${data.data.submissions.unread}`);
			console.log(`Read: ${data.data.submissions.read}`);
			console.log(`Archived: ${data.data.submissions.archived}`);
			console.log(
				`\nDatabase size: ${data.data.database.sizeMB} MB (${data.data.database.percentUsed}% used)`
			);
			if (data.data.database.warning) {
				console.log('⚠️  Database is over 80% capacity!');
			}
		} else {
			console.log(`📧 Fetching ${limit} submissions (offset: ${offset})...\n`);
			const data = await fetchSubmissions();

			console.log(
				`=== Submissions (${data.data.submissions.length} of ${data.data.stats.total}) ===\n`
			);

			for (const submission of data.data.submissions) {
				const date = new Date(submission.created_at);
				console.log(`ID: ${submission.id}`);
				console.log(`Status: ${submission.status}`);
				console.log(`From: ${submission.name} <${submission.email}>`);
				console.log(`Date: ${date.toLocaleString()}`);
				console.log(`Message:\n${submission.message}`);
				console.log(`IP: ${submission.ip_address}`);
				console.log(`Referrer: ${submission.referrer || 'N/A'}`);
				console.log('─'.repeat(60));
			}

			console.log(
				`\nStats: ${data.data.stats.unread} unread, ${data.data.stats.read} read, ${data.data.stats.archived} archived`
			);
		}
	} catch (error) {
		console.error('❌ Error:', error.message);
		process.exit(1);
	}
}

main();
