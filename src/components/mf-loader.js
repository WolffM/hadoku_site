// Micro-frontend loader using Shadow DOM
// Import logger from the compiled module (works in both dev and production)
import { logger } from '@wolffm/task-ui-components';

document.addEventListener('DOMContentLoaded', async () => {
	try {
		const root = document.getElementById('root');
		if (!root) {
			logger.error('Micro-app container #root not found');
			return;
		}

		const appName = root.getAttribute('data-app-name');
		if (!appName) {
			logger.error('Micro-app name is not specified (data-app-name)');
			return;
		}

		const response = await fetch('/mf/registry.json');
		if (!response.ok) {
			throw new Error('Failed to load micro-frontend registry.');
		}
		const registry = await response.json();
		const appConfig = registry[appName];

		if (!appConfig) {
			logger.error(`Configuration for micro-app "${appName}" not found`);
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
			logger.debug(`Loaded CSS for micro-app: ${appName}`);
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

					// Try to get existing session from sessionStorage first
					sessionId = sessionStorage.getItem('hadoku_session_id');

					if (key) {
						// If we have a key from URL, validate it first
						// If we're using an existing session (no key in URL), skip validation
						if (keyFromUrl) {
							// Validate the key with the backend to get the correct userType
							try {
								const validationResponse = await fetch('/task/api/validate-key', {
									method: 'POST',
									headers: {
										'X-User-Key': key,
									},
								});

								if (validationResponse.ok) {
									const validation = await validationResponse.json();

									if (validation.valid) {
										// Key is valid - use the userType from the auth middleware
										userType = validation.userType; // 'admin' or 'friend'
										userId = key;
									} else {
										// Key is invalid - clear it and go to public mode
										logger.warn('Invalid key detected, clearing session and redirecting to public');
										sessionStorage.removeItem('hadoku_session_id');
										sessionStorage.removeItem('hadoku_session_key');

										// Redirect to public route
										window.location.href = `/${appName}/public`;
										return;
									}
								} else {
									// Validation endpoint failed - clear session as safety measure
									logger.error('Failed to validate key, clearing session');
									sessionStorage.removeItem('hadoku_session_id');
									sessionStorage.removeItem('hadoku_session_key');
									userType = 'public';
									userId = 'public';
								}
							} catch (err) {
								logger.error('Error validating key', { error: err.message || err });
								// On error, clear session for safety
								sessionStorage.removeItem('hadoku_session_id');
								sessionStorage.removeItem('hadoku_session_key');
								userType = 'public';
								userId = 'public';
							}
						} else if (sessionId) {
							// Using existing session - trust it without re-validation
							// The edge router will validate the session when child app makes API requests
							userType = 'friend'; // Default assumption for existing sessions
							userId = key;
							logger.debug(`Using existing session`, {
								sessionId: `${sessionId.substring(0, 16)}...`,
							});
						}

						// If we have a key from URL or no existing session, create/refresh session
						if (keyFromUrl || !sessionId) {
							try {
								const sessionResponse = await fetch('/session/create', {
									method: 'POST',
									headers: {
										'X-User-Key': key,
									},
								});

								if (sessionResponse.ok) {
									const sessionData = await sessionResponse.json();
									sessionId = sessionData.sessionId;

									// Store session data in sessionStorage (survives page reloads, not browser close)
									sessionStorage.setItem('hadoku_session_id', sessionId);
									sessionStorage.setItem('hadoku_session_key', key);

									logger.info(`Session created/refreshed`, {
										sessionId: `${sessionId.substring(0, 16)}...`,
									});

									// Scrub key from URL for security (only if it was in the URL)
									if (keyFromUrl) {
										const newUrl = new URL(window.location);
										newUrl.searchParams.delete('key');
										window.history.replaceState({}, '', newUrl);
										logger.info('🔒 Key removed from URL for security');
									}
								} else {
									const errorText = await sessionResponse.text();
									logger.error('Failed to create session', {
										status: sessionResponse.status,
										error: errorText,
									});
									// Clear invalid session data
									sessionStorage.removeItem('hadoku_session_id');
									sessionStorage.removeItem('hadoku_session_key');
								}
							} catch (err) {
								logger.error('Error creating session', { error: err.message });
								sessionStorage.removeItem('hadoku_session_id');
								sessionStorage.removeItem('hadoku_session_key');
							}
						}
					} else {
						// No key found - clear any stale session data
						sessionStorage.removeItem('hadoku_session_id');
						sessionStorage.removeItem('hadoku_session_key');
					}

					// Get current theme from parent
					const currentTheme =
						sessionStorage.getItem('hadoku-theme') ||
						(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
							? 'dark'
							: 'light');

					// Merge registry props with runtime overrides
					// All child apps receive these standard props:
					// - userType: 'admin' | 'friend' | 'public' (permission level)
					// - userId: string (user identifier, defaults to userType)
					// - sessionId: string | null (for API requests via X-Session-Id header)
					// - theme: string (current theme for seamless handoff)
					const runtimeProps = {
						...appConfig.props,
						userType,
						userId,
						sessionId, // Pass sessionId to child app (not the key!)
						theme: currentTheme, // Pass current theme for seamless handoff
					};

					logger.debug(`Mounting ${appName} with props`, runtimeProps);
					module.mount(root, runtimeProps);
					logger.info('Micro-app mounted successfully', { appName });
				} else {
					logger.error('Micro-app module does not have a mount function', { appName });
				}
			} catch (err) {
				logger.error('Error loading micro-app module', { appName, error: err.message });
			}
		}
	} catch (error) {
		logger.error('Failed to load micro-app', { error: error.message });
	}
});

/**
 * Global helper for child apps to update session when user changes key via UI
 * This allows the "Enter New Key" feature to work without page reload
 *
 * @param {string} newKey - The new authentication key
 * @returns {Promise<{success: boolean, sessionId?: string, error?: string}>}
 */
window.updateHadokuSession = async function (newKey) {
	if (!newKey || typeof newKey !== 'string') {
		return { success: false, error: 'Invalid key provided' };
	}

	try {
		const sessionResponse = await fetch('/session/create', {
			method: 'POST',
			headers: {
				'X-User-Key': newKey,
			},
		});

		if (sessionResponse.ok) {
			const sessionData = await sessionResponse.json();
			const sessionId = sessionData.sessionId;

			// Update sessionStorage with new session
			sessionStorage.setItem('hadoku_session_id', sessionId);
			sessionStorage.setItem('hadoku_session_key', newKey);

			logger.info(`Session updated`, { sessionId: `${sessionId.substring(0, 16)}...` });
			return { success: true, sessionId };
		} else {
			const errorText = await sessionResponse.text();
			logger.error('Failed to update session', {
				status: sessionResponse.status,
				error: errorText,
			});
			return { success: false, error: errorText };
		}
	} catch (err) {
		logger.error('Error updating session', { error: err.message });
		return { success: false, error: err.message };
	}
};
