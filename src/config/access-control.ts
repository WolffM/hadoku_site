// Access control configuration
// Determines which apps are visible based on user access level

export type UserType = 'public' | 'friend' | 'admin';

export interface AccessConfig {
  adminKey: string;
  friendKey: string;
}

// App visibility by user type
export const appVisibility: Record<UserType, string[]> = {
  public: ['home', 'task', 'watchparty'],
  friend: ['home', 'task', 'watchparty'],
  admin: ['home', 'task', 'watchparty', 'contact', 'herodraft']
};

// Build-time validation for production
if (import.meta.env.PROD) {
  if (!import.meta.env.PUBLIC_ADMIN_KEY) {
    throw new Error("Missing PUBLIC_ADMIN_KEY environment variable");
  }
  if (!import.meta.env.PUBLIC_FRIEND_KEY) {
    throw new Error("Missing PUBLIC_FRIEND_KEY environment variable");
  }
}

// Get access config from environment
export const accessConfig: AccessConfig = {
  // In production, these come from GitHub secrets via import.meta.env
  adminKey: import.meta.env.PUBLIC_ADMIN_KEY || 'default-admin-key',
  friendKey: import.meta.env.PUBLIC_FRIEND_KEY || 'default-friend-key'
};

/**
 * Determine user type based on URL parameter
 * Usage: /?key=xxx or /watchparty?key=xxx
 */
export function getUserType(urlKey?: string): UserType {
  if (!urlKey) {
    return 'public';
  }
  
  if (urlKey === accessConfig.adminKey) {
    return 'admin';
  }
  
  if (urlKey === accessConfig.friendKey) {
    return 'friend';
  }
  
  return 'public';
}

/**
 * Check if user has access to a specific app
 */
export function hasAccess(userType: UserType, appName: string): boolean {
  return appVisibility[userType].includes(appName);
}

/**
 * Get list of accessible apps for user type
 */
export function getAccessibleApps(userType: UserType): string[] {
  return appVisibility[userType];
}
