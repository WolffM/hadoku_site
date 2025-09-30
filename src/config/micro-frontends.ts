// Micro-frontend configuration
// This defines the props passed to each micro-app

export interface WatchpartyConfig {
  serverOrigin: string;
  defaultRoomKey: string;
  mediaBase: string;
}

export interface TaskConfig {
  repoOwner: string;
  repoName: string;
  branch: string;
  tasksPath: string;
  statsPath: string;
  apiUrl: string;
  environment: string;
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

// Task Development configuration
const devTaskConfig: TaskConfig = {
  repoOwner: 'WolffM',
  repoName: 'hadoku_site', // or separate data repo
  branch: 'main',
  tasksPath: 'task/data/tasks.json',
  statsPath: 'task/data/stats.json',
  apiUrl: 'http://localhost:3000',
  environment: 'development'
};

// Task Production configuration
const prodTaskConfig: TaskConfig = {
  repoOwner: 'WolffM',
  repoName: 'hadoku_site',
  branch: 'main',
  tasksPath: 'task/data/tasks.json',
  statsPath: 'task/data/stats.json',
  apiUrl: 'https://api.hadoku.me',
  environment: 'production'
};

// Export all app configs
export const appConfigs = {
  watchparty: watchpartyConfig,
  task: import.meta.env.MODE === 'production' ? prodTaskConfig : devTaskConfig,
  // Add other apps as needed:
  // contact: contactConfig,
  // herodraft: herodraftConfig,
};
