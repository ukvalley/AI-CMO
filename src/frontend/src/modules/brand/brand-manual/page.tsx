/**
 * Brand Manual Module - Comprehensive Brand Guidelines
 *
 * Professional brand guidelines document combining data from
 * Brand Strategy and Visual Identity with detailed visualizations.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { moduleDataApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import {
  Download,
  Printer,
  Check,
  AlertCircle,
  Palette,
  Type,
  MessageSquare,
  Users,
  Target,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layout,
  Image,
  MousePointer,
  Monitor,
  Smartphone,
  FileText,
  Mail,
  Briefcase,
  Share2,
  Heart,
  Compass,
  Brain,
  Eye,
  Volume2,
  Shield,
  Zap,
  Copy,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/utils/cn';
// html2pdf is loaded dynamically to avoid SSR issues

// ============================================
// TYPES
// ============================================

interface BrandStrategy {
  brandName: string;
  tagline: string;
  brandPromise: string;
  brandStory: string;
  brandArchetype: string;
  brandPersonality: string[];
  brandValues: string[];
  emotionalBenefits: string;
  rationalBenefits: string;
  marketCategory: string;
  competitiveDifference: string;
  brandPositioning: string;
  uniqueValueProposition: string;
  targetAudience: {
    demographics: string;
    psychographics: string;
    painPoints: string[];
    desires: string[];
    behaviors: string;
  };
  brandMessage: string;
  keyMessages: string[];
  elevatorPitch: string;
  brandVoice: string;
  toneAttributes: {
    professional: number;
    friendly: number;
    authoritative: number;
    playful: number;
    empathetic: number;
    bold: number;
  };
  toneGuidelines: string;
  brandTouchpoints: string[];
  customerExperience: string;
}

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
  headingLineHeight: string;
  bodyLineHeight: string;
  headingLetterSpacing: string;
  bodyLetterSpacing: string;
  borderRadiusSm: string;
  borderRadiusMd: string;
  borderRadiusLg: string;
  borderRadiusXl: string;
  sectionSpacing: string;
  componentSpacing: string;
  elementSpacing: string;
  iconStyle?: {
    name: string;
    style: string;
    strokeWidth: number;
    defaultSize: number;
  };
  imageStyle?: {
    name: string;
    description: string;
  };
}

// ============================================
// ARCHETYPE DATA
// ============================================

const ARCHETYPES: Record<string, {
  name: string;
  traits: string[];
  examples: string[];
  description: string;
  color: string;
}> = {
  innocent: {
    name: 'The Innocent',
    traits: ['Optimistic', 'Simple', 'Trustworthy', 'Honest'],
    examples: ['Dove', 'Coca-Cola', 'Disney'],
    description: 'Seeks safety and happiness. Emphasizes simplicity, optimism, and purity.',
    color: '#22c55e'
  },
  explorer: {
    name: 'The Explorer',
    traits: ['Adventurous', 'Independent', 'Authentic', 'Free-spirited'],
    examples: ['Jeep', 'Red Bull', 'The North Face'],
    description: 'Seeks freedom and adventure. Emphasizes discovery, independence, and authenticity.',
    color: '#3b82f6'
  },
  sage: {
    name: 'The Sage',
    traits: ['Knowledgeable', 'Trusted', 'Wise', 'Analytical'],
    examples: ['Google', 'IBM', 'Harvard'],
    description: 'Seeks truth and knowledge. Emphasizes wisdom, expertise, and thought leadership.',
    color: '#6366f1'
  },
  hero: {
    name: 'The Hero',
    traits: ['Brave', 'Strong', 'Competent', 'Inspiring'],
    examples: ['Nike', 'BMW', 'FedEx'],
    description: 'Seeks to prove worth through courageous acts. Emphasizes mastery, achievement, and honor.',
    color: '#ef4444'
  },
  outlaw: {
    name: 'The Outlaw',
    traits: ['Rebellious', 'Disruptive', 'Liberating', 'Bold'],
    examples: ['Harley-Davidson', 'Virgin', 'Patagonia'],
    description: 'Seeks revolution and change. Emphasizes disruption, rebellion, and liberation.',
    color: '#1f2937'
  },
  magician: {
    name: 'The Magician',
    traits: ['Visionary', 'Transformative', 'Charismatic', 'Innovative'],
    examples: ['Apple', 'Tesla', 'Disney'],
    description: 'Seeks to make dreams come true. Emphasizes transformation, vision, and wonder.',
    color: '#a855f7'
  },
  caregiver: {
    name: 'The Caregiver',
    traits: ['Caring', 'Supportive', 'Nurturing', 'Protective'],
    examples: ['Johnson & Johnson', 'UNICEF', 'Kleenex'],
    description: 'Seeks to help and protect. Emphasizes compassion, service, and generosity.',
    color: '#ec4899'
  },
  jester: {
    name: 'The Jester',
    traits: ['Playful', 'Humorous', 'Spontaneous', 'Fun-loving'],
    examples: ['Old Spice', 'M&Ms', 'Skittles'],
    description: 'Seeks to enjoy life and bring joy. Emphasizes fun, humor, and lightheartedness.',
    color: '#f59e0b'
  },
  lover: {
    name: 'The Lover',
    traits: ['Passionate', 'Sensual', 'Committed', 'Romantic'],
    examples: ['Chanel', 'Victoria\'s Secret', 'Godiva'],
    description: 'Seeks intimacy and connection. Emphasizes passion, beauty, and sensuality.',
    color: '#e11d48'
  },
  creator: {
    name: 'The Creator',
    traits: ['Creative', 'Innovative', 'Imaginative', 'Artistic'],
    examples: ['Lego', 'Adobe', 'Canon'],
    description: 'Seeks to create something new. Emphasizes innovation, imagination, and design.',
    color: '#14b8a6'
  },
  ruler: {
    name: 'The Ruler',
    traits: ['Authoritative', 'Responsible', 'Commanding', 'Sophisticated'],
    examples: ['Mercedes-Benz', 'Rolex', 'American Express'],
    description: 'Seeks control and order. Emphasizes leadership, responsibility, and success.',
    color: '#f59e0b'
  },
  everyman: {
    name: 'The Everyman',
    traits: ['Friendly', 'Approachable', 'Humble', 'Real'],
    examples: ['IKEA', 'Target', 'eBay'],
    description: 'Seeks belonging and connection. Emphasizes realism, accessibility, and community.',
    color: '#6b7280'
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#0f172a' : '#f8fafc';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function generateColorScale(baseColor: string): string[] {
  const { r, g, b } = hexToRgb(baseColor);
  const scale = [];
  for (let i = 0; i <= 10; i++) {
    const factor = i / 10;
    const newR = Math.round(r * (1 - factor) + 255 * factor);
    const newG = Math.round(g * (1 - factor) + 255 * factor);
    const newB = Math.round(b * (1 - factor) + 255 * factor);
    scale.push(`rgb(${newR}, ${newG}, ${newB})`);
  }
  return scale;
}

// ============================================
// COMPONENTS
// ============================================

function Section({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
  completed,
  description,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  completed: boolean;
  description?: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden print:!bg-white print:!border-gray-300 print:shadow-none print:mb-6" style={{ pageBreakInside: 'avoid' }}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors print:!bg-white print:!border-b print:!border-gray-300 print:!m-0 print:!p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center print:!bg-gray-100">
            <Icon className="w-6 h-6 text-primary-500 print:!text-gray-800" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-semibold text-slate-200 print:!text-slate-900">{title}</h2>
            {description && (
              <p className="text-sm text-slate-500 print:!text-slate-600">{description}</p>
            )}
          </div>
          {completed && (
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center print:hidden">
              <Check className="w-4 h-4 text-green-400" />
            </div>
          )}
        </div>
        <div className="print:hidden">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>
      {isOpen && <div className="px-6 pb-6 border-t border-slate-800 print:!border-t print:!border-gray-200 print:!bg-white print:!p-4">{children}</div>}
    </div>
  );
}

function ColorDetailCard({ color, name, description, usage }: { color: string; name: string; description?: string; usage?: string }) {
  const contrastColor = getContrastColor(color);
  const scale = generateColorScale(color);

  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden print:!bg-white print:!border print:!border-gray-300" style={{ pageBreakInside: 'avoid' }}>
      <div
        className="h-32 flex items-end p-4 print:!h-20"
        style={{ backgroundColor: color, color: contrastColor }}
      >
        <div>
          <p className="font-semibold text-lg print:!text-base">{name}</p>
          <p className="text-sm opacity-80 font-mono print:!text-xs">{color}</p>
        </div>
      </div>
      <div className="p-4 space-y-3 print:!p-3 print:!space-y-2">
        {description && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 print:!text-gray-500">Description</p>
            <p className="text-sm text-slate-300 print:!text-gray-700 print:!text-xs">{description}</p>
          </div>
        )}
        {usage && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 print:!text-gray-500">Usage</p>
            <p className="text-sm text-slate-400 print:!text-gray-600 print:!text-xs">{usage}</p>
          </div>
        )}
        <div className="pt-2 print:hidden">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tints</p>
          <div className="flex h-6 rounded-lg overflow-hidden">
            {scale.slice(0, 10).map((tint, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: tint }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPairCard({ fg, bg, name, description }: { fg: string; bg: string; name: string; description: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden print:!bg-white print:!border print:!border-gray-300" style={{ pageBreakInside: 'avoid' }}>
      <div
        className="h-24 flex items-center justify-center p-4 print:!h-16"
        style={{ backgroundColor: bg }}
      >
        <p className="text-2xl font-bold print:!text-xl" style={{ color: fg }}>{name}</p>
      </div>
      <div className="p-4 print:!p-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 print:!text-gray-500">Combination</p>
        <p className="text-sm text-slate-300 print:!text-gray-700 print:!text-xs">{description}</p>
        <div className="mt-3 flex gap-2 print:hidden">
          <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 font-mono">{fg}</span>
          <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 font-mono">{bg}</span>
        </div>
      </div>
    </div>
  );
}

function TypographySpec({
  font,
  name,
  sample,
  size,
  weight,
  lineHeight,
  letterSpacing
}: {
  font: string;
  name: string;
  sample: string;
  size: string;
  weight: string;
  lineHeight?: string;
  letterSpacing?: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 space-y-4 print:!bg-white print:!border print:!border-gray-300 print:!p-4" style={{ pageBreakInside: 'avoid' }}>
      <div
        className="text-slate-200 print:!text-slate-900"
        style={{
          fontFamily: font,
          fontSize: size,
          fontWeight: weight,
          lineHeight: lineHeight || 'normal',
          letterSpacing: letterSpacing || 'normal'
        }}
      >
        {sample}
      </div>
      <div className="pt-4 border-t border-slate-700 space-y-2 print:!border-gray-300 print:!space-y-1">
        <div className="flex justify-between">
          <span className="text-xs text-slate-500 print:!text-gray-500">Font Family</span>
          <span className="text-sm text-slate-300 font-mono print:!text-gray-700 print:!text-xs">{font}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-slate-500 print:!text-gray-500">Size</span>
          <span className="text-sm text-slate-300 print:!text-gray-700 print:!text-xs">{size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-slate-500 print:!text-gray-500">Weight</span>
          <span className="text-sm text-slate-300 print:!text-gray-700 print:!text-xs">{weight}</span>
        </div>
        {lineHeight && (
          <div className="flex justify-between">
            <span className="text-xs text-slate-500 print:!text-gray-500">Line Height</span>
            <span className="text-sm text-slate-300 print:!text-gray-700 print:!text-xs">{lineHeight}</span>
          </div>
        )}
        {letterSpacing && (
          <div className="flex justify-between">
            <span className="text-xs text-slate-500 print:!text-gray-500">Letter Spacing</span>
            <span className="text-sm text-slate-300 print:!text-gray-700 print:!text-xs">{letterSpacing}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function BorderRadiusDemo({ size, value }: { size: string; value: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col items-center print:!bg-white print:!border print:!border-gray-300" style={{ pageBreakInside: 'avoid' }}>
      <div
        className="w-24 h-24 bg-primary-500 mb-3 print:!w-16 print:!h-16"
        style={{ borderRadius: value }}
      />
      <p className="text-sm font-medium text-slate-300 print:!text-slate-700">{size}</p>
      <p className="text-xs text-slate-500 font-mono print:!text-gray-500">{value}</p>
    </div>
  );
}

function SpacingDemo({ name, value, visual }: { name: string; value: string; visual: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 print:!bg-white print:!border print:!border-gray-300" style={{ pageBreakInside: 'avoid' }}>
      <div className="h-16 bg-slate-700/50 rounded-lg mb-3 overflow-hidden print:!bg-gray-100">
        <div className="h-full bg-primary-500/20 border-l-4 border-primary-500 flex items-center pl-4 print:!bg-gray-200 print:!border-gray-400">
          <span className="text-xs text-slate-400 print:!text-gray-600">{name} spacing</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-300 print:!text-slate-700">{name}</p>
      <p className="text-xs text-slate-500 font-mono print:!text-gray-500">{value}</p>
      <p className="text-xs text-slate-500 print:!text-gray-500">{visual}</p>
    </div>
  );
}

function InfoCard({ title, value, subtitle }: { title: string; value?: string; subtitle?: string }) {
  if (!value) return null;
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 print:!bg-white print:!border print:!border-gray-300" style={{ pageBreakInside: 'avoid' }}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 print:!text-gray-500">{title}</p>
      <p className="text-base text-slate-200 print:!text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1 print:!text-gray-500">{subtitle}</p>}
    </div>
  );
}

function ToneSlider({ name, value, left, right }: { name: string; value: number; left: string; right: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 print:!bg-white print:!border print:!border-gray-300" style={{ pageBreakInside: 'avoid' }}>
      <div className="flex justify-between text-xs text-slate-500 mb-2 print:!text-gray-500">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3 print:!bg-gray-300">
        <div
          className="h-full bg-gradient-to-r from-slate-500 to-primary-500 print:!bg-primary-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-300 capitalize print:!text-slate-700">{name}</span>
        <span className="text-sm text-slate-400 print:!text-gray-500">{value}%</span>
      </div>
    </div>
  );
}

function DoDontCard({ type, items }: { type: 'do' | 'dont'; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className={cn(
      "rounded-xl p-4 border print:!p-3",
      type === 'do'
        ? "bg-green-500/10 border-green-500/30 print:!bg-white print:!border-green-600"
        : "bg-red-500/10 border-red-500/30 print:!bg-white print:!border-red-600"
    )} style={{ pageBreakInside: 'avoid' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center",
          type === 'do' ? "bg-green-500/20 print:!hidden" : "bg-red-500/20 print:!hidden"
        )}>
          {type === 'do' ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
        </div>
        <span className={cn(
          "font-semibold",
          type === 'do' ? "text-green-400 print:!text-green-700" : "text-red-400 print:!text-red-700"
        )}>
          {type === 'do' ? "Do" : "Don't"}
        </span>
      </div>
      <ul className="space-y-2 print:!space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-300 flex items-start gap-2 print:!text-gray-700">
            <span className={type === 'do' ? "text-green-400 print:!text-green-600" : "text-red-400 print:!text-red-600"}>
              {type === 'do' ? "✓" : "×"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TouchpointCard({ name, icon: Icon }: { name: string; icon: any }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-3 print:!bg-white print:!border print:!border-gray-300" style={{ pageBreakInside: 'avoid' }}>
      <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center print:!bg-gray-100 print:!hidden">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <span className="text-sm text-slate-300 print:!text-slate-700">{name}</span>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BrandManualPage() {
  const { user } = useAuthStore();
  const { activeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || activeCompanyId;
  const printRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState<BrandStrategy | null>(null);
  const [visualIdentity, setVisualIdentity] = useState<VisualIdentity | null>(null);
  const [openSections, setOpenSections] = useState<string[]>(['identity', 'visual', 'messaging', 'audience', 'tone', 'application']);
  const [copied, setCopied] = useState(false);

  // Load data from both modules
  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [strategyResponse, visualResponse] = await Promise.all([
          moduleDataApi.get('brand-strategy', companyId),
          moduleDataApi.get('visual-identity', companyId),
        ]);

        if (strategyResponse.data) {
          setStrategy(strategyResponse.data as BrandStrategy);
        }
        if (visualResponse.data) {
          setVisualIdentity(visualResponse.data as VisualIdentity);
        }
      } catch (error) {
        console.error('Failed to load brand manual data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [companyId]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const hasStrategy = !!(strategy && strategy.brandName);
  const hasVisualIdentity = !!(visualIdentity && visualIdentity.primaryColor);

  // Calculate completion
  const strategyFields = ['brandName', 'tagline', 'brandPromise', 'brandArchetype', 'brandValues', 'brandPositioning'];
  const visualFields = ['primaryColor', 'headingFont', 'bodyFont'];

  const strategyComplete = strategyFields.filter(f => strategy?.[f as keyof BrandStrategy]).length;
  const visualComplete = visualFields.filter(f => visualIdentity?.[f as keyof VisualIdentity]).length;
  const completionPercent = Math.round(((strategyComplete + visualComplete) / (strategyFields.length + visualFields.length)) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    // Expand all sections before generating PDF
    setOpenSections(['identity', 'visual', 'messaging', 'audience', 'tone', 'application']);

    // Wait for sections to expand
    await new Promise(resolve => setTimeout(resolve, 500));

    const element = printRef.current;
    const opt = {
      margin: [0.4, 0.4, 0.4, 0.4] as [number, number, number, number],
      filename: `${strategy?.brandName || 'brand'}-manual.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait' as const,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['.avoid-break', 'Section', 'img', 'table', '.color-card'],
      },
    };

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <p className="text-slate-400">Please select a company to view brand manual.</p>
      </div>
    );
  }

  const selectedArchetype = strategy?.brandArchetype ? ARCHETYPES[strategy.brandArchetype] : null;

  return (
    <div ref={printRef} className="max-w-6xl mx-auto space-y-6 print:!bg-white print:!p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-200">Brand Manual</h1>
            </div>
          </div>
          <p className="text-slate-400">Your complete brand guidelines document</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-slate-900 rounded-lg transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          {strategy?.brandName || 'Brand'} Guidelines
        </h1>
        <p className="text-slate-600">Official Brand Manual</p>
        <p className="text-sm text-slate-500 mt-4">
          Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Cover Section with Brand Identity */}
      {hasStrategy && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700 print:!bg-white print:!border-gray-300 print:!shadow-none" style={{ pageBreakAfter: 'avoid', pageBreakInside: 'avoid' }}>
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-slate-300">Brand Identity</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white print:text-slate-900">
              {strategy.brandName}
            </h1>

            {strategy.tagline && (
              <p className="text-xl md:text-2xl text-slate-400 italic print:text-slate-600">
                "{strategy.tagline}"
              </p>
            )}

            {strategy.brandPromise && (
              <div className="max-w-2xl mx-auto pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Brand Promise</p>
                <p className="text-lg text-slate-300 print:text-slate-700">{strategy.brandPromise}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Status */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 print:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-slate-200">Brand Manual Completion</h2>
          </div>
          <span className="text-2xl font-bold text-primary-400">{completionPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {hasStrategy ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-sm text-slate-400">Brand Strategy</span>
          </div>
          <div className="flex items-center gap-2">
            {hasVisualIdentity ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-sm text-slate-400">Visual Identity</span>
          </div>
        </div>
      </div>

      {/* Manual Sections */}
      <div className="space-y-6 print:!space-y-4">
        {/* Section 1: Brand Strategy Overview */}
        <Section
          title="Brand Strategy"
          icon={Brain}
          description="Core brand identity and positioning"
          isOpen={openSections.includes('identity')}
          onToggle={() => toggleSection('identity')}
          completed={hasStrategy}
        >
          <div className="pt-8 space-y-8">
            {!strategy ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl">
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No brand strategy data found.</p>
                <a href="/brand/strategy" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-slate-900 rounded-lg font-medium">
                  Complete Brand Strategy →
                </a>
              </div>
            ) : (
              <>
                {/* Brand Overview Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoCard title="Brand Name" value={strategy.brandName} />
                  <InfoCard title="Tagline" value={strategy.tagline} />
                  <InfoCard title="Market Category" value={strategy.marketCategory} />
                  <InfoCard
                    title="Archetype"
                    value={selectedArchetype?.name}
                    subtitle={selectedArchetype ? selectedArchetype.description : undefined}
                  />
                </div>

                {/* Brand Promise */}
                {strategy.brandPromise && (
                  <div className="bg-gradient-to-r from-primary-500/10 to-transparent border-l-4 border-primary-500 p-6 rounded-r-xl print:!bg-white print:!border-l-4 print:!border-gray-800">
                    <p className="text-xs text-primary-400 uppercase tracking-wider mb-2 print:!text-gray-600">Brand Promise</p>
                    <p className="text-xl text-slate-200 italic print:!text-slate-900">"{strategy.brandPromise}"</p>
                  </div>
                )}

                {/* Brand Story */}
                {strategy.brandStory && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Brand Story
                    </h4>
                    <div className="bg-slate-800/30 rounded-xl p-6 text-slate-300 leading-relaxed">
                      {strategy.brandStory}
                    </div>
                  </div>
                )}

                {/* Brand Values */}
                {strategy.brandValues?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Brand Values
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {strategy.brandValues.map((value) => (
                        <div
                          key={value}
                          className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700"
                        >
                          <span className="text-slate-200 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personality Traits */}
                {strategy.brandPersonality?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Brand Personality
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {strategy.brandPersonality.map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-full text-sm font-medium"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Archetype Details */}
                {selectedArchetype && (
                  <div className="bg-slate-800/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
                        style={{
                          backgroundColor: `${selectedArchetype.color}20`,
                          color: selectedArchetype.color
                        }}
                      >
                        {selectedArchetype.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-200 mb-1">{selectedArchetype.name}</h4>
                        <p className="text-sm text-slate-400 mb-3">{selectedArchetype.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Traits:</span>{' '}
                            <span className="text-slate-300">{selectedArchetype.traits.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Examples:</span>{' '}
                            <span className="text-slate-300">{selectedArchetype.examples.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div className="grid md:grid-cols-2 gap-6">
                  {strategy.emotionalBenefits && (
                    <div className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 rounded-xl p-6 print:!bg-white print:!border-gray-300">
                      <h4 className="text-sm font-medium text-pink-400 mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Emotional Benefits
                      </h4>
                      <p className="text-slate-300">{strategy.emotionalBenefits}</p>
                    </div>
                  )}
                  {strategy.rationalBenefits && (
                    <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-6 print:!bg-white print:!border-gray-300">
                      <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Rational Benefits
                      </h4>
                      <p className="text-slate-300">{strategy.rationalBenefits}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Section>

        {/* Section 2: Visual Identity System */}
        <Section
          title="Visual Identity System"
          icon={Palette}
          description="Colors, typography, spacing, and design tokens"
          isOpen={openSections.includes('visual')}
          onToggle={() => toggleSection('visual')}
          completed={hasVisualIdentity}
        >
          <div className="pt-8 space-y-10">
            {!visualIdentity ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl">
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No visual identity data found.</p>
                <a href="/visual-identity" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-slate-900 rounded-lg font-medium">
                  Complete Visual Identity →
                </a>
              </div>
            ) : (
              <>
                {/* Color Palette */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary-500" />
                    Color Palette
                  </h3>

                  {/* Primary Colors */}
                  <div className="mb-8">
                    <p className="text-sm text-slate-500 mb-4">Primary Brand Colors</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <ColorDetailCard
                        color={visualIdentity.primaryColor}
                        name="Primary"
                        description="Main brand color for primary actions, buttons, and key highlights"
                        usage="CTAs, primary buttons, key highlights, active states"
                      />
                      <ColorDetailCard
                        color={visualIdentity.secondaryColor}
                        name="Secondary"
                        description="Supporting color that complements the primary"
                        usage="Secondary buttons, backgrounds, supporting elements"
                      />
                      <ColorDetailCard
                        color={visualIdentity.accentColor}
                        name="Accent"
                        description="Accent color for special highlights and emphasis"
                        usage="Special CTAs, promotions, decorative elements"
                      />
                    </div>
                  </div>

                  {/* Neutral Colors */}
                  <div className="mb-8">
                    <p className="text-sm text-slate-500 mb-4">Neutral Colors</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <ColorDetailCard
                        color={visualIdentity.backgroundColor}
                        name="Background"
                        description="Primary background color for pages"
                        usage="Page backgrounds, main containers"
                      />
                      <ColorDetailCard
                        color={visualIdentity.surfaceColor}
                        name="Surface"
                        description="Surface color for cards, panels, and elevated elements"
                        usage="Cards, modals, dropdowns, elevated surfaces"
                      />
                      <ColorDetailCard
                        color={visualIdentity.textMutedColor}
                        name="Muted Text"
                        description="Color for secondary text and disabled states"
                        usage="Secondary text, placeholders, disabled text"
                      />
                    </div>
                  </div>

                  {/* Feedback Colors */}
                  {(visualIdentity.successColor || visualIdentity.errorColor || visualIdentity.warningColor) && (
                    <div>
                      <p className="text-sm text-slate-500 mb-4">Feedback Colors</p>
                      <div className="grid md:grid-cols-4 gap-6">
                        {visualIdentity.successColor && (
                          <ColorDetailCard
                            color={visualIdentity.successColor}
                            name="Success"
                            usage="Success messages, completed states, positive actions"
                          />
                        )}
                        {visualIdentity.errorColor && (
                          <ColorDetailCard
                            color={visualIdentity.errorColor}
                            name="Error"
                            usage="Error messages, destructive actions, validation errors"
                          />
                        )}
                        {visualIdentity.warningColor && (
                          <ColorDetailCard
                            color={visualIdentity.warningColor}
                            name="Warning"
                            usage="Warning messages, caution states, important notices"
                          />
                        )}
                        {visualIdentity.infoColor && (
                          <ColorDetailCard
                            color={visualIdentity.infoColor}
                            name="Info"
                            usage="Information messages, tips, hints"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Color Combinations */}
                  <div className="mt-8">
                    <p className="text-sm text-slate-500 mb-4">Recommended Color Combinations</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <ColorPairCard
                        fg={visualIdentity.backgroundColor}
                        bg={visualIdentity.primaryColor}
                        name="Primary on Light"
                        description="Use for primary buttons on light backgrounds"
                      />
                      <ColorPairCard
                        fg={visualIdentity.textColor}
                        bg={visualIdentity.surfaceColor}
                        name="Text on Surface"
                        description="Standard text on card surfaces"
                      />
                      <ColorPairCard
                        fg={visualIdentity.accentColor}
                        bg={visualIdentity.backgroundColor}
                        name="Accent Highlight"
                        description="For promotional and special content"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography System */}
                <div className="border-t border-slate-800 pt-8">
                  <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary-500" />
                    Typography System
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <TypographySpec
                      font={visualIdentity.headingFont}
                      name="Heading Font"
                      sample="The Quick Brown Fox"
                      size="2rem"
                      weight="700"
                      lineHeight={visualIdentity.headingLineHeight}
                      letterSpacing={visualIdentity.headingLetterSpacing}
                    />
                    <TypographySpec
                      font={visualIdentity.bodyFont}
                      name="Body Font"
                      sample="The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
                      size="1rem"
                      weight="400"
                      lineHeight={visualIdentity.bodyLineHeight}
                      letterSpacing={visualIdentity.bodyLetterSpacing}
                    />
                  </div>

                  {/* Font Usage */}
                  <div className="mt-6 grid md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Headings</p>
                      <p className="text-sm text-slate-300 font-medium" style={{ fontFamily: visualIdentity.headingFont }}>
                        {visualIdentity.headingFont}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">H1, H2, H3, H4, H5, H6</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Body Text</p>
                      <p className="text-sm text-slate-300" style={{ fontFamily: visualIdentity.bodyFont }}>
                        {visualIdentity.bodyFont}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Paragraphs, lists, descriptions</p>
                    </div>
                    {visualIdentity.accentFont && (
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Accent</p>
                        <p className="text-sm text-slate-300" style={{ fontFamily: visualIdentity.accentFont }}>
                          {visualIdentity.accentFont}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Quotes, callouts, special text</p>
                      </div>
                    )}
                    {visualIdentity.monoFont && (
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Monospace</p>
                        <p className="text-sm text-slate-300 font-mono">{visualIdentity.monoFont}</p>
                        <p className="text-xs text-slate-500 mt-1">Code, data, technical content</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Border Radius */}
                <div className="border-t border-slate-800 pt-8">
                  <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary-500" />
                    Border Radius Scale
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <BorderRadiusDemo size="Small" value={visualIdentity.borderRadiusSm} />
                    <BorderRadiusDemo size="Medium" value={visualIdentity.borderRadiusMd} />
                    <BorderRadiusDemo size="Large" value={visualIdentity.borderRadiusLg} />
                    <BorderRadiusDemo size="Extra Large" value={visualIdentity.borderRadiusXl} />
                  </div>
                </div>

                {/* Spacing */}
                <div className="border-t border-slate-800 pt-8">
                  <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                    <MousePointer className="w-5 h-5 text-primary-500" />
                    Spacing System
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <SpacingDemo
                      name="Section"
                      value={visualIdentity.sectionSpacing || '3rem'}
                      visual="Between major sections"
                    />
                    <SpacingDemo
                      name="Component"
                      value={visualIdentity.componentSpacing || '1rem'}
                      visual="Between related components"
                    />
                    <SpacingDemo
                      name="Element"
                      value={visualIdentity.elementSpacing || '0.5rem'}
                      visual="Between inline elements"
                    />
                  </div>
                </div>

                {/* Icon Style */}
                {visualIdentity.iconStyle && (
                  <div className="border-t border-slate-800 pt-8">
                    <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary-500" />
                      Icon Style Guidelines
                    </h3>
                    <div className="bg-slate-800/50 rounded-xl p-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Style</p>
                          <p className="text-lg text-slate-200">{visualIdentity.iconStyle.name}</p>
                          <p className="text-sm text-slate-400">{visualIdentity.iconStyle.style}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Stroke Width</p>
                          <p className="text-lg text-slate-200">{visualIdentity.iconStyle.strokeWidth}px</p>
                          <p className="text-sm text-slate-400">Line thickness</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Default Size</p>
                          <p className="text-lg text-slate-200">{visualIdentity.iconStyle.defaultSize}px</p>
                          <p className="text-sm text-slate-400">Base icon dimension</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div
                            className="w-12 h-12 border-2 rounded-lg flex items-center justify-center"
                            style={{
                              borderColor: visualIdentity.primaryColor,
                              borderWidth: visualIdentity.iconStyle.strokeWidth
                            }}
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: visualIdentity.primaryColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Style */}
                {visualIdentity.imageStyle && (
                  <div className="border-t border-slate-800 pt-8">
                    <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                      <Image className="w-5 h-5 text-primary-500" />
                      Image Style Guidelines
                    </h3>
                    <div className="bg-slate-800/50 rounded-xl p-6">
                      <p className="text-lg text-slate-200 mb-2">{visualIdentity.imageStyle.name}</p>
                      <p className="text-slate-400">{visualIdentity.imageStyle.description}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Section>

        {/* Section 3: Brand Messaging */}
        <Section
          title="Brand Messaging"
          icon={MessageSquare}
          description="Positioning, value proposition, and key messages"
          isOpen={openSections.includes('messaging')}
          onToggle={() => toggleSection('messaging')}
          completed={!!strategy?.brandMessage}
        >
          <div className="pt-8 space-y-8">
            {!strategy ? (
              <p className="text-slate-500 text-center py-8">No messaging data available.</p>
            ) : (
              <>
                {/* Positioning Statement */}
                {strategy.brandPositioning && (
                  <div className="bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-500/30 rounded-xl p-6 print:!bg-white print:!border-gray-300">
                    <h4 className="text-sm font-semibold text-primary-400 mb-3 flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      Brand Positioning Statement
                    </h4>
                    <p className="text-slate-200 text-lg leading-relaxed">{strategy.brandPositioning}</p>
                  </div>
                )}

                {/* UVP */}
                {strategy.uniqueValueProposition && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Unique Value Proposition
                    </h4>
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <p className="text-slate-300 text-lg">{strategy.uniqueValueProposition}</p>
                    </div>
                  </div>
                )}

                {/* Competitive Difference */}
                {strategy.competitiveDifference && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary-400" />
                      Competitive Difference
                    </h4>
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <p className="text-slate-300">{strategy.competitiveDifference}</p>
                    </div>
                  </div>
                )}

                {/* Core Brand Message */}
                {strategy.brandMessage && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      Core Brand Message
                    </h4>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                      <p className="text-slate-200 text-lg leading-relaxed">{strategy.brandMessage}</p>
                    </div>
                  </div>
                )}

                {/* Key Messages */}
                {strategy.keyMessages?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Key Messages
                    </h4>
                    <div className="space-y-3">
                      {strategy.keyMessages.map((msg, i) => (
                        <div key={i} className="flex items-start gap-4 bg-slate-800/30 rounded-xl p-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold">
                            {i + 1}
                          </span>
                          <p className="text-slate-300 pt-1">{msg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Elevator Pitch */}
                {strategy.elevatorPitch && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-green-400" />
                      Elevator Pitch
                    </h4>
                    <div className="bg-gradient-to-r from-green-500/10 to-transparent border-l-4 border-green-500 rounded-r-xl p-6 print:!bg-white print:!border-gray-300">
                      <p className="text-slate-200 italic text-lg leading-relaxed">"{strategy.elevatorPitch}"</p>
                      <button
                        onClick={() => copyToClipboard(strategy.elevatorPitch)}
                        className="mt-4 flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy to clipboard'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Section>

        {/* Section 4: Target Audience */}
        <Section
          title="Target Audience"
          icon={Users}
          description="Demographics, psychographics, and customer insights"
          isOpen={openSections.includes('audience')}
          onToggle={() => toggleSection('audience')}
          completed={!!strategy?.targetAudience?.demographics}
        >
          <div className="pt-8 space-y-8">
            {!strategy?.targetAudience ? (
              <p className="text-slate-500 text-center py-8">No audience data available.</p>
            ) : (
              <>
                {/* Demographics & Psychographics */}
                <div className="grid md:grid-cols-2 gap-6">
                  {strategy.targetAudience.demographics && (
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        Demographics
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{strategy.targetAudience.demographics}</p>
                    </div>
                  )}
                  {strategy.targetAudience.psychographics && (
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        Psychographics
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{strategy.targetAudience.psychographics}</p>
                    </div>
                  )}
                </div>

                {/* Pain Points */}
                {strategy.targetAudience.painPoints?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      Pain Points
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {strategy.targetAudience.painPoints.map((point) => (
                        <div key={point} className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                          <span className="text-red-400 mt-0.5">→</span>
                          <p className="text-slate-300">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Desires */}
                {strategy.targetAudience.desires?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-green-400" />
                      Desires & Aspirations
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {strategy.targetAudience.desires.map((desire) => (
                        <div key={desire} className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <span className="text-green-400 mt-0.5">★</span>
                          <p className="text-slate-300">{desire}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buying Behaviors */}
                {strategy.targetAudience.behaviors && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-primary-400" />
                      Buying Behaviors
                    </h4>
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <p className="text-slate-300">{strategy.targetAudience.behaviors}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Section>

        {/* Section 5: Tone of Voice */}
        <Section
          title="Tone of Voice"
          icon={Volume2}
          description="Voice attributes, guidelines, and examples"
          isOpen={openSections.includes('tone')}
          onToggle={() => toggleSection('tone')}
          completed={!!strategy?.toneAttributes}
        >
          <div className="pt-8 space-y-8">
            {!strategy?.toneAttributes ? (
              <p className="text-slate-500 text-center py-8">No tone guidelines available.</p>
            ) : (
              <>
                {/* Tone Sliders */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-4">Tone Attributes</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ToneSlider
                      name="Professional"
                      value={strategy.toneAttributes.professional}
                      left="Casual"
                      right="Formal"
                    />
                    <ToneSlider
                      name="Friendly"
                      value={strategy.toneAttributes.friendly}
                      left="Reserved"
                      right="Warm"
                    />
                    <ToneSlider
                      name="Authoritative"
                      value={strategy.toneAttributes.authoritative}
                      left="Humble"
                      right="Expert"
                    />
                    <ToneSlider
                      name="Playful"
                      value={strategy.toneAttributes.playful}
                      left="Serious"
                      right="Fun"
                    />
                    <ToneSlider
                      name="Empathetic"
                      value={strategy.toneAttributes.empathetic}
                      left="Direct"
                      right="Understanding"
                    />
                    <ToneSlider
                      name="Bold"
                      value={strategy.toneAttributes.bold}
                      left="Conservative"
                      right="Daring"
                    />
                  </div>
                </div>

                {/* Voice Description */}
                {strategy.brandVoice && (
                  <div className="bg-slate-800/30 rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Brand Voice Description</h4>
                    <p className="text-slate-300 leading-relaxed">{strategy.brandVoice}</p>
                  </div>
                )}

                {/* Tone Guidelines */}
                {strategy.toneGuidelines && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Tone Guidelines</h4>
                    <div className="bg-slate-800/30 rounded-xl p-6 text-slate-300 whitespace-pre-wrap">
                      {strategy.toneGuidelines}
                    </div>
                  </div>
                )}

                {/* Do's and Don'ts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <DoDontCard
                    type="do"
                    items={[
                      'Be clear and concise in all communications',
                      'Use active voice whenever possible',
                      'Address the customer directly',
                      'Maintain consistency across all channels',
                      'Match tone to the context and audience',
                    ]}
                  />
                  <DoDontCard
                    type="dont"
                    items={[
                      'Use jargon or overly technical terms',
                      'Be overly casual in formal contexts',
                      'Make promises you cannot keep',
                      'Copy competitor messaging',
                      'Use inconsistent terminology',
                    ]}
                  />
                </div>
              </>
            )}
          </div>
        </Section>

        {/* Section 6: Brand Application */}
        <Section
          title="Brand Application"
          icon={Layout}
          description="Touchpoints and usage guidelines"
          isOpen={openSections.includes('application')}
          onToggle={() => toggleSection('application')}
          completed={!!strategy?.brandTouchpoints?.length}
        >
          <div className="pt-8 space-y-8">
            {!strategy ? (
              <p className="text-slate-500 text-center py-8">No application data available.</p>
            ) : (
              <>
                {/* Touchpoints */}
                {strategy.brandTouchpoints?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-4">Brand Touchpoints</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {strategy.brandTouchpoints.map((touchpoint) => {
                        const Icon = [
                          Monitor, Smartphone, FileText, Mail, Share2,
                          Briefcase, Image, Volume2
                        ][strategy.brandTouchpoints.indexOf(touchpoint) % 8];
                        return (
                          <TouchpointCard key={touchpoint} name={touchpoint} icon={Icon || Monitor} />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Customer Experience */}
                {strategy.customerExperience && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      Desired Customer Experience
                    </h4>
                    <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-6 print:!bg-white print:!border-gray-300">
                      <p className="text-slate-300 leading-relaxed">{strategy.customerExperience}</p>
                    </div>
                  </div>
                )}

                {/* Usage Guidelines Summary */}
                <div className="bg-slate-800/30 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-400" />
                    Brand Usage Guidelines
                  </h4>
                  <div className="space-y-4 text-sm text-slate-400">
                    <div className="flex items-start gap-3">
                      <span className="text-primary-400 font-semibold">1.</span>
                      <p>Always use the approved color palette. Never deviate from the defined hex codes.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-400 font-semibold">2.</span>
                      <p>Maintain consistent typography. Use heading and body fonts as specified.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-400 font-semibold">3.</span>
                      <p>Preserve spacing ratios. Use the defined spacing system for consistency.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-400 font-semibold">4.</span>
                      <p>Follow the tone of voice guidelines in all written communications.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-400 font-semibold">5.</span>
                      <p>Apply the brand consistently across all touchpoints and channels.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-800 text-sm text-slate-500 print:!border-gray-300 print:!text-gray-500 print:!mt-8">
        <div>
          <p>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 print:!hidden">
          <Shield className="w-4 h-4" />
          <p>Confidential - Internal Use Only</p>
        </div>
        <div className="hidden print:block">
          <p>Confidential - Internal Use Only</p>
        </div>
      </div>
    </div>
  );
}
