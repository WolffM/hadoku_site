/**
 * React wrapper for @wolffm/task-ui-components ThemePicker
 * Connects @wolffm/themes with ThemePicker component
 * Only contains Hadoku-specific API sync logic
 */
import React, { useState } from 'react';
import { ThemePicker, logger } from '@wolffm/task-ui-components';
import { useTheme, THEME_FAMILIES, THEME_ICON_MAP } from '@wolffm/themes';
import '@wolffm/task-ui-components/theme-picker.css';

export default function ThemePickerWrapper() {
  const { theme, setTheme: setThemeBase } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Wrapper to add Hadoku-specific API sync
  const handleThemeChange = async (newTheme: string) => {
    // Update theme using hook from @wolffm/themes
    setThemeBase(newTheme as any);

    // Hadoku-specific: Sync to API for cross-device persistence
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        const response = await fetch('/task/api/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId
          },
          body: JSON.stringify({ theme: newTheme })
        });

        if (!response.ok) {
          logger.warn('Failed to sync theme to API', { status: response.status, theme: newTheme });
        }
      }
    } catch (err) {
      logger.error('Error syncing theme to API', { theme: newTheme, error: (err as Error).message });
    }
  };

  return (
    <ThemePicker
      currentTheme={theme}
      isOpen={isOpen}
      themeFamilies={THEME_FAMILIES}
      onThemeChange={handleThemeChange}
      onToggle={() => setIsOpen(!isOpen)}
      getThemeIcon={(t) => THEME_ICON_MAP[t as keyof typeof THEME_ICON_MAP]?.() || null}
      className="theme-picker"
    />
  );
}
