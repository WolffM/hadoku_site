/**
 * Hook for managing appointments
 */

import { useState, useEffect, useCallback } from 'react';
import type { ContactAdminClient } from '../../../lib/api/contact-admin-client';
import type { Appointment, AppointmentStatus } from '../../../lib/api/types';

type ShowToastFn = (
	message: string,
	type?: 'success' | 'error' | 'info' | 'warning',
	duration?: number
) => void;

interface UseAppointmentsResult {
	appointments: Appointment[];
	loading: boolean;
	refreshing: boolean;
	error: string | null;
	refreshAppointments: () => Promise<void>;
	updateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
	cancelAppointment: (id: string) => Promise<void>;
}

/**
 * Hook to manage appointments
 */
export function useAppointments(
	client: ContactAdminClient | null,
	showToast: ShowToastFn
): UseAppointmentsResult {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch appointments on mount (after client is available)
	useEffect(() => {
		if (!client) return;

		const apiClient = client;
		async function fetchAppointments() {
			try {
				const response = await apiClient.getAppointments();
				setAppointments(response.data.appointments);
				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
				setLoading(false);
			}
		}

		fetchAppointments().catch(console.error);
	}, [client]);

	// Refresh appointments
	const refreshAppointments = useCallback(async () => {
		if (!client) return;

		setRefreshing(true);
		try {
			const response = await client.getAppointments();
			setAppointments(response.data.appointments);
		} catch (err) {
			showToast(
				`Failed to refresh appointments: ${err instanceof Error ? err.message : 'Unknown error'}`,
				'error'
			);
		} finally {
			setRefreshing(false);
		}
	}, [client, showToast]);

	// Update appointment status
	const updateStatus = useCallback(
		async (id: string, status: AppointmentStatus) => {
			if (!client) return;

			try {
				await client.updateAppointmentStatus(id, status);

				// Update status in local state
				setAppointments((prev) =>
					prev.map((apt) =>
						apt.id === id
							? {
									...apt,
									status,
									updated_at: Date.now(),
									cancelled_at: status === 'cancelled' ? Date.now() : apt.cancelled_at,
								}
							: apt
					)
				);

				showToast(`Appointment ${status}`, 'success');
			} catch (err) {
				showToast(
					`Failed to update appointment: ${err instanceof Error ? err.message : 'Unknown error'}`,
					'error'
				);
			}
		},
		[client, showToast]
	);

	// Cancel appointment (convenience wrapper)
	const cancelAppointment = useCallback(
		async (id: string) => {
			if (!confirm('Cancel this appointment?')) return;
			await updateStatus(id, 'cancelled');
		},
		[updateStatus]
	);

	return {
		appointments,
		loading,
		refreshing,
		error,
		refreshAppointments,
		updateStatus,
		cancelAppointment,
	};
}
