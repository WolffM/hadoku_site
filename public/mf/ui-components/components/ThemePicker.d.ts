/**
 * ThemePicker component
 * A beautiful theme picker with light/dark variants for each theme family
 * Designed to work with any theme system via configuration
 */
import React from 'react';
import type { ThemePickerProps } from '../types';
/**
 * ThemePicker - Dropdown theme selector with optional settings button
 *
 * @example
 * ```tsx
 * import { ThemePicker } from '@wolffm/task-ui-components'
 * import '@wolffm/task-ui-components/theme-picker.css'
 *
 * <ThemePicker
 *   currentTheme="dark"
 *   isOpen={showPicker}
 *   themeFamilies={MY_THEME_FAMILIES}
 *   onThemeChange={setTheme}
 *   onToggle={() => setShowPicker(!showPicker)}
 *   onSettingsClick={() => openSettings()}
 * />
 * ```
 */
export declare function ThemePicker({ currentTheme, isOpen, themeFamilies, onThemeChange, onToggle, onSettingsClick, getThemeIcon, className }: ThemePickerProps): React.JSX.Element;
//# sourceMappingURL=ThemePicker.d.ts.map