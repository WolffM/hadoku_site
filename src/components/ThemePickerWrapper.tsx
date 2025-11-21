/**
 * React wrapper for @wolffm/task-ui-components ThemePicker
 * Connects @wolffm/themes with ThemePicker component
 * Only contains Hadoku-specific API sync logic
 */
import React, { useState } from 'react';
import { ThemePicker, logger } from '@wolffm/task-ui-components';
import { useTheme, THEME_FAMILIES, THEME_ICON_MAP } from '@wolffm/themes';
import '@wolffm/task-ui-components/theme-picker.css';

// Type declarations for @wolffm/themes exports
interface UseThemeResult {
	theme: string;
	setTheme: (theme: string) => void;
}

export default function ThemePickerWrapper() {
	const themeHook = (useTheme as () => UseThemeResult)();
	const theme = themeHook.theme;
	const setThemeBase = themeHook.setTheme;
	const [isOpen, setIsOpen] = useState(false);

	// Wrapper to add Hadoku-specific API sync
	const handleThemeChange = (newTheme: string) => {
		// Update theme using hook from @wolffm/themes
		setThemeBase(newTheme);

		// Hadoku-specific: Sync to API for cross-device persistence
		(async () => {
			try {
				const sessionId = localStorage.getItem('sessionId');
				if (sessionId) {
					const response = await fetch('/task/api/preferences', {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'X-Session-Id': sessionId,
						},
						body: JSON.stringify({ theme: newTheme }),
					});

					if (!response.ok) {
						logger.warn('Failed to sync theme to API', {
							status: response.status,
							theme: newTheme,
						});
					}
				}
			} catch (err) {
				logger.error('Error syncing theme to API', {
					theme: newTheme,
					error: (err as Error).message,
				});
			}
		})().catch(console.error);
	};

	return (
		<ThemePicker
			currentTheme={theme}
			isOpen={isOpen}
			themeFamilies={THEME_FAMILIES as unknown[]}
			onThemeChange={handleThemeChange}
			onToggle={() => setIsOpen(!isOpen)}
			getThemeIcon={(t: string) => {
				const iconMap = THEME_ICON_MAP as Record<string, (() => React.ReactNode) | undefined>;
				const IconFn = iconMap[t];
				return IconFn?.() ?? null;
			}}
			className="theme-picker"
		/>
	);
}
