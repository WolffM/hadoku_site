/**
 * Appointment list view
 */

import type { Appointment } from '../../../lib/api/types';

interface AppointmentListProps {
	appointments: Appointment[];
	loading: boolean;
	refreshing: boolean;
	error: string | null;
	onRefresh: () => void;
	onCancel: (id: string) => void;
}

function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	});
}

function formatTime(time: string): string {
	const [hours, minutes] = time.split(':').map(Number);
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function getStatusBadge(status: Appointment['status']) {
	const styles: Record<Appointment['status'], string> = {
		confirmed: 'bg-success-bg text-success',
		cancelled: 'bg-danger-bg text-danger',
		completed: 'bg-primary-bg text-primary',
		no_show: 'bg-warning-bg text-warning',
	};
	return (
		<span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
			{status.replace('_', ' ')}
		</span>
	);
}

function getPlatformIcon(platform: Appointment['platform']) {
	const icons: Record<Appointment['platform'], string> = {
		discord: 'Discord',
		google: 'Google Meet',
		teams: 'Teams',
		jitsi: 'Jitsi',
	};
	return icons[platform];
}

export function AppointmentList({
	appointments,
	loading,
	refreshing,
	error,
	onRefresh,
	onCancel,
}: AppointmentListProps) {
	if (loading) {
		return (
			<div className="text-center py-12">
				<div className="text-text-secondary">Loading appointments...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<div className="text-danger mb-2">Error loading appointments</div>
				<div className="text-text-secondary text-sm">{error}</div>
			</div>
		);
	}

	// Sort by date desc, then by time
	const sortedAppointments = [...appointments].sort((a, b) => {
		const dateCompare = b.date.localeCompare(a.date);
		if (dateCompare !== 0) return dateCompare;
		return b.start_time.localeCompare(a.start_time);
	});

	// Separate upcoming and past/cancelled
	const now = new Date();
	const todayStr = now.toISOString().split('T')[0];
	const upcoming = sortedAppointments.filter(
		(apt) => apt.status === 'confirmed' && apt.date >= todayStr
	);
	const pastOrCancelled = sortedAppointments.filter(
		(apt) => apt.status !== 'confirmed' || apt.date < todayStr
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-text">Appointments</h2>
				<button
					onClick={onRefresh}
					disabled={refreshing}
					className="px-4 py-2 text-sm bg-bg-secondary border border-border rounded hover:bg-bg-card transition-colors disabled:opacity-50"
				>
					{refreshing ? 'Refreshing...' : 'Refresh'}
				</button>
			</div>

			{/* Upcoming Section */}
			<div>
				<h3 className="text-lg font-semibold text-text mb-3">Upcoming ({upcoming.length})</h3>
				{upcoming.length === 0 ? (
					<div className="text-text-secondary text-sm py-4">No upcoming appointments</div>
				) : (
					<div className="space-y-3">
						{upcoming.map((apt) => (
							<AppointmentCard key={apt.id} appointment={apt} onCancel={() => onCancel(apt.id)} />
						))}
					</div>
				)}
			</div>

			{/* Past/Cancelled Section */}
			{pastOrCancelled.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold text-text-secondary mb-3">
						Past & Cancelled ({pastOrCancelled.length})
					</h3>
					<div className="space-y-3 opacity-70">
						{pastOrCancelled.map((apt) => (
							<AppointmentCard key={apt.id} appointment={apt} />
						))}
					</div>
				</div>
			)}

			{appointments.length === 0 && (
				<div className="text-center py-12 text-text-secondary">No appointments scheduled</div>
			)}
		</div>
	);
}

interface AppointmentCardProps {
	appointment: Appointment;
	onCancel?: () => void;
}

function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
	const apt = appointment;

	return (
		<div className="bg-bg-secondary border border-border rounded-lg p-4">
			<div className="flex items-start justify-between">
				<div className="flex-1 min-w-0">
					{/* Date, Time & Status */}
					<div className="flex items-center gap-2 mb-2">
						<span className="font-semibold text-text">{formatDate(apt.date)}</span>
						<span className="text-text-secondary">
							{formatTime(apt.start_time)} - {formatTime(apt.end_time)}
						</span>
						{getStatusBadge(apt.status)}
					</div>

					{/* Contact Info */}
					<div className="mb-2">
						<div className="font-medium text-text">{apt.name}</div>
						<a href={`mailto:${apt.email}`} className="text-sm text-primary hover:underline">
							{apt.email}
						</a>
					</div>

					{/* Message */}
					{apt.message && (
						<div className="text-sm text-text-secondary mb-2 line-clamp-2">{apt.message}</div>
					)}

					{/* Platform & Link */}
					<div className="flex items-center gap-3 text-sm">
						<span className="text-text-muted">{getPlatformIcon(apt.platform)}</span>
						{apt.meeting_link && (
							<a
								href={apt.meeting_link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Join Meeting
							</a>
						)}
						<span className="text-text-muted">{apt.duration} min</span>
					</div>

					{/* Created timestamp */}
					<div className="text-xs text-text-muted mt-2">
						Booked: {new Date(apt.created_at).toLocaleString()}
					</div>
				</div>

				{/* Cancel button */}
				{onCancel && apt.status === 'confirmed' && (
					<button
						onClick={onCancel}
						className="ml-4 p-2 text-danger hover:bg-danger-bg rounded transition-colors"
						title="Cancel appointment"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				)}
			</div>
		</div>
	);
}
