/**
 * Weekly availability editor with visual time blocking
 * Shows a week calendar where users can click to block/unblock time slots
 */

import { useMemo, useCallback } from 'react';
import { DAYS_OF_WEEK } from '../../../config/contact-admin';

interface WeeklyAvailabilityEditorProps {
	startHour: number;
	endHour: number;
	availableDays: number[];
	onUpdate: (updates: {
		start_hour?: number;
		end_hour?: number;
		available_days?: number[];
	}) => void;
}

// Generate hour labels (0-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(hour: number): string {
	if (hour === 0) return '12 AM';
	if (hour === 12) return '12 PM';
	if (hour < 12) return `${hour} AM`;
	return `${hour - 12} PM`;
}

export function WeeklyAvailabilityEditor({
	startHour,
	endHour,
	availableDays,
	onUpdate,
}: WeeklyAvailabilityEditorProps) {
	// Calculate which cells are available (not blocked)
	const availabilityGrid = useMemo(() => {
		const grid: boolean[][] = [];
		for (let day = 0; day < 7; day++) {
			const daySlots: boolean[] = [];
			const isDayAvailable = availableDays.includes(day);
			for (let hour = 0; hour < 24; hour++) {
				// Available if: day is available AND hour is within business hours
				const isAvailable = isDayAvailable && hour >= startHour && hour < endHour;
				daySlots.push(isAvailable);
			}
			grid.push(daySlots);
		}
		return grid;
	}, [startHour, endHour, availableDays]);

	// Toggle entire day
	const toggleDay = useCallback(
		(dayIndex: number) => {
			const newDays = availableDays.includes(dayIndex)
				? availableDays.filter((d) => d !== dayIndex)
				: [...availableDays, dayIndex].sort();
			onUpdate({ available_days: newDays });
		},
		[availableDays, onUpdate]
	);

	// Adjust business hours by clicking on hour row
	const handleHourClick = useCallback(
		(hour: number) => {
			// If clicking before current start, set as new start
			if (hour < startHour) {
				onUpdate({ start_hour: hour });
			}
			// If clicking after current end, set as new end
			else if (hour >= endHour) {
				onUpdate({ end_hour: hour + 1 });
			}
			// If clicking within range, determine if closer to start or end
			else {
				const distToStart = hour - startHour;
				const distToEnd = endHour - hour - 1;
				if (distToStart <= distToEnd) {
					onUpdate({ start_hour: hour + 1 });
				} else {
					onUpdate({ end_hour: hour });
				}
			}
		},
		[startHour, endHour, onUpdate]
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="text-sm text-text-secondary">
					Click days to enable/disable. Click hours to adjust business hours.
				</div>
				<div className="flex items-center gap-4 text-xs">
					<div className="flex items-center gap-1">
						<div className="w-4 h-4 bg-success/30 border border-success/50 rounded" />
						<span className="text-text-secondary">Available</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-4 h-4 bg-danger/20 border border-danger/30 rounded" />
						<span className="text-text-secondary">Blocked</span>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<div className="min-w-[600px]">
					{/* Header row with day names */}
					<div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-border rounded-t-lg overflow-hidden">
						<div className="bg-bg-secondary p-2 text-center text-xs font-medium text-text-muted">
							Time
						</div>
						{DAYS_OF_WEEK.map((day) => (
							<button
								key={day.value}
								onClick={() => toggleDay(day.value)}
								className={`p-2 text-center text-sm font-medium transition-colors ${
									availableDays.includes(day.value)
										? 'bg-primary/20 text-primary hover:bg-primary/30'
										: 'bg-bg-secondary text-text-muted hover:bg-bg-card'
								}`}
							>
								{day.short}
							</button>
						))}
					</div>

					{/* Hour rows */}
					<div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-border">
						{HOURS.map((hour) => (
							<div key={hour} className="contents">
								{/* Hour label */}
								<button
									onClick={() => handleHourClick(hour)}
									className={`p-1 text-center text-xs transition-colors ${
										hour >= startHour && hour < endHour
											? 'bg-bg-card text-text-secondary font-medium'
											: 'bg-bg-secondary text-text-muted hover:bg-bg-card'
									}`}
								>
									{formatHour(hour)}
								</button>

								{/* Day cells for this hour */}
								{DAYS_OF_WEEK.map((day) => {
									const isAvailable = availabilityGrid[day.value][hour];
									const isWithinHours = hour >= startHour && hour < endHour;
									const isDayEnabled = availableDays.includes(day.value);

									return (
										<div
											key={`${day.value}-${hour}`}
											className={`h-6 transition-colors ${
												isAvailable
													? 'bg-success/20 hover:bg-success/30'
													: isWithinHours && !isDayEnabled
														? 'bg-danger/15 hover:bg-danger/25'
														: 'bg-bg-secondary'
											}`}
											title={`${day.long} ${formatHour(hour)} - ${isAvailable ? 'Available' : 'Blocked'}`}
										/>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Current settings summary */}
			<div className="flex flex-wrap gap-4 text-sm">
				<div className="bg-bg-secondary px-3 py-2 rounded border border-border">
					<span className="text-text-muted">Hours: </span>
					<span className="text-text font-medium">
						{formatHour(startHour)} - {formatHour(endHour)}
					</span>
				</div>
				<div className="bg-bg-secondary px-3 py-2 rounded border border-border">
					<span className="text-text-muted">Days: </span>
					<span className="text-text font-medium">
						{availableDays.length === 0
							? 'None'
							: availableDays
									.sort()
									.map((d) => DAYS_OF_WEEK[d].short)
									.join(', ')}
					</span>
				</div>
			</div>
		</div>
	);
}
