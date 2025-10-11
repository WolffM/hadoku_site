# Edge Router Logging

Modular logging system for tracking request routing decisions.

## Overview

- **Where**: Logs are stored in `logs/requests/YYYY-MM-DD.jsonl` in the GitHub repository
- **Format**: JSON Lines (one JSON object per line)
- **Sampling**: 10% of successful requests, 100% of errors
- **Provider**: GitHub (easily swappable)

## Log Entry Format

```typescript
{
  timestamp: "2025-10-11T18:30:00.123Z",
  path: "/task/api/task",
  method: "GET",
  backend: "tunnel" | "worker" | "lambda" | "static" | "error",
  status: 200,
  duration: 145,  // milliseconds
  userAgent: "Mozilla/5.0..."  // truncated to 100 chars
}
```

## Reading Logs

### Option 1: GitHub Web UI
1. Navigate to: https://github.com/WolffM/hadoku_site/tree/main/logs/requests
2. Click on a date file (e.g., `2025-10-11.jsonl`)
3. View raw to see all log entries

### Option 2: Git Clone
```bash
git pull origin main
cat logs/requests/2025-10-11.jsonl | jq .
```

### Option 3: Python Analysis Script
```bash
python scripts/analyze_logs.py logs/requests/2025-10-11.jsonl
```

## Analysis Script

Create `scripts/analyze_logs.py`:

```python
#!/usr/bin/env python3
import json
import sys
from collections import Counter
from datetime import datetime

def analyze_logs(log_file):
    """Analyze request logs and print summary statistics"""
    backend_counts = Counter()
    status_counts = Counter()
    method_counts = Counter()
    total_requests = 0
    total_duration = 0
    errors = []
    
    with open(log_file) as f:
        for line in f:
            if not line.strip():
                continue
            log = json.loads(line)
            total_requests += 1
            backend_counts[log['backend']] += 1
            status_counts[log['status']] += 1
            method_counts[log['method']] += 1
            total_duration += log['duration']
            
            if log['status'] >= 400:
                errors.append(log)
    
    print(f"📊 Log Analysis: {log_file}")
    print(f"=" * 60)
    print(f"\n📈 Total Requests: {total_requests}")
    print(f"⏱️  Average Duration: {total_duration / total_requests:.1f}ms\n")
    
    print("🔀 Backend Distribution:")
    for backend, count in backend_counts.most_common():
        pct = (count / total_requests) * 100
        print(f"  {backend:8} : {count:4} ({pct:5.1f}%)")
    
    print(f"\n📡 HTTP Methods:")
    for method, count in method_counts.most_common():
        print(f"  {method:6} : {count:4}")
    
    print(f"\n🚦 Status Codes:")
    for status, count in sorted(status_counts.items()):
        emoji = "✅" if 200 <= status < 300 else "⚠️" if 300 <= status < 400 else "❌"
        print(f"  {emoji} {status} : {count:4}")
    
    if errors:
        print(f"\n❌ Errors ({len(errors)}):")
        for err in errors[:10]:  # Show first 10
            print(f"  {err['timestamp']} {err['method']} {err['path']} → {err['status']}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python analyze_logs.py <log_file>")
        sys.exit(1)
    analyze_logs(sys.argv[1])
```

Make it executable:
```bash
chmod +x scripts/analyze_logs.py
```

## Switching Providers

To switch from GitHub to another provider (e.g., R2, Splunk):

1. Create new provider implementing `LogProvider` interface:
```typescript
// workers/edge-router/src/logging/r2-provider.ts
export class R2LogProvider implements LogProvider {
  async writeLogs(entries: LogEntry[]): Promise<void> {
    // Implementation
  }
}
```

2. Update `logRequest()` in `index.ts`:
```typescript
const provider = new R2LogProvider({
  bucket: env.LOG_BUCKET
});
```

That's it! No other code changes needed.

## Configuration

Environment variables in `wrangler.toml`:
- `LOG_ENABLED`: "true" or "false" (default: true)
- `REPO_OWNER`, `REPO_NAME`: GitHub repo for logs
- `GITHUB_PAT` (secret): GitHub token with repo write access

Adjust sampling rates in `index.ts`:
```typescript
const logger = new RequestLogger(provider, {
  sampleRate: 0.1,      // 10% of success
  errorSampleRate: 1.0  // 100% of errors
});
```

## GitHub API Rate Limits

- **GitHub API**: 5000 requests/hour with PAT
- **Batch size**: 50 logs per write (configurable)
- **With 10% sampling**: ~500,000 requests/hour before hitting API limits
- **Cost**: Free (uses existing GitHub repo)

## Troubleshooting

**Logs not appearing?**
1. Check Worker logs: `wrangler tail edge-router`
2. Verify `GITHUB_PAT` secret is set
3. Check sampling rate (might not log every request)
4. Verify `LOG_ENABLED` is "true"

**Provider errors?**
- GitHub API errors are logged to console but don't break requests
- Check token permissions (needs `repo` scope)
