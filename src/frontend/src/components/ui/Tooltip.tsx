/**
 * Tooltip Component (Molecule)
 *
 * Accessible tooltip for icons and interactive elements.
 * Required by Defect Prevention Guide: All action icons must display a tooltip on hover.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

// ============================================
// COMPONENT
// ============================================

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMounted(true);
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setTimeout(() => setIsMounted(false), 150);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-neutral-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-neutral-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-neutral-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-neutral-800',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isMounted && (
        <div
          className={cn(
            'absolute z-tooltip px-2 py-1',
            'bg-neutral-800 text-white text-xs rounded',
            'whitespace-nowrap pointer-events-none',
            'transition-opacity duration-150',
            positionStyles[position],
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <span
            className={cn(
              'absolute w-0 h-0',
              'border-4 border-transparent',
              arrowStyles[position]
            )}
          />
        </div>
      )}
    </div>
  );
};

// ============================================
// ICON BUTTON WITH TOOLTIP
// ============================================

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip: string;
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900',
    danger: 'bg-transparent hover:bg-error-50 text-error-600 hover:text-error-700',
  };

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  };

  return (
    <Tooltip content={tooltip}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-md',
          'transition-colors duration-200 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    </Tooltip>
  );
};
