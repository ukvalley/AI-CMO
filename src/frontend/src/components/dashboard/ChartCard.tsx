/**
 * Chart Card Component (Molecule)
 *
 * Container for charts with title, legend, and time range selector.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Download, Calendar } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';

// ============================================
// TYPES
// ============================================

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  timeRanges?: string[];
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
  loading?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  timeRanges = ['7 days', '30 days', '90 days', '1 year'],
  selectedRange = '30 days',
  onRangeChange,
  loading = false,
  className,
}) => {
  const [activeRange, setActiveRange] = React.useState(selectedRange);

  const handleRangeChange = (range: string) => {
    setActiveRange(range);
    onRangeChange?.(range);
  };

  return (
    <Card padding="md" className={cn('h-full', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="hidden sm:flex items-center bg-neutral-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-all',
                  activeRange === range
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Mobile Time Range */}
          <div className="sm:hidden">
            <Dropdown
              align="right"
              trigger={
                <Button variant="secondary" size="sm" leftIcon={<Calendar className="w-4 h-4" />}
                >
                  {activeRange}
                </Button>
              }
              items={timeRanges.map((range) => ({
                id: range,
                label: range,
                onClick: () => handleRangeChange(range),
              }))}
            />
          </div>

          {/* Actions */}
          <Dropdown
            align="right"
            trigger={
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            }
            items={[
              {
                id: 'download',
                label: 'Download CSV',
                onClick: () => console.log('Download'),
              },
              {
                id: 'share',
                label: 'Share chart',
                onClick: () => console.log('Share'),
              },
              {
                id: 'fullscreen',
                label: 'View fullscreen',
                onClick: () => console.log('Fullscreen'),
              },
            ]}
          />
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {loading ? (
          // Loading skeleton
          <div className="h-64 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="h-32 w-full skeleton" />
              <div className="flex justify-between">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-4 w-12 skeleton" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 w-full">{children}</div>
        )}
      </div>
    </Card>
  );
};

// ============================================
// SIMPLE LINE CHART (Placeholder)
// ============================================

export const SimpleLineChart: React.FC<{
  data: { label: string; value: number }[];
  color?: string;
}> = ({ data, color = '#3b82f6' }) => {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  return (
    <div className="h-full flex flex-col">
      {/* Chart area */}
      <div className="flex-1 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-neutral-100" />
          ))}
        </div>

        {/* Line */}
        <svg
          viewBox={`0 0 ${data.length - 1} 100`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            points={data
              .map((d, i) => {
                const x = i;
                const y = 100 - ((d.value - min) / range) * 80 - 10;
                return `${x},${y}`;
              })
              .join(' ')}
          />
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4">
        {data.map((d, i) => (
          <span
            key={i}
            className="text-xs text-neutral-400"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// ============================================
// BAR CHART (Placeholder)
// ============================================

export const BarChart: React.FC<{
  data: { label: string; value: number; color?: string }[];
}> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="h-full flex items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full max-w-12 rounded-t-md transition-all duration-500"
            style={{
              height: `${(d.value / max) * 100}%`,
              backgroundColor: d.color || '#3b82f6',
            }}
          />
          <span className="text-xs text-neutral-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// DONUT CHART (Placeholder)
// ============================================

export const DonutChart: React.FC<{
  data: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
}> = ({ data, centerLabel, centerValue }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-48 h-48">
          {data.map((d, i) => {
            const percent = d.value / total;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;

            const startX = 50 + 40 * Math.cos(2 * Math.PI * startPercent - Math.PI / 2);
            const startY = 50 + 40 * Math.sin(2 * Math.PI * startPercent - Math.PI / 2);
            const endX = 50 + 40 * Math.cos(2 * Math.PI * cumulativePercent - Math.PI / 2);
            const endY = 50 + 40 * Math.sin(2 * Math.PI * cumulativePercent - Math.PI / 2);

            const largeArc = percent > 0.5 ? 1 : 0;

            return (
              <path
                key={i}
                d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                fill={d.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>

        {/* Center label */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <span className="text-2xl font-bold text-neutral-900">{centerValue}</span>
            )}
            {centerLabel && (
              <span className="text-xs text-neutral-500">{centerLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
