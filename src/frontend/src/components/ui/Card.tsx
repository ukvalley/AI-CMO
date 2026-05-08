/**
 * Card Component (Atom)
 *
 * A versatile card component with soft shadows and consistent padding.
 * Foundation for dashboard widgets, KPI cards, and content containers.
 */

import React from 'react';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  shadow?: CardShadow;
  hover?: boolean;
  border?: boolean;
}

// ============================================
// PADDING STYLES
// ============================================

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

// ============================================
// SHADOW STYLES (Soft UI)
// ============================================

const shadowStyles: Record<CardShadow, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-soft-md',
  lg: 'shadow-soft-lg',
  xl: 'shadow-soft-xl',
};

// ============================================
// CARD COMPONENT
// ============================================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      padding = 'md',
      shadow = 'md',
      hover = false,
      border = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles - MENGO Dark theme
          'bg-[#151920] backdrop-blur-sm rounded-xl',
          'transition-all duration-200',

          // Padding
          paddingStyles[padding],

          // Shadow (Soft UI)
          shadowStyles[shadow],

          // Border
          border && 'border border-white/10',

          // Hover effect
          hover && 'hover:border-[#C8FF2E]/30 cursor-pointer hover:shadow-[0_0_20px_rgba(200,255,46,0.1)]',

          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================
// CARD HEADER
// ============================================

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 mb-4',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-semibold text-white truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-[#878e9a] mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </div>
  );
};

// ============================================
// CARD CONTENT
// ============================================

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

// ============================================
// CARD FOOTER
// ============================================

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  align = 'start',
  className,
  ...props
}) => {
  const alignStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 mt-4 pt-4 border-t border-white/10',
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
