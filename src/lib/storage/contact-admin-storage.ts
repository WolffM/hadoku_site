/**
 * LocalStorage abstraction for Contact Admin
 * Provides type-safe, error-handled access to localStorage
 */

import { STORAGE_KEYS } from '../../config/contact-admin';

/**
 * Generic localStorage getter with error handling
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
	try {
		const item = window.localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.error(`Failed to read from localStorage: ${key}`, error);
		return defaultValue;
	}
}

/**
 * Generic localStorage setter with error handling
 */
function setInStorage<T>(key: string, value: T): boolean {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (error) {
		console.error(`Failed to write to localStorage: ${key}`, error);
		// Check if it's a quota exceeded error
		if (
			typeof error === 'object' &&
			error !== null &&
			'name' in error &&
			error.name === 'QuotaExceededError'
		) {
			console.warn('LocalStorage quota exceeded. Consider clearing old data.');
		}
		return false;
	}
}

/**
 * Generic localStorage remover
 */
function removeFromStorage(key: string): void {
	try {
		window.localStorage.removeItem(key);
	} catch (error) {
		console.error(`Failed to remove from localStorage: ${key}`, error);
	}
}

/**
 * Contact Admin Storage API
 */
export const ContactAdminStorage = {
	/**
	 * Get set of read email IDs
	 */
	getReadEmails(): Set<string> {
		const ids = getFromStorage<string[]>(STORAGE_KEYS.READ_EMAILS, []);
		return new Set(ids);
	},

	/**
	 * Save set of read email IDs
	 */
	setReadEmails(ids: Set<string> | string[]): boolean {
		const array = Array.isArray(ids) ? ids : Array.from(ids);
		return setInStorage(STORAGE_KEYS.READ_EMAILS, array);
	},

	/**
	 * Mark an email as read
	 */
	markEmailAsRead(id: string): boolean {
		const readEmails = this.getReadEmails();
		readEmails.add(id);
		return this.setReadEmails(readEmails);
	},

	/**
	 * Check if an email is read
	 */
	isEmailRead(id: string): boolean {
		return this.getReadEmails().has(id);
	},

	/**
	 * Clear all read email records
	 */
	clearReadEmails(): void {
		removeFromStorage(STORAGE_KEYS.READ_EMAILS);
	},

	/**
	 * Get list of past email recipients
	 */
	getPastRecipients(): string[] {
		return getFromStorage<string[]>(STORAGE_KEYS.PAST_RECIPIENTS, []);
	},

	/**
	 * Save list of past email recipients
	 */
	setPastRecipients(recipients: string[]): boolean {
		return setInStorage(STORAGE_KEYS.PAST_RECIPIENTS, recipients);
	},

	/**
	 * Add a recipient to the past recipients list
	 */
	addPastRecipient(email: string): boolean {
		const recipients = this.getPastRecipients();
		if (!recipients.includes(email)) {
			recipients.push(email);
			return this.setPastRecipients(recipients);
		}
		return true; // Already exists, no need to update
	},

	/**
	 * Clear all past recipients
	 */
	clearPastRecipients(): void {
		removeFromStorage(STORAGE_KEYS.PAST_RECIPIENTS);
	},

	/**
	 * Clear all Contact Admin storage
	 */
	clearAll(): void {
		this.clearReadEmails();
		this.clearPastRecipients();
	},
};
