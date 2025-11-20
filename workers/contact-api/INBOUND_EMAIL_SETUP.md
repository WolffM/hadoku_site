# Inbound Email Setup Guide

This guide explains how to configure Resend to forward incoming emails to your contact-api worker, which will check the whitelist before accepting them.

## Overview

The whitelist system now works bidirectionally:

1. **Outbound**: When you reply to someone via the send-email endpoint, they get whitelisted
2. **Inbound**: When they reply back, the webhook checks the whitelist and creates a contact submission if they're whitelisted

## Setup Steps

### 1. Configure MX Records (Already Done ✓)

You've already set up the MX record for receiving emails at your domain:

- Type: MX
- Name: @
- Content: `inbound-smtp.us-east-1...`
- Priority: 10
- Status: Pending

Wait for this to become "Active" before proceeding.

### 2. Configure Resend Webhook for email.received Events

In your Resend dashboard:

1. Go to **Webhooks** section
2. Click **Add Webhook** (or use your existing webhook)
3. Configure the webhook:
   - **Endpoint URL**: `https://contact-api.jamescannon4237-cfd.workers.dev/contact/api/inbound`
   - **Events**: Enable `email.received` event
   - **Description**: "Inbound email handler with whitelist checking"

4. Click **Create** or **Save**

**Important:** When someone sends an email to your domain (e.g., `matthaeus@hadoku.me`), Resend will:

- Receive the email via your MX records
- Trigger the `email.received` webhook
- Your worker will fetch the full email content and check the whitelist

### 3. Test the Integration

#### Test 1: Whitelist an Email Address

Use the admin send-email endpoint to send a test email (this auto-whitelists):

```bash
curl -X POST https://contact-api.jamescannon4237-cfd.workers.dev/contact/api/admin/send-email \
  -H "Content-Type: application/json" \
  -H "X-User-Key: your-admin-key" \
  -d '{
    "from": "matthaeus@hadoku.me",
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test. Please reply to this email."
  }'
```

#### Test 2: Reply to That Email

Reply to the email from `test@example.com`. The inbound webhook should:

1. Receive the email from Resend
2. Check if `test@example.com` is whitelisted (it is, from step 1)
3. Create a contact submission in your database
4. You'll see it in your ContactAdmin dashboard

#### Test 3: Send from Non-Whitelisted Address

Send an email from a different address (not whitelisted). The webhook should:

1. Receive the email
2. Check whitelist (not found)
3. Return success but not process it (logs will show "Sender not whitelisted")

### 4. Verify in Logs

Check your Cloudflare Workers logs:

```bash
cd workers/contact-api
npx wrangler tail
```

Send a test email and watch for:

- `Received inbound email from: test@example.com`
- `Processing email from whitelisted sender: test@example.com`
- `Created submission {id} from inbound email`

Or for rejected emails:

- `Rejecting email from non-whitelisted sender: spam@example.com`

## How It Works

### Workflow

1. **User submits contact form** → Gets recorded in database
2. **You reply via send-email endpoint** → Recipient gets auto-whitelisted
3. **They reply to your email** → Resend receives it → Forwards to webhook
4. **Webhook checks whitelist** → If whitelisted, creates submission → You see it in admin dashboard
5. **You reply again** → Continues the conversation

### Security Features

- Only whitelisted senders can create submissions via email
- Non-whitelisted emails are silently rejected (returns 200 to prevent retries)
- All emails are logged for security audit
- Optional webhook signature verification (see below)

## Optional: Enable Webhook Signature Verification

For additional security, you can verify that webhooks are actually from Resend:

1. Get your Resend webhook signing secret from the dashboard
2. Add it as a Cloudflare Worker secret:
   ```bash
   cd workers/contact-api
   npx wrangler secret put RESEND_WEBHOOK_SECRET
   # Paste your secret when prompted
   ```
3. Redeploy: `npm run deploy`

The webhook will then verify the `svix-signature` header on all incoming requests.

## Monitoring

### Check Whitelist

To see all whitelisted emails, use the admin API:

```bash
curl https://contact-api.jamescannon4237-cfd.workers.dev/contact/api/admin/whitelist \
  -H "X-User-Key: your-admin-key"
```

### Check Submissions

All inbound emails that pass the whitelist check appear as normal contact submissions:

- User Agent: "Resend Inbound Email"
- IP Address: null
- Referrer: null
- Message: Includes subject line and body

## Troubleshooting

### Emails Not Arriving

1. **Check MX Record Status**: Verify it's "Active" in your DNS provider
2. **Check Resend Rule**: Ensure the inbound rule is enabled and correct
3. **Check Webhook URL**: Must be exactly `https://contact-api.jamescannon4237-cfd.workers.dev/contact/api/inbound`
4. **Check Whitelist**: Verify sender is whitelisted in database

### Test the Webhook Directly

```bash
curl -X POST https://contact-api.jamescannon4237-cfd.workers.dev/contact/api/inbound \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@example.com",
    "to": "matthaeus@hadoku.me",
    "subject": "Test Subject",
    "text": "Test message body"
  }'
```

Expected response:

- If whitelisted: `{"success": true, "processed": true}`
- If not whitelisted: `{"success": false, "processed": false, "message": "Sender not whitelisted"}`

### Check Logs

```bash
cd workers/contact-api
npx wrangler tail --format pretty
```

Then send a test email and watch the real-time logs.

## API Endpoints

### POST /contact/api/inbound

Webhook endpoint for Resend to forward emails.

**Request Body** (sent by Resend):

```json
{
  "from": "sender@example.com",
  "to": "matthaeus@hadoku.me",
  "subject": "Email subject",
  "text": "Plain text body",
  "html": "<p>HTML body</p>",
  "reply_to": "reply@example.com",
  "headers": {}
}
```

**Response**:

```json
{
  "success": true,
  "processed": true,
  "submissionId": "uuid-here"
}
```

## Next Steps

1. Wait for MX record to become active
2. Configure the inbound rule in Resend
3. Send yourself a test email using the send-email endpoint
4. Reply to that email and verify it appears in your ContactAdmin dashboard
5. Enjoy bidirectional email with automatic whitelist enforcement!
