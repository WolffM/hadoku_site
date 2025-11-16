// Access control configuration
// Determines which apps are visible based on user access level
//
// NOTE: User type determination now happens SERVER-SIDE in workers
// Client-side only uses this static mapping for UI display
// Actual access control is enforced by the API workers

export type UserType = 'public' | 'friend' | 'admin';

// App visibility by user type (static mapping for UI)
export const appVisibility: Record<UserType, string[]> = {
	public: ['home', 'resume', 'task', 'watchparty'],
	friend: ['home', 'resume', 'task', 'watchparty'],
	admin: ['home', 'resume', 'task', 'watchparty', 'contact', 'herodraft'],
};

/**
 * Check if user has access to a specific app (UI only)
 * Actual access control happens server-side
 */
export function hasAccess(userType: UserType, appName: string): boolean {
	return appVisibility[userType].includes(appName);
}

/**
 * Get list of accessible apps for user type (UI only)
 * Actual access control happens server-side
 */
export function getAccessibleApps(userType: UserType): string[] {
	return appVisibility[userType];
}
