#!/usr/bin/env python3
"""
Request Log Analyzer

Analyzes JSONL log files from edge-router Worker.
Usage: python analyze_logs.py logs/requests/2025-10-11.jsonl
"""

import json
import sys
from collections import Counter
from pathlib import Path

def analyze_logs(log_file):
    """Analyze request logs and print summary statistics"""
    backend_counts = Counter()
    status_counts = Counter()
    method_counts = Counter()
    path_counts = Counter()
    total_requests = 0
    total_duration = 0
    errors = []
    
    log_path = Path(log_file)
    if not log_path.exists():
        print(f"❌ Log file not found: {log_file}")
        return
    
    with open(log_path) as f:
        for line_num, line in enumerate(f, 1):
            if not line.strip():
                continue
            
            try:
                log = json.loads(line)
                total_requests += 1
                backend_counts[log['backend']] += 1
                status_counts[log['status']] += 1
                method_counts[log['method']] += 1
                
                # Group paths by first two segments
                path_parts = log['path'].split('/')[:3]
                path_key = '/'.join(path_parts) if len(path_parts) > 1 else log['path']
                path_counts[path_key] += 1
                
                total_duration += log['duration']
                
                if log['status'] >= 400:
                    errors.append(log)
            except (json.JSONDecodeError, KeyError) as e:
                print(f"⚠️  Line {line_num}: Invalid log entry: {e}")
                continue
    
    if total_requests == 0:
        print(f"📭 No valid log entries found in {log_file}")
        return
    
    print(f"📊 Log Analysis: {log_path.name}")
    print(f"=" * 70)
    print(f"\n📈 Total Requests Logged: {total_requests}")
    print(f"⏱️  Average Duration: {total_duration / total_requests:.1f}ms")
    print(f"⚡ Min/Max Duration: {min(log.get('duration', 0) for log in [json.loads(l) for l in open(log_path) if l.strip()])}ms / {max(log.get('duration', 0) for log in [json.loads(l) for l in open(log_path) if l.strip()])}ms")
    
    print(f"\n🔀 Backend Distribution:")
    for backend, count in backend_counts.most_common():
        pct = (count / total_requests) * 100
        emoji = "🚇" if backend == "tunnel" else "☁️" if backend == "worker" else "λ" if backend == "lambda" else "📄" if backend == "static" else "❌"
        print(f"  {emoji} {backend:8} : {count:4} ({pct:5.1f}%)")
    
    print(f"\n📡 HTTP Methods:")
    for method, count in method_counts.most_common():
        emoji = "📥" if method == "GET" else "📤" if method == "POST" else "🔄" if method == "PUT" else "✏️" if method == "PATCH" else "🗑️" if method == "DELETE" else "❓"
        print(f"  {emoji} {method:6} : {count:4}")
    
    print(f"\n📂 Top Paths:")
    for path, count in path_counts.most_common(10):
        print(f"  {path:30} : {count:4}")
    
    print(f"\n🚦 Status Codes:")
    for status, count in sorted(status_counts.items()):
        emoji = "✅" if 200 <= status < 300 else "➡️" if 300 <= status < 400 else "⚠️" if 400 <= status < 500 else "❌"
        print(f"  {emoji} {status} : {count:4}")
    
    if errors:
        print(f"\n❌ Errors ({len(errors)}):")
        for err in errors[:15]:  # Show first 15
            backend_emoji = "🚇" if err['backend'] == "tunnel" else "☁️" if err['backend'] == "worker" else "❌"
            print(f"  {backend_emoji} {err['timestamp']} {err['method']:6} {err['path']:30} → {err['status']} ({err['duration']}ms)")
        if len(errors) > 15:
            print(f"  ... and {len(errors) - 15} more errors")
    
    # Cloudflare Workers free tier info
    print(f"\n💰 Cloudflare Workers Free Tier Usage:")
    print(f"  Estimated actual requests (10% sample): ~{total_requests * 10:,}")
    print(f"  Free tier limit: 100,000 requests/day")
    if total_requests * 10 > 100000:
        print(f"  ⚠️  WARNING: Approaching or exceeding free tier!")
    else:
        remaining_pct = ((100000 - (total_requests * 10)) / 100000) * 100
        print(f"  ✅ {remaining_pct:.1f}% of daily quota remaining")

def main():
    if len(sys.argv) < 2:
        print("Usage: python analyze_logs.py <log_file>")
        print("\nExample:")
        print("  python analyze_logs.py logs/requests/2025-10-11.jsonl")
        sys.exit(1)
    
    analyze_logs(sys.argv[1])

if __name__ == '__main__':
    main()
