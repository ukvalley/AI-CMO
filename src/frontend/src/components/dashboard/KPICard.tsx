/**
 * KPI Card Component (Molecule)
 *
 * Key performance indicator card with trend visualization.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/Card';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, type LucideIcon } from 'lucide-react';

// ============================================
// TYPES
// ============================================

type TrendType = 'up' | 'down' | 'neutral';
type FormatType = 'currency' | 'percentage' | 'number' | 'compact';

interface KPICardProps {
  title: string;
  value: number | string;
  change?: {
    value: number;
    timeframe: string;
    trend: TrendType;
  };
  icon?: LucideIcon;
  format?: FormatType;
  loading?: boolean;
  className?: string;
}

// ============================================
// FORMATTER
// ============================================

const formatValue = (value: number | string, format?: FormatType): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numValue);

    case 'percentage':
      return `${numValue.toFixed(1)}%`;

    case 'compact':
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(numValue);

    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(numValue);
  }
};

// ============================================
// COMPONENT
// ============================================

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  format,
  loading = false,
  className,
}) => {
  const formattedValue = typeof value === 'string' ? value : formatValue(value, format);

  // Trend styling
  const trendStyles: Record<TrendType, { color: string; icon: LucideIcon; bg: string }> = {
    up: {
      color: 'text-success-600',
      icon: ArrowUpRight,
      bg: 'bg-success-50',
    },
    down: {
      color: 'text-error-600',
      icon: ArrowDownRight,
      bg: 'bg-error-50',
    },
    neutral: {
      color: 'text-neutral-600',
      icon: Minus,
      bg: 'bg-neutral-100',
    },
  };

  const trend = change?.trend || 'neutral';
  const TrendIcon = trendStyles[trend].icon;
  const changeColor = trendStyles[trend].color;
  const changeBg = trendStyles[trend].bg;

  return (
    <Card padding="md" hover className={cn('h-full', className)}>
      {loading ? (
        // Loading skeleton
        <div className="space-y-4">
          <div className="h-4 w-24 skeleton" />
          <div className="h-8 w-32 skeleton" />
          <div className="h-4 w-20 skeleton" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
            </div>
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
            )}
          </div>

          {/* Value */}
          <div className="space-y-1">
            <p className="text-3xl font-bold text-neutral-900 tracking-tight">
              {formattedValue}
            </p>

            {/* Change indicator */}
            {change && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium',
                    changeBg,
                    changeColor
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  {Math.abs(change.value).toFixed(1)}%
                </span>
                <span className="text-xs text-neutral-500">
                  vs {change.timeframe}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
