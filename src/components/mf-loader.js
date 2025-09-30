// Micro-frontend loader
(async function() {
  const root = document.getElementById('root');
  const appName = root.dataset.app;
  
  if (!appName) {
    console.error('No app name specified in data-app attribute');
    return;
  }

  try {
    // Fetch the registry
    const response = await fetch('/mf/registry.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.statusText}`);
    }
    
    const registry = await response.json();
    const appConfig = registry[appName];
    
    if (!appConfig) {
      throw new Error(`App "${appName}" not found in registry`);
    }

    // Create a blob URL for the module to work around Vite's public directory restrictions
    const moduleResponse = await fetch(appConfig.url);
    if (!moduleResponse.ok) {
      throw new Error(`Failed to fetch module: ${moduleResponse.statusText}`);
    }
    
    const moduleCode = await moduleResponse.text();
    const blob = new Blob([moduleCode], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    
    // Import the micro-app module from the blob URL
    const module = await import(/* @vite-ignore */ blobUrl);
    
    // Clean up blob URL
    URL.revokeObjectURL(blobUrl);
    
    // Mount the app
    if (typeof module.mount === 'function') {
      const props = {
        basename: appConfig.basename || '',
        ...appConfig.props
      };
      await module.mount(root, props);
      console.log(`Mounted micro-app: ${appName}`);
    } else {
      throw new Error(`Module for "${appName}" does not export a mount function`);
    }

    // Cleanup on navigation
    window.addEventListener('beforeunload', () => {
      if (typeof module.unmount === 'function') {
        module.unmount(root);
      }
    });
  } catch (error) {
    console.error('Error loading micro-app:', error);
    root.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #666;">
        <h2>Failed to load application</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
})();
