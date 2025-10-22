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
          const keyFromUrl = urlParams.get('key');
          
          let userType = 'public';
          let userId = 'public';
          let sessionId = null;
          
          // Check for key in URL first, otherwise check sessionStorage
          const key = keyFromUrl || sessionStorage.getItem('hadoku_session_key');
          
          if (key) {
            // Don't determine userType here - let the backend validate via /validate-key
            // For now, assume 'friend' as default (backend will correct it)
            userType = 'friend';
            userId = key; // Use key as temporary userId until backend provides real one
            
            // Try to get existing session from sessionStorage
            sessionId = sessionStorage.getItem('hadoku_session_id');
            
            // If we have a key from URL or no existing session, create/refresh session
            if (keyFromUrl || !sessionId) {
              try {
                const sessionResponse = await fetch('/session/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ key })
                });
                
                if (sessionResponse.ok) {
                  const sessionData = await sessionResponse.json();
                  sessionId = sessionData.sessionId;
                  
                  // Store session data in sessionStorage (survives page reloads, not browser close)
                  sessionStorage.setItem('hadoku_session_id', sessionId);
                  sessionStorage.setItem('hadoku_session_key', key);
                  
                  // Scrub key from URL for security (only if it was in the URL)
                  if (keyFromUrl) {
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.delete('key');
                    window.history.replaceState({}, '', newUrl);
                    console.log('🔒 Key removed from URL for security');
                  }
                  
                  console.log(`Session created/refreshed: ${sessionId}`);
                  
                  // If key was in URL, scrub it for security
                  if (keyFromUrl) {
                    const url = new URL(window.location);
                    url.searchParams.delete('key');
                    window.history.replaceState({}, '', url);
                    console.log('🔒 Key scrubbed from URL for security');
                  }
                } else {
                  console.error('Failed to create session:', await sessionResponse.text());
                  // Clear invalid session data
                  sessionStorage.removeItem('hadoku_session_id');
                  sessionStorage.removeItem('hadoku_session_key');
                }
              } catch (err) {
                console.error('Error creating session:', err);
                sessionStorage.removeItem('hadoku_session_id');
                sessionStorage.removeItem('hadoku_session_key');
              }
            } else {
              console.log(`Using existing session: ${sessionId}`);
            }
          } else {
            // No key found - clear any stale session data
            sessionStorage.removeItem('hadoku_session_id');
            sessionStorage.removeItem('hadoku_session_key');
          }
          
          // Merge registry props with runtime overrides
          // All child apps receive these standard auth props:
          // - userType: 'admin' | 'friend' | 'public' (permission level)
          // - userId: string (user identifier, defaults to userType)
          // - sessionId: string | null (for API requests via X-Session-Id header)
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

/**
 * Global helper for child apps to update session when user changes key via UI
 * This allows the "Enter New Key" feature to work without page reload
 * 
 * @param {string} newKey - The new authentication key
 * @returns {Promise<{success: boolean, sessionId?: string, error?: string}>}
 */
window.updateHadokuSession = async function(newKey) {
  if (!newKey || typeof newKey !== 'string') {
    return { success: false, error: 'Invalid key provided' };
  }
  
  try {
    const sessionResponse = await fetch('/session/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: newKey })
    });
    
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.sessionId;
      
      // Update sessionStorage with new session
      sessionStorage.setItem('hadoku_session_id', sessionId);
      sessionStorage.setItem('hadoku_session_key', newKey);
      
      console.log(`Session updated: ${sessionId}`);
      return { success: true, sessionId };
    } else {
      const errorText = await sessionResponse.text();
      console.error('Failed to update session:', errorText);
      return { success: false, error: errorText };
    }
  } catch (err) {
    console.error('Error updating session:', err);
    return { success: false, error: err.message };
  }
};
