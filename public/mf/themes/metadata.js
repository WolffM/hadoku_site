/**
 * Theme metadata - icon mappings and theme family configurations
 * This file imports icons from @wolffm/task-ui-components
 */
import React from 'react';
import { SunIcon, MoonIcon, StrawberryIcon, WaveIcon, ZapIcon, CoffeeIcon, FlowerIcon, HeartIcon, LeafIcon, SpaIcon } from '@wolffm/task-ui-components';
/**
 * Theme families configuration for all 9 theme pairs
 * Each family has a light and dark variant with corresponding icons
 */
export const THEME_FAMILIES = [
    {
        lightTheme: 'light',
        darkTheme: 'dark',
        lightLabel: 'Light',
        darkLabel: 'Dark',
        lightIcon: React.createElement(SunIcon, null),
        darkIcon: React.createElement(MoonIcon, null)
    },
    {
        lightTheme: 'strawberry-light',
        darkTheme: 'strawberry-dark',
        lightLabel: 'Strawberry Light',
        darkLabel: 'Strawberry Dark',
        lightIcon: React.createElement(StrawberryIcon, null),
        darkIcon: React.createElement(StrawberryIcon, null)
    },
    {
        lightTheme: 'ocean-light',
        darkTheme: 'ocean-dark',
        lightLabel: 'Ocean Light',
        darkLabel: 'Ocean Dark',
        lightIcon: React.createElement(WaveIcon, null),
        darkIcon: React.createElement(WaveIcon, null)
    },
    {
        lightTheme: 'cyberpunk-light',
        darkTheme: 'cyberpunk-dark',
        lightLabel: 'Cyberpunk Light',
        darkLabel: 'Cyberpunk Dark',
        lightIcon: React.createElement(ZapIcon, null),
        darkIcon: React.createElement(ZapIcon, null)
    },
    {
        lightTheme: 'coffee-light',
        darkTheme: 'coffee-dark',
        lightLabel: 'Coffee Light',
        darkLabel: 'Coffee Dark',
        lightIcon: React.createElement(CoffeeIcon, null),
        darkIcon: React.createElement(CoffeeIcon, null)
    },
    {
        lightTheme: 'lavender-light',
        darkTheme: 'lavender-dark',
        lightLabel: 'Lavender Light',
        darkLabel: 'Lavender Dark',
        lightIcon: React.createElement(FlowerIcon, null),
        darkIcon: React.createElement(FlowerIcon, null)
    },
    {
        lightTheme: 'nature-light',
        darkTheme: 'nature-dark',
        lightLabel: 'Nature Light',
        darkLabel: 'Nature Dark',
        lightIcon: React.createElement(LeafIcon, null),
        darkIcon: React.createElement(LeafIcon, null)
    },
    {
        lightTheme: 'pink-light',
        darkTheme: 'pink-dark',
        lightLabel: 'Pink Light',
        darkLabel: 'Pink Dark',
        lightIcon: React.createElement(HeartIcon, null),
        darkIcon: React.createElement(HeartIcon, null)
    },
    {
        lightTheme: 'izakaya-light',
        darkTheme: 'izakaya-dark',
        lightLabel: 'Izakaya Light',
        darkLabel: 'Izakaya Dark',
        lightIcon: React.createElement(SpaIcon, null),
        darkIcon: React.createElement(SpaIcon, null)
    }
];
/**
 * Theme icon mapping - maps each theme name to its icon component
 * Useful for getting the icon for a specific theme
 */
export const THEME_ICON_MAP = {
    light: SunIcon,
    dark: MoonIcon,
    'strawberry-light': StrawberryIcon,
    'strawberry-dark': StrawberryIcon,
    'ocean-light': WaveIcon,
    'ocean-dark': WaveIcon,
    'cyberpunk-light': ZapIcon,
    'cyberpunk-dark': ZapIcon,
    'coffee-light': CoffeeIcon,
    'coffee-dark': CoffeeIcon,
    'lavender-light': FlowerIcon,
    'lavender-dark': FlowerIcon,
    'nature-light': LeafIcon,
    'nature-dark': LeafIcon,
    'pink-light': HeartIcon,
    'pink-dark': HeartIcon,
    'izakaya-light': SpaIcon,
    'izakaya-dark': SpaIcon
};
