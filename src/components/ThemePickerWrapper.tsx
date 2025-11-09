/**
 * React wrapper for @wolffm/task-ui-components ThemePicker
 * Integrates with the Hadoku theme system
 */
import React, { useState, useEffect } from 'react';
import { ThemePicker, logger } from '@wolffm/task-ui-components';
import type { ThemeFamily } from '@wolffm/task-ui-components';
import '@wolffm/task-ui-components/theme-picker.css';
import {
  SunIcon,
  MoonIcon,
  StrawberryIcon,
  WaveIcon,
  ZapIcon,
  CoffeeIcon,
  FlowerIcon,
  HeartIcon,
  LeafIcon
} from '@wolffm/task-ui-components';

// Define theme families matching our theme structure
const themeFamilies: ThemeFamily[] = [
  {
    lightTheme: 'light',
    darkTheme: 'dark',
    lightLabel: 'Light',
    darkLabel: 'Dark',
    lightIcon: <SunIcon />,
    darkIcon: <MoonIcon />
  },
  {
    lightTheme: 'strawberry-light',
    darkTheme: 'strawberry-dark',
    lightLabel: 'Strawberry Light',
    darkLabel: 'Strawberry Dark',
    lightIcon: <StrawberryIcon />,
    darkIcon: <StrawberryIcon />
  },
  {
    lightTheme: 'ocean-light',
    darkTheme: 'ocean-dark',
    lightLabel: 'Ocean Light',
    darkLabel: 'Ocean Dark',
    lightIcon: <WaveIcon />,
    darkIcon: <WaveIcon />
  },
  {
    lightTheme: 'cyberpunk-light',
    darkTheme: 'cyberpunk-dark',
    lightLabel: 'Cyberpunk Light',
    darkLabel: 'Cyberpunk Dark',
    lightIcon: <ZapIcon />,
    darkIcon: <ZapIcon />
  },
  {
    lightTheme: 'coffee-light',
    darkTheme: 'coffee-dark',
    lightLabel: 'Coffee Light',
    darkLabel: 'Coffee Dark',
    lightIcon: <CoffeeIcon />,
    darkIcon: <CoffeeIcon />
  },
  {
    lightTheme: 'lavender-light',
    darkTheme: 'lavender-dark',
    lightLabel: 'Lavender Light',
    darkLabel: 'Lavender Dark',
    lightIcon: <FlowerIcon />,
    darkIcon: <FlowerIcon />
  },
  {
    lightTheme: 'nature-light',
    darkTheme: 'nature-dark',
    lightLabel: 'Nature Light',
    darkLabel: 'Nature Dark',
    lightIcon: <LeafIcon />,
    darkIcon: <LeafIcon />
  },
  {
    lightTheme: 'pink-light',
    darkTheme: 'pink-dark',
    lightLabel: 'Pink Light',
    darkLabel: 'Pink Dark',
    lightIcon: <HeartIcon />,
    darkIcon: <HeartIcon />
  }
];

// Icon mapping for current theme display
const themeIcons: Record<string, React.ReactNode> = {
  'light': <SunIcon />,
  'dark': <MoonIcon />,
  'strawberry-light': <StrawberryIcon />,
  'strawberry-dark': <StrawberryIcon />,
  'ocean-light': <WaveIcon />,
  'ocean-dark': <WaveIcon />,
  'cyberpunk-light': <ZapIcon />,
  'cyberpunk-dark': <ZapIcon />,
  'coffee-light': <CoffeeIcon />,
  'coffee-dark': <CoffeeIcon />,
  'lavender-light': <FlowerIcon />,
  'lavender-dark': <FlowerIcon />,
  'nature-light': <LeafIcon />,
  'nature-dark': <LeafIcon />,
  'pink-light': <HeartIcon />,
  'pink-dark': <HeartIcon />
};

export default function ThemePickerWrapper() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Wait for theme system to be available
    const checkThemeSystem = () => {
      if (window.hadokuThemes) {
        const { getTheme } = window.hadokuThemes;
        setCurrentTheme(getTheme());
      } else {
        setTimeout(checkThemeSystem, 50);
      }
    };
    checkThemeSystem();
  }, []);

  const handleThemeChange = async (theme: string) => {
    if (!window.hadokuThemes) return;

    const { setTheme, saveTheme } = window.hadokuThemes;

    // Update theme
    setTheme(theme);
    saveTheme(theme);
    setCurrentTheme(theme);

    // Sync theme to API for cross-device persistence
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        const response = await fetch('/task/api/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId
          },
          body: JSON.stringify({ theme })
        });

        if (!response.ok) {
          logger.warn('Failed to sync theme to API', { status: response.status, theme });
        }
      }
    } catch (err) {
      logger.error('Error syncing theme to API', { theme, error: (err as Error).message });
    }
  };

  const getThemeIcon = (theme: string) => {
    return themeIcons[theme] || <SunIcon />;
  };

  return (
    <ThemePicker
      currentTheme={currentTheme}
      isOpen={isOpen}
      themeFamilies={themeFamilies}
      onThemeChange={handleThemeChange}
      onToggle={() => setIsOpen(!isOpen)}
      getThemeIcon={getThemeIcon}
      className="theme-picker"
    />
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hadokuThemes?: {
      getTheme: () => string;
      setTheme: (theme: string) => void;
      saveTheme: (theme: string) => void;
      THEMES: string[];
    };
  }
}
