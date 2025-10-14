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
          // Get runtime props from URL parameters
          const urlParams = new URLSearchParams(window.location.search);
          const key = urlParams.get('key');
          
          // Determine userType from key parameter
          const adminKey = document.querySelector('meta[name="admin-key"]')?.getAttribute('content') || '';
          const friendKey = document.querySelector('meta[name="friend-key"]')?.getAttribute('content') || '';
          
          let userType = 'public';
          let userId = 'public';
          let sessionId = null;
          
          if (key) {
            if (key === adminKey) {
              userType = 'admin';
              userId = 'admin';
            } else if (key === friendKey) {
              userType = 'friend';
              userId = 'friend';
            } else {
              // Unknown key - treat as userId for friend/admin context
              userType = 'admin';
              userId = key;
            }
            
            // Create a session for this key (key stays server-side)
            try {
              const sessionResponse = await fetch('/session/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
              });
              
              if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json();
                sessionId = sessionData.sessionId;
                console.log(`Session created: ${sessionId}`);
              } else {
                console.error('Failed to create session:', await sessionResponse.text());
              }
            } catch (err) {
              console.error('Error creating session:', err);
            }
          }
          
          // Merge registry props with runtime overrides
          const runtimeProps = {
            ...appConfig.props,
            userType,
            userId,
            sessionId  // Pass sessionId to child app (not the key!)
          };
          
          console.log(`Mounting ${appName} with props:`, runtimeProps);
          module.mount(root, runtimeProps);
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
