// Micro-frontend loader using Shadow DOM
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const root = document.getElementById('root');
    if (!root) {
      console.error('Micro-app container #root not found.');
      return;
    }

    const appName = root.getAttribute('data-app-name');
    if (!appName) {
      console.error('Micro-app name is not specified (data-app-name).');
      return;
    }

    const response = await fetch('/mf/registry.json');
    if (!response.ok) {
      throw new Error('Failed to load micro-frontend registry.');
    }
    const registry = await response.json();
    const appConfig = registry[appName];

    if (!appConfig) {
      console.error(`Configuration for micro-app "${appName}" not found.`);
      return;
    }

    // Load CSS if specified (URL already includes cache-busting version param)
    if (appConfig.css) {
      const linkId = `mf-css-${appName}`;
      // Remove existing CSS for this app if present
      const existingLink = document.getElementById(linkId);
      if (existingLink) {
        existingLink.remove();
      }
      // Add new CSS link
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = appConfig.css;
      document.head.appendChild(link);
      console.log(`Loaded CSS for micro-app: ${appName}`);
    }

    // Load JS module (URL already includes cache-busting version param)
    // Note: importmap is already defined in Base.astro, so we don't recreate it
    if (appConfig.url) {
      // Convert to absolute URL for proper module resolution
      const absoluteUrl = new URL(appConfig.url, window.location.origin).href;
      
      try {
        const module = await import(absoluteUrl);
        if (module.mount) {
          module.mount(root);
          console.log('Micro-app mounted successfully.');
        } else {
          console.error('Micro-app module does not have a mount function.');
        }
      } catch (err) {
        console.error('Error loading micro-app module:', err);
      }
    }
  } catch (error) {
    console.error('Failed to load micro-app:', error);
  }
});
