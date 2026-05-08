/**
 * Visual Identity Module
 *
 * Comprehensive design system and visual identity management.
 * Includes colors, typography, spacing, shadows, and live component previews.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { moduleDataApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import { Check, Copy, RefreshCcw, Palette, Type, Layout, Image as ImageIcon, Download, Eye, Moon, Sun, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================
// DATA SETS
// ============================================

const GOOGLE_FONTS = [
  { name: 'Inter', category: 'sans-serif', weights: ['400', '500', '600', '700'] },
  { name: 'Roboto', category: 'sans-serif', weights: ['400', '500', '700'] },
  { name: 'Poppins', category: 'sans-serif', weights: ['400', '500', '600', '700'] },
  { name: 'Montserrat', category: 'sans-serif', weights: ['400', '500', '600', '700'] },
  { name: 'Open Sans', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Lato', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'Playfair Display', category: 'serif', weights: ['400', '600', '700'] },
  { name: 'Merriweather', category: 'serif', weights: ['400', '700'] },
  { name: 'Source Sans Pro', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Nunito', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Ubuntu', category: 'sans-serif', weights: ['400', '500', '700'] },
  { name: 'Raleway', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Cabin', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Oxygen', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'PT Sans', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'Work Sans', category: 'sans-serif', weights: ['400', '500', '700'] },
  { name: 'DM Sans', category: 'sans-serif', weights: ['400', '500', '700'] },
  { name: 'Space Grotesk', category: 'sans-serif', weights: ['400', '500', '700'] },
  { name: 'Sora', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Outfit', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Plus Jakarta Sans', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Manrope', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Satoshi', category: 'sans-serif', weights: ['400', '500', '700'] },
  { name: 'General Sans', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Clash Display', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Uncut Sans', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'BDO Grotesk', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'FK Grotesk', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Messapia', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'GT America', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Neue Montreal', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Suisse Int\'l', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Graphik', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Circular Std', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Avenir Next', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Proxima Nova', category: 'sans-serif', weights: ['400', '600', '700'] },
  { name: 'Futura PT', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'Didot', category: 'serif', weights: ['400', '700'] },
  { name: 'Bodoni Moda', category: 'serif', weights: ['400', '700'] },
  { name: 'Libre Baskerville', category: 'serif', weights: ['400', '700'] },
  { name: 'Cormorant Garamond', category: 'serif', weights: ['400', '600', '700'] },
  { name: 'Crimson Text', category: 'serif', weights: ['400', '700'] },
  { name: 'EB Garamond', category: 'serif', weights: ['400', '600', '700'] },
  { name: 'Source Code Pro', category: 'monospace', weights: ['400', '600'] },
  { name: 'JetBrains Mono', category: 'monospace', weights: ['400', '600'] },
  { name: 'Fira Code', category: 'monospace', weights: ['400', '600'] },
  { name: 'IBM Plex Mono', category: 'monospace', weights: ['400', '600'] },
  { name: 'DM Mono', category: 'monospace', weights: ['400', '600'] },
];

const PRESET_PALETTES = [
  {
    name: 'Midnight Modern',
    description: 'Dark, sophisticated tech aesthetic',
    colors: {
      primary: '#C8FF2E',
      secondary: '#1E293B',
      accent: '#22D3EE',
      background: '#0D1117',
      surface: '#161B22',
      text: '#E6EDF3',
      textMuted: '#8B949E',
      success: '#3FB950',
      warning: '#D29922',
      error: '#F85149',
      info: '#58A6FF',
    },
  },
  {
    name: 'Soft Organic',
    description: 'Warm, natural, approachable',
    colors: {
      primary: '#E07A5F',
      secondary: '#F2CC8F',
      accent: '#81B29A',
      background: '#F4F1DE',
      surface: '#FFFFFF',
      text: '#3D405B',
      textMuted: '#6B7280',
      success: '#81B29A',
      warning: '#F2CC8F',
      error: '#E07A5F',
      info: '#3D405B',
    },
  },
  {
    name: 'Electric Future',
    description: 'Bold, energetic, innovative',
    colors: {
      primary: '#FF006E',
      secondary: '#8338EC',
      accent: '#3A86FF',
      background: '#0A0A0A',
      surface: '#141414',
      text: '#FFFFFF',
      textMuted: '#A0A0A0',
      success: '#06FFA5',
      warning: '#FFBE0B',
      error: '#FB5607',
      info: '#3A86FF',
    },
  },
  {
    name: 'Corporate Blue',
    description: 'Professional, trustworthy, stable',
    colors: {
      primary: '#0066CC',
      secondary: '#4A90E2',
      accent: '#50E3C2',
      background: '#FFFFFF',
      surface: '#F5F7FA',
      text: '#1A1A2E',
      textMuted: '#6B7280',
      success: '#27AE60',
      warning: '#F39C12',
      error: '#E74C3C',
      info: '#3498DB',
    },
  },
  {
    name: 'Sunset Warmth',
    description: 'Friendly, welcoming, creative',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD23F',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#2D3748',
      textMuted: '#718096',
      success: '#48BB78',
      warning: '#ED8936',
      error: '#F56565',
      info: '#4299E1',
    },
  },
  {
    name: 'Forest Minimal',
    description: 'Calm, sustainable, balanced',
    colors: {
      primary: '#2D6A4F',
      secondary: '#40916C',
      accent: '#52B788',
      background: '#F8FAF9',
      surface: '#FFFFFF',
      text: '#1B4332',
      textMuted: '#52796F',
      success: '#2D6A4F',
      warning: '#D4A373',
      error: '#BC4749',
      info: '#457B9D',
    },
  },
  {
    name: 'Cyber Neon',
    description: 'Futuristic, high-contrast, bold',
    colors: {
      primary: '#00F5FF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      background: '#0D0221',
      surface: '#1A0B2E',
      text: '#FFFFFF',
      textMuted: '#B8B8B8',
      success: '#00FF9F',
      warning: '#FFB800',
      error: '#FF003C',
      info: '#00F5FF',
    },
  },
  {
    name: 'Elegant Luxury',
    description: 'Premium, refined, sophisticated',
    colors: {
      primary: '#D4AF37',
      secondary: '#1C1C1C',
      accent: '#8B0000',
      background: '#0A0A0A',
      surface: '#141414',
      text: '#F5F5F5',
      textMuted: '#A0A0A0',
      success: '#228B22',
      warning: '#B8860B',
      error: '#8B0000',
      info: '#4169E1',
    },
  },
];

// ============================================
// TYPES
// ============================================

interface VisualIdentity {
  id: string;
  companyId: string;
  // Colors
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
  // Typography
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  monoFont: string;
  // Font sizes
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeBase: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontSize4xl: string;
  // Spacing
  borderRadiusSm: string;
  borderRadiusMd: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  // Line heights
  lineHeightTight: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;
  // Letter spacing
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
  // Dark mode
  darkModePrimaryColor?: string;
  darkModeBackgroundColor?: string;
  darkModeSurfaceColor?: string;
  darkModeTextColor?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// COLOR UTILITIES
// ============================================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 0;

  const luminance1 = (0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b) / 255;
  const luminance2 = (0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b) / 255;

  return Math.abs(luminance1 - luminance2);
}

function isAccessible(background: string, foreground: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(background, foreground);
  return level === 'AAA' ? ratio >= 0.7 : ratio >= 0.5;
}

// ============================================
// COMPONENTS
// ============================================

function ColorPicker({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer bg-transparent"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm font-mono uppercase"
          />
        </div>
      </div>
    </div>
  );
}

function FontSelector({
  label,
  value,
  onChange,
  previewText = 'The quick brown fox',
  description,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  previewText?: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedFont = GOOGLE_FONTS.find((f) => f.name === value);

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      {description && <p className="text-xs text-slate-500">{description}</p>}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-slate-600 transition-colors flex items-center justify-between"
      >
        <div>
          <span className="text-slate-200" style={{ fontFamily: value }}>
            {value}
          </span>
          {selectedFont && (
            <span className="ml-2 text-xs text-slate-500 capitalize">({selectedFont.category})</span>
          )}
        </div>
        <span className="text-slate-500">▼</span>
      </button>

      {/* Preview */}
      <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
        <p className="text-slate-400 text-xs mb-1">Preview:</p>
        <p className="text-lg text-slate-200" style={{ fontFamily: value }}>
          {previewText}
        </p>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-slate-800 border-b border-slate-700">
              <input
                type="text"
                placeholder="Search fonts..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {GOOGLE_FONTS.map((font) => (
              <button
                key={font.name}
                onClick={() => {
                  onChange(font.name);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center justify-between',
                  value === font.name && 'bg-slate-700'
                )}
              >
                <div>
                  <span className="text-slate-200 block" style={{ fontFamily: font.name }}>
                    {font.name}
                  </span>
                  <span className="text-xs text-slate-500 capitalize">{font.category}</span>
                </div>
                {value === font.name && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PaletteCard({
  palette,
  isSelected,
  onClick,
}: {
  palette: typeof PRESET_PALETTES[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 transition-all text-left',
        isSelected
          ? 'border-primary-500 bg-slate-800/50'
          : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
      )}
    >
      <h3 className="font-semibold text-slate-200 mb-1">{palette.name}</h3>
      <p className="text-xs text-slate-500 mb-3">{palette.description}</p>
      <div className="flex gap-1">
        {Object.entries(palette.colors)
          .slice(0, 5)
          .map(([key, color]) => (
            <div
              key={key}
              className="w-8 h-8 rounded-lg border border-slate-700"
              style={{ backgroundColor: color }}
              title={`${key}: ${color}`}
            />
          ))}
      </div>
    </button>
  );
}

function ComponentPreview({ identity }: { identity: Partial<VisualIdentity> }) {
  const colors = {
    primary: identity.primaryColor || '#C8FF2E',
    secondary: identity.secondaryColor || '#1E293B',
    accent: identity.accentColor || '#22D3EE',
    background: identity.backgroundColor || '#0D1117',
    surface: identity.surfaceColor || '#161B22',
    text: identity.textColor || '#E6EDF3',
    textMuted: identity.textMutedColor || '#8B949E',
    success: identity.successColor || '#3FB950',
    error: identity.errorColor || '#F85149',
  };

  const fonts = {
    heading: identity.headingFont || 'Inter',
    body: identity.bodyFont || 'Inter',
  };

  return (
    <div
      className="p-6 rounded-xl border"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.secondary,
      }}
    >
      <h3
        className="text-xl font-bold mb-4"
        style={{ color: colors.text, fontFamily: fonts.heading }}
      >
        Component Preview
      </h3>

      <div className="space-y-4">
        {/* Button */}
        <div>
          <p className="text-xs mb-2" style={{ color: colors.textMuted }}>
            Primary Button
          </p>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: colors.primary,
              color: colors.secondary,
              fontFamily: fonts.body,
            }}
          >
            Get Started
          </button>
        </div>

        {/* Card */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.secondary,
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{ color: colors.text, fontFamily: fonts.heading }}
          >
            Feature Card
          </h4>
          <p style={{ color: colors.textMuted, fontFamily: fonts.body }}>
            This is how your content will look with the selected colors and typography.
          </p>
        </div>

        {/* Alert */}
        <div
          className="p-3 rounded-lg flex items-center gap-2"
          style={{
            backgroundColor: `${colors.success}20`,
            borderLeft: `3px solid ${colors.success}`,
          }}
        >
          <CheckCircle2 style={{ color: colors.success }} className="w-5 h-5" />
          <span style={{ color: colors.text, fontFamily: fonts.body }}>
            Success message example
          </span>
        </div>

        {/* Input */}
        <div>
          <p className="text-xs mb-2" style={{ color: colors.textMuted }}>
            Form Input
          </p>
          <input
            type="text"
            placeholder="Enter your email..."
            className="w-full px-3 py-2 rounded-lg border bg-transparent"
            style={{
              borderColor: colors.secondary,
              color: colors.text,
              fontFamily: fonts.body,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function AccessibilityChecker({ identity }: { identity: Partial<VisualIdentity> }) {
  const checks = [
    {
      name: 'Primary text on background',
      background: identity.backgroundColor || '#0D1117',
      foreground: identity.textColor || '#E6EDF3',
    },
    {
      name: 'Primary color on background',
      background: identity.backgroundColor || '#0D1117',
      foreground: identity.primaryColor || '#C8FF2E',
    },
    {
      name: 'Muted text on surface',
      background: identity.surfaceColor || '#161B22',
      foreground: identity.textMutedColor || '#8B949E',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-200 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Accessibility Checks
      </h3>
      {checks.map((check) => {
        const ratio = getContrastRatio(check.background, check.foreground);
        const isAAPass = ratio >= 0.5;
        const isAAAPass = ratio >= 0.7;

        return (
          <div
            key={check.name}
            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div
                  className="w-6 h-6 rounded border border-slate-700"
                  style={{ backgroundColor: check.background }}
                />
                <div
                  className="w-6 h-6 rounded border border-slate-700 flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: check.background,
                    color: check.foreground,
                  }}
                >
                  A
                </div>
              </div>
              <span className="text-sm text-slate-300">{check.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {isAAAPass ? (
                <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded">
                  AAA
                </span>
              ) : isAAPass ? (
                <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                  AA
                </span>
              ) : (
                <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                  Fail
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function VisualIdentityPage() {
  const { user } = useAuthStore();
  const { activeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || activeCompanyId;

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'preview'>('colors');
  const [identity, setIdentity] = useState<Partial<VisualIdentity>>({
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
    fontSizeXs: '0.75rem',
    fontSizeSm: '0.875rem',
    fontSizeBase: '1rem',
    fontSizeLg: '1.125rem',
    fontSizeXl: '1.25rem',
    fontSize2xl: '1.5rem',
    fontSize3xl: '1.875rem',
    fontSize4xl: '2.25rem',
    borderRadiusSm: '0.25rem',
    borderRadiusMd: '0.5rem',
    borderRadiusLg: '0.75rem',
    borderRadiusXl: '1rem',
    lineHeightTight: '1.25',
    lineHeightNormal: '1.5',
    lineHeightRelaxed: '1.75',
    letterSpacingTight: '-0.025em',
    letterSpacingNormal: '0',
    letterSpacingWide: '0.025em',
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load data
  useEffect(() => {
    if (!companyId) return;

    const loadData = async () => {
      const response = await moduleDataApi.get('visual-identity', companyId);
      if (response.data?.data) {
        setIdentity((prev) => ({ ...prev, ...response.data.data }));
      }
    };

    loadData();
  }, [companyId]);

  // Save data
  const saveIdentity = async () => {
    if (!companyId) return;

    await moduleDataApi.save('visual-identity', {
      companyId,
      data: identity,
    });
  };

  // Apply preset palette
  const applyPalette = (palette: typeof PRESET_PALETTES[0]) => {
    setIdentity((prev) => ({
      ...prev,
      ...palette.colors,
    }));
  };

  // Export CSS
  const exportCSS = () => {
    const css = `
:root {
  /* Colors */
  --color-primary: ${identity.primaryColor};
  --color-secondary: ${identity.secondaryColor};
  --color-accent: ${identity.accentColor};
  --color-background: ${identity.backgroundColor};
  --color-surface: ${identity.surfaceColor};
  --color-text: ${identity.textColor};
  --color-text-muted: ${identity.textMutedColor};
  --color-success: ${identity.successColor};
  --color-warning: ${identity.warningColor};
  --color-error: ${identity.errorColor};
  --color-info: ${identity.infoColor};

  /* Typography */
  --font-heading: ${identity.headingFont};
  --font-body: ${identity.bodyFont};
  --font-accent: ${identity.accentFont};
  --font-mono: ${identity.monoFont};

  /* Font sizes */
  --font-size-xs: ${identity.fontSizeXs};
  --font-size-sm: ${identity.fontSizeSm};
  --font-size-base: ${identity.fontSizeBase};
  --font-size-lg: ${identity.fontSizeLg};
  --font-size-xl: ${identity.fontSizeXl};
  --font-size-2xl: ${identity.fontSize2xl};
  --font-size-3xl: ${identity.fontSize3xl};
  --font-size-4xl: ${identity.fontSize4xl};

  /* Spacing */
  --radius-sm: ${identity.borderRadiusSm};
  --radius-md: ${identity.borderRadiusMd};
  --radius-lg: ${identity.borderRadiusLg};
  --radius-xl: ${identity.borderRadiusXl};
}
    `.trim();

    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to configure visual identity.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">Visual Identity</h1>
          <p className="mt-1 text-slate-400">
            Define your brand's complete visual language and design system.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSS}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Export CSS'}
          </button>
          <button
            onClick={saveIdentity}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-slate-900 rounded-lg hover:bg-primary-400 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
        {[
          { id: 'colors', label: 'Colors', icon: Palette },
          { id: 'typography', label: 'Typography', icon: Type },
          { id: 'spacing', label: 'Spacing', icon: Layout },
          { id: 'preview', label: 'Preview', icon: Eye },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
              activeTab === tab.id
                ? 'bg-slate-800 text-slate-200'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'colors' && (
            <>
              {/* Preset Palettes */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                  Preset Palettes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PRESET_PALETTES.map((palette) => (
                    <PaletteCard
                      key={palette.name}
                      palette={palette}
                      isSelected={identity.primaryColor === palette.colors.primary}
                      onClick={() => applyPalette(palette)}
                    />
                  ))}
                </div>
              </div>

              {/* Color Configuration */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-200">
                    Custom Colors
                  </h2>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300"
                  >
                    {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    {isDarkMode ? 'Dark' : 'Light'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Primary Color"
                    value={identity.primaryColor || '#C8FF2E'}
                    onChange={(v) => setIdentity((p) => ({ ...p, primaryColor: v }))}
                    description="Main brand color for CTAs and highlights"
                  />
                  <ColorPicker
                    label="Secondary Color"
                    value={identity.secondaryColor || '#1E293B'}
                    onChange={(v) => setIdentity((p) => ({ ...p, secondaryColor: v }))}
                    description="Supporting color for backgrounds"
                  />
                  <ColorPicker
                    label="Accent Color"
                    value={identity.accentColor || '#22D3EE'}
                    onChange={(v) => setIdentity((p) => ({ ...p, accentColor: v }))}
                    description="Accent for special highlights"
                  />
                  <ColorPicker
                    label="Background Color"
                    value={identity.backgroundColor || '#0D1117'}
                    onChange={(v) => setIdentity((p) => ({ ...p, backgroundColor: v }))}
                    description="Page background color"
                  />
                  <ColorPicker
                    label="Surface Color"
                    value={identity.surfaceColor || '#161B22'}
                    onChange={(v) => setIdentity((p) => ({ ...p, surfaceColor: v }))}
                    description="Card and component backgrounds"
                  />
                  <ColorPicker
                    label="Text Color"
                    value={identity.textColor || '#E6EDF3'}
                    onChange={(v) => setIdentity((p) => ({ ...p, textColor: v }))}
                    description="Primary text color"
                  />
                  <ColorPicker
                    label="Text Muted"
                    value={identity.textMutedColor || '#8B949E'}
                    onChange={(v) => setIdentity((p) => ({ ...p, textMutedColor: v }))}
                    description="Secondary text color"
                  />
                  <ColorPicker
                    label="Success Color"
                    value={identity.successColor || '#3FB950'}
                    onChange={(v) => setIdentity((p) => ({ ...p, successColor: v }))}
                    description="Success states and confirmations"
                  />
                  <ColorPicker
                    label="Warning Color"
                    value={identity.warningColor || '#D29922'}
                    onChange={(v) => setIdentity((p) => ({ ...p, warningColor: v }))}
                    description="Warning states"
                  />
                  <ColorPicker
                    label="Error Color"
                    value={identity.errorColor || '#F85149'}
                    onChange={(v) => setIdentity((p) => ({ ...p, errorColor: v }))}
                    description="Error states and alerts"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'typography' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-200">Typography System</h2>

              <FontSelector
                label="Heading Font"
                value={identity.headingFont || 'Inter'}
                onChange={(v) => setIdentity((p) => ({ ...p, headingFont: v }))}
                previewText="The quick brown fox jumps over the lazy dog"
                description="Used for headings and titles"
              />

              <FontSelector
                label="Body Font"
                value={identity.bodyFont || 'Inter'}
                onChange={(v) => setIdentity((p) => ({ ...p, bodyFont: v }))}
                previewText="The quick brown fox jumps over the lazy dog"
                description="Used for body text and paragraphs"
              />

              <FontSelector
                label="Accent Font"
                value={identity.accentFont || 'Playfair Display'}
                onChange={(v) => setIdentity((p) => ({ ...p, accentFont: v }))}
                previewText="Elegant & Sophisticated"
                description="Used for special accents and quotes"
              />

              <FontSelector
                label="Monospace Font"
                value={identity.monoFont || 'JetBrains Mono'}
                onChange={(v) => setIdentity((p) => ({ ...p, monoFont: v }))}
                previewText="const hello = 'world';"
                description="Used for code and technical content"
              />

              {/* Font Size Scale */}
              <div className="pt-6 border-t border-slate-800">
                <h3 className="font-medium text-slate-300 mb-4">Font Size Scale</h3>
                <div className="space-y-3">
                  {[
                    { key: 'fontSizeXs', label: 'XS', default: '0.75rem' },
                    { key: 'fontSizeSm', label: 'SM', default: '0.875rem' },
                    { key: 'fontSizeBase', label: 'Base', default: '1rem' },
                    { key: 'fontSizeLg', label: 'LG', default: '1.125rem' },
                    { key: 'fontSizeXl', label: 'XL', default: '1.25rem' },
                    { key: 'fontSize2xl', label: '2XL', default: '1.5rem' },
                    { key: 'fontSize3xl', label: '3XL', default: '1.875rem' },
                    { key: 'fontSize4xl', label: '4XL', default: '2.25rem' },
                  ].map((size) => (
                    <div key={size.key} className="flex items-center gap-4">
                      <span className="w-12 text-sm text-slate-500">{size.label}</span>
                      <input
                        type="text"
                        value={identity[size.key as keyof typeof identity] || size.default}
                        onChange={(e) =>
                          setIdentity((p) => ({ ...p, [size.key]: e.target.value }))
                        }
                        className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
                      />
                      <span
                        className="text-slate-400"
                        style={{
                          fontSize: identity[size.key as keyof typeof identity] || size.default,
                        }}
                      >
                        Aa
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spacing' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-200">Spacing System</h2>

              {/* Border Radius */}
              <div>
                <h3 className="font-medium text-slate-300 mb-4">Border Radius</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'borderRadiusSm', label: 'Small', default: '0.25rem' },
                    { key: 'borderRadiusMd', label: 'Medium', default: '0.5rem' },
                    { key: 'borderRadiusLg', label: 'Large', default: '0.75rem' },
                    { key: 'borderRadiusXl', label: 'Extra Large', default: '1rem' },
                  ].map((radius) => (
                    <div key={radius.key} className="space-y-2">
                      <label className="text-sm text-slate-400">{radius.label}</label>
                      <input
                        type="text"
                        value={identity[radius.key as keyof typeof identity] || radius.default}
                        onChange={(e) =>
                          setIdentity((p) => ({ ...p, [radius.key]: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
                      />
                      <div
                        className="h-12 bg-primary-500/20 border border-primary-500/50"
                        style={{
                          borderRadius: identity[radius.key as keyof typeof identity] || radius.default,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Heights */}
              <div className="pt-6 border-t border-slate-800">
                <h3 className="font-medium text-slate-300 mb-4">Line Heights</h3>
                <div className="space-y-3">
                  {[
                    { key: 'lineHeightTight', label: 'Tight', default: '1.25' },
                    { key: 'lineHeightNormal', label: 'Normal', default: '1.5' },
                    { key: 'lineHeightRelaxed', label: 'Relaxed', default: '1.75' },
                  ].map((lh) => (
                    <div key={lh.key} className="flex items-center gap-4">
                      <span className="w-20 text-sm text-slate-400">{lh.label}</span>
                      <input
                        type="text"
                        value={identity[lh.key as keyof typeof identity] || lh.default}
                        onChange={(e) =>
                          setIdentity((p) => ({ ...p, [lh.key]: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
                      />
                      <p
                        className="w-48 text-sm text-slate-400"
                        style={{
                          lineHeight: identity[lh.key as keyof typeof identity] || lh.default,
                        }}
                      >
                        Lorem ipsum dolor sit amet consectetur
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="pt-6 border-t border-slate-800">
                <h3 className="font-medium text-slate-300 mb-4">Letter Spacing</h3>
                <div className="space-y-3">
                  {[
                    { key: 'letterSpacingTight', label: 'Tight', default: '-0.025em' },
                    { key: 'letterSpacingNormal', label: 'Normal', default: '0' },
                    { key: 'letterSpacingWide', label: 'Wide', default: '0.025em' },
                  ].map((ls) => (
                    <div key={ls.key} className="flex items-center gap-4">
                      <span className="w-20 text-sm text-slate-400">{ls.label}</span>
                      <input
                        type="text"
                        value={identity[ls.key as keyof typeof identity] || ls.default}
                        onChange={(e) =>
                          setIdentity((p) => ({ ...p, [ls.key]: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
                      />
                      <span
                        className="text-lg text-slate-400"
                        style={{
                          letterSpacing: identity[ls.key as keyof typeof identity] || ls.default,
                        }}
                      >
                        SPACING
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <>
              <ComponentPreview identity={identity} />

              {/* Typography Samples */}
              <div
                className="p-6 rounded-xl border"
                style={{
                  backgroundColor: identity.surfaceColor || '#161B22',
                  borderColor: identity.secondaryColor || '#1E293B',
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: identity.textColor || '#E6EDF3',
                    fontFamily: identity.headingFont || 'Inter',
                  }}
                >
                  Typography Samples
                </h3>

                <div className="space-y-4">
                  <div>
                    <h1
                      style={{
                        fontSize: identity.fontSize4xl || '2.25rem',
                        fontFamily: identity.headingFont || 'Inter',
                        color: identity.textColor || '#E6EDF3',
                        lineHeight: identity.lineHeightTight || '1.25',
                      }}
                    >
                      Heading 1 (4XL)
                    </h1>
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: identity.fontSize3xl || '1.875rem',
                        fontFamily: identity.headingFont || 'Inter',
                        color: identity.textColor || '#E6EDF3',
                        lineHeight: identity.lineHeightTight || '1.25',
                      }}
                    >
                      Heading 2 (3XL)
                    </h2>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: identity.fontSize2xl || '1.5rem',
                        fontFamily: identity.headingFont || 'Inter',
                        color: identity.textColor || '#E6EDF3',
                        lineHeight: identity.lineHeightNormal || '1.5',
                      }}
                    >
                      Heading 3 (2XL)
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: identity.fontSizeBase || '1rem',
                      fontFamily: identity.bodyFont || 'Inter',
                      color: identity.textColor || '#E6EDF3',
                      lineHeight: identity.lineHeightNormal || '1.5',
                    }}
                  >
                    This is body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <p
                    style={{
                      fontSize: identity.fontSizeSm || '0.875rem',
                      fontFamily: identity.bodyFont || 'Inter',
                      color: identity.textMutedColor || '#8B949E',
                      lineHeight: identity.lineHeightNormal || '1.5',
                    }}
                  >
                    This is small/muted text used for secondary information and captions.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Color Summary */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold text-slate-200 mb-4">Color Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Primary', color: identity.primaryColor },
                { label: 'Secondary', color: identity.secondaryColor },
                { label: 'Accent', color: identity.accentColor },
                { label: 'Background', color: identity.backgroundColor },
                { label: 'Surface', color: identity.surfaceColor },
                { label: 'Text', color: identity.textColor },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border border-slate-700"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="ml-auto text-xs font-mono text-slate-500">
                    {item.color?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Summary */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold text-slate-200 mb-4">Typography</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Heading</span>
                <span
                  className="text-slate-300"
                  style={{ fontFamily: identity.headingFont }}
                >
                  {identity.headingFont}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Body</span>
                <span
                  className="text-slate-300"
                  style={{ fontFamily: identity.bodyFont }}
                >
                  {identity.bodyFont}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Accent</span>
                <span
                  className="text-slate-300"
                  style={{ fontFamily: identity.accentFont }}
                >
                  {identity.accentFont}
                </span>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <AccessibilityChecker identity={identity} />
        </div>
      </div>
    </div>
  );
}
