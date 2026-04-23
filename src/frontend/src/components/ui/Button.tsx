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
// VARIANT STYLES
// ============================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary-600 text-white
    hover:bg-primary-700 hover:shadow-md
    active:bg-primary-800
    focus:ring-primary-500
    shadow-sm
  `,
  secondary: `
    bg-white text-neutral-900
    border border-neutral-200
    hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-sm
    active:bg-neutral-100
    focus:ring-primary-500
  `,
  ghost: `
    bg-transparent text-neutral-700
    hover:bg-neutral-100 hover:text-neutral-900
    active:bg-neutral-200
    focus:ring-neutral-400
  `,
  danger: `
    bg-error-600 text-white
    hover:bg-error-700 hover:shadow-md
    active:bg-error-800
    focus:ring-error-500
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
          'inline-flex items-center justify-center',
          'font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          'rounded-md cursor-pointer',

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
