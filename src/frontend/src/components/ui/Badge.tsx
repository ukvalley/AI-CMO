/**
 * Badge Component (Atom)
 *
 * Small status indicators for labels, counts, and states.
 */

import React from 'react';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

// ============================================
// VARIANT STYLES
// ============================================

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  error: 'bg-error-50 text-error-700 border-error-200',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
};

// ============================================
// COMPONENT
// ============================================

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        // Base
        'inline-flex items-center justify-center',
        'font-medium rounded-full border',
        'transition-colors duration-200',

        // Size
        sizeStyles[size],

        // Variant
        variantStyles[variant],

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// ============================================
// DOT BADGE (Status indicator)
// ============================================

interface DotBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'online' | 'offline' | 'busy' | 'away';
  label?: string;
}

const statusColors: Record<string, string> = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  busy: 'bg-error-500',
  away: 'bg-warning-500',
};

export const DotBadge: React.FC<DotBadgeProps> = ({
  status = 'online',
  label,
  className,
  ...props
}) => {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          statusColors[status]
        )}
      />
      {label && (
        <span className="text-xs text-neutral-600">{label}</span>
      )}
    </span>
  );
};
