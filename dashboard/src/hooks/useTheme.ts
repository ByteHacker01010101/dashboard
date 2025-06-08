import { useEffect } from 'react';
import { UserData } from '../types';

export function useTheme(userData: UserData) {
  useEffect(() => {
    const root = document.documentElement;
    const theme = userData.preferences.theme;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [userData.preferences.theme]);
}