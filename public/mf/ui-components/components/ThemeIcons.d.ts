/**
 * Theme icons - Simple monochrome SVG icons for theme picker
 * All icons use currentColor so they can be styled with CSS
 */
import React from 'react';
export declare const SunIcon: () => React.JSX.Element;
export declare const MoonIcon: () => React.JSX.Element;
export declare const StrawberryIcon: () => React.JSX.Element;
export declare const WaveIcon: () => React.JSX.Element;
export declare const ZapIcon: () => React.JSX.Element;
export declare const CoffeeIcon: () => React.JSX.Element;
export declare const FlowerIcon: () => React.JSX.Element;
export declare const HeartIcon: () => React.JSX.Element;
export declare const LeafIcon: () => React.JSX.Element;
export declare const SettingsIcon: () => React.JSX.Element;
export declare const TagIcon: () => React.JSX.Element;
export declare const SpaIcon: () => React.JSX.Element;
/**
 * Generic/Fallback icons for custom themes without specific icons
 * These provide visual differentiation when using the ThemePicker with custom themes
 */
export declare const CircleIcon: () => React.JSX.Element;
export declare const SquareIcon: () => React.JSX.Element;
export declare const TriangleIcon: () => React.JSX.Element;
export declare const DiamondIcon: () => React.JSX.Element;
export declare const StarIcon: () => React.JSX.Element;
export declare const HexagonIcon: () => React.JSX.Element;
export declare const PentagonIcon: () => React.JSX.Element;
export declare const OctagonIcon: () => React.JSX.Element;
/**
 * Fallback icon sets for themes - provides 8 distinct shapes
 * Use these when you don't have specific icons for your themes
 */
export declare const FALLBACK_ICONS: readonly [() => React.JSX.Element, () => React.JSX.Element, () => React.JSX.Element, () => React.JSX.Element, () => React.JSX.Element, () => React.JSX.Element, () => React.JSX.Element, () => React.JSX.Element];
/**
 * Get a fallback icon for a theme by index
 * Icons repeat after 8 themes to provide consistent differentiation
 */
export declare function getFallbackIcon(index: number): React.JSX.Element;
//# sourceMappingURL=ThemeIcons.d.ts.map