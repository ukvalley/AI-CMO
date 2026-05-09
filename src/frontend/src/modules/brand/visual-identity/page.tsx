/**
 * Visual Identity Module - Enhanced with Brand Wizard
 *
 * Choose between Preset Mode (wizard + suggestions) or Custom Mode (full control).
 */

'use client';

import React, { useState, useEffect } from 'react';
import { moduleDataApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import { Palette, Type, Layout, Eye, Sparkles, Moon, Sun, AlertCircle, CheckCircle2, ArrowLeft, Wand2, Settings, LayoutGrid, Check, Smartphone, FileText, CreditCard } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BrandWizard, Suggestions, WizardAnswers } from './components/BrandWizard';
import { DashboardPreview } from './components/DashboardPreview';
import { MobileAppPreview } from './components/MobileAppPreview';
import { FlyerPreview } from './components/FlyerPreview';
import { VisitingCardPreview } from './components/VisitingCardPreview';
import { PRESET_PALETTES, GOOGLE_FONTS, FONT_COMBINATIONS, ICON_STYLES, IMAGE_STYLES, COMPLETE_TEMPLATES, CompleteTemplate, IconStyle, ImageStyle } from './components/data';

// ============================================
// TYPES
// ============================================

interface VisualIdentity {
  id?: string;
  companyId: string;
  mode: 'preset' | 'custom';
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
  // Typography Spacing
  headingLineHeight: string;
  bodyLineHeight: string;
  headingLetterSpacing: string;
  bodyLetterSpacing: string;
  // Border Radius
  borderRadiusSm: string;
  borderRadiusMd: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
  // Spacing (new)
  sectionSpacing: string;
  componentSpacing: string;
  elementSpacing: string;
  // Icon Style (new)
  iconStyle: IconStyle;
  // Image Style (new)
  imageStyle: ImageStyle;
  // Wizard answers (for preset mode)
  wizardAnswers?: WizardAnswers;
  // Selected template (for preset mode)
  selectedTemplateId?: string;
}

// ============================================
// UTILITY FUNCTIONS
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

// ============================================
// COMPONENTS
// ============================================

function ColorPicker({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer bg-transparent disabled:opacity-50"
          />
        </div>
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm font-mono uppercase disabled:opacity-50"
        />
      </div>
    </div>
  );
}

// Sample text for font preview
const FONT_PREVIEW_TEXT = 'The quick brown fox jumps over the lazy dog';
const FONT_PREVIEW_TEXT_ALT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function FontSelector({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredFonts = GOOGLE_FONTS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-slate-600 transition-colors flex items-center justify-between disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: value }} className="text-slate-200 text-lg">
            {value}
          </span>
          <span
            style={{ fontFamily: value }}
            className="text-slate-400 text-sm truncate max-w-[200px]"
          >
            {FONT_PREVIEW_TEXT.slice(0, 20)}...
          </span>
        </div>
        <span className="text-slate-500">▼</span>
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-[500px] overflow-y-auto">
            <div className="p-2 sticky top-0 bg-slate-800 border-b border-slate-700">
              <input
                type="text"
                placeholder="Search fonts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200"
              />
            </div>
            {filteredFonts.map((font) => (
              <button
                key={font.name}
                onClick={() => {
                  onChange(font.name);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={cn(
                  'w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-0',
                  value === font.name && 'bg-slate-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 font-mono">{font.name}</span>
                      {font.popular && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary-500/20 text-primary-400 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: font.name }} className="text-slate-200"
                    >
                      <p className="text-base mb-0.5">{FONT_PREVIEW_TEXT}</p>
                      <p className="text-xs text-slate-500">{FONT_PREVIEW_TEXT_ALT}</p>
                    </div>
                  </div>
                  {value === font.name && (
                    <CheckCircle2 className="w-5 h-5 text-primary-500 ml-3 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Template Selector Component
function TemplateSelector({
  currentTemplateId,
  currentColors,
  onSelectTemplate,
}: {
  currentTemplateId?: string;
  currentColors: { primary: string; secondary: string; accent: string };
  onSelectTemplate: (template: typeof COMPLETE_TEMPLATES[0]) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Finance' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'education', name: 'Education' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? COMPLETE_TEMPLATES
    : COMPLETE_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Templates</h2>
          <p className="text-sm text-slate-500">
            Click any template to apply it instantly. Switch to Preset mode first.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              selectedCategory === cat.id
                ? 'bg-primary-500 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const isSelected = currentTemplateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={cn(
                'relative p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]',
                isSelected
                  ? 'border-primary-500 bg-slate-800 ring-2 ring-primary-500/30'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
              )}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-slate-900" />
                </div>
              )}

              {/* Color Preview */}
              <div className="flex gap-1 mb-3">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: template.colors.primary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: template.colors.secondary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: template.colors.accent }}
                />
              </div>

              {/* Template Name */}
              <p className="font-medium text-slate-200 mb-1">{template.name}</p>
              <p className="text-xs text-slate-500 mb-2">{template.description}</p>

              {/* Category Badge */}
              <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded bg-slate-800 text-slate-400">
                {template.category}
              </span>

              {/* Spacing Info */}
              <div className="mt-2 pt-2 border-t border-slate-700/50 flex gap-2 text-[10px] text-slate-500">
                <span>S: {template.spacing.section}</span>
                <span>C: {template.spacing.component}</span>
                <span>E: {template.spacing.element}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Spacing Slider Component
function SpacingSelector({
  label,
  value,
  onChange,
  min,
  max,
  step,
  presets,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  presets: string[];
  disabled?: boolean;
}) {
  const numericValue = parseFloat(value) || 0;
  const unit = value.replace(/[0-9.]/g, '') || 'rem';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(`${e.target.value}${unit}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-mono text-slate-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 accent-primary-500"
      />
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => !disabled && onChange(preset)}
            disabled={disabled}
            className={cn(
              'px-2 py-1 text-xs rounded border transition-colors',
              value === preset
                ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

// Icon Style Selector Component
function IconStyleSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: IconStyle;
  onChange: (style: IconStyle) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">Icon Style</label>
      <div className="grid grid-cols-2 gap-3">
        {ICON_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => !disabled && onChange(style)}
            disabled={disabled}
            className={cn(
              'p-3 rounded-xl border-2 text-left transition-all',
              value.id === style.id
                ? 'border-primary-500 bg-slate-800'
                : 'border-slate-700 hover:border-slate-600 bg-slate-900/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={style.style === 'filled' ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={style.strokeWidth}
                className="text-slate-400"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="font-medium text-slate-200 text-sm">{style.name}</span>
            </div>
            <p className="text-xs text-slate-500">{style.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Image Style Selector Component
function ImageStyleSelector({
  value,
  onChange,
  disabled = false,
  primaryColor,
}: {
  value: ImageStyle;
  onChange: (style: ImageStyle) => void;
  disabled?: boolean;
  primaryColor: string;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">Image Style</label>
      <div className="grid grid-cols-2 gap-3">
        {IMAGE_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => !disabled && onChange(style)}
            disabled={disabled}
            className={cn(
              'p-3 rounded-xl border-2 text-left transition-all',
              value.id === style.id
                ? 'border-primary-500 bg-slate-800'
                : 'border-slate-700 hover:border-slate-600 bg-slate-900/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className="w-full h-12 mb-2 bg-slate-700 flex items-center justify-center"
              style={{
                borderRadius: style.borderRadius,
                border: style.border === 'none' ? 'none' : `${style.border} ${primaryColor}`,
                boxShadow: style.shadow,
              }}
            >
              <span className="text-xs text-slate-400">Preview</span>
            </div>
            <span className="font-medium text-slate-200 text-sm block">{style.name}</span>
            <span className="text-xs text-slate-500">{style.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AccessibilityChecker({ identity }: { identity: VisualIdentity }) {
  const checks = [
    {
      name: 'Text on background',
      background: identity.backgroundColor,
      foreground: identity.textColor,
    },
    {
      name: 'Primary on background',
      background: identity.backgroundColor,
      foreground: identity.primaryColor,
    },
    {
      name: 'Muted text on surface',
      background: identity.surfaceColor,
      foreground: identity.textMutedColor,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-200 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Accessibility
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [previewType, setPreviewType] = useState<'dashboard' | 'mobile' | 'flyer' | 'card'>('dashboard');
  const [wizardComplete, setWizardComplete] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'visuals' | 'templates' | 'preview'>('colors');

  const defaultIdentity: VisualIdentity = {
    companyId: companyId || '',
    mode: 'preset',
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
    // Typography Spacing
    headingLineHeight: '1.2',
    bodyLineHeight: '1.6',
    headingLetterSpacing: '-0.02em',
    bodyLetterSpacing: '0',
    borderRadiusSm: '0.25rem',
    borderRadiusMd: '0.5rem',
    borderRadiusLg: '0.75rem',
    borderRadiusXl: '1rem',
    sectionSpacing: '3rem',
    componentSpacing: '1rem',
    elementSpacing: '0.5rem',
    iconStyle: ICON_STYLES[1], // regular-outline
    imageStyle: IMAGE_STYLES[2], // modern-rounded
  };

  const [identity, setIdentity] = useState<VisualIdentity>(defaultIdentity);

  // Load existing data
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await moduleDataApi.get('visual-identity', companyId);
        // Backend returns data directly, not wrapped in { data: ... }
        const savedData = response.data;
        if (savedData && Object.keys(savedData).length > 0) {
          setIdentity({ ...defaultIdentity, ...savedData });
          // Data exists - don't show wizard, show saved config
          setShowWizard(false);
        } else {
          // No existing data - show wizard for first-time setup
          setShowWizard(true);
        }
      } catch (error) {
        setShowWizard(true);
      }
      setLoading(false);
    };

    loadData();
  }, [companyId]);

  // Handle wizard completion
  const handleWizardComplete = (answers: WizardAnswers) => {
    setWizardAnswers(answers);
    setWizardComplete(true);
  };

  // Select palette (just for preview/storing, not global app theme)
  const handleSelectPalette = (palette: typeof PRESET_PALETTES[0]) => {
    const newIdentity: VisualIdentity = {
      ...identity,
      mode: 'preset',
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
    };
    setIdentity(newIdentity);
    // Note: We do NOT apply to global theme - this is just brand config storage
  };

  // Select fonts (just for preview/storing, not global app theme)
  const handleSelectFonts = (fonts: typeof FONT_COMBINATIONS[0]) => {
    setIdentity((prev) => ({
      ...prev,
      headingFont: fonts.heading,
      bodyFont: fonts.body,
      accentFont: fonts.accent,
      monoFont: fonts.mono,
    }));
    // Note: We do NOT apply to global theme - this is just brand config storage
  };

  // Save BOTH palette and fonts to brand configuration
  const handleSaveBoth = async (palette: typeof PRESET_PALETTES[0], fonts: typeof FONT_COMBINATIONS[0]) => {
    // Find template for this palette to get spacing, icon, and image defaults
    const template = COMPLETE_TEMPLATES.find((t) => t.id === palette.id);

    const newIdentity: VisualIdentity = {
      ...identity,
      mode: 'preset',
      selectedTemplateId: palette.id,
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
      headingFont: fonts.heading,
      bodyFont: fonts.body,
      accentFont: fonts.accent,
      monoFont: fonts.mono,
      // In template mode, use template defaults for spacing, icons, and images
      sectionSpacing: template?.spacing?.section || '3rem',
      componentSpacing: template?.spacing?.component || '1rem',
      elementSpacing: template?.spacing?.element || '0.5rem',
      iconStyle: template?.iconStyle || ICON_STYLES[1],
      imageStyle: template?.imageStyle || IMAGE_STYLES[2],
      // Typography defaults from template
      headingLineHeight: template?.fonts?.headingLineHeight || '1.2',
      bodyLineHeight: template?.fonts?.bodyLineHeight || '1.6',
      headingLetterSpacing: template?.fonts?.headingLetterSpacing || '-0.02em',
      bodyLetterSpacing: template?.fonts?.bodyLetterSpacing || '0',
    };
    setIdentity(newIdentity);
    // Save to module data only - do NOT apply globally to Mengo app
    if (companyId) {
      try {
        const response = await moduleDataApi.save('visual-identity', {
          companyId,
          data: newIdentity,
        });
        if (response.error) {
          console.error('Failed to save:', response.error);
        }
      } catch (error) {
        console.error('Error saving:', error);
      }
    }
    // Close wizard and show main editor
    setShowWizard(false);
    setWizardComplete(false);
  };

  // Switch to custom mode
  const handleCustomize = () => {
    setIdentity((prev: VisualIdentity) => ({ ...prev, mode: 'custom' }));
    setShowWizard(false);
    setWizardComplete(false);
  };

  // Switch to preset mode (re-run wizard)
  const handlePresetMode = () => {
    setShowWizard(true);
    setWizardComplete(false);
  };

  // Save identity
  const saveIdentity = async () => {
    if (!companyId) return;
    setSaving(true);
    setShowSuccess(false);
    try {
      const response = await moduleDataApi.save('visual-identity', {
        companyId,
        data: identity,
      });
      if (response.error) {
        console.error('Failed to save visual identity:', response.error);
        alert('Failed to save: ' + response.error);
      } else {
        console.log('Visual identity saved successfully');
        setShowSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving visual identity:', error);
      alert('Error saving visual identity');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to configure visual identity.</p>
      </div>
    );
  }

  // Show Wizard
  if (showWizard && !wizardComplete) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Visual Identity Wizard</h1>
          <p className="text-slate-400">Answer a few questions to get personalized suggestions</p>
        </div>
        <BrandWizard
          onComplete={handleWizardComplete}
          onSkip={handleCustomize}
        />
      </div>
    );
  }

  // Show Suggestions after wizard
  if (wizardComplete && wizardAnswers) {
    return (
      <div className="max-w-5xl mx-auto">
        <Suggestions
          answers={wizardAnswers}
          onSelectPalette={handleSelectPalette}
          onSelectFonts={handleSelectFonts}
          onSaveBoth={handleSaveBoth}
          onCustomize={handleCustomize}
        />
      </div>
    );
  }

  // Main Editor
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">Visual Identity</h1>
          <p className="mt-1 text-slate-400">
            {identity.mode === 'preset'
              ? 'Preset Mode - Based on wizard suggestions'
              : 'Custom Mode - Full control over all settings'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-800">
            <button
              onClick={handlePresetMode}
              title="Run wizard again to get new suggestions"
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                identity.mode === 'preset'
                  ? 'bg-slate-800 text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Wand2 className="w-4 h-4" />
              Run Wizard
            </button>
            <button
              onClick={handleCustomize}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                identity.mode === 'custom'
                  ? 'bg-slate-800 text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Settings className="w-4 h-4" />
              Custom
            </button>
          </div>

          <div className="flex items-center gap-3">
            {showSuccess && (
              <span className="flex items-center gap-1.5 text-sm text-green-400 animate-in fade-in slide-in-from-right-2 duration-300">
                <Check className="w-4 h-4" />
                Saved successfully
              </span>
            )}
            <button
              onClick={saveIdentity}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-slate-900 rounded-lg hover:bg-primary-400 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Banner */}
      {identity.mode === 'preset' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <div className="flex-1">
            <p className="text-blue-200 text-sm">
              You're in Preset Mode. Custom color editing is disabled.
              <button onClick={handleCustomize} className="ml-2 underline hover:text-blue-100">
                Switch to Custom Mode
              </button>
              for full control.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800 flex-wrap">
        {[
          { id: 'colors', label: 'Colors', icon: Palette },
          { id: 'typography', label: 'Typography', icon: Type },
          { id: 'spacing', label: 'Spacing', icon: Layout },
          { id: 'visuals', label: 'Visuals', icon: Sparkles },
          { id: 'templates', label: 'Templates', icon: LayoutGrid },
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-6">Color Palette</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ColorPicker
                  label="Primary Color"
                  value={identity.primaryColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, primaryColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <ColorPicker
                  label="Secondary Color"
                  value={identity.secondaryColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, secondaryColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <ColorPicker
                  label="Accent Color"
                  value={identity.accentColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, accentColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <ColorPicker
                  label="Background Color"
                  value={identity.backgroundColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, backgroundColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <ColorPicker
                  label="Surface Color"
                  value={identity.surfaceColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, surfaceColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <ColorPicker
                  label="Text Color"
                  value={identity.textColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, textColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <ColorPicker
                  label="Text Muted"
                  value={identity.textMutedColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, textMutedColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <ColorPicker
                  label="Success Color"
                  value={identity.successColor}
                  onChange={(v) => setIdentity((p) => ({ ...p, successColor: v }))}
                  disabled={identity.mode === 'preset'}
                />
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-6">
              {/* Font Selectors */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-200">Typography</h2>
                  {identity.mode === 'preset' && (
                    <p className="text-sm text-slate-500">
                      Fonts are preset from template. Switch to Custom mode to change.
                    </p>
                  )}
                </div>

                <FontSelector
                  label="Heading Font"
                  value={identity.headingFont}
                  onChange={(v) => setIdentity((p) => ({ ...p, headingFont: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <FontSelector
                  label="Body Font"
                  value={identity.bodyFont}
                  onChange={(v) => setIdentity((p) => ({ ...p, bodyFont: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <FontSelector
                  label="Accent Font"
                  value={identity.accentFont}
                  onChange={(v) => setIdentity((p) => ({ ...p, accentFont: v }))}
                  disabled={identity.mode === 'preset'}
                />
                <FontSelector
                  label="Monospace Font"
                  value={identity.monoFont}
                  onChange={(v) => setIdentity((p) => ({ ...p, monoFont: v }))}
                  disabled={identity.mode === 'preset'}
                />
              </div>

              {/* Typography Spacing */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-200">Typography Spacing</h2>
                  {identity.mode === 'preset' && (
                    <p className="text-sm text-slate-500">
                      Spacing is preset from template. Switch to Custom mode to change.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Heading Line Height */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Heading Line Height</label>
                    <input
                      type="range"
                      min="1"
                      max="2"
                      step="0.05"
                      value={identity.headingLineHeight}
                      onChange={(e) => setIdentity((p) => ({ ...p, headingLineHeight: e.target.value }))}
                      disabled={identity.mode === 'preset'}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1.0</span>
                      <span className="text-slate-300 font-mono">{identity.headingLineHeight}</span>
                      <span>2.0</span>
                    </div>
                  </div>

                  {/* Body Line Height */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Body Line Height</label>
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.05"
                      value={identity.bodyLineHeight}
                      onChange={(e) => setIdentity((p) => ({ ...p, bodyLineHeight: e.target.value }))}
                      disabled={identity.mode === 'preset'}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1.0</span>
                      <span className="text-slate-300 font-mono">{identity.bodyLineHeight}</span>
                      <span>2.5</span>
                    </div>
                  </div>

                  {/* Heading Letter Spacing */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Heading Letter Spacing</label>
                    <input
                      type="range"
                      min="-0.05"
                      max="0.1"
                      step="0.01"
                      value={parseFloat(identity.headingLetterSpacing)}
                      onChange={(e) => setIdentity((p) => ({ ...p, headingLetterSpacing: `${parseFloat(e.target.value).toFixed(2)}em` }))}
                      disabled={identity.mode === 'preset'}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>-0.05em</span>
                      <span className="text-slate-300 font-mono">{identity.headingLetterSpacing}</span>
                      <span>0.1em</span>
                    </div>
                  </div>

                  {/* Body Letter Spacing */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Body Letter Spacing</label>
                    <input
                      type="range"
                      min="-0.02"
                      max="0.05"
                      step="0.005"
                      value={parseFloat(identity.bodyLetterSpacing)}
                      onChange={(e) => setIdentity((p) => ({ ...p, bodyLetterSpacing: `${parseFloat(e.target.value).toFixed(3)}em` }))}
                      disabled={identity.mode === 'preset'}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>-0.02em</span>
                      <span className="text-slate-300 font-mono">{identity.bodyLetterSpacing}</span>
                      <span>0.05em</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Preview */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-6">Live Font Preview</h3>

                <div
                  className="p-6 rounded-lg border-2 border-dashed space-y-6"
                  style={{
                    borderColor: identity.secondaryColor,
                    backgroundColor: identity.backgroundColor,
                  }}
                >
                  {/* Heading Preview */}
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                      Heading Font: {identity.headingFont}
                    </span>
                    <h1
                      style={{
                        fontFamily: identity.headingFont,
                        color: identity.textColor,
                        lineHeight: identity.headingLineHeight,
                        letterSpacing: identity.headingLetterSpacing,
                      }}
                      className="text-4xl font-bold"
                    >
                      The Quick Brown Fox
                    </h1>
                    <h2
                      style={{
                        fontFamily: identity.headingFont,
                        color: identity.textColor,
                        lineHeight: identity.headingLineHeight,
                        letterSpacing: identity.headingLetterSpacing,
                      }}
                      className="text-2xl mt-2"
                    >
                      Jumps Over The Lazy Dog
                    </h2>
                  </div>

                  {/* Body Preview */}
                  <div className="pt-4 border-t" style={{ borderColor: identity.secondaryColor }}>
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                      Body Font: {identity.bodyFont}
                    </span>
                    <p
                      style={{
                        fontFamily: identity.bodyFont,
                        color: identity.textMutedColor,
                        lineHeight: identity.bodyLineHeight,
                        letterSpacing: identity.bodyLetterSpacing,
                      }}
                      className="text-base"
                    >
                      The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
                      How vexingly quick daft zebras jump! Sphinx of black quartz, judge my vow.
                    </p>
                  </div>

                  {/* Accent Preview */}
                  <div className="pt-4 border-t" style={{ borderColor: identity.secondaryColor }}>
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                      Accent Font: {identity.accentFont}
                    </span>
                    <p
                      style={{
                        fontFamily: identity.accentFont,
                        color: identity.accentColor,
                      }}
                      className="text-xl italic"
                    >
                      "Beautiful typography makes the design"
                    </p>
                  </div>

                  {/* Monospace Preview */}
                  <div className="pt-4 border-t" style={{ borderColor: identity.secondaryColor }}>
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                      Monospace Font: {identity.monoFont}
                    </span>
                    <code
                      style={{
                        fontFamily: identity.monoFont,
                        color: identity.primaryColor,
                        backgroundColor: identity.surfaceColor,
                      }}
                      className="text-sm px-3 py-2 rounded block"
                    >
                      const fontFamily = '{identity.monoFont}';
                      console.log('Hello World!');
                    </code>
                  </div>

                  {/* Typography Scale */}
                  <div className="pt-4 border-t" style={{ borderColor: identity.secondaryColor }}>
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-3 block">
                      Type Scale
                    </span>
                    <div className="space-y-2">
                      {['3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'].map((size, i) => {
                        const sizes: Record<string, string> = {
                          '3xl': '1.875rem',
                          '2xl': '1.5rem',
                          xl: '1.25rem',
                          lg: '1.125rem',
                          base: '1rem',
                          sm: '0.875rem',
                          xs: '0.75rem',
                        };
                        return (
                          <div key={size} className="flex items-center gap-4">
                            <span className="text-xs text-slate-500 w-12">{size}</span>
                            <span
                              style={{
                                fontFamily: identity.bodyFont,
                                fontSize: sizes[size],
                                color: identity.textColor,
                              }}
                            >
                              The quick brown fox
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spacing' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">Spacing</h2>
                {identity.mode === 'preset' && (
                  <p className="text-sm text-slate-500">
                    Using template defaults. Switch to Custom mode to adjust.
                  </p>
                )}
              </div>

              <SpacingSelector
                label="Section Spacing"
                value={identity.sectionSpacing}
                onChange={(v) => setIdentity((p) => ({ ...p, sectionSpacing: v }))}
                min={3}
                max={8}
                step={0.5}
                presets={['3rem', '4rem', '5rem', '6rem', '7rem', '8rem']}
                disabled={identity.mode === 'preset'}
              />

              <SpacingSelector
                label="Component Spacing"
                value={identity.componentSpacing}
                onChange={(v) => setIdentity((p) => ({ ...p, componentSpacing: v }))}
                min={1}
                max={4}
                step={0.25}
                presets={['1rem', '1.5rem', '2rem', '2.5rem', '3rem', '4rem']}
                disabled={identity.mode === 'preset'}
              />

              <SpacingSelector
                label="Element Spacing"
                value={identity.elementSpacing}
                onChange={(v) => setIdentity((p) => ({ ...p, elementSpacing: v }))}
                min={0.25}
                max={2}
                step={0.25}
                presets={['0.25rem', '0.5rem', '0.75rem', '1rem', '1.5rem', '2rem']}
                disabled={identity.mode === 'preset'}
              />

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Spacing Preview</h3>
                <div
                  className="p-4 rounded-lg border-2 border-dashed border-slate-700"
                  style={{ backgroundColor: identity.surfaceColor }}
                >
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: identity.backgroundColor,
                      borderColor: identity.secondaryColor,
                      marginBottom: identity.sectionSpacing,
                    }}
                  >
                    <span className="text-xs text-slate-500">Section</span>
                    <div
                      className="p-3 rounded border mt-2"
                      style={{
                        backgroundColor: identity.surfaceColor,
                        borderColor: identity.secondaryColor,
                        marginBottom: identity.componentSpacing,
                      }}
                    >
                      <span className="text-xs text-slate-500">Component</span>
                      <div className="flex gap-2 mt-2">
                        <div
                          className="px-3 py-2 rounded text-xs"
                          style={{
                            backgroundColor: `${identity.primaryColor}20`,
                            color: identity.primaryColor,
                          }}
                        >
                          Element
                        </div>
                        <div
                          className="px-3 py-2 rounded text-xs"
                          style={{
                            backgroundColor: `${identity.primaryColor}20`,
                            color: identity.primaryColor,
                          }}
                        >
                          Element
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visuals' && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">Visual Styles</h2>
                {identity.mode === 'preset' && (
                  <p className="text-sm text-slate-500">
                    Using template defaults. Switch to Custom mode to adjust.
                  </p>
                )}
              </div>

              <IconStyleSelector
                value={identity.iconStyle}
                onChange={(style) => setIdentity((p) => ({ ...p, iconStyle: style }))}
                disabled={identity.mode === 'preset'}
              />

              <div className="pt-4 border-t border-slate-800">
                <ImageStyleSelector
                  value={identity.imageStyle}
                  onChange={(style) => setIdentity((p) => ({ ...p, imageStyle: style }))}
                  disabled={identity.mode === 'preset'}
                  primaryColor={identity.primaryColor}
                />
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <TemplateSelector
              currentTemplateId={identity.selectedTemplateId}
              currentColors={{
                primary: identity.primaryColor,
                secondary: identity.secondaryColor,
                accent: identity.accentColor,
              }}
              onSelectTemplate={(template) => {
                setIdentity((prev) => ({
                  ...prev,
                  mode: 'preset',
                  selectedTemplateId: template.id,
                  primaryColor: template.colors.primary,
                  secondaryColor: template.colors.secondary,
                  accentColor: template.colors.accent,
                  backgroundColor: template.colors.background,
                  surfaceColor: template.colors.surface,
                  textColor: template.colors.text,
                  textMutedColor: template.colors.textMuted,
                  successColor: template.colors.success,
                  warningColor: template.colors.warning,
                  errorColor: template.colors.error,
                  infoColor: template.colors.info,
                  headingFont: template.fonts.heading,
                  bodyFont: template.fonts.body,
                  accentFont: template.fonts.accent,
                  monoFont: template.fonts.mono,
                  sectionSpacing: template.spacing.section,
                  componentSpacing: template.spacing.component,
                  elementSpacing: template.spacing.element,
                  iconStyle: template.iconStyle,
                  imageStyle: template.imageStyle,
                  headingLineHeight: template.fonts.headingLineHeight || '1.2',
                  bodyLineHeight: template.fonts.bodyLineHeight || '1.6',
                  headingLetterSpacing: template.fonts.headingLetterSpacing || '-0.02em',
                  bodyLetterSpacing: template.fonts.bodyLetterSpacing || '0',
                }));
              }}
            />
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Preview Disclaimer */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-400">
                  <span className="font-semibold">Note:</span> These previews are for demonstration purposes only. Actual results may vary based on implementation.
                </p>
              </div>
              {/* Preview Type Selector */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-400 mr-2">Preview:</span>
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Layout },
                  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
                  { id: 'flyer', label: 'Flyer', icon: FileText },
                  { id: 'card', label: 'Visiting Card', icon: CreditCard },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setPreviewType(type.id as typeof previewType)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      previewType === type.id
                        ? 'bg-primary-500 text-slate-900'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    )}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Preview Content */}
              <div className="overflow-x-auto">
                {previewType === 'dashboard' && (
                  <DashboardPreview
                    scale={0.55}
                    onOpenNewTab={() => {
                      sessionStorage.setItem('preview-identity', JSON.stringify(identity));
                      window.open('/brand/visual-identity/preview', '_blank');
                    }}
                    colors={{
                      primary: identity.primaryColor,
                      secondary: identity.secondaryColor,
                      accent: identity.accentColor,
                      background: identity.backgroundColor,
                      surface: identity.surfaceColor,
                      text: identity.textColor,
                      textMuted: identity.textMutedColor,
                      success: identity.successColor,
                      warning: identity.warningColor,
                      error: identity.errorColor,
                      info: identity.infoColor,
                    }}
                    fonts={{
                      heading: identity.headingFont,
                      body: identity.bodyFont,
                      accent: identity.accentFont,
                      mono: identity.monoFont,
                    }}
                    typography={{
                      headingLineHeight: identity.headingLineHeight,
                      bodyLineHeight: identity.bodyLineHeight,
                      headingLetterSpacing: identity.headingLetterSpacing,
                      bodyLetterSpacing: identity.bodyLetterSpacing,
                    }}
                    borderRadius={{
                      sm: identity.borderRadiusSm,
                      md: identity.borderRadiusMd,
                      lg: identity.borderRadiusLg,
                      xl: identity.borderRadiusXl,
                    }}
                    spacing={{
                      section: identity.sectionSpacing,
                      component: identity.componentSpacing,
                      element: identity.elementSpacing,
                    }}
                    iconStyle={identity.iconStyle}
                    imageStyle={identity.imageStyle}
                  />
                )}

                {previewType === 'mobile' && (
                  <div className="flex justify-center">
                    <MobileAppPreview
                      colors={{
                        primary: identity.primaryColor,
                        secondary: identity.secondaryColor,
                        accent: identity.accentColor,
                        background: identity.backgroundColor,
                        surface: identity.surfaceColor,
                        text: identity.textColor,
                        textMuted: identity.textMutedColor,
                        success: identity.successColor,
                        warning: identity.warningColor,
                        error: identity.errorColor,
                        info: identity.infoColor,
                      }}
                      fonts={{
                        heading: identity.headingFont,
                        body: identity.bodyFont,
                        accent: identity.accentFont,
                        mono: identity.monoFont,
                      }}
                      borderRadius={{
                        sm: identity.borderRadiusSm,
                        md: identity.borderRadiusMd,
                        lg: identity.borderRadiusLg,
                        xl: identity.borderRadiusXl,
                      }}
                      iconStyle={identity.iconStyle}
                      imageStyle={identity.imageStyle}
                    />
                  </div>
                )}

                {previewType === 'flyer' && (
                  <div className="flex justify-center">
                    <FlyerPreview
                      colors={{
                        primary: identity.primaryColor,
                        secondary: identity.secondaryColor,
                        accent: identity.accentColor,
                        background: identity.backgroundColor,
                        surface: identity.surfaceColor,
                        text: identity.textColor,
                        textMuted: identity.textMutedColor,
                        success: identity.successColor,
                        warning: identity.warningColor,
                        error: identity.errorColor,
                        info: identity.infoColor,
                      }}
                      fonts={{
                        heading: identity.headingFont,
                        body: identity.bodyFont,
                        accent: identity.accentFont,
                        mono: identity.monoFont,
                      }}
                      borderRadius={{
                        sm: identity.borderRadiusSm,
                        md: identity.borderRadiusMd,
                        lg: identity.borderRadiusLg,
                        xl: identity.borderRadiusXl,
                      }}
                      iconStyle={identity.iconStyle}
                      imageStyle={identity.imageStyle}
                    />
                  </div>
                )}

                {previewType === 'card' && (
                  <div className="flex justify-center">
                    <VisitingCardPreview
                      colors={{
                        primary: identity.primaryColor,
                        secondary: identity.secondaryColor,
                        accent: identity.accentColor,
                        background: identity.backgroundColor,
                        surface: identity.surfaceColor,
                        text: identity.textColor,
                        textMuted: identity.textMutedColor,
                        success: identity.successColor,
                        warning: identity.warningColor,
                        error: identity.errorColor,
                        info: identity.infoColor,
                      }}
                      fonts={{
                        heading: identity.headingFont,
                        body: identity.bodyFont,
                        accent: identity.accentFont,
                        mono: identity.monoFont,
                      }}
                      borderRadius={{
                        sm: identity.borderRadiusSm,
                        md: identity.borderRadiusMd,
                        lg: identity.borderRadiusLg,
                        xl: identity.borderRadiusXl,
                      }}
                      iconStyle={identity.iconStyle}
                      imageStyle={identity.imageStyle}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Color Summary */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold text-slate-200 mb-4">Colors</h3>
            <div className="space-y-3">
              {[
                { label: 'Primary', color: identity.primaryColor },
                { label: 'Secondary', color: identity.secondaryColor },
                { label: 'Accent', color: identity.accentColor },
                { label: 'Background', color: identity.backgroundColor },
                { label: 'Text', color: identity.textColor },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border border-slate-700"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Summary */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold text-slate-200 mb-4">Typography</h3>
            <div className="space-y-3">
              {[
                { label: 'Heading', font: identity.headingFont },
                { label: 'Body', font: identity.bodyFont },
                { label: 'Accent', font: identity.accentFont },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-xs text-slate-500 block mb-1">{item.label}</span>
                  <span className="text-slate-300" style={{ fontFamily: item.font }}>
                    {item.font}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing Summary */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold text-slate-200 mb-4">Spacing</h3>
            <div className="space-y-3">
              {[
                { label: 'Section', value: identity.sectionSpacing },
                { label: 'Component', value: identity.componentSpacing },
                { label: 'Element', value: identity.elementSpacing },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-sm text-slate-300 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Styles Summary */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold text-slate-200 mb-4">Visual Styles</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Icon Style</span>
                <span className="text-sm text-slate-300">{identity.iconStyle.name}</span>
                <p className="text-xs text-slate-500">{identity.iconStyle.description}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Image Style</span>
                <span className="text-sm text-slate-300">{identity.imageStyle.name}</span>
                <p className="text-xs text-slate-500">{identity.imageStyle.description}</p>
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
