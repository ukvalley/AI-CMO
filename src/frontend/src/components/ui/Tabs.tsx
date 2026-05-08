/**
 * Tabs Component (Molecule)
 *
 * Accessible tab navigation with keyboard support.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

interface Tab {
  id: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md';
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentEnabledIdx = enabledTabs.findIndex((t) => t.id === tabs[index].id);

    let nextEnabledIdx: number;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextEnabledIdx = (currentEnabledIdx + 1) % enabledTabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextEnabledIdx =
          currentEnabledIdx === 0
            ? enabledTabs.length - 1
            : currentEnabledIdx - 1;
        break;
      case 'Home':
        e.preventDefault();
        nextEnabledIdx = 0;
        break;
      case 'End':
        e.preventDefault();
        nextEnabledIdx = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = enabledTabs[nextEnabledIdx];
    onChange(nextTab.id);
    tabRefs.current.get(nextTab.id)?.focus();
  };

  // Variant styles
  const variantContainerStyles = {
    default: 'bg-neutral-100 p-1 rounded-lg',
    pills: 'gap-1',
    underline: 'border-b border-neutral-200',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <div
      className={cn(
        'flex',
        variantContainerStyles[variant],
        className
      )}
      role="tablist"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={tab.disabled}
            className={cn(
              'relative font-medium transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Size
              sizeStyles[size],

              // Variant-specific styles
              variant === 'default' && [
                'rounded-md',
                isActive
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50',
              ],

              variant === 'pills' && [
                'rounded-full',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
              ],

              variant === 'underline' && [
                '-mb-px border-b-2',
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
              ]
            )}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs rounded-full',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-neutral-200 text-neutral-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ============================================
// TAB PANEL
// ============================================

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tabId: string;
  activeTab: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children,
  className,
  ...props
}) => {
  const isActive = activeTab === tabId;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      hidden={!isActive}
      className={cn(
        'animate-fade-in',
        !isActive && 'hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
