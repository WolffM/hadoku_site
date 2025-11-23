/**
 * Appointment configuration editor
 */

import type { AppointmentConfig } from '../../../lib/api/types';
import { TIMEZONE_OPTIONS, MEETING_PLATFORMS } from '../../../config/contact-admin';
import { WeeklyAvailabilityEditor } from './WeeklyAvailabilityEditor';

interface AppointmentConfigEditorProps {
	config: AppointmentConfig | null;
	loading: boolean;
	saving: boolean;
	onUpdate: (updates: Partial<AppointmentConfig>) => void;
	onSave: () => void;
}

export function AppointmentConfigEditor({
	config,
	loading,
	saving,
	onUpdate,
	onSave,
}: AppointmentConfigEditorProps) {
	if (loading) {
		return (
			<div className="text-center py-12">
				<div className="text-text-secondary">Loading configuration...</div>
			</div>
		);
	}

	if (!config) {
		return (
			<div className="text-center py-12">
				<div className="text-text-secondary">No configuration found</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Weekly Availability Calendar */}
			<div className="bg-bg-secondary p-4 rounded-lg border border-border">
				<h3 className="text-lg font-semibold text-text mb-4">Weekly Availability</h3>
				<WeeklyAvailabilityEditor
					startHour={config.start_hour}
					endHour={config.end_hour}
					availableDays={config.available_days}
					onUpdate={onUpdate}
				/>
			</div>

			{/* Settings Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Timezone */}
				<div className="bg-bg-secondary p-4 rounded-lg border border-border">
					<label className="block text-sm font-medium text-text mb-2">Timezone</label>
					<select
						value={config.timezone}
						onChange={(e) => onUpdate({ timezone: e.target.value })}
						className="w-full px-3 py-2 bg-bg border border-border rounded text-text text-sm"
					>
						{TIMEZONE_OPTIONS.map((tz) => (
							<option key={tz.value} value={tz.value}>
								{tz.label}
							</option>
						))}
					</select>
				</div>

				{/* Advance Notice */}
				<div className="bg-bg-secondary p-4 rounded-lg border border-border">
					<label className="block text-sm font-medium text-text mb-2">Advance Notice</label>
					<div className="flex items-center gap-2">
						<input
							type="number"
							min="0"
							max="168"
							value={config.advance_notice_hours}
							onChange={(e) => onUpdate({ advance_notice_hours: parseInt(e.target.value) })}
							className="w-20 px-3 py-2 bg-bg border border-border rounded text-text text-sm"
						/>
						<span className="text-sm text-text-secondary">hours minimum</span>
					</div>
				</div>

				{/* Meeting Platforms */}
				<div className="bg-bg-secondary p-4 rounded-lg border border-border">
					<label className="block text-sm font-medium text-text mb-2">Platforms</label>
					<div className="flex flex-wrap gap-2">
						{MEETING_PLATFORMS.map((platform) => (
							<button
								key={platform.id}
								onClick={() => {
									const platforms = config.platforms.includes(platform.id)
										? config.platforms.filter((p) => p !== platform.id)
										: [...config.platforms, platform.id];
									onUpdate({ platforms });
								}}
								className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
									config.platforms.includes(platform.id)
										? 'bg-primary text-bg-card'
										: 'bg-bg border border-border text-text-secondary hover:text-text'
								}`}
								title={platform.todoNote}
							>
								{platform.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Save Button */}
			<div className="flex justify-end">
				<button
					onClick={onSave}
					disabled={saving}
					className="px-6 py-2 bg-primary text-bg-card rounded hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{saving ? 'Saving...' : 'Save Configuration'}
				</button>
			</div>
		</div>
	);
}
