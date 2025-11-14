// Micro-frontend configuration
// This defines the props passed to each micro-app

// Common interface for all micro-apps
// These props are automatically injected by mf-loader.js at runtime
export interface BaseAppProps {
	basename?: string;
	environment?: string;

	// Auth props (injected by mf-loader.js)
	userType?: 'admin' | 'friend' | 'public'; // Permission level
	userId?: string; // User identifier (key or 'admin'/'friend'/'public')
	sessionId?: string; // Session ID for API requests (never expose key!)
}

export interface WatchpartyConfig extends BaseAppProps {
	serverOrigin: string;
	defaultRoomKey: string;
}

export interface TaskAppProps extends BaseAppProps {
	apiUrl?: string; // Not currently used (uses internal API)
}

// Watchparty Development configuration
const devWatchpartyConfig: WatchpartyConfig = {
	serverOrigin: 'http://localhost:8080',
	defaultRoomKey: 'dev-room-1000',
};

// Watchparty Production configuration
const prodWatchpartyConfig: WatchpartyConfig = {
	serverOrigin: 'https://api.hadoku.me', // Update this when you have your API
	defaultRoomKey: 'dev-room-1000',
};

// Auto-select based on environment
export const watchpartyConfig: WatchpartyConfig =
	import.meta.env.MODE === 'production' ? prodWatchpartyConfig : devWatchpartyConfig;

// Export all app configs
export const appConfigs = {
	watchparty: watchpartyConfig,
	task: {} as TaskAppProps, // Task app config is handled in generate-registry.mjs
	// Add other apps as needed:
	// contact: contactConfig,
	// herodraft: herodraftConfig,
};
