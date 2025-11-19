# Contact API Worker

Public-facing contact form API for hadoku.me with comprehensive security layers.

## Features

- ✅ **Public submission endpoint** - No authentication required
- ✅ **Multi-layer security**:
  - Rate limiting (5 submissions/hour per IP)
  - Referrer validation (hadoku.me only)
  - Honeypot spam detection
  - Field validation and sanitization
  - CORS protection
- ✅ **Admin endpoints** - View and manage submissions (admin-only)
- ✅ **Auto-archiving** - Moves 30+ day old submissions to archive table
- ✅ **D1 database storage** - SQLite-based with automatic cleanup
- ✅ **Scheduled tasks** - Daily cron job for maintenance

## Architecture

```
Public Form (hadoku.me/contact)
    ↓
Edge Router (hadoku.me/contact/api/*)
    ↓
Contact API Worker
    ↓
┌─────────────────────────────────┐
│ Security Layers:                │
│ 1. Referrer validation          │
│ 2. Rate limiting (KV)           │
│ 3. Honeypot detection           │
│ 4. Field validation             │
└─────────────────────────────────┘
    ↓
D1 Database (contact_submissions)
```

## Setup & Deployment

### 1. Create D1 Database

```bash
# Create the database
wrangler d1 create contact-submissions

# Copy the database_id from output and update wrangler.toml
```

### 2. Create KV Namespace

```bash
# Create KV namespace for rate limiting
wrangler kv:namespace create "RATE_LIMIT_KV"

# Copy the id from output and update wrangler.toml
```

### 3. Update wrangler.toml

Replace the placeholder IDs in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "contact-submissions"
database_id = "YOUR_D1_DATABASE_ID_HERE"

[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "YOUR_KV_NAMESPACE_ID_HERE"
```

### 4. Run Migrations

```bash
# Local development
pnpm run migrate

# Production
pnpm run migrate:remote
```

### 5. Set Secrets (Optional - for admin endpoints)

```bash
# Set admin keys for admin endpoint access
wrangler secret put ADMIN_KEYS
# Enter: ["your-admin-key-1", "your-admin-key-2"]

# Set friend keys (optional)
wrangler secret put FRIEND_KEYS
# Enter: ["your-friend-key-1"]
```

### 6. Deploy Worker

```bash
# Deploy to Cloudflare
pnpm run deploy
```

### 7. Update Edge Router

Update `workers/edge-router/wrangler.toml` with the deployed worker URL:

```toml
CONTACT_WORKER_BASE = "https://contact-api.YOUR_SUBDOMAIN.workers.dev"
```

Then redeploy edge-router:

```bash
cd workers/edge-router
pnpm run deploy
```

## API Endpoints

### Public Endpoints

#### `POST /contact/api/submit`

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question...",
  "website": ""  // Honeypot - must be empty
}
```

**Success Response (201):**
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Your message has been sent successfully!"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    "Name must be at least 2 characters",
    "Email format is invalid"
  ]
}
```

**Rate Limit Response (429):**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "You can submit again in 45 minute(s).",
  "retryAfter": 2700
}
```

### Admin Endpoints

All admin endpoints require `X-User-Key` or `X-Session-Id` header with admin privileges.

#### `GET /contact/api/admin/submissions`

List all submissions with pagination.

**Query Parameters:**
- `limit` (optional, default: 100) - Number of results per page
- `offset` (optional, default: 0) - Offset for pagination

**Response:**
```json
{
  "submissions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello...",
      "status": "unread",
      "created_at": 1705849200000,
      "ip_address": "203.0.113.1",
      "user_agent": "Mozilla/5.0...",
      "referrer": "https://hadoku.me/contact"
    }
  ],
  "stats": {
    "total": 42,
    "unread": 10,
    "read": 25,
    "archived": 7
  },
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 42
  }
}
```

#### `GET /contact/api/admin/submissions/:id`

Get a single submission by ID.

#### `PATCH /contact/api/admin/submissions/:id/status`

Update submission status.

**Request Body:**
```json
{
  "status": "read"  // "unread" | "read" | "archived"
}
```

#### `GET /contact/api/admin/stats`

Get statistics about submissions and database usage.

**Response:**
```json
{
  "submissions": {
    "total": 42,
    "unread": 10,
    "read": 25,
    "archived": 7
  },
  "database": {
    "sizeBytes": 12582912,
    "sizeMB": "12.00",
    "percentUsed": "2.39",
    "warning": false
  }
}
```

#### `POST /contact/api/admin/archive`

Manually trigger archiving of old submissions.

**Request Body:**
```json
{
  "daysOld": 30  // Optional, default: 30
}
```

#### `POST /contact/api/admin/rate-limit/reset`

Reset rate limit for a specific IP address.

**Request Body:**
```json
{
  "ipAddress": "203.0.113.1"
}
```

## Security Features

### 1. Rate Limiting

- **Limit:** 5 submissions per hour per IP
- **Window:** Sliding 1-hour window
- **Storage:** Cloudflare KV with automatic TTL expiration
- **Response:** 429 status with `Retry-After` header

### 2. Referrer Validation

- Only accepts requests from `hadoku.me` and `*.hadoku.me`
- Rejects requests with missing or invalid referrer
- Prevents embedding on malicious sites

### 3. Honeypot Spam Detection

- Hidden `website` field invisible to humans
- Bots automatically fill all fields, including honeypot
- Instant rejection if honeypot is filled

### 4. Field Validation

- **Name:** 2-100 characters, required
- **Email:** Valid email format, 5-100 characters, required
- **Message:** 10-5000 characters, required
- All fields sanitized (trimmed, length-limited)

### 5. CORS Protection

- Only allows origins: `hadoku.me`, `*.hadoku.me`
- Credentials allowed for admin endpoints
- Preflight OPTIONS support

## Scheduled Maintenance

A cron job runs daily at 3 AM UTC to perform:

1. **Auto-archiving:** Move submissions older than 30 days to archive table
2. **Capacity monitoring:** Log warning if database exceeds 80% capacity

Configure the cron schedule in `wrangler.toml`:

```toml
[triggers]
crons = ["0 3 * * *"]  # Daily at 3 AM UTC
```

## Database Schema

### contact_submissions

Active submissions (auto-archived after 30 days):

```sql
CREATE TABLE contact_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT
);
```

### contact_submissions_archive

Historical submissions (moved from active table):

```sql
CREATE TABLE contact_submissions_archive (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    archived_at INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT
);
```

## Development

### Local Development

```bash
# Install dependencies
pnpm install

# Run migrations (local)
pnpm run migrate

# Start dev server
pnpm run dev

# Test the API
curl http://localhost:8787/contact/api/health
```

### Testing Submissions

```bash
# Test valid submission
curl -X POST http://localhost:8787/contact/api/submit \
  -H "Content-Type: application/json" \
  -H "Referer: https://hadoku.me/contact" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message",
    "website": ""
  }'

# Test honeypot detection
curl -X POST http://localhost:8787/contact/api/submit \
  -H "Content-Type: application/json" \
  -H "Referer: https://hadoku.me/contact" \
  -d '{
    "name": "Bot",
    "email": "bot@example.com",
    "message": "Spam",
    "website": "https://spam.com"
  }'
```

### View Submissions (Admin)

```bash
# Get all submissions
curl http://localhost:8787/contact/api/admin/submissions \
  -H "X-User-Key: your-admin-key"

# Get stats
curl http://localhost:8787/contact/api/admin/stats \
  -H "X-User-Key: your-admin-key"
```

## Monitoring

### Analytics

The edge-router logs all requests to Cloudflare Analytics Engine. Query with:

```sql
SELECT
  timestamp,
  path,
  method,
  backend,
  status,
  duration
FROM ANALYTICS_ENGINE_DATASET
WHERE path LIKE '/contact/api/%'
ORDER BY timestamp DESC
LIMIT 100
```

### D1 Database Size

Monitor database usage via admin stats endpoint:

```bash
curl https://hadoku.me/contact/api/admin/stats \
  -H "X-Session-Id: your-session-id"
```

Watch for `warning: true` when database exceeds 80% capacity (400 MB of 500 MB free tier).

## Troubleshooting

### "Contact API unavailable" error

1. Check worker deployment:
   ```bash
   wrangler deployments list
   ```

2. Verify edge-router has correct `CONTACT_WORKER_BASE`:
   ```bash
   wrangler whoami
   # Worker URL should be: https://contact-api.YOUR_SUBDOMAIN.workers.dev
   ```

3. Check worker logs:
   ```bash
   wrangler tail
   ```

### Rate limit not working

1. Verify KV namespace is bound:
   ```bash
   wrangler kv:namespace list
   ```

2. Check KV bindings in wrangler.toml match deployed namespaces

3. Monitor KV operations:
   ```bash
   wrangler tail --format=json | grep "rate-limit"
   ```

### Database migrations failed

1. Check D1 database exists:
   ```bash
   wrangler d1 list
   ```

2. Verify database ID in wrangler.toml matches

3. Run migrations with verbose output:
   ```bash
   wrangler d1 migrations apply contact-submissions --local
   ```

## Next Steps

1. ✅ Set up D1 database and KV namespace
2. ✅ Run migrations
3. ✅ Deploy worker
4. ✅ Update edge-router configuration
5. ✅ Test submission endpoint
6. ⏳ Monitor for spam and adjust rate limits if needed
7. ⏳ Set up email notifications (future enhancement)
8. ⏳ Build admin dashboard UI (future enhancement)

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Workers KV Docs](https://developers.cloudflare.com/kv/)
- [Cron Triggers Docs](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
