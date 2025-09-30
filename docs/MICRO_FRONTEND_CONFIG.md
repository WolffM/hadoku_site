# Micro-Frontend Configuration Guide

## Overview

The watchparty micro-frontend receives configuration from the parent application (hadoku_site) via props. This allows the parent to control environment-specific settings without rebuilding the micro-frontend.

## Props Received

When your app is mounted, it receives these props from hadoku_site:

```typescript
interface WatchpartyProps {
  basename: string;          // e.g., "/watchparty" - for routing
  serverOrigin: string;      // e.g., "http://localhost:8080" or "https://api.hadoku.me"
  defaultRoomKey: string;    // e.g., "dev-room-1000"
  mediaBase: string;         // e.g., "/media"
}
```

## How to Use Props in Your Code

### In entry.tsx

```typescript
export function mount(el: HTMLElement, props: WatchpartyProps = {}) {
  const {
    basename = '/watchparty',
    serverOrigin = 'http://localhost:8080',
    defaultRoomKey = 'dev-room-1000',
    mediaBase = '/media'
  } = props;

  // Use these values instead of import.meta.env
  const router = createWatchpartyRouter({
    basename,
    appProps: {
      serverOrigin,
      defaultRoomKey,
      mediaBase
    }
  });

  // ... rest of mount logic
}
```

### In App.tsx or other components

Pass the config through your app props:

```typescript
export interface AppProps {
  serverOrigin?: string;
  defaultRoomKey?: string;
  mediaBase?: string;
}

export default function App(props: AppProps) {
  const serverOrigin = props.serverOrigin || 'http://localhost:8080';
  
  // Use serverOrigin instead of import.meta.env.VITE_SERVER_ORIGIN
  useEffect(() => {
    async function checkHealth() {
      const url = serverOrigin.replace(/\/$/, '') + '/healthz';
      // ...
    }
  }, [serverOrigin]);
}
```

### In socket.ts or other utilities

Create a context or config object:

```typescript
let runtimeConfig = {
  serverOrigin: 'http://localhost:8080',
  defaultRoomKey: 'dev-room-1000',
  mediaBase: '/media'
};

export function setRuntimeConfig(config: Partial<typeof runtimeConfig>) {
  runtimeConfig = { ...runtimeConfig, ...config };
}

export function getRuntimeConfig() {
  return runtimeConfig;
}

// In your socket connection:
export function getSocket(): Socket {
  if (!socket) {
    const { serverOrigin } = getRuntimeConfig();
    socket = io(serverOrigin, { path: '/watchparty/ws', transports: ['websocket'] });
  }
  return socket;
}
```

Then in entry.tsx:
```typescript
import { setRuntimeConfig } from './lib/socket';

export function mount(el: HTMLElement, props: WatchpartyProps = {}) {
  setRuntimeConfig({
    serverOrigin: props.serverOrigin,
    defaultRoomKey: props.defaultRoomKey,
    mediaBase: props.mediaBase
  });
  
  // ... mount logic
}
```

## Local Development

When running locally with `pnpm dev`, the props won't be available. Use fallback values:

```typescript
const serverOrigin = props.serverOrigin || import.meta.env.VITE_SERVER_ORIGIN || 'http://localhost:8080';
```

This way:
- ✅ Standalone dev: Uses .env file
- ✅ Integrated with hadoku_site: Uses props from parent
- ✅ Production: Parent controls all config

## Vite Build Configuration

**Remove environment variables from the build output.** Your vite.config.ts should NOT have a `define` block for env vars since we're using props instead:

```typescript
export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/watchparty/' : undefined,
    plugins: [react()],
    build: {
      sourcemap: true,
      lib: {
        entry: 'src/entry.tsx',
        formats: ['es'],
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: ['react', 'react-dom/client'],
      },
    },
  };
});
```

## Environment Variables (Local Dev Only)

Your `.env` file is only used during local development:

```env
VITE_SERVER_ORIGIN=http://localhost:8080
VITE_DEFAULT_ROOM_KEY=dev-room-1000
VITE_MEDIA_BASE=/media
```

These are NOT included in the production build - props take over.

## Parent Configuration

The parent app (hadoku_site) controls these values in `public/mf/registry.json`:

```json
{
  "watchparty": {
    "url": "/mf/watchparty/index.js",
    "basename": "/watchparty",
    "props": {
      "serverOrigin": "https://api.hadoku.me",
      "defaultRoomKey": "dev-room-1000",
      "mediaBase": "/media"
    }
  }
}
```

## Testing

### Test with props:
```typescript
import { mount } from './entry';

const el = document.createElement('div');
mount(el, {
  basename: '/watchparty',
  serverOrigin: 'https://staging-api.hadoku.me',
  defaultRoomKey: 'test-room',
  mediaBase: '/media'
});
```

### Test without props (fallback):
```typescript
mount(el); // Should use .env defaults
```

## Migration Checklist

- [ ] Replace all `import.meta.env.VITE_SERVER_ORIGIN` with props
- [ ] Replace all `import.meta.env.VITE_DEFAULT_ROOM_KEY` with props
- [ ] Replace all `import.meta.env.VITE_MEDIA_BASE` with props
- [ ] Add fallback values for local development
- [ ] Remove `define` block from vite.config.ts (if present)
- [ ] Test locally with `pnpm dev`
- [ ] Test integrated with hadoku_site
- [ ] Verify production build doesn't contain `import.meta.env` references

## Benefits

✅ **No rebuilds needed** - Parent controls config
✅ **Multiple environments** - Same build works everywhere
✅ **Better separation** - Micro-frontend doesn't know about deployment
✅ **Easier testing** - Mock props for different scenarios
✅ **No env variable leaks** - Config is explicit, not embedded
