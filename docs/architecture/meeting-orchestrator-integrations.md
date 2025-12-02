# Meeting Orchestrator – Integration Setup Guide

This document describes what needs to be done to set up an automated meeting workflow using:

- **Jitsi**
- **Google Meet**
- **Microsoft Teams**
- **Discord** (invite + scheduled event)

The goal is to use **`meeting@hadoku.me`** as the primary “service account” identity wherever possible, and to expose a simple CLI / API that can create meetings and then announce them (for example, by creating a Discord scheduled event).

---

## 0. Shared Prerequisites

These are one-time things that benefit all integrations.

### 0.1 `meeting@hadoku.me` account

- Ensure `meeting@hadoku.me` is a working email address (via your Cloudflare + Resend routing).
- Confirm that messages sent to `meeting@hadoku.me` are correctly routed to an inbox you can read.

You will reuse this identity when signing up for Google / Microsoft / Discord where appropriate.

### 0.2 Secrets and config

Decide where you’re going to store credentials and config:

- `.env` file for local dev, plus a secrets manager for production (GitHub Actions / Cloudflare / etc.).
- Plan for at least the following env vars (you’ll fill them in as you complete each section):

```bash
# Google
MEETING_GOOGLE_CLIENT_ID=
MEETING_GOOGLE_CLIENT_SECRET=
MEETING_GOOGLE_REFRESH_TOKEN=
MEETING_GOOGLE_CALENDAR_ID=primary   # or full email

# Microsoft / Teams
MEETING_TEAMS_TENANT_ID=
MEETING_TEAMS_CLIENT_ID=
MEETING_TEAMS_CLIENT_SECRET=
MEETING_TEAMS_USER_ID=               # object ID or UPN of meeting@hadoku.me

# Discord
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=
DISCORD_DEFAULT_CHANNEL_ID=

# Jitsi
MEETING_JITSI_BASE_URL=https://meet.jit.si
# (later: JWT signing key / JaaS config if needed)
```

### 0.3 Minimal orchestrator CLI

Plan to have a small Node/TS tool (or similar) that exposes commands like:

```bash
meeting create   --provider jitsi|google-meet|teams   --title "My Meeting"   --start "2025-11-23T20:00:00Z"   --duration 60   --discord-guild $DISCORD_GUILD_ID   --discord-channel $DISCORD_DEFAULT_CHANNEL_ID
```

Every integration below assumes this CLI (or equivalent script) will call the appropriate API and then output JSON with at least:

```jsonc
{
  "provider": "google-meet",
  "meetingUrl": "https://meet.google.com/...",
  "start": "2025-11-23T20:00:00Z",
  "end": "2025-11-23T21:00:00Z",
}
```

---

## 1. Jitsi Integration

Jitsi is the easiest integration and can be implemented with **zero API keys** to start.

### 1.1 Basic “URL-only” setup

What you need to do:

1. **Choose a Jitsi base URL**
   - Default: `https://meet.jit.si`
   - Or your own self-hosted Jitsi instance.
2. **Implement room-name generation in your orchestrator**
   - For example: `hdk-<date>-<random-suffix>`
   - E.g., `hdk-2025-11-23-xyz123`.
3. **Build the meeting URL**
   - `MEETING_JITSI_BASE_URL + "/" + roomName`.

No accounts, tokens, or CLI tools are required for the basic flow.

### 1.2 Optional: advanced Jitsi / JaaS

If you decide later that you need authenticated / locked meetings or embedding with control:

1. Sign up for **Jitsi as a Service (JaaS)** or set up Jitsi JWT auth on your own instance.
2. Obtain:
   - JaaS **API key** and **private key** for JWT, or
   - Your own signing key for self-hosted Jitsi.
3. Extend the orchestrator:
   - Sign a JWT with the meeting details and attach it when embedding Jitsi or sharing URLs.
   - Store secrets as env vars (e.g., `JITSI_JAAS_APP_ID`, `JITSI_JAAS_PRIVATE_KEY`).

For initial implementation, you can skip this and just use anonymous rooms.

---

## 2. Google Meet Integration (via Google Calendar API)

There is no separate “Meet API”; instead, you create a **Calendar event** with a **Meet conference** and the API returns the Meet URL.

### 2.1 Create a Google account for `meeting@hadoku.me`

1. Go to Google Account signup.
2. Choose **Use my current email address**.
3. Enter `meeting@hadoku.me` as the email.
4. Complete verification (Google will send a code to `meeting@hadoku.me`, which Resend should route to you).

This account will own the calendar and Meet links your orchestrator creates.

### 2.2 Create and configure a Google Cloud project

1. Sign in to the Google Cloud Console as `meeting@hadoku.me`.
2. Create a **new project**, e.g., `hadoku-meet-orchestrator`.
3. In **APIs & Services → Library**, enable:
   - **Google Calendar API**.

### 2.3 Create OAuth credentials

You have two main paths; for now, a user-based OAuth flow is simplest:

1. In **APIs & Services → Credentials**:
   - Click **Create credentials → OAuth client ID**.
2. Configure **OAuth consent screen** (one-time):
   - Set user type (likely **External**).
   - Add basic info (app name, support email, etc.).
   - Add scope: `https://www.googleapis.com/auth/calendar`.
3. Create an **OAuth client** of type “Desktop” or “Web application”:
   - Save the **Client ID** and **Client Secret** into your env vars:
     - `MEETING_GOOGLE_CLIENT_ID`
     - `MEETING_GOOGLE_CLIENT_SECRET`

### 2.4 Obtain a refresh token (one-time)

You need a persistent refresh token for your orchestrator:

1. Write or use a small local script that:
   - Opens the Google OAuth consent URL in a browser.
   - Lets you sign in as `meeting@hadoku.me` and approve Calendar access.
   - Exchanges the authorization code for access + refresh tokens.
2. Store the **refresh token** as:
   - `MEETING_GOOGLE_REFRESH_TOKEN`

After that, your orchestrator can use the client ID/secret + refresh token to obtain access tokens automatically.

### 2.5 Implement “create Google Meet” in the orchestrator

Your `createGoogleMeet()` function should:

1. Use the OAuth credentials (client ID, secret, refresh token) to get an access token.
2. Send a `POST` to:

   ```text
   https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1
   ```

3. Use a body similar to:

   ```jsonc
   {
     "summary": "My Meeting Title",
     "start": { "dateTime": "2025-11-23T20:00:00Z" },
     "end": { "dateTime": "2025-11-23T21:00:00Z" },
     "conferenceData": {
       "createRequest": {
         "requestId": "some-random-uuid",
         "conferenceSolutionKey": { "type": "hangoutsMeet" },
       },
     },
   }
   ```

4. Parse the response and extract the Meet URL, typically at:

   ```jsonc
   response.conferenceData.entryPoints[0].uri
   ```

5. Return something like:

   ```jsonc
   {
     "provider": "google-meet",
     "meetingUrl": "https://meet.google.com/abc-defg-hij",
     "start": "...",
     "end": "...",
   }
   ```

Your CLI can now call `createGoogleMeet()` when `--provider google-meet` is passed.

---

## 3. Microsoft Teams Integration (via Microsoft Graph)

Teams meetings are created via the **Microsoft Graph Online Meetings API**.

### 3.1 Create a Microsoft 365 identity for `meeting@hadoku.me`

Depending on your setup, you need `meeting@hadoku.me` as a **user** in an M365 tenant:

1. In your Microsoft 365 admin portal:
   - Create a user account with the login `meeting@hadoku.me` (or equivalent UPN).
   - Assign a license that includes **Microsoft Teams**.
2. Note the user’s:
   - **User principal name (UPN)**: often the email.
   - **Object ID** (GUID).

Store the UPN or object ID as:

- `MEETING_TEAMS_USER_ID`

### 3.2 Create an app registration (Entra ID / Azure AD)

1. Go to the **Azure Portal → App registrations**.
2. Create a new app, e.g. `HadokuMeetingOrchestrator`.
3. Record:
   - **Application (client) ID** → `MEETING_TEAMS_CLIENT_ID`
   - **Directory (tenant) ID** → `MEETING_TEAMS_TENANT_ID`

4. Under **Certificates & secrets → Client secrets**:
   - Create a new client secret and store as `MEETING_TEAMS_CLIENT_SECRET`.

### 3.3 Grant Graph API permissions

You have two options: **delegated** (user-based) or **application** (daemon). For automation, **application permissions** are usually better.

In the app registration:

1. Go to **API permissions → Add a permission → Microsoft Graph → Application permissions**.
2. Add:
   - `OnlineMeetings.ReadWrite.All`
3. Click **Grant admin consent** for the tenant.

This allows your app to create online meetings on behalf of users (subject to access policy below).

### 3.4 Configure application access policy for Teams

To restrict which users the app can impersonate, you create an application access policy:

1. Install / open the **Teams / Skype for Business PowerShell module**.
2. Run commands (as a Teams admin) similar to:

   ```powershell
   # Create an application access policy
   New-CsApplicationAccessPolicy -Identity "MeetingOrchestratorPolicy" -AppIds "<YOUR-CLIENT-ID>"

   # Grant the policy to the meeting user
   Grant-CsApplicationAccessPolicy -Identity "meeting@hadoku.me" -PolicyName "MeetingOrchestratorPolicy"
   ```

This tells Teams that your app is allowed to create online meetings for the `meeting@hadoku.me` user.

### 3.5 Implement “create Teams meeting” in the orchestrator

Your `createTeamsMeeting()` function should:

1. Obtain an **application token** using the client credentials flow:
   - Token endpoint: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`
   - Scope: `https://graph.microsoft.com/.default`
2. Use that token to call the Graph API:

   ```text
   POST https://graph.microsoft.com/v1.0/users/{MEETING_TEAMS_USER_ID}/onlineMeetings
   ```

3. Body (simplified):

   ```jsonc
   {
     "subject": "My Meeting Title",
     "startDateTime": "2025-11-23T20:00:00Z",
     "endDateTime": "2025-11-23T21:00:00Z",
   }
   ```

4. Extract the join URL from the response:

   ```jsonc
   response.joinUrl
   ```

5. Return something like:

   ```jsonc
   {
     "provider": "teams",
     "meetingUrl": "https://teams.microsoft.com/l/meetup-join/...",
     "start": "...",
     "end": "...",
   }
   ```

Your CLI can call `createTeamsMeeting()` when `--provider teams` is used.

---

## 4. Discord Integration (Invite + Scheduled Event)

Discord automation is handled through a **bot** (Discord application) using a **bot token**.

### 4.1 Create a Discord application and bot

1. Go to the **Discord Developer Portal**.
2. Create a new application, e.g. `HadokuMeetingBot`.
3. In the **Bot** section:
   - Add a bot to the application.
   - Reset and copy the **bot token**.
4. Store:
   - `DISCORD_BOT_TOKEN`

### 4.2 Add the bot to your server (guild)

1. In the Developer Portal, use the **OAuth2 URL Generator**:
   - Select **bot** and **applications.commands** as scopes.
   - Under **Bot Permissions**, include at least:
     - `MANAGE_EVENTS`
     - `CREATE_INSTANT_INVITE`
     - (Optionally `MANAGE_CHANNELS` if you want more control.)
2. Visit the generated URL and add the bot to your server.
3. In the Discord client, note:
   - Your **Server (guild) ID** → `DISCORD_GUILD_ID`
   - The **default channel ID** where you want events associated → `DISCORD_DEFAULT_CHANNEL_ID`

### 4.3 Implement “create Discord scheduled event”

Whenever your orchestrator creates a meeting on Jitsi / Meet / Teams and gets a `meetingUrl`, it should:

1. Call the Discord REST API (or use a library like `discord.js`) to create a **Guild Scheduled Event**.
2. Use **entity type = EXTERNAL** and set the meeting URL as the location.

Example JSON body:

```jsonc
{
  "name": "My Meeting Title",
  "scheduled_start_time": "2025-11-23T20:00:00Z",
  "scheduled_end_time": "2025-11-23T21:00:00Z",
  "privacy_level": 2,          # GUILD_ONLY
  "entity_type": 3,            # EXTERNAL
  "entity_metadata": {
    "location": "https://meet.google.com/aaa-bbbb-ccc"
  },
  "description": "Join via the link above."
}
```

API endpoint:

```text
POST https://discord.com/api/v10/guilds/{DISCORD_GUILD_ID}/scheduled-events
```

3. Optionally, also create or reuse an invite link for a specific voice/text channel using:

```text
POST https://discord.com/api/v10/channels/{CHANNEL_ID}/invites
```

4. Return the created event’s ID and URL if you want to display or log it.

### 4.4 Wrap Discord as a post-step in the orchestrator

Your orchestrator’s flow should look like:

1. Create meeting via Jitsi / Google Meet / Teams.
2. Create a Discord scheduled event pointing at that meeting URL.
3. Print the joint result as JSON.

Example final output:

```jsonc
{
  "provider": "google-meet",
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "start": "2025-11-23T20:00:00Z",
  "end": "2025-11-23T21:00:00Z",
  "discord": {
    "guildId": "1234567890",
    "scheduledEventId": "0987654321",
  },
}
```

---

## 5. Optional: Unified Calendar “Source of Truth”

Regardless of which provider you use for the actual video call, you can also:

- Always create a **Google Calendar event** under `meeting@hadoku.me` that:
  - Uses the external meeting URL (Jitsi / Teams) in the **description** or **location**.
  - Keeps a complete, centralized log of all meetings.

This is just a variant of the Google Meet Calendar flow where you **omit** the `conferenceData` block and instead set:

```jsonc
{
  "location": "https://meet.jit.si/hdk-xyz123",
  "description": "Jitsi room: https://meet.jit.si/hdk-xyz123",
}
```

---

## 6. Summary of “What Needs To Be Done”

**Jitsi**

- [ ] Decide Jitsi base URL (`https://meet.jit.si` or self-hosted).
- [ ] Implement function to generate room names and compose meeting URL.
- [ ] (Optional later) Set up JaaS / JWT if you want handled auth and embedding.

**Google Meet**

- [ ] Create a Google account using `meeting@hadoku.me`.
- [ ] Create a GCP project and enable the Google Calendar API.
- [ ] Configure OAuth consent screen and create an OAuth client ID/secret.
- [ ] Run a one-time script to get a refresh token for `meeting@hadoku.me`.
- [ ] Implement `createGoogleMeet()` in the orchestrator to call Calendar API and return the Meet URL.

**Microsoft Teams**

- [ ] Create a Microsoft 365 user for `meeting@hadoku.me` with a Teams license.
- [ ] Register a Graph app (client ID, tenant ID, client secret).
- [ ] Add `OnlineMeetings.ReadWrite.All` application permission and grant admin consent.
- [ ] Create and assign a Teams application access policy that links the app to `meeting@hadoku.me`.
- [ ] Implement `createTeamsMeeting()` in the orchestrator using client credentials + Graph OnlineMeetings API.

**Discord**

- [ ] Create a Discord application and bot; store the `DISCORD_BOT_TOKEN`.
- [ ] Add the bot to your server with permissions including `MANAGE_EVENTS` and `CREATE_INSTANT_INVITE`.
- [ ] Record `DISCORD_GUILD_ID` and your preferred default channel ID.
- [ ] Implement Discord REST calls to create **external** Guild Scheduled Events with the meeting URL as the location.
- [ ] Optionally create or reuse channel invites for convenience.

Once these steps are done, your CLI can orchestrate meetings end-to-end by:

1. Creating the actual meeting URL (Jitsi / Meet / Teams).
2. Optionally logging it to a calendar.
3. Creating a Discord scheduled event pointing to that URL.
4. Printing all relevant info as JSON so you can plug it into other scripts or UIs.
