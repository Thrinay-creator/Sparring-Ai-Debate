import { useState, useEffect, useCallback } from 'react';
import { getStoredTheme, saveStoredTheme } from '../utils/storage';

export function useTheme() {
  const [theme, setThemeState] = useState(() => getStoredTheme());
  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to OS system color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Compute resolved theme: 'light' or 'dark'
  const resolvedTheme = theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;

  // Apply theme attribute to document element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const daisyTheme = resolvedTheme === 'light' ? 'chamber-light' : 'chamber';
    document.documentElement.setAttribute('data-theme', daisyTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'system') {
      setThemeState(newTheme);
      saveStoredTheme(newTheme);
    }
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme
  };
}
