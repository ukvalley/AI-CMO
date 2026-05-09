/**
 * Full-Size Dashboard Preview Page with Template Switcher
 *
 * Opens in a new tab to show the dashboard preview at full size.
 * Includes a template switcher for real-time preview of different templates.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { X, LayoutGrid, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DashboardPreview } from '@/modules/brand/visual-identity/components/DashboardPreview';
import { ICON_STYLES, IMAGE_STYLES, COMPLETE_TEMPLATES } from '@/modules/brand/visual-identity/components/data';
import { cn } from '@/utils/cn';

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
  headingLineHeight?: string;
  bodyLineHeight?: string;
  headingLetterSpacing?: string;
  bodyLetterSpacing?: string;
  borderRadiusSm: string;
  borderRadiusMd: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
  sectionSpacing?: string;
  componentSpacing?: string;
  elementSpacing?: string;
  iconStyle?: typeof ICON_STYLES[0];
  imageStyle?: typeof IMAGE_STYLES[0];
  selectedTemplateId?: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'technology', name: 'Technology' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'finance', name: 'Finance' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'education', name: 'Education' },
];

export default function PreviewPage() {
  const [identity, setIdentity] = useState<VisualIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplates, setShowTemplates] = useState(true);

  useEffect(() => {
    // Get identity from sessionStorage
    const stored = sessionStorage.getItem('preview-identity');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Provide fallbacks for potentially missing fields
        setIdentity({
          ...parsed,
          sectionSpacing: parsed.sectionSpacing || '3rem',
          componentSpacing: parsed.componentSpacing || '1rem',
          elementSpacing: parsed.elementSpacing || '0.5rem',
          iconStyle: parsed.iconStyle || ICON_STYLES[1],
          imageStyle: parsed.imageStyle || IMAGE_STYLES[2],
          headingLineHeight: parsed.headingLineHeight || '1.2',
          bodyLineHeight: parsed.bodyLineHeight || '1.6',
          headingLetterSpacing: parsed.headingLetterSpacing || '-0.02em',
          bodyLetterSpacing: parsed.bodyLetterSpacing || '0',
        });
        if (parsed.selectedTemplateId) {
          const template = COMPLETE_TEMPLATES.find(t => t.id === parsed.selectedTemplateId);
          if (template) {
            setSelectedCategory(template.category);
          }
        }
      } catch (e) {
        console.error('Failed to parse preview identity:', e);
      }
    }
    setLoading(false);
  }, []);

  // Apply a template to the current identity
  const applyTemplate = (template: typeof COMPLETE_TEMPLATES[0]) => {
    if (!identity) return;

    setIdentity({
      ...identity,
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
    });
  };

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all'
    ? COMPLETE_TEMPLATES
    : COMPLETE_TEMPLATES.filter(t => t.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No preview data available.</p>
          <p className="text-slate-500 text-sm">
            Please go to the Visual Identity module and click &quot;View in New Tab&quot; to see the preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LayoutGrid className="w-6 h-6 text-primary-500" />
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard Preview</h1>
              <p className="text-sm text-slate-400">Click any template below to preview in real-time</p>
              <p className="text-xs text-yellow-500 mt-1">
                Note: This preview is for demonstration purposes only. Actual results may vary.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              {showTemplates ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              {showTemplates ? 'Hide Templates' : 'Show Templates'}
            </button>
            <button
              onClick={() => window.close()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <X size={18} />
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Template Selector */}
      {showTemplates && (
        <div className="border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {filteredTemplates.map((template) => {
                const isSelected = identity.selectedTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className={cn(
                      'relative p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02]',
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
                    <div className="flex gap-1 mb-2">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>

                    {/* Template Name */}
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {template.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {template.description}
                    </p>

                    {/* Category Badge */}
                    <span className="inline-block mt-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded bg-slate-800 text-slate-400">
                      {template.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="inline-block rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl"
            style={{
              backgroundColor: identity.backgroundColor,
            }}
          >
            <DashboardPreview
              scale={1}
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
                headingLineHeight: identity.headingLineHeight || '1.2',
                bodyLineHeight: identity.bodyLineHeight || '1.6',
                headingLetterSpacing: identity.headingLetterSpacing || '-0.02em',
                bodyLetterSpacing: identity.bodyLetterSpacing || '0',
              }}
              borderRadius={{
                sm: identity.borderRadiusSm,
                md: identity.borderRadiusMd,
                lg: identity.borderRadiusLg,
                xl: identity.borderRadiusXl,
              }}
              spacing={{
                section: identity.sectionSpacing || '6rem',
                component: identity.componentSpacing || '2rem',
                element: identity.elementSpacing || '1rem',
              }}
              iconStyle={identity.iconStyle || ICON_STYLES[1]}
              imageStyle={identity.imageStyle || IMAGE_STYLES[2]}
            />
          </div>
        </div>
      </div>

      {/* Current Template Info */}
      <div className="fixed bottom-4 left-4 right-4 max-w-[1600px] mx-auto">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-slate-600"
                  style={{ backgroundColor: identity.primaryColor }}
                />
                <div
                  className="w-8 h-8 rounded-lg border border-slate-600"
                  style={{ backgroundColor: identity.secondaryColor }}
                />
                <div
                  className="w-8 h-8 rounded-lg border border-slate-600"
                  style={{ backgroundColor: identity.accentColor }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {identity.selectedTemplateId
                    ? COMPLETE_TEMPLATES.find(t => t.id === identity.selectedTemplateId)?.name || 'Custom'
                    : 'Custom Configuration'}
                </p>
                <p className="text-xs text-slate-500">
                  {identity.headingFont} · {identity.sectionSpacing} spacing · {identity.iconStyle?.name || 'Regular Outline'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">
                {filteredTemplates.length} templates available
              </p>
              <p className="text-[10px] text-slate-600">
                Click any template above to switch
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
