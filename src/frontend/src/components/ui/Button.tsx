/**
 * Button Component (Atom)
 *
 * A versatile button component with multiple variants and sizes.
 * Follows atomic design principles - single responsibility.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ============================================
// VARIANT STYLES - Dark Theme
// ============================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[#C8FF2E] text-[#0d1117]
    hover:bg-[#d4ff5c] hover:shadow-md
    active:bg-[#b3e62e]
    focus:ring-[#C8FF2E]
    font-semibold
    shadow-[0_0_20px_rgba(200,255,46,0.3)]
  `,
  secondary: `
    bg-[#1a1d21] text-white
    border border-white/10
    hover:bg-[#21262d] hover:border-[#C8FF2E]/30 hover:shadow-sm
    active:bg-[#151920]
    focus:ring-[#C8FF2E]
  `,
  ghost: `
    bg-transparent text-[#878e9a]
    hover:bg-[#1a1d21] hover:text-white
    active:bg-[#21262d]
    focus:ring-[#878e9a]
  `,
  danger: `
    bg-red-500 text-white
    hover:bg-red-600 hover:shadow-md
    active:bg-red-700
    focus:ring-red-500
    shadow-sm
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

// ============================================
// COMPONENT
// ============================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Determine if button is effectively disabled
    const isDisabled = disabled || loading;

    // Render icon with proper sizing
    const renderIcon = (icon: React.ReactNode) => {
      if (!icon) return null;

      // If it's a Lucide icon or similar, clone with size
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon as React.ReactElement, {
          className: cn(iconSizeStyles[size], (icon.props as { className?: string }).className),
        });
      }

      return (
        <span className={iconSizeStyles[size]}>{icon}</span>
      );
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center shrink-0',
          'font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          'rounded-lg cursor-pointer whitespace-nowrap',

          // Variant styles
          variantStyles[variant],

          // Size styles
          sizeStyles[size],

          // Full width
          fullWidth && 'w-full',

          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className={cn(iconSizeStyles[size], 'animate-spin')} />
        )}
        {!loading && leftIcon && renderIcon(leftIcon)}
        <span>{children}</span>
        {!loading && rightIcon && renderIcon(rightIcon)}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================
// BUTTON GROUP
// ============================================

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  attached?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  attached = false,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center',
        attached ? '' : 'gap-2',
        className
      )}
    >
      {attached
        ? React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child;

            const isFirst = index === 0;
            const isLast = index === React.Children.count(children) - 1;

            return React.cloneElement(child as React.ReactElement, {
              className: cn(
                (child.props as { className?: string }).className,
                isFirst && 'rounded-r-none',
                isLast && 'rounded-l-none',
                !isFirst && !isLast && 'rounded-none',
                !isFirst && '-ml-px'
              ),
            });
          })
        : children}
    </div>
  );
};
