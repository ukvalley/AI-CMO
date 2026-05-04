'use client';

/**
 * SOP Sub-Navigation
 *
 * Tab-style navigation across the four SOP module sub-pages:
 *   Library · Templates · Map · AI Studio
 *
 * Used at the top of each SOP route so users can switch views without
 * going back to the library first.
 */

import React from 'react';
import Link from 'next/link';
import { ClipboardList, Layers, LayoutDashboard, Sparkles } from 'lucide-react';

export type SopSection = 'library' | 'templates' | 'map' | 'ai';

interface NavItem {
  id: SopSection;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: NavItem[] = [
  { id: 'library', label: 'Library', href: '/sops', icon: ClipboardList },
  { id: 'templates', label: 'Templates', href: '/sops/templates', icon: Layers },
  { id: 'map', label: 'Insights', href: '/sops/map', icon: LayoutDashboard },
  { id: 'ai', label: 'AI Studio', href: '/sops/ai', icon: Sparkles },
];

export function SopSubNav({ active }: { active: SopSection }) {
  return (
    <nav className="border-b border-slate-700/60">
      <ul className="flex flex-wrap items-center gap-0.5 -mb-px">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={
                  'inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ' +
                  (isActive
                    ? 'border-primary-500 text-primary-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200')
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
