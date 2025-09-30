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
- [Creating Micro-Frontends](https://github.com/WolffM/hadoku_site/blob/main/docs/CREATE_MICRO_FRONTEND.md)
- [Architecture Guide](https://github.com/WolffM/hadoku_site/blob/main/docs/MICRO_FRONTEND_CONFIG.md)

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

1. Add to `public/mf/registry.json`:
   ```json
   {
     "myapp": {
       "url": "/mf/myapp/index.js",
       "css": "/mf/myapp/style.css",
       "basename": "/myapp",
       "props": {
         "apiUrl": "https://api.hadoku.me",
         "environment": "production"
       }
     }
   }
   ```

2. Create `src/pages/myapp/index.astro` in hadoku_site (see docs for template)

3. Add navigation link to home page

## License

MIT
