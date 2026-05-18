/**
 * Brand Strategy Module
 *
 * Comprehensive brand strategy framework based on established methodologies
 * including brand psychology, positioning, messaging, and tone of voice.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { moduleDataApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import {
  Target,
  MessageSquare,
  Brain,
  Compass,
  Users,
  Heart,
  Zap,
  Shield,
  Save,
  ChevronRight,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Check,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================
// TYPES & INTERFACES
// ============================================

interface BrandStrategy {
  id?: string;
  companyId: string;

  // Basic Brand Details
  brandName: string;
  tagline: string;
  brandPromise: string;
  brandStory: string;

  // Brand Psychology
  brandArchetype: string;
  brandPersonality: string[];
  brandValues: string[];
  emotionalBenefits: string;
  rationalBenefits: string;

  // Brand Positioning
  marketCategory: string;
  competitiveDifference: string;
  brandPositioning: string;
  uniqueValueProposition: string;

  // Target Audience (Psychographics)
  targetAudience: {
    demographics: string;
    psychographics: string;
    painPoints: string[];
    desires: string[];
    behaviors: string;
  };

  // Brand Messaging
  brandMessage: string;
  keyMessages: string[];
  elevatorPitch: string;
  brandVoice: string;

  // Tone of Voice
  toneAttributes: {
    professional: number;
    friendly: number;
    authoritative: number;
    playful: number;
    empathetic: number;
    bold: number;
  };
  toneGuidelines: string;

  // Brand Experience
  brandTouchpoints: string[];
  customerExperience: string;

  updatedAt?: string;
}

// ============================================
// BRAND ARCHETYPES FRAMEWORK
// ============================================

const BRAND_ARCHETYPES = [
  {
    id: 'innocent',
    name: 'The Innocent',
    description: 'Seeks safety and happiness. Emphasizes simplicity, optimism, and purity.',
    traits: ['Optimistic', 'Simple', 'Trustworthy', 'Honest'],
    examples: ['Dove', 'Coca-Cola', 'Disney'],
    color: '#22c55e',
  },
  {
    id: 'explorer',
    name: 'The Explorer',
    description: 'Seeks freedom and adventure. Emphasizes discovery, independence, and authenticity.',
    traits: ['Adventurous', 'Independent', 'Authentic', 'Free-spirited'],
    examples: ['Jeep', 'Red Bull', 'The North Face'],
    color: '#3b82f6',
  },
  {
    id: 'sage',
    name: 'The Sage',
    description: 'Seeks truth and knowledge. Emphasizes wisdom, expertise, and thought leadership.',
    traits: ['Knowledgeable', 'Trusted', 'Wise', 'Analytical'],
    examples: ['Google', 'IBM', 'Harvard'],
    color: '#6366f1',
  },
  {
    id: 'hero',
    name: 'The Hero',
    description: 'Seeks to prove worth through courageous acts. Emphasizes mastery, achievement, and honor.',
    traits: ['Brave', 'Strong', 'Competent', 'Inspiring'],
    examples: ['Nike', 'BMW', 'FedEx'],
    color: '#ef4444',
  },
  {
    id: 'outlaw',
    name: 'The Outlaw',
    description: 'Seeks revolution and change. Emphasizes disruption, rebellion, and liberation.',
    traits: ['Rebellious', 'Disruptive', 'Liberating', 'Bold'],
    examples: ['Harley-Davidson', 'Virgin', 'Patagonia'],
    color: '#1f2937',
  },
  {
    id: 'magician',
    name: 'The Magician',
    description: 'Seeks to make dreams come true. Emphasizes transformation, vision, and wonder.',
    traits: ['Visionary', 'Transformative', 'Charismatic', 'Innovative'],
    examples: ['Apple', 'Tesla', 'Disney'],
    color: '#a855f7',
  },
  {
    id: 'caregiver',
    name: 'The Caregiver',
    description: 'Seeks to help and protect. Emphasizes compassion, service, and generosity.',
    traits: ['Caring', 'Supportive', 'Nurturing', 'Protective'],
    examples: ['Johnson & Johnson', 'UNICEF', 'Kleenex'],
    color: '#ec4899',
  },
  {
    id: 'jester',
    name: 'The Jester',
    description: 'Seeks to enjoy life and bring joy. Emphasizes fun, humor, and lightheartedness.',
    traits: ['Playful', 'Humorous', 'Spontaneous', 'Fun-loving'],
    examples: ['Old Spice', 'M&Ms', 'Skittles'],
    color: '#f59e0b',
  },
  {
    id: 'lover',
    name: 'The Lover',
    description: 'Seeks intimacy and connection. Emphasizes passion, beauty, and sensuality.',
    traits: ['Passionate', 'Sensual', 'Committed', 'Romantic'],
    examples: ['Chanel', 'Victoria\'s Secret', 'Godiva'],
    color: '#e11d48',
  },
  {
    id: 'creator',
    name: 'The Creator',
    description: 'Seeks to create something new. Emphasizes innovation, imagination, and design.',
    traits: ['Creative', 'Innovative', 'Imaginative', 'Artistic'],
    examples: ['Lego', 'Adobe', 'Canon'],
    color: '#14b8a6',
  },
  {
    id: 'ruler',
    name: 'The Ruler',
    description: 'Seeks control and order. Emphasizes leadership, responsibility, and success.',
    traits: ['Authoritative', 'Responsible', 'Commanding', 'Sophisticated'],
    examples: ['Mercedes-Benz', 'Rolex', 'American Express'],
    color: '#f59e0b',
  },
  {
    id: 'everyman',
    name: 'The Everyman',
    description: 'Seeks belonging and connection. Emphasizes realism, accessibility, and community.',
    traits: ['Friendly', 'Approachable', 'Humble', 'Real'],
    examples: ['IKEA', 'Target', 'eBay'],
    color: '#6b7280',
  },
];

// ============================================
// BRAND PERSONALITY TRAITS
// ============================================

const PERSONALITY_TRAITS = [
  { id: 'innovative', name: 'Innovative', description: 'Forward-thinking, creative, cutting-edge' },
  { id: 'trustworthy', name: 'Trustworthy', description: 'Reliable, honest, dependable' },
  { id: 'friendly', name: 'Friendly', description: 'Approachable, warm, welcoming' },
  { id: 'professional', name: 'Professional', description: 'Competent, expert, polished' },
  { id: 'bold', name: 'Bold', description: 'Confident, daring, courageous' },
  { id: 'playful', name: 'Playful', description: 'Fun, lighthearted, spontaneous' },
  { id: 'sophisticated', name: 'Sophisticated', description: 'Elegant, refined, luxurious' },
  { id: 'authentic', name: 'Authentic', description: 'Genuine, real, transparent' },
  { id: 'empathetic', name: 'Empathetic', description: 'Understanding, caring, supportive' },
  { id: 'ambitious', name: 'Ambitious', description: 'Driven, determined, goal-oriented' },
  { id: 'rebellious', name: 'Rebellious', description: 'Non-conformist, disruptive, independent' },
  { id: 'nurturing', name: 'Nurturing', description: 'Caring, protective, supportive' },
];

// ============================================
// BRAND VALUES OPTIONS
// ============================================

const BRAND_VALUES = [
  'Innovation', 'Integrity', 'Quality', 'Customer Focus', 'Sustainability',
  'Excellence', 'Transparency', 'Accessibility', 'Diversity', 'Collaboration',
  'Responsibility', 'Passion', 'Simplicity', 'Empowerment', 'Community',
  'Authenticity', 'Trust', 'Creativity', 'Efficiency', 'Growth',
];

// ============================================
// COMPONENTS
// ============================================

function SectionCard({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="px-6 pb-6 border-t border-slate-800">{children}</div>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none"
      />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
      />
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  maxSelect = 5,
}: {
  label: string;
  options: { id: string; name: string; description?: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  maxSelect?: number;
}) {
  const toggleValue = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < maxSelect) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-300">{label}</label>
        <span className="text-xs text-slate-500">{selected.length}/{maxSelect}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleValue(option.id)}
            className={cn(
              'p-3 rounded-lg border text-left transition-all',
              selected.includes(option.id)
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-slate-700 hover:border-slate-600'
            )}
          >
            <p className="text-sm font-medium text-slate-200">{option.name}</p>
            {option.description && (
              <p className="text-xs text-slate-500 mt-1">{option.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagInput({
  label,
  values,
  onChange,
  suggestions,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  suggestions?: string[];
}) {
  const [input, setInput] = useState('');

  const addValue = (value: string) => {
    if (value && !values.includes(value)) {
      onChange([...values, value]);
    }
    setInput('');
  };

  const removeValue = (value: string) => {
    onChange(values.filter((v) => v !== value));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 bg-slate-800 border border-slate-700 rounded-lg min-h-[48px]">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
          >
            {value}
            <button
              onClick={() => removeValue(value)}
              className="hover:text-primary-300"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addValue(input);
            }
          }}
          placeholder="Type and press Enter"
          className="flex-1 min-w-[120px] bg-transparent text-slate-200 text-sm outline-none"
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500">Suggestions:</span>
          {suggestions
            .filter((s) => !values.includes(s))
            .slice(0, 8)
            .map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addValue(suggestion)}
                className="text-xs text-slate-400 hover:text-primary-400 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BrandStrategyPage() {
  const user = useAuthStore(s => s.user);
  const activeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companyId = user?.activeCompanyId || activeCompanyId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(['basic']);

  const defaultStrategy: BrandStrategy = {
    companyId: companyId || '',
    brandName: '',
    tagline: '',
    brandPromise: '',
    brandStory: '',
    brandArchetype: '',
    brandPersonality: [],
    brandValues: [],
    emotionalBenefits: '',
    rationalBenefits: '',
    marketCategory: '',
    competitiveDifference: '',
    brandPositioning: '',
    uniqueValueProposition: '',
    targetAudience: {
      demographics: '',
      psychographics: '',
      painPoints: [],
      desires: [],
      behaviors: '',
    },
    brandMessage: '',
    keyMessages: [],
    elevatorPitch: '',
    brandVoice: '',
    toneAttributes: {
      professional: 50,
      friendly: 50,
      authoritative: 50,
      playful: 50,
      empathetic: 50,
      bold: 50,
    },
    toneGuidelines: '',
    brandTouchpoints: [],
    customerExperience: '',
  };

  const [strategy, setStrategy] = useState<BrandStrategy>(defaultStrategy);

  // Load existing data
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await moduleDataApi.get('brand-strategy', companyId);
        if (response.data && Object.keys(response.data).length > 0) {
          setStrategy({ ...defaultStrategy, ...response.data });
        }
      } catch (error) {
        console.error('Failed to load brand strategy:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [companyId]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const saveStrategy = async () => {
    if (!companyId) return;
    setSaving(true);
    setShowSuccess(false);
    try {
      const response = await moduleDataApi.save('brand-strategy', {
        companyId,
        data: strategy,
      });
      if (!response.error) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
    setSaving(false);
  };

  const updateStrategy = (updates: Partial<BrandStrategy>) => {
    setStrategy((prev) => ({ ...prev, ...updates }));
  };

  const updateTargetAudience = (updates: Partial<BrandStrategy['targetAudience']>) => {
    setStrategy((prev) => ({
      ...prev,
      targetAudience: { ...prev.targetAudience, ...updates },
    }));
  };

  const updateToneAttributes = (updates: Partial<BrandStrategy['toneAttributes']>) => {
    setStrategy((prev) => ({
      ...prev,
      toneAttributes: { ...prev.toneAttributes, ...updates },
    }));
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
        <p className="text-slate-400">Please select a company to configure brand strategy.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">Brand Strategy</h1>
          <p className="mt-1 text-slate-400">
            Define your brand's psychology, positioning, and messaging framework
          </p>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="flex items-center gap-1.5 text-sm text-green-400">
              <Check className="w-4 h-4" />
              Saved successfully
            </span>
          )}
          <button
            onClick={saveStrategy}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-slate-900 rounded-lg hover:bg-primary-400 transition-colors font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Framework Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-200 font-medium">Brand Strategy Framework</p>
          <p className="text-sm text-blue-300/80 mt-1">
            Based on established methodologies including Jungian archetypes, brand positioning theory,
            and the "Return on Brand" framework. Each section builds upon the previous to create a
            comprehensive brand strategy.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {/* Basic Brand Details */}
        <SectionCard
          title="Basic Brand Details"
          icon={Shield}
          isOpen={openSections.includes('basic')}
          onToggle={() => toggleSection('basic')}
        >
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Brand Name"
                value={strategy.brandName}
                onChange={(v) => updateStrategy({ brandName: v })}
                placeholder="Your brand name"
              />
              <Input
                label="Tagline"
                value={strategy.tagline}
                onChange={(v) => updateStrategy({ tagline: v })}
                placeholder="A memorable tagline"
              />
            </div>
            <TextArea
              label="Brand Promise"
              value={strategy.brandPromise}
              onChange={(v) => updateStrategy({ brandPromise: v })}
              placeholder="What do you promise to deliver to your customers every time?"
              rows={2}
            />
            <TextArea
              label="Brand Story"
              value={strategy.brandStory}
              onChange={(v) => updateStrategy({ brandStory: v })}
              placeholder="Tell the story of how and why your brand was founded..."
              rows={4}
            />
          </div>
        </SectionCard>

        {/* Brand Psychology */}
        <SectionCard
          title="Brand Psychology"
          icon={Brain}
          isOpen={openSections.includes('psychology')}
          onToggle={() => toggleSection('psychology')}
        >
          <div className="pt-6 space-y-8">
            {/* Brand Archetype */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">Brand Archetype</label>
              <p className="text-xs text-slate-500">
                Select the archetype that best represents your brand's personality and role in customer's lives.
                Based on Jungian archetypes as used in the "Hero and the Outlaw" framework.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {BRAND_ARCHETYPES.map((archetype) => (
                  <button
                    key={archetype.id}
                    onClick={() => updateStrategy({ brandArchetype: archetype.id })}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      strategy.brandArchetype === archetype.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${archetype.color}20` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: archetype.color }}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-200">{archetype.name}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{archetype.description}</p>
                    {strategy.brandArchetype === archetype.id && (
                      <div className="mt-2 pt-2 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400">
                          <span className="text-slate-500">Traits:</span> {archetype.traits.join(', ')}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Examples: {archetype.examples.join(', ')}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Personality */}
            <MultiSelect
              label="Brand Personality Traits"
              options={PERSONALITY_TRAITS}
              selected={strategy.brandPersonality}
              onChange={(v) => updateStrategy({ brandPersonality: v })}
              maxSelect={5}
            />

            {/* Brand Values */}
            <TagInput
              label="Brand Values"
              values={strategy.brandValues}
              onChange={(v) => updateStrategy({ brandValues: v })}
              suggestions={BRAND_VALUES}
            />

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-6">
              <TextArea
                label="Emotional Benefits"
                value={strategy.emotionalBenefits}
                onChange={(v) => updateStrategy({ emotionalBenefits: v })}
                placeholder="How do customers feel when using your brand?"
                rows={3}
              />
              <TextArea
                label="Rational Benefits"
                value={strategy.rationalBenefits}
                onChange={(v) => updateStrategy({ rationalBenefits: v })}
                placeholder="What practical advantages does your brand provide?"
                rows={3}
              />
            </div>
          </div>
        </SectionCard>

        {/* Brand Positioning */}
        <SectionCard
          title="Brand Positioning"
          icon={Compass}
          isOpen={openSections.includes('positioning')}
          onToggle={() => toggleSection('positioning')}
        >
          <div className="pt-6 space-y-6">
            <Input
              label="Market Category"
              value={strategy.marketCategory}
              onChange={(v) => updateStrategy({ marketCategory: v })}
              placeholder="e.g., Premium SaaS, Budget-friendly Fashion, etc."
            />
            <TextArea
              label="Competitive Difference"
              value={strategy.competitiveDifference}
              onChange={(v) => updateStrategy({ competitiveDifference: v })}
              placeholder="What makes you different from competitors? Why should customers choose you?"
              rows={3}
            />
            <TextArea
              label="Brand Positioning Statement"
              value={strategy.brandPositioning}
              onChange={(v) => updateStrategy({ brandPositioning: v })}
              placeholder="For [target audience], [brand] is the [category] that [key benefit], unlike [competitors], we [unique difference]."
              rows={3}
            />
            <TextArea
              label="Unique Value Proposition"
              value={strategy.uniqueValueProposition}
              onChange={(v) => updateStrategy({ uniqueValueProposition: v })}
              placeholder="The one clear reason why your target audience should buy from you."
              rows={2}
            />
          </div>
        </SectionCard>

        {/* Target Audience - Psychographics */}
        <SectionCard
          title="Target Audience & Psychographics"
          icon={Users}
          isOpen={openSections.includes('audience')}
          onToggle={() => toggleSection('audience')}
        >
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <TextArea
                label="Demographics"
                value={strategy.targetAudience.demographics}
                onChange={(v) => updateTargetAudience({ demographics: v })}
                placeholder="Age, gender, income, education, location..."
                rows={3}
              />
              <TextArea
                label="Psychographics"
                value={strategy.targetAudience.psychographics}
                onChange={(v) => updateTargetAudience({ psychographics: v })}
                placeholder="Values, interests, attitudes, lifestyle..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <TagInput
                label="Pain Points"
                values={strategy.targetAudience.painPoints}
                onChange={(v) => updateTargetAudience({ painPoints: v })}
              />
              <TagInput
                label="Desires & Aspirations"
                values={strategy.targetAudience.desires}
                onChange={(v) => updateTargetAudience({ desires: v })}
              />
            </div>
            <TextArea
              label="Buying Behaviors"
              value={strategy.targetAudience.behaviors}
              onChange={(v) => updateTargetAudience({ behaviors: v })}
              placeholder="How do they research, decide, and purchase? What influences them?"
              rows={3}
            />
          </div>
        </SectionCard>

        {/* Brand Messaging */}
        <SectionCard
          title="Brand Messaging"
          icon={MessageSquare}
          isOpen={openSections.includes('messaging')}
          onToggle={() => toggleSection('messaging')}
        >
          <div className="pt-6 space-y-6">
            <TextArea
              label="Core Brand Message"
              value={strategy.brandMessage}
              onChange={(v) => updateStrategy({ brandMessage: v })}
              placeholder="The central idea you want to communicate to your audience."
              rows={3}
            />
            <TagInput
              label="Key Messages"
              values={strategy.keyMessages}
              onChange={(v) => updateStrategy({ keyMessages: v })}
            />
            <TextArea
              label="Elevator Pitch"
              value={strategy.elevatorPitch}
              onChange={(v) => updateStrategy({ elevatorPitch: v })}
              placeholder="A 30-second compelling summary of what your brand does and why it matters."
              rows={3}
            />
            <TextArea
              label="Brand Voice Description"
              value={strategy.brandVoice}
              onChange={(v) => updateStrategy({ brandVoice: v })}
              placeholder="How does your brand 'speak'? Formal or casual? Enthusiastic or calm?"
              rows={3}
            />
          </div>
        </SectionCard>

        {/* Tone of Voice */}
        <SectionCard
          title="Tone of Voice"
          icon={Heart}
          isOpen={openSections.includes('tone')}
          onToggle={() => toggleSection('tone')}
        >
          <div className="pt-6 space-y-6">
            <p className="text-sm text-slate-500">
              Adjust the sliders to define your brand's tone balance. Each attribute represents a spectrum.
            </p>
            <div className="space-y-6">
              {Object.entries(strategy.toneAttributes).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <span className="text-sm text-slate-400">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) =>
                      updateToneAttributes({
                        [key]: parseInt(e.target.value),
                      } as Partial<BrandStrategy['toneAttributes']>)
                    }
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
              ))}
            </div>
            <TextArea
              label="Tone Guidelines"
              value={strategy.toneGuidelines}
              onChange={(v) => updateStrategy({ toneGuidelines: v })}
              placeholder="Specific do's and don'ts for maintaining brand tone. Example: 'Do use contractions to sound friendly. Don't use jargon.'"
              rows={4}
            />
          </div>
        </SectionCard>

        {/* Brand Experience */}
        <SectionCard
          title="Brand Experience"
          icon={Zap}
          isOpen={openSections.includes('experience')}
          onToggle={() => toggleSection('experience')}
        >
          <div className="pt-6 space-y-6">
            <TagInput
              label="Key Brand Touchpoints"
              values={strategy.brandTouchpoints}
              onChange={(v) => updateStrategy({ brandTouchpoints: v })}
            />
            <p className="text-xs text-slate-500 -mt-4">
              Examples: Website, Social Media, Customer Service, Packaging, Email, App
            </p>
            <TextArea
              label="Desired Customer Experience"
              value={strategy.customerExperience}
              onChange={(v) => updateStrategy({ customerExperience: v })}
              placeholder="Describe the ideal experience at every touchpoint. How should customers feel?"
              rows={4}
            />
          </div>
        </SectionCard>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end pt-6 border-t border-slate-800">
        <button
          onClick={saveStrategy}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-slate-900 rounded-lg hover:bg-primary-400 transition-colors font-medium disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Brand Strategy'}
        </button>
      </div>
    </div>
  );
}
