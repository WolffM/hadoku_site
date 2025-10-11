# Application Hosting & API Routing Guide
**Last Updated:** 2025-10-11

This document outlines the hosting requirements and API routing architecture for the `hadoku_site` project following the migration from a static site to a dynamic, server-rendered application.

---

## 1. Core Architectural Change

The project is no longer a static site suitable for simple file hosts like GitHub Pages. It is now a **dynamic Node.js application** that uses a custom Express.js server to handle incoming requests.

- **From:** Static Astro site (`output: 'static'`)
- **To:** Server-rendered Astro application with a custom Express middleware (`output: 'server'`).

This change was made to support a sophisticated, centralized API fallback and proxy system, as detailed in the [Hadoku Route Fallback Design](./hadoku_route_fallback_design.md).

---

## 2. The Express.js Edge Router

The heart of the new architecture is the Express server located at `server/main.mjs`. It serves two primary functions:

1.  **API Proxy & Fallback Router:**
    - It intercepts all requests to API paths (e.g., `/task/api/*`, `/watchparty/api/*`).
    - It consults `route-config.json` to determine the ordered list of backend providers to try for that request.
    - It attempts to proxy the request to each provider in order, falling back to the next one upon failure (e.g., connection error, 404, or 5xx response).
    - This logic is centralized on the server, meaning the frontend micro-apps remain simple and unaware of the backend complexity.

2.  **Astro Page Renderer:**
    - For any request that is *not* an API call, the server passes control to the Astro handler, which renders the appropriate page.

### Live Configuration Reload

The server uses `chokidar` to watch `route-config.json` for changes. Any updates to this file are loaded **in real-time without requiring a server restart**, allowing for dynamic, live changes to API routing priorities.

---

## 3. Hosting Requirements

Because the project now requires a running Node.js process, it must be deployed to a hosting provider that supports Node.js applications.

**Suitable Hosting Platforms:**
-   **Vercel:** Excellent integration with Astro, supports Node.js runtimes.
-   **Render:** Provides a free tier for Node.js web services. Easy to set up with a "Deploy Hook".
-   **Fly.io:** Deploys applications as Docker containers (which can run Node.js) in global data centers.
-   **DigitalOcean App Platform, Heroku, AWS, etc.:** Any traditional PaaS or IaaS provider that can run a Node.js server.

**Incompatible Hosting Platforms:**
-   **GitHub Pages:** Can only host static files and has no Node.js runtime.
-   **Cloudflare Pages (Static):** The base offering is for static sites. However, it *could* be used if the Express logic were migrated to **Cloudflare Functions**, which is a more advanced use case.

---

## 4. Configuration for Deployment

To deploy the application, the hosting environment must be configured with two things:

1.  **Environment Variables:**
    - All secrets from the local `.env` file must be added to the hosting provider's environment variable settings. This includes `PUBLIC_ADMIN_KEY`, `HADOKU_SITE_TOKEN`, and the provider base URLs (`LOCAL_BASE`, `WORKER_BASE`, etc.).

2.  **Configuration File:**
    - The `route-config.json` file must be present in the deployed application. Since it's checked into the repository, this will happen automatically.

---

## 5. Deployment Process

The deployment process is managed via GitHub Actions but targets a Node.js host. A typical workflow (`.github/workflows/deploy.yml`) would look like this:

1.  **Trigger:** On `push` to the `main` branch.
2.  **Build:**
    - Check out the code.
    - Set up Node.js.
    - Install dependencies with `npm install`.
    - Build the Astro server assets with `npm run build`.
3.  **Deploy:**
    - The final step uses a provider-specific action or CLI to push the application code to the host.
    - For example, using a Render Deploy Hook: `curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}`.
    - The hosting provider then takes over, installs `node_modules`, and runs the start command.

### Build & Start Commands

The hosting provider will need to know these commands:
-   **Build Command:** `npm run build`
-   **Start Command:** `node server/main.mjs` (or `npm start`)

This setup ensures that your entire CI/CD pipeline and secret management remains centralized within your GitHub repository, even though the final application runs on a different platform.

