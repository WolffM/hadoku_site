// Micro-frontend configuration
// This defines the props passed to each micro-app

export interface WatchpartyConfig {
  serverOrigin: string;
  defaultRoomKey: string;
  mediaBase: string;
}

// Watchparty Development configuration
const devWatchpartyConfig: WatchpartyConfig = {
  serverOrigin: 'http://localhost:8080',
  defaultRoomKey: 'dev-room-1000',
  mediaBase: '/media',
};

// Watchparty Production configuration
const prodWatchpartyConfig: WatchpartyConfig = {
  serverOrigin: 'https://api.hadoku.me', // Update this when you have your API
  defaultRoomKey: 'dev-room-1000',
  mediaBase: '/media',
};

// Auto-select based on environment
export const watchpartyConfig: WatchpartyConfig =
  import.meta.env.MODE === 'production' ? prodWatchpartyConfig : devWatchpartyConfig;

// Export all app configs
export const appConfigs = {
  watchparty: watchpartyConfig,
  task: {}, // Task app handles its own configuration
  // Add other apps as needed:
  // contact: contactConfig,
  // herodraft: herodraftConfig,
};
