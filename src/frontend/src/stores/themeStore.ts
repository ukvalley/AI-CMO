/**
 * Theme Store
 *
 * Global visual identity and theme management.
 * Applies colors, fonts, and spacing from Visual Identity module.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VisualIdentity {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  monoFont: string;
  borderRadiusSm: string;
  borderRadiusMd: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
}

interface ThemeState {
  // Current visual identity
  identity: VisualIdentity;
  // Whether to use custom identity or default
  isCustomActive: boolean;
  // Actions
  setIdentity: (identity: Partial<VisualIdentity>) => void;
  applyPalette: (palette: any) => void;
  applyFonts: (fonts: { heading: string; body: string; accent?: string; mono?: string }) => void;
  resetToDefault: () => void;
  activateCustom: () => void;
  deactivateCustom: () => void;
  // Get CSS variables
  getCSSVariables: () => Record<string, string>;
}

const defaultIdentity: VisualIdentity = {
  primaryColor: '#C8FF2E',
  secondaryColor: '#1E293B',
  accentColor: '#22D3EE',
  backgroundColor: '#0D1117',
  surfaceColor: '#161B22',
  textColor: '#E6EDF3',
  textMutedColor: '#8B949E',
  successColor: '#3FB950',
  warningColor: '#D29922',
  errorColor: '#F85149',
  infoColor: '#58A6FF',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  accentFont: 'Playfair Display',
  monoFont: 'JetBrains Mono',
  borderRadiusSm: '0.25rem',
  borderRadiusMd: '0.5rem',
  borderRadiusLg: '0.75rem',
  borderRadiusXl: '1rem',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      identity: defaultIdentity,
      isCustomActive: false,

      setIdentity: (identity) =>
        set((state) => ({
          identity: { ...state.identity, ...identity },
        })),

      applyPalette: (palette) =>
        set((state) => ({
          identity: {
            ...state.identity,
            primaryColor: palette.colors.primary,
            secondaryColor: palette.colors.secondary,
            accentColor: palette.colors.accent,
            backgroundColor: palette.colors.background,
            surfaceColor: palette.colors.surface,
            textColor: palette.colors.text,
            textMutedColor: palette.colors.textMuted,
            successColor: palette.colors.success,
            warningColor: palette.colors.warning,
            errorColor: palette.colors.error,
            infoColor: palette.colors.info,
          },
          isCustomActive: true,
        })),

      applyFonts: (fonts) =>
        set((state) => ({
          identity: {
            ...state.identity,
            headingFont: fonts.heading,
            bodyFont: fonts.body,
            ...(fonts.accent && { accentFont: fonts.accent }),
            ...(fonts.mono && { monoFont: fonts.mono }),
          },
        })),

      resetToDefault: () =>
        set({
          identity: defaultIdentity,
          isCustomActive: false,
        }),

      activateCustom: () => set({ isCustomActive: true }),
      deactivateCustom: () => set({ isCustomActive: false }),

      getCSSVariables: () => {
        const { identity } = get();
        return {
          '--color-primary': identity.primaryColor,
          '--color-secondary': identity.secondaryColor,
          '--color-accent': identity.accentColor,
          '--color-background': identity.backgroundColor,
          '--color-surface': identity.surfaceColor,
          '--color-text': identity.textColor,
          '--color-text-muted': identity.textMutedColor,
          '--color-success': identity.successColor,
          '--color-warning': identity.warningColor,
          '--color-error': identity.errorColor,
          '--color-info': identity.infoColor,
          '--font-heading': identity.headingFont,
          '--font-body': identity.bodyFont,
          '--font-accent': identity.accentFont,
          '--font-mono': identity.monoFont,
          '--radius-sm': identity.borderRadiusSm,
          '--radius-md': identity.borderRadiusMd,
          '--radius-lg': identity.borderRadiusLg,
          '--radius-xl': identity.borderRadiusXl,
        };
      },
    }),
    {
      name: 'mengo-theme-storage',
    }
  )
);

// Hook to get CSS variable style for components
export function useThemeStyles() {
  const { identity, isCustomActive, getCSSVariables } = useThemeStore();

  if (!isCustomActive) {
    return {};
  }

  return getCSSVariables();
}

// Hook to get current theme colors
export function useThemeColors() {
  const { identity, isCustomActive } = useThemeStore();
  return isCustomActive ? identity : defaultIdentity;
}
