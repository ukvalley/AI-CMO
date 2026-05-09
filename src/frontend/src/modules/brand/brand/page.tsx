/**
 * Brand Module Landing Page
 *
 * Central hub for all brand-related modules.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  Paintbrush,
  Image,
  FileText,
  ArrowRight,
  Palette,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// ============================================
// BRAND MODULE CARDS
// ============================================

const BRAND_MODULES = [
  {
    id: 'brand-strategy',
    name: 'Brand Strategy',
    description: 'Define your brand\'s psychology, archetypes, positioning, messaging, and tone of voice using established frameworks.',
    icon: Brain,
    path: '/brand/strategy',
    color: '#7C6BF0',
    features: ['Brand Archetypes', 'Positioning', 'Tone of Voice', 'Messaging Framework'],
  },
  {
    id: 'visual-identity',
    name: 'Visual Identity',
    description: 'Create your complete design system with colors, typography, spacing, and preview across multiple formats.',
    icon: Paintbrush,
    path: '/visual-identity',
    color: '#EC4899',
    features: ['Color System', 'Typography', 'Templates', 'Live Previews'],
  },
  {
    id: 'brand-assets',
    name: 'Brand Assets',
    description: 'Manage logos, favicons, patterns, backgrounds, and other visual brand elements.',
    icon: Image,
    path: '/brand-assets',
    color: '#3B82F6',
    features: ['Logo Library', 'Favicons', 'Patterns', 'Backgrounds'],
  },
  {
    id: 'stationery',
    name: 'Stationery',
    description: 'Design business cards, letterheads, templates, and other branded materials.',
    icon: FileText,
    path: '/stationery',
    color: '#10B981',
    features: ['Business Cards', 'Letterheads', 'Email Signatures', 'Templates'],
  },
];

// ============================================
// MODULE CARD COMPONENT
// ============================================

function ModuleCard({
  module,
}: {
  module: typeof BRAND_MODULES[0];
}) {
  const Icon = module.icon;

  return (
    <Link
      href={module.path}
      className="group block bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${module.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: module.color }} />
        </div>
        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        {module.name}
      </h3>

      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {module.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {module.features.map((feature) => (
          <span
            key={feature}
            className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded"
          >
            {feature}
          </span>
        ))}
      </div>
    </Link>
  );
}

// ============================================
// BRAND MANUAL CARD
// ============================================

function BrandManualCard() {
  return (
    <Link
      href="/brand/manual"
      className="group block bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-500/30 rounded-xl p-6 hover:border-primary-500/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary-400" />
        </div>
        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary-400 transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        Brand Manual
      </h3>

      <p className="text-sm text-slate-400 mb-4">
        View and download your complete brand guidelines document.
      </p>

      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded">
          View Guidelines
        </span>
      </div>
    </Link>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function BrandLandingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full">
          <Palette className="w-4 h-4 text-primary-500" />
          <span className="text-sm text-primary-400 font-medium">Brand Hub</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-200">
          Build Your Brand
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Create a comprehensive brand identity that resonates with your audience.
          Start with strategy, then bring it to life with visual identity and assets.
        </p>
      </div>

      {/* Recommended Workflow */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-medium text-slate-300 mb-4">Recommended Workflow</h2>
        <div className="flex flex-wrap items-center gap-2">
          {BRAND_MODULES.map((module, index) => (
            <React.Fragment key={module.id}>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                <module.icon className="w-4 h-4" style={{ color: module.color }} />
                <span className="text-sm text-slate-300">{module.name}</span>
              </div>
              {index < BRAND_MODULES.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRAND_MODULES.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
        <BrandManualCard />
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-sm font-medium text-blue-200 mb-2">
          Brand Building Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-300/80">
          <li className="flex items-start gap-2">
            <span className="text-blue-400">1.</span>
            Start with <strong className="text-blue-200">Brand Strategy</strong> to define your foundation before creating visual assets
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">2.</span>
            Use <strong className="text-blue-200">Visual Identity</strong> to ensure consistency across all touchpoints
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">3.</span>
            Keep all assets organized in <strong className="text-blue-200">Brand Assets</strong> for easy team access
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">4.</span>
            Apply your brand to <strong className="text-blue-200">Stationery</strong> for professional communication
          </li>
        </ul>
      </div>
    </div>
  );
}
