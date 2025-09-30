# Access Control System

## Overview

Hadoku uses a URL parameter-based access control system to show different micro-apps to different types of users.

## User Types

### 1. Public (`public`)
- **Access**: Home page only
- **URL**: `https://hadoku.me/`
- **Visible Apps**: None (just the home page welcome screen)

### 2. Friend (`friend`)
- **Access**: Home + Watchparty
- **URL**: `https://hadoku.me/?key=FRIEND_KEY`
- **Visible Apps**: 
  - Home
  - Watchparty

### 3. Admin (`admin`)
- **Access**: All apps
- **URL**: `https://hadoku.me/?key=ADMIN_KEY`
- **Visible Apps**:
  - Home
  - Watchparty
  - Task
  - Contact
  - Herodraft

## How It Works

### URL Parameter
Users provide an access key via the `key` URL parameter:
```
https://hadoku.me/?key=your-access-key
```

The key is checked against stored secrets to determine access level.

### Key Propagation
When navigating to apps, the key is preserved:
```
Home (?key=xxx) → Watchparty (?key=xxx) → maintains access level
```

### Access Control Logic
1. User visits site with or without `?key=xxx`
2. `src/config/access-control.ts` determines user type
3. Home page shows only accessible apps
4. Apps can optionally check access level for additional protection

## Configuration

### Environment Variables
Set these in GitHub repository secrets:

- `ADMIN_KEY`: Key for admin access (all apps)
- `FRIEND_KEY`: Key for friend access (home + watchparty)

### File: `src/config/access-control.ts`

```typescript
export const appVisibility: Record<UserType, string[]> = {
  public: ['home'],
  friend: ['home', 'watchparty'],
  admin: ['home', 'watchparty', 'task', 'contact', 'herodraft']
};
```

## Setup Instructions

### 1. Generate Access Keys

```bash
# Admin key (full access)
openssl rand -hex 16

# Friend key (limited access)
openssl rand -hex 16
```

### 2. Add to GitHub Secrets

1. Go to: https://github.com/WolffM/hadoku_site/settings/secrets/actions
2. Add `ADMIN_KEY` with your admin key
3. Add `FRIEND_KEY` with your friend key

### 3. Share Keys Securely

- **Admin Key**: Keep private, only for you
- **Friend Key**: Share with trusted friends for watchparty access
- **Public**: No key needed, anyone can visit

## Usage Examples

### For Admin (You)
```
https://hadoku.me/?key=<ADMIN_KEY>
```
See all apps: Home, Watchparty, Task, Contact, Herodraft

### For Friends
```
https://hadoku.me/?key=<FRIEND_KEY>
```
See limited apps: Home, Watchparty

### For Public
```
https://hadoku.me/
```
See welcome screen only

## Adding New Apps

To add a new app to the access control system:

### 1. Update `src/config/access-control.ts`

```typescript
export const appVisibility: Record<UserType, string[]> = {
  public: ['home'],
  friend: ['home', 'watchparty'],
  admin: ['home', 'watchparty', 'task', 'contact', 'herodraft', 'newapp']
                                                                  // ^^^^^^ add here
};
```

### 2. Update `src/pages/index.astro`

Add app metadata:

```typescript
const appInfo = {
  // ... existing apps
  newapp: {
    title: 'New App',
    description: 'Description of new app',
    icon: '🆕'
  }
};
```

### 3. Create App Route

Add to `src/pages/[app].astro` valid apps:

```typescript
const validApps = ['watchparty', 'task', 'contact', 'herodraft', 'home', 'newapp'];
```

## Security Notes

1. **Keys are visible in URLs**: URL parameters can be seen in browser history and logs
2. **Client-side only**: This is basic access control, not security
3. **For convenience**: Prevents accidental discovery, not malicious access
4. **Consider authentication**: For sensitive data, implement proper auth
5. **Rotate keys**: Change keys periodically, especially if shared widely

## Future Enhancements

- Session storage to avoid key in URL after initial login
- Time-limited keys that expire
- Per-app access control (e.g., friend can see task but not herodraft)
- Admin panel to generate/revoke keys
- Analytics on key usage
