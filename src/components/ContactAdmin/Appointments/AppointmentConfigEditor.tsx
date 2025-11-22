/**
 * Appointment configuration editor
 */

import type { AppointmentConfig } from '../../../lib/api/types';
import { TIMEZONE_OPTIONS, DAYS_OF_WEEK, MEETING_PLATFORMS } from '../../../config/contact-admin';

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
			<div className="flex-1 p-6 overflow-y-auto">
				<div className="max-w-4xl mx-auto">
					<div className="text-center py-12">
						<div className="text-text-secondary">Loading configuration...</div>
					</div>
				</div>
			</div>
		);
	}

	if (!config) {
		return (
			<div className="flex-1 p-6 overflow-y-auto">
				<div className="max-w-4xl mx-auto">
					<div className="text-center py-12">
						<div className="text-text-secondary">No configuration found</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 p-6 overflow-y-auto">
			<div className="max-w-4xl mx-auto">
				<h2 className="text-2xl font-bold text-text mb-6">Appointment Configuration</h2>

				<div className="space-y-6">
					{/* Timezone */}
					<div className="bg-bg-secondary p-6 rounded-lg border border-border">
						<label className="block text-sm font-medium text-text mb-2">Timezone</label>
						<select
							value={config.timezone}
							onChange={(e) => onUpdate({ timezone: e.target.value })}
							className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
						>
							{TIMEZONE_OPTIONS.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))}
						</select>
					</div>

					{/* Business Hours */}
					<div className="bg-bg-secondary p-6 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-text mb-4">Business Hours</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-text mb-2">Start Time (24h)</label>
								<input
									type="number"
									min="0"
									max="23"
									value={config.start_hour}
									onChange={(e) => onUpdate({ start_hour: parseInt(e.target.value) })}
									className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
								/>
								<div className="text-xs text-text-secondary mt-1">
									Current: {config.start_hour}:00
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-2">End Time (24h)</label>
								<input
									type="number"
									min="0"
									max="23"
									value={config.end_hour}
									onChange={(e) => onUpdate({ end_hour: parseInt(e.target.value) })}
									className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
								/>
								<div className="text-xs text-text-secondary mt-1">
									Current: {config.end_hour}:00
								</div>
							</div>
						</div>
					</div>

					{/* Available Days */}
					<div className="bg-bg-secondary p-6 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-text mb-4">Available Days</h3>
						<div className="grid grid-cols-7 gap-2">
							{DAYS_OF_WEEK.map((day) => (
								<button
									key={day.value}
									onClick={() => {
										const days = config.available_days.includes(day.value)
											? config.available_days.filter((d) => d !== day.value)
											: [...config.available_days, day.value].sort();
										onUpdate({ available_days: days });
									}}
									className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
										config.available_days.includes(day.value)
											? 'bg-primary text-bg-card'
											: 'bg-bg border border-border text-text-secondary hover:text-text'
									}`}
								>
									{day.short}
								</button>
							))}
						</div>
					</div>

					{/* Meeting Platforms */}
					<div className="bg-bg-secondary p-6 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-text mb-4">Meeting Platforms</h3>
						<div className="space-y-2">
							{MEETING_PLATFORMS.map((platform) => (
								<label key={platform.id} className="flex items-center space-x-3">
									<input
										type="checkbox"
										checked={config.platforms.includes(platform.id)}
										onChange={(e) => {
											const platforms = e.target.checked
												? [...config.platforms, platform.id]
												: config.platforms.filter((p) => p !== platform.id);
											onUpdate({ platforms });
										}}
										className="w-4 h-4"
									/>
									<span className="text-text capitalize">{platform.label}</span>
									{platform.todoNote && (
										<span className="text-xs text-text-secondary">({platform.todoNote})</span>
									)}
								</label>
							))}
						</div>
					</div>

					{/* Advance Notice */}
					<div className="bg-bg-secondary p-6 rounded-lg border border-border">
						<label className="block text-sm font-medium text-text mb-2">
							Advance Notice (hours)
						</label>
						<input
							type="number"
							min="0"
							max="168"
							value={config.advance_notice_hours}
							onChange={(e) => onUpdate({ advance_notice_hours: parseInt(e.target.value) })}
							className="w-full px-3 py-2 bg-bg border border-border rounded text-text"
						/>
						<div className="text-xs text-text-secondary mt-1">
							Minimum hours required between booking and appointment
						</div>
					</div>

					{/* Save Button */}
					<div className="flex justify-end space-x-4">
						<button
							onClick={onSave}
							disabled={saving}
							className="px-6 py-2 bg-primary text-bg-card rounded hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{saving ? 'Saving...' : 'Save Configuration'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
