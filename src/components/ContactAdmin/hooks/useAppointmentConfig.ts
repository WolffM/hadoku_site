/**
 * Hook for managing appointment configuration
 */

import { useState, useEffect, useCallback } from 'react';
import type { ContactAdminClient } from '../../../lib/api/contact-admin-client';
import type { AppointmentConfig } from '../../../lib/api/types';

interface UseAppointmentConfigResult {
	config: AppointmentConfig | null;
	loading: boolean;
	saving: boolean;
	fetchConfig: () => Promise<void>;
	saveConfig: () => Promise<void>;
	updateConfig: (updates: Partial<AppointmentConfig>) => void;
}

/**
 * Hook to manage appointment configuration
 */
export function useAppointmentConfig(
	client: ContactAdminClient | null,
	isActive: boolean
): UseAppointmentConfigResult {
	const [config, setConfig] = useState<AppointmentConfig | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	// Fetch config when appointments tab becomes active
	useEffect(() => {
		if (!client || !isActive) return;

		fetchConfig().catch(console.error);
	}, [client, isActive]);

	// Fetch appointment config
	const fetchConfig = useCallback(async () => {
		if (!client) return;

		setLoading(true);
		try {
			const fetchedConfig = await client.getAppointmentConfig();
			setConfig(fetchedConfig);
		} catch (err) {
			console.error('Failed to fetch appointment config:', err);
			alert('Failed to load appointment configuration');
		} finally {
			setLoading(false);
		}
	}, [client]);

	// Save appointment config
	const saveConfig = useCallback(async () => {
		if (!client || !config) return;

		setSaving(true);
		try {
			await client.saveAppointmentConfig(config);
			alert('Appointment configuration saved successfully!');
		} catch (err) {
			console.error('Failed to save appointment config:', err);
			alert('Failed to save appointment configuration');
		} finally {
			setSaving(false);
		}
	}, [client, config]);

	// Update config
	const updateConfig = useCallback((updates: Partial<AppointmentConfig>) => {
		setConfig((prev) => (prev ? { ...prev, ...updates } : null));
	}, []);

	return {
		config,
		loading,
		saving,
		fetchConfig,
		saveConfig,
		updateConfig,
	};
}
