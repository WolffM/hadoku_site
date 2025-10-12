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

    // Load CSS if specified
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
    
    // Determine user type from URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('key');
    const storedKey = localStorage.getItem('hadoku-auth-key');
    const activeKey = urlKey || storedKey;
    let userType = 'public';
    
    // Get access keys from meta tags (set by Astro at build time)
    const adminKey = document.querySelector('meta[name="admin-key"]')?.content;
    const friendKey = document.querySelector('meta[name="friend-key"]')?.content;
    
    if (activeKey && adminKey && activeKey === adminKey) {
      userType = 'admin';
    } else if (activeKey && friendKey && activeKey === friendKey) {
      userType = 'friend';
    }
    
    // Store auth key in localStorage for API calls (persists across refreshes)
    if (urlKey) {
      localStorage.setItem('hadoku-auth-key', urlKey);
      // Clean URL to remove key parameter
      const cleanUrl = new URL(window.location);
      cleanUrl.searchParams.delete('key');
      window.history.replaceState({}, '', cleanUrl);
    }
    
    // If we have a stored key but no URL key, update URL to show user they're authenticated
    // (optional - helps with debugging)
    console.log(`[mf-loader] Using key: ${activeKey ? 'present' : 'none'}, userType: ${userType}`);
    
    // Override fetch to automatically add auth header to all API requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      const authKey = localStorage.getItem('hadoku-auth-key');
      
      // Only add auth header for same-origin API requests
      if (authKey && typeof url === 'string' && url.startsWith('/')) {
        options.headers = {
          ...options.headers,
          'X-Admin-Key': authKey
        };
      }
      
      return originalFetch(url, options);
    };
    
    // Mount the app
    if (typeof module.mount === 'function') {
      const props = {
        ...appConfig.props,  // Spread registry props first (has default userType: 'public')
        basename: appConfig.basename || '',
        userType: userType   // Override with validated userType from URL key
      };
      console.log(`[mf-loader] Mounting ${appName} with props:`, props);
      await module.mount(root, props);
      console.log(`Mounted micro-app: ${appName} with userType: ${userType}`);
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
