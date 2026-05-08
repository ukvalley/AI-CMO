/**
 * Visual Identity Module - Enhanced with Brand Wizard
 *
 * Choose between Preset Mode (wizard + suggestions) or Custom Mode (full control).
 */

'use client';

import React, { useState, useEffect } from 'react';
import { moduleDataApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import { Palette, Type, Layout, Eye, Sparkles, Moon, Sun, AlertCircle, CheckCircle2, ArrowLeft, Wand2, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BrandWizard, Suggestions, WizardAnswers } from './components/BrandWizard';
import { PRESET_PALETTES, GOOGLE_FONTS, FONT_COMBINATIONS } from './components/data';

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
  // Spacing
  borderRadiusSm: string;
  borderRadiusMd: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
  // Wizard answers (for preset mode)
  wizardAnswers?: WizardAnswers;
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
        <span style={{ fontFamily: value }} className="text-slate-200">
          {value}
        </span>
        <span className="text-slate-500">▼</span>
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
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
                  'w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center justify-between',
                  value === font.name && 'bg-slate-700'
                )}
              >
                <span style={{ fontFamily: font.name }} className="text-slate-200">
                  {font.name}
                </span>
                {value === font.name && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ComponentPreview({ identity }: { identity: VisualIdentity }) {
  return (
    <div
      className="p-6 rounded-xl border"
      style={{
        backgroundColor: identity.backgroundColor,
        borderColor: identity.secondaryColor,
      }}
    >
      <h3
        className="text-xl font-bold mb-4"
        style={{
          color: identity.textColor,
          fontFamily: identity.headingFont,
        }}
      >
        Component Preview
      </h3>

      <div className="space-y-4">
        {/* Button */}
        <div>
          <p className="text-xs mb-2" style={{ color: identity.textMutedColor }}>
            Primary Button
          </p>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: identity.primaryColor,
              color: identity.secondaryColor,
              fontFamily: identity.bodyFont,
            }}
          >
            Get Started
          </button>
        </div>

        {/* Card */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: identity.surfaceColor,
            borderColor: identity.secondaryColor,
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{ color: identity.textColor, fontFamily: identity.headingFont }}
          >
            Feature Card
          </h4>
          <p style={{ color: identity.textMutedColor, fontFamily: identity.bodyFont }}>
            This is how your content will look with the selected colors and typography.
          </p>
        </div>

        {/* Alert */}
        <div
          className="p-3 rounded-lg flex items-center gap-2"
          style={{
            backgroundColor: `${identity.successColor}20`,
            borderLeft: `3px solid ${identity.successColor}`,
          }}
        >
          <CheckCircle2 style={{ color: identity.successColor }} className="w-5 h-5" />
          <span style={{ color: identity.textColor, fontFamily: identity.bodyFont }}>
            Success message example
          </span>
        </div>

        {/* Input */}
        <div>
          <p className="text-xs mb-2" style={{ color: identity.textMutedColor }}>
            Form Input
          </p>
          <input
            type="text"
            placeholder="Enter your email..."
            className="w-full px-3 py-2 rounded-lg border bg-transparent"
            style={{
              borderColor: identity.secondaryColor,
              color: identity.textColor,
              fontFamily: identity.bodyFont,
            }}
          />
        </div>
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
  const [showWizard, setShowWizard] = useState(false);
  const [wizardComplete, setWizardComplete] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'preview'>('colors');

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
    borderRadiusSm: '0.25rem',
    borderRadiusMd: '0.5rem',
    borderRadiusLg: '0.75rem',
    borderRadiusXl: '1rem',
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
        if (response.data?.data) {
          setIdentity({ ...defaultIdentity, ...response.data.data });
        } else {
          // No existing data - show wizard
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

  // Apply selected palette
  const handleSelectPalette = (palette: typeof PRESET_PALETTES[0]) => {
    setIdentity((prev) => ({
      ...prev,
      mode: 'preset',
      ...palette.colors,
    }));
    setShowWizard(false);
    setWizardComplete(false);
  };

  // Apply selected fonts
  const handleSelectFonts = (fonts: typeof FONT_COMBINATIONS[0]) => {
    setIdentity((prev) => ({
      ...prev,
      headingFont: fonts.heading,
      bodyFont: fonts.body,
      accentFont: fonts.accent,
    }));
  };

  // Switch to custom mode
  const handleCustomize = () => {
    setIdentity((prev) => ({ ...prev, mode: 'custom' }));
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
    await moduleDataApi.save('visual-identity', {
      companyId,
      data: identity,
    });
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
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                identity.mode === 'preset'
                  ? 'bg-slate-800 text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Wand2 className="w-4 h-4" />
              Preset
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

          <button
            onClick={saveIdentity}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-slate-900 rounded-lg hover:bg-primary-400 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
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
      <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
        {[
          { id: 'colors', label: 'Colors', icon: Palette },
          { id: 'typography', label: 'Typography', icon: Type },
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Typography</h2>

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
          )}

          {activeTab === 'preview' && (
            <ComponentPreview identity={identity} />
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

          {/* Accessibility */}
          <AccessibilityChecker identity={identity} />
        </div>
      </div>
    </div>
  );
}
