/**
 * AI CMO Design System Tokens - MENGO Theme
 *
 * Dark theme with neon lime/green accents
 * Based on the MENGO dashboard design
 */

// ============================================
// COLOR SYSTEM
// ============================================

export const colors = {
  // Primary Brand Colors - Neon Lime/Green
  primary: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#C8FF2E',  // Primary neon lime - matches design
    500: '#a3e635',  // Slightly darker lime
    600: '#84cc16',
    700: '#65a30d',
    800: '#4d7c0f',
    900: '#3f6212',
  },

  // Secondary Accent - Cyan for variety
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Neutral Scale - Dark greenish-gray for dark theme
  neutral: {
    50: '#f6f7f9',
    100: '#eceef2',
    200: '#d4d8e0',
    300: '#afb6c4',
    400: '#878e9d',
    500: '#686f7e',
    600: '#525662',
    700: '#3f434d',
    800: '#1a1d21',   // Card backgrounds
    900: '#0d1117',   // Main dark background - matches design
    950: '#080a0c',   // Deepest background
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#C8FF2E',  // Use primary lime for success
    600: '#84cc16',
    700: '#65a30d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#fbbf24',
    600: '#f59e0b',
    700: '#d97706',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Background Layers - Dark Theme (Greenish tint)
  background: {
    primary: '#0d1117',      // Main background
    secondary: '#151920',   // Card background - slightly lighter
    tertiary: '#1a1d21',     // Elevated surfaces
    subtle: '#21262d',       // Subtle backgrounds
  },

  // Chart/Graph Colors for stats
  chart: {
    green: '#C8FF2E',
    yellow: '#FACC15',
    orange: '#FB923C',
    red: '#EF4444',
    blue: '#22D3EE',
  },
} as const;

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'].join(', '),
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'].join(', '),
  },

  // Font Sizes (rem units for scalability)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// ============================================
// SPACING SYSTEM (8px base scale)
// ============================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px (base)
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// ============================================
// BORDER RADIUS SYSTEM
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const;

// ============================================
// SHADOW SYSTEM
// ============================================

export const shadows = {
  // Subtle dark theme shadows
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',

  // Neon glow for primary accent
  glow: {
    sm: '0 0 10px rgba(200, 255, 46, 0.3)',
    md: '0 0 20px rgba(200, 255, 46, 0.4)',
    lg: '0 0 30px rgba(200, 255, 46, 0.5)',
  },

  // Inner shadow for pressed states
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
} as const;

// ============================================
// TRANSITIONS & ANIMATIONS
// ============================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ============================================
// BREAKPOINTS (Responsive)
// ============================================

export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
} as const;

// ============================================
// GRID SYSTEM
// ============================================

export const grid = {
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  gap: {
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
  },
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px', // Max content width
  },
} as const;

// ============================================
// SIDEBAR CONFIGURATION
// ============================================

export const sidebar = {
  width: {
    expanded: '16rem',  // 256px
    collapsed: '4rem',  // 64px
  },
  transition: `${transitions.duration.normal} ${transitions.timing.default}`,
} as const;

// ============================================
// COMPONENT-SPECIFIC TOKENS
// ============================================

export const componentTokens = {
  // Card tokens - Dark theme with subtle borders
  card: {
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    shadow: shadows.md,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },

  // Stats card tokens - Big bold numbers like in design
  statsCard: {
    valueSize: typography.fontSize['4xl'],
    valueWeight: typography.fontWeight.bold,
    labelSize: typography.fontSize.sm,
    changeSize: typography.fontSize.sm,
  },

  // Button tokens - Rounded with neon accent
  button: {
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,
      md: `${spacing[2.5]} ${spacing[4]}`,
      lg: `${spacing[3]} ${spacing[5]}`,
    },
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
  },

  // Input tokens
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: borderRadius.md,
  },

  // Table tokens
  table: {
    cellPadding: spacing[4],
    headerHeight: '3rem',
    rowHeight: '3.5rem',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
} as const;

// Type exports for TypeScript
type Colors = typeof colors;
type Typography = typeof typography;
type Spacing = typeof spacing;
type BorderRadius = typeof borderRadius;
type Shadows = typeof shadows;

export type { Colors, Typography, Spacing, BorderRadius, Shadows };
