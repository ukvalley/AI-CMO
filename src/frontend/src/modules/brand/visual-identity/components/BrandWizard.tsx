/**
 * Brand Wizard Component
 *
 * Questionnaire to understand brand and suggest visual identity.
 */

'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  INDUSTRIES,
  BRAND_PERSONALITIES,
  TARGET_AUDIENCES,
  MOOD_OPTIONS,
  COLOR_PREFERENCES,
  PRESET_PALETTES,
  FONT_COMBINATIONS,
  getSmartSuggestions,
  FONT_SPECIFICATIONS,
} from './data';

interface WizardAnswers {
  industry?: string;
  personality?: string[];
  targetAudience?: string;
  mood?: string;
  colorPreference?: string;
}

interface BrandWizardProps {
  onComplete: (answers: WizardAnswers) => void;
  onSkip: () => void;
}

const STEPS = [
  { id: 'industry', title: 'What industry are you in?', subtitle: 'This helps us understand your business context' },
  { id: 'personality', title: 'How would you describe your brand?', subtitle: 'Select 2-3 personality traits' },
  { id: 'targetAudience', title: 'Who is your target audience?', subtitle: 'Who are you trying to reach?' },
  { id: 'mood', title: 'What mood or feel are you going for?', subtitle: 'The overall aesthetic direction' },
  { id: 'colorPreference', title: 'Any color preferences?', subtitle: 'We can suggest based on this' },
];

export function BrandWizard({ onComplete, onSkip }: BrandWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({});

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const step = STEPS[currentStep].id;
    const value = answers[step as keyof WizardAnswers];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !!value;
  };

  const renderStep = () => {
    const step = STEPS[currentStep];

    switch (step.id) {
      case 'industry':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setAnswers({ ...answers, industry: industry.id })}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  answers.industry === industry.id
                    ? 'border-primary-500 bg-slate-800'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                )}
              >
                <h3 className="font-medium text-slate-200 mb-1">{industry.name}</h3>
                <p className="text-xs text-slate-500">{industry.description}</p>
              </button>
            ))}
          </div>
        );

      case 'personality':
        return (
          <div className="grid grid-cols-2 gap-4">
            {BRAND_PERSONALITIES.map((personality) => {
              const isSelected = answers.personality?.includes(personality.id);
              return (
                <button
                  key={personality.id}
                  onClick={() => {
                    const current = answers.personality || [];
                    const updated = isSelected
                      ? current.filter((p) => p !== personality.id)
                      : [...current, personality.id];
                    setAnswers({ ...answers, personality: updated });
                  }}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all relative',
                    isSelected
                      ? 'border-primary-500 bg-slate-800'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-5 h-5 text-primary-500" />
                    </div>
                  )}
                  <h3 className="font-medium text-slate-200 mb-1">{personality.name}</h3>
                  <p className="text-xs text-slate-500">{personality.description}</p>
                </button>
              );
            })}
          </div>
        );

      case 'targetAudience':
        return (
          <div className="grid grid-cols-2 gap-4">
            {TARGET_AUDIENCES.map((audience) => (
              <button
                key={audience.id}
                onClick={() => setAnswers({ ...answers, targetAudience: audience.id })}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  answers.targetAudience === audience.id
                    ? 'border-primary-500 bg-slate-800'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                )}
              >
                <h3 className="font-medium text-slate-200 mb-1">{audience.name}</h3>
                <p className="text-xs text-slate-500">{audience.description}</p>
              </button>
            ))}
          </div>
        );

      case 'mood':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setAnswers({ ...answers, mood: mood.id })}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  answers.mood === mood.id
                    ? 'border-primary-500 bg-slate-800'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                )}
              >
                <h3 className="font-medium text-slate-200 mb-1">{mood.name}</h3>
                <p className="text-xs text-slate-500">{mood.description}</p>
              </button>
            ))}
          </div>
        );

      case 'colorPreference':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COLOR_PREFERENCES.map((pref) => (
              <button
                key={pref.id}
                onClick={() => setAnswers({ ...answers, colorPreference: pref.id })}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  answers.colorPreference === pref.id
                    ? 'border-primary-500 bg-slate-800'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                )}
              >
                <div className="flex gap-1 mb-2">
                  {pref.colors.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <h3 className="font-medium text-slate-200 mb-1">{pref.name}</h3>
                <p className="text-xs text-slate-500">{pref.description}</p>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-400">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-slate-400">{STEPS[currentStep].title}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">{STEPS[currentStep].title}</h2>
        <p className="text-slate-400">{STEPS[currentStep].subtitle}</p>
      </div>

      {/* Options */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={currentStep === 0 ? onSkip : handleBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 0 ? 'Skip Wizard' : 'Back'}
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={cn(
            'flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all',
            canProceed()
              ? 'bg-primary-500 text-slate-900 hover:bg-primary-400'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          )}
        >
          {currentStep === STEPS.length - 1 ? 'Get Suggestions' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Suggestions Component
interface SuggestionsProps {
  answers: WizardAnswers;
  onSelectPalette: (palette: typeof PRESET_PALETTES[0]) => void;
  onSelectFonts: (fonts: typeof FONT_COMBINATIONS[0]) => void;
  onSaveBoth: (palette: typeof PRESET_PALETTES[0], fonts: typeof FONT_COMBINATIONS[0]) => void | Promise<void>;
  onCustomize: () => void;
}

export function Suggestions({ answers, onSelectPalette, onSelectFonts, onSaveBoth, onCustomize }: SuggestionsProps) {
  const [selectedPalette, setSelectedPalette] = useState<typeof PRESET_PALETTES[0] | null>(null);
  const [selectedFonts, setSelectedFonts] = useState<typeof FONT_COMBINATIONS[0] | null>(null);

  // Get smart suggestions using algorithm
  const { palettes: matchingPalettes, fonts: matchingFonts } = getSmartSuggestions(
    answers.industry || '',
    answers.personality || [],
    answers.targetAudience || '',
    answers.mood || '',
    answers.colorPreference || ''
  );

  const handlePaletteClick = (palette: typeof PRESET_PALETTES[0]) => {
    setSelectedPalette(palette);
    onSelectPalette(palette);
  };

  const handleFontClick = (fonts: typeof FONT_COMBINATIONS[0]) => {
    setSelectedFonts(fonts);
    onSelectFonts(fonts);
  };

  const handleSave = async () => {
    if (selectedPalette && selectedFonts) {
      await onSaveBoth(selectedPalette, selectedFonts);
    }
  };

  const canSave = selectedPalette && selectedFonts;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-200 mb-2">We Found Some Matches!</h2>
        <p className="text-slate-400">Based on your answers, here are our recommendations. Select one palette and one font combination.</p>
      </div>

      {/* Color Palettes */}
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          Recommended Color Palettes
          {selectedPalette && <span className="ml-2 text-sm text-primary-400">✓ {selectedPalette.name}</span>}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingPalettes.length > 0 ? (
            matchingPalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => handlePaletteClick(palette)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all relative",
                  selectedPalette?.id === palette.id
                    ? "border-primary-500 bg-slate-800 ring-2 ring-primary-500/30"
                    : "border-slate-700 hover:border-slate-500 bg-slate-900/50"
                )}
              >
                {selectedPalette?.id === palette.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-primary-500" />
                  </div>
                )}
                <h4 className="font-medium text-slate-200 mb-1">{palette.name}</h4>
                <p className="text-xs text-slate-500 mb-3">{palette.description}</p>
                <div className="flex gap-1">
                  {Object.entries(palette.colors)
                    .slice(0, 5)
                    .map(([key, color]) => (
                      <div
                        key={key}
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                </div>
              </button>
            ))
          ) : (
            <p className="text-slate-500 col-span-3">No specific matches found. Try customizing!</p>
          )}
        </div>
      </div>

      {/* Font Combinations */}
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          Recommended Font Combinations
          {selectedFonts && <span className="ml-2 text-sm text-primary-400">✓ {selectedFonts.name}</span>}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingFonts.map((combo) => (
            <button
              key={combo.name}
              onClick={() => handleFontClick(combo)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all relative",
                selectedFonts?.name === combo.name
                  ? "border-primary-500 bg-slate-800 ring-2 ring-primary-500/30"
                  : "border-slate-700 hover:border-slate-500 bg-slate-900/50"
              )}
            >
              {selectedFonts?.name === combo.name && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-primary-500" />
                </div>
              )}
              <h4 className="font-medium text-slate-200 mb-1">{combo.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{combo.description}</p>

              {/* Font Preview with Sample Text */}
              <div className="space-y-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                {/* Heading Preview */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Heading</span>
                  <p
                    style={{ fontFamily: combo.heading }}
                    className="text-lg text-slate-200 leading-tight"
                  >
                    The Quick Brown Fox
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{combo.heading}</p>
                </div>

                {/* Body Preview */}
                <div className="pt-2 border-t border-slate-700/50">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Body</span>
                  <p
                    style={{ fontFamily: combo.body }}
                    className="text-sm text-slate-300 leading-relaxed"
                  >
                    The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{combo.body}</p>
                </div>

                {/* Accent Preview */}
                <div className="pt-2 border-t border-slate-700/50">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Accent</span>
                  <p
                    style={{ fontFamily: combo.accent }}
                    className="text-base text-slate-200 italic"
                  >
                    Beautiful Design
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{combo.accent}</p>
                </div>

                {/* Monospace Preview */}
                <div className="pt-2 border-t border-slate-700/50">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Code</span>
                  <code
                    style={{ fontFamily: combo.mono }}
                    className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded block"
                  >
                    const font = '{combo.mono}';
                  </code>
                </div>
              </div>

              {/* Line Height & Letter Spacing Info */}
              <div className="flex gap-2 mt-3 text-[10px] text-slate-500">
                <span className="px-2 py-0.5 bg-slate-800 rounded">LH: {combo.lineHeight.heading}</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">LS: {combo.letterSpacing.heading}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center pt-4 border-t border-slate-800">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 mx-auto",
            canSave
              ? "bg-primary-500 text-slate-900 hover:bg-primary-400"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          )}
        >
          <Check className="w-5 h-5" />
          Apply Selected Theme
        </button>
        <p className="text-sm text-slate-500 mt-2">
          {!selectedPalette && !selectedFonts && "Select a palette and fonts to apply"}
          {selectedPalette && !selectedFonts && "Now select a font combination"}
          {!selectedPalette && selectedFonts && "Now select a color palette"}
          {selectedPalette && selectedFonts && "Ready to apply your brand theme!"}
        </p>
      </div>

      {/* Customize Option */}
      <div className="text-center pt-4 border-t border-slate-800">
        <p className="text-slate-400 mb-4">Want full control? Switch to custom mode</p>
        <button
          onClick={onCustomize}
          className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:border-slate-400 transition-colors"
        >
          Customize Everything
        </button>
      </div>
    </div>
  );
}

export type { WizardAnswers };
