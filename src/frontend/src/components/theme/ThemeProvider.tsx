/**
 * Theme Provider
 *
 * Applies visual identity theme globally to the application.
 * Injects CSS variables and updates document styles.
 */

'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isCustomActive = useThemeStore(s => s.isCustomActive);
  const identity = useThemeStore(s => s.identity);
  const getCSSVariables = useThemeStore(s => s.getCSSVariables);

  useEffect(() => {
    if (isCustomActive) {
      const cssVars = getCSSVariables();
      const root = document.documentElement;

      // Apply CSS variables
      Object.entries(cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Apply background and text colors to body
      document.body.style.backgroundColor = identity.backgroundColor;
      document.body.style.color = identity.textColor;
    } else {
      // Reset to defaults
      const root = document.documentElement;
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--color-accent');
      root.style.removeProperty('--color-background');
      root.style.removeProperty('--color-surface');
      root.style.removeProperty('--color-text');
      root.style.removeProperty('--color-text-muted');
      root.style.removeProperty('--color-success');
      root.style.removeProperty('--color-warning');
      root.style.removeProperty('--color-error');
      root.style.removeProperty('--color-info');
      root.style.removeProperty('--font-heading');
      root.style.removeProperty('--font-body');
      root.style.removeProperty('--font-accent');
      root.style.removeProperty('--font-mono');

      document.body.style.backgroundColor = '#0d1117';
      document.body.style.color = '#ffffff';
    }
  }, [isCustomActive, identity, getCSSVariables]);

  return <>{children}</>;
}
