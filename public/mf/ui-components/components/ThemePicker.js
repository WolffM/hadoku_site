/**
 * ThemePicker component
 * A beautiful theme picker with light/dark variants for each theme family
 * Designed to work with any theme system via configuration
 */
import React from 'react';
import { SettingsIcon, MoonIcon, getFallbackIcon } from './ThemeIcons.js';
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
export function ThemePicker({ currentTheme, isOpen, themeFamilies, onThemeChange, onToggle, onSettingsClick, getThemeIcon, className = '' }) {
    // Get icon for current theme (use provided function or fallback to MoonIcon)
    const currentIcon = getThemeIcon ? getThemeIcon(currentTheme) : React.createElement(MoonIcon, null);
    return (React.createElement("div", { className: `theme-picker ${className}` },
        React.createElement("button", { className: "theme-toggle-btn", onClick: onToggle, "aria-label": "Choose theme", title: "Choose theme" }, currentIcon),
        isOpen && (React.createElement("div", { className: "theme-picker__dropdown", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { className: "theme-picker__pills" }, themeFamilies.map((family, idx) => {
                // Use provided icons or fallback to generic shapes
                const lightIcon = family.lightIcon ?? getFallbackIcon(idx);
                const darkIcon = family.darkIcon ?? getFallbackIcon(idx);
                return (React.createElement("div", { key: idx, className: "theme-pill" },
                    React.createElement("button", { className: `theme-pill__btn theme-pill__btn--light ${currentTheme === family.lightTheme ? 'active' : ''}`, onClick: () => onThemeChange(family.lightTheme), title: family.lightLabel, "aria-label": family.lightLabel },
                        React.createElement("div", { className: "theme-pill__icon" }, lightIcon)),
                    React.createElement("button", { className: `theme-pill__btn theme-pill__btn--dark ${currentTheme === family.darkTheme ? 'active' : ''}`, onClick: () => onThemeChange(family.darkTheme), title: family.darkLabel, "aria-label": family.darkLabel },
                        React.createElement("div", { className: "theme-pill__icon" }, darkIcon))));
            })),
            onSettingsClick && (React.createElement("button", { className: "theme-picker__settings-icon", onClick: () => {
                    onSettingsClick();
                    onToggle(); // Close picker after opening settings
                }, "aria-label": "Settings", title: "Settings" },
                React.createElement(SettingsIcon, null))))),
        isOpen && (React.createElement("div", { className: "theme-picker__overlay", onClick: onToggle }))));
}
