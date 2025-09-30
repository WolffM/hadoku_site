# My Micro-Frontend App

A micro-frontend application that integrates with [hadoku_site](https://github.com/WolffM/hadoku_site).

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

## Development

Visit `http://localhost:5173/myapp/` after running `npm run dev`.

## Deployment

Push to the `main` branch to automatically deploy to hadoku_site via GitHub Actions.

## Documentation

See the [hadoku_site documentation](https://github.com/WolffM/hadoku_site/tree/main/docs) for:
- [Registry Configuration](../REGISTRY_CONFIGURATION.md) - How the registry works
- [Access Control](../ACCESS_CONTROL.md) - User visibility and access levels

## Structure

```
├── src/
│   ├── entry.tsx    # Required: mount/unmount exports
│   ├── App.tsx      # Main app component
│   └── styles.css   # App styles
├── .github/
│   └── workflows/
│       └── build.yml  # Auto-deploy workflow
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Configuration

Edit these files to customize your app:

1. **App Name**: Change all instances of `myapp` to your app name
   - `vite.config.ts`: `base` path
   - `entry.tsx`: Instance key (`__myapp`)
   - `.github/workflows/build.yml`: `APP_NAME` env var

2. **Props**: Customize props in `entry.tsx`:
   ```typescript
   export interface MyAppProps {
     basename?: string;
     apiUrl?: string;
     environment?: string;
     // Add your custom props here
   }
   ```

3. **Routes**: Add routes in `entry.tsx`:
   ```typescript
   const router = createBrowserRouter([
     { path: '/', element: <App /> },
     { path: '/about', element: <About /> },
     // ...more routes
   ], { basename });
   ```

## Integration with hadoku_site

After deploying, update hadoku_site:

1. **Update Registry Configuration**  
   Edit `scripts/generate-registry.mjs` to add your app:
   ```javascript
   // Add your app config
   const myappConfig = MODE === 'production'
     ? {
         apiUrl: 'https://api.hadoku.me',
         environment: 'production',
         githubPat: HADOKU_SITE_TOKEN
       }
     : {
         apiUrl: 'http://localhost:3000',
         environment: 'development',
         githubPat: HADOKU_SITE_TOKEN
       };

   // Add to registry object
   const registry = {
     // ... existing apps
     myapp: {
       url: '/mf/myapp/index.js',
       css: '/mf/myapp/style.css',
       basename: '/myapp',
       props: myappConfig
     }
   };
   ```

2. **Update Access Control** (optional)  
   Edit `src/config/access-control.ts` to control visibility:
   ```typescript
   export const appVisibility: Record<UserType, string[]> = {
     public: ['home'],
     friend: ['home', 'watchparty'],
     admin: ['home', 'watchparty', 'task', 'contact', 'herodraft', 'myapp']
   };
   ```

3. **Add to Dynamic Route**  
   Edit `src/pages/[app].astro`:
   ```typescript
   const validApps = ['watchparty', 'task', 'contact', 'herodraft', 'home', 'myapp'];
   ```

4. **Update Home Page** (optional)  
   Edit `src/pages/index.astro` to add app metadata:
   ```typescript
   const appInfo = {
     // ... existing apps
     myapp: {
       title: 'My App',
       description: 'Description of my app',
       icon: '🆕'
     }
   };
   ```

See [REGISTRY_CONFIGURATION.md](../REGISTRY_CONFIGURATION.md) for details.

## License

MIT
