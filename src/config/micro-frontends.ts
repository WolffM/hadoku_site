// Micro-frontend configuration
// This defines the props passed to each micro-app

export interface WatchpartyConfig {
  serverOrigin: string;
  defaultRoomKey: string;
  mediaBase: string;
}

// Development configuration
const devConfig: WatchpartyConfig = {
  serverOrigin: 'http://localhost:8080',
  defaultRoomKey: 'dev-room-1000',
  mediaBase: '/media',
};

// Production configuration
const prodConfig: WatchpartyConfig = {
  serverOrigin: 'https://api.hadoku.me', // Update this when you have your API
  defaultRoomKey: 'dev-room-1000',
  mediaBase: '/media',
};

// Auto-select based on environment
export const watchpartyConfig: WatchpartyConfig =
  import.meta.env.MODE === 'production' ? prodConfig : devConfig;

// You can also export other app configs here as needed
export const appConfigs = {
  watchparty: watchpartyConfig,
  // Add other apps as needed:
  // task: taskConfig,
  // contact: contactConfig,
};
