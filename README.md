# hadoku_site

An Astro-based controller application for managing micro-frontends (micro-apps). This application provides a consistent navigation experience and dynamically loads micro-apps based on the route.

## Features

- **Astro-based routing**: Utilizes Astro's file-based routing for clean URL structure
- **Consistent header navigation**: Custom `<hadoku-header>` web component with Shadow DOM
- **Micro-frontend architecture**: Dynamically loads and mounts micro-apps via ES modules
- **Centralized registry**: Single source of truth for all micro-app configurations
- **TypeScript support**: Full TypeScript configuration for type safety

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/WolffM/hadoku_site.git
cd hadoku_site
```

2. Install dependencies:
```bash
npm install
```

### Running Locally

#### Development Mode
Start the development server with hot-reload:
```bash
npm run dev
```
The site will be available at `http://localhost:4321`

#### Build for Production
Build the static site:
```bash
npm run build
```

#### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

## Architecture

### Directory Structure

```
hadoku_site/
├── src/
│   ├── layouts/
│   │   └── Base.astro          # Base layout with HTML head
│   ├── pages/
│   │   ├── index.astro          # Home route (/)
│   │   ├── watchparty/
│   │   │   └── index.astro      # Watch Party route (/watchparty/)
│   │   ├── task/
│   │   │   └── index.astro      # Task route (/task/)
│   │   ├── contact/
│   │   │   └── index.astro      # Contact route (/contact/)
│   │   └── herodraft/
│   │       └── index.astro      # Hero Draft route (/herodraft/)
│   └── components/
│       ├── hadoku-header.js     # Header web component
│       └── mf-loader.js         # Micro-frontend loader script
├── public/
│   └── mf/
│       ├── registry.json        # Micro-app registry
│       └── [app-name]/
│           └── index.js         # Micro-app bundle
└── astro.config.mjs             # Astro configuration
```

### Routes

All routes follow the same pattern:
1. Render the `<hadoku-header>` web component for navigation
2. Include an empty `<div id="root" data-app="[app-name]">` placeholder
3. Load the micro-frontend loader script that:
   - Fetches `/mf/registry.json`
   - Imports the correct ESM bundle for the route
   - Calls `mount(el, props)` on the imported module

Available routes:
- `/` - Home page
- `/watchparty/` - Watch Party app
- `/task/` - Task Manager app
- `/contact/` - Contact app
- `/herodraft/` - Hero Draft app

### Micro-Frontend Registry

The registry (`/public/mf/registry.json`) maps app names to their configurations:

```json
{
  "appname": {
    "url": "/mf/appname/index.js",
    "basename": "/appname",
    "props": {}
  }
}
```

## Developing Micro-Apps

### Micro-App Contract

Each micro-app must be an ES module that exports two functions:

#### `mount(el, props)`
Called when the app should render into the DOM.

**Parameters:**
- `el` (HTMLElement): The DOM element to render into (the `#root` div)
- `props` (Object): Configuration object containing:
  - `basename` (string): The route basename for the app
  - Any additional custom properties from the registry

**Example:**
```javascript
export function mount(el, props) {
  el.innerHTML = `
    <div>
      <h1>My Micro App</h1>
      <p>Running at: ${props.basename}</p>
    </div>
  `;
  console.log('App mounted with props:', props);
}
```

#### `unmount(el)` (optional)
Called before the page unloads for cleanup.

**Parameters:**
- `el` (HTMLElement): The DOM element that was used for rendering

**Example:**
```javascript
export function unmount(el) {
  // Clean up event listeners, timers, etc.
  el.innerHTML = '';
  console.log('App unmounted');
}
```

### Publishing Micro-Apps

1. **Build your app** as an ES module that exports `mount` and `unmount` functions

2. **Deploy your bundle** to the `/public/mf/[app-name]/` directory:
   ```
   public/mf/
   └── myapp/
       └── index.js  (your built bundle)
   ```

3. **Register your app** in `/public/mf/registry.json`:
   ```json
   {
     "myapp": {
       "url": "/mf/myapp/index.js",
       "basename": "/myapp",
       "props": {
         "customProp": "value"
       }
     }
   }
   ```

4. **Create a route** in `src/pages/myapp/index.astro`:
   ```astro
   ---
   import Base from '../../layouts/Base.astro';
   ---

   <Base title="My App">
     <hadoku-header></hadoku-header>
     <div id="root" data-app="myapp"></div>
     
     <script src="../../components/hadoku-header.js"></script>
     <script src="../../components/mf-loader.js"></script>
   </Base>
   ```

### Micro-App Best Practices

- **Keep bundles small**: Use code splitting and lazy loading
- **Avoid global state**: Each app should be self-contained
- **Clean up resources**: Always implement the `unmount` function
- **Use the basename**: Respect the `props.basename` for routing within your app
- **Error handling**: Handle errors gracefully and display user-friendly messages

## Technologies Used

- [Astro](https://astro.build/) - Static site generator with server-side rendering
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- Web Components - For the custom header navigation
- ES Modules - For dynamic micro-app loading

## License

ISC