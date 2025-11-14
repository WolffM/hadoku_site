# Edge Router Logging

Uses **Cloudflare Workers Analytics Engine** for zero-setup request tracking.

## Overview

- **Where**: Cloudflare Analytics Engine (built-in to Workers)
- **Retention**: 30 days
- **Limits**: 10 million events/month (free)
- **Query**: SQL-like syntax via Cloudflare Dashboard
- **Setup**: Zero - automatically bound to all Workers

## Data Structure

Each request logs:

- **Blobs** (strings): path, userAgent
- **Doubles** (numbers): duration (ms), status
- **Indexes** (filterable): backend, method, timestamp

## Viewing Logs

### Cloudflare Dashboard (Recommended)

1. Go to: https://dash.cloudflare.com
2. Select your account
3. Go to **Workers & Pages** → **edge-router**
4. Click **Analytics** tab
5. View real-time metrics and run SQL queries

### Example Queries

**Backend distribution:**

```sql
SELECT
  index1 as backend,
  COUNT(*) as requests
FROM ANALYTICS_ENGINE
WHERE timestamp > NOW() - INTERVAL '24' HOUR
GROUP BY backend
ORDER BY requests DESC
```

**Average duration by backend:**

```sql
SELECT
  index1 as backend,
  AVG(double1) as avg_duration_ms
FROM ANALYTICS_ENGINE
WHERE timestamp > NOW() - INTERVAL '24' HOUR
GROUP BY backend
```

**Error rate:**

```sql
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN double2 >= 400 THEN 1 ELSE 0 END) as errors,
  (SUM(CASE WHEN double2 >= 400 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as error_rate
FROM ANALYTICS_ENGINE
WHERE timestamp > NOW() - INTERVAL '24' HOUR
```

**Top slow paths:**

```sql
SELECT
  blob1 as path,
  AVG(double1) as avg_duration,
  COUNT(*) as count
FROM ANALYTICS_ENGINE
WHERE timestamp > NOW() - INTERVAL '24' HOUR
GROUP BY path
ORDER BY avg_duration DESC
LIMIT 10
```

## Benefits

- ✅ **Zero setup** - automatically enabled for all Workers
- ✅ **Zero cost** - 10M events/month free
- ✅ **Real-time** - see metrics instantly
- ✅ **SQL queries** - powerful analytics
- ✅ **No maintenance** - Cloudflare manages everything
- ✅ **Fast** - non-blocking writes
- ✅ **Reliable** - built into Workers platform

## Limits

- **Free tier**: 10 million events/month
- **Retention**: 30 days
- **Query complexity**: Reasonable SQL queries
- **Data points**: Unlimited writes (within event limit)

## Monitoring

View analytics at:

```
https://dash.cloudflare.com/<account_id>/workers/services/view/edge-router/analytics
```

Or use the Cloudflare API:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/<account_id>/analytics_engine/sql" \
  -H "Authorization: Bearer <token>" \
  -d '{"query":"SELECT * FROM ANALYTICS_ENGINE LIMIT 10"}'
```

## Troubleshooting

**Not seeing data?**

1. Wait 1-2 minutes for data to appear (slight delay)
2. Check Worker is deployed: `wrangler deployments list edge-router`
3. Verify requests are hitting the Worker
4. Check browser dev tools for X-Backend-Source header

**Need more detail?**

- Analytics Engine is for metrics/aggregation
- For detailed request logs, use `wrangler tail edge-router --format=pretty`
