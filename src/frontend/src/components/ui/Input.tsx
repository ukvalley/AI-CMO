/**
 * Input Component (Atom)
 *
 * Text input with label, error handling, and icon support.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle } from 'lucide-react';

// ============================================
// TYPES
// ============================================

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

// ============================================
// SIZE STYLES
// ============================================

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};

const iconSizeStyles: Record<InputSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const iconPositionStyles: Record<InputSize, string> = {
  sm: 'left-2.5',
  md: 'left-3',
  lg: 'left-3.5',
};

// ============================================
// COMPONENT
// ============================================

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      inputSize: size = 'md',
      leftIcon,
      rightIcon,
      disabled,
      required,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || React.useId();
    const hasError = !!error;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-slate-300 mb-1.5',
              disabled && 'text-slate-500'
            )}
          >
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-slate-500',
                iconPositionStyles[size],
                'pointer-events-none'
              )}
            >
              {React.isValidElement(leftIcon)
                ? React.cloneElement(leftIcon as React.ReactElement, {
                    className: cn(iconSizeStyles[size]),
                  })
                : leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base styles - Dark theme
              'w-full rounded-lg transition-all duration-200',
              'bg-slate-800 text-slate-200 placeholder:text-slate-500',
              'border focus:outline-none focus:ring-2',
              'disabled:bg-slate-900 disabled:text-slate-500 disabled:cursor-not-allowed',

              // Size
              sizeStyles[size],

              // Padding for icons
              leftIcon && size === 'sm' && 'pl-8',
              leftIcon && size === 'md' && 'pl-10',
              leftIcon && size === 'lg' && 'pl-11',
              rightIcon && size === 'sm' && 'pr-8',
              rightIcon && size === 'md' && 'pr-10',
              rightIcon && size === 'lg' && 'pr-11',

              // Border and focus states
              hasError
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-primary-500 focus:ring-primary-500/20',

              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && !hasError && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 right-3 text-slate-500',
                'pointer-events-auto'
              )}
            >
              {React.isValidElement(rightIcon)
                ? React.cloneElement(rightIcon as React.ReactElement, {
                    className: cn(iconSizeStyles[size]),
                  })
                : rightIcon}
            </div>
          )}

          {/* Error Icon */}
          {hasError && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 right-3 text-red-400',
                'pointer-events-none'
              )}
            >
              <AlertCircle className={iconSizeStyles[size]} />
            </div>
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              hasError ? 'text-red-400' : 'text-slate-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================
// TEXTAREA COMPONENT
// ============================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, disabled, className, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium text-slate-300 mb-1.5',
              disabled && 'text-slate-500'
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            // Base styles - Dark theme
            'w-full rounded-lg transition-all duration-200',
            'bg-slate-800 text-slate-200 placeholder:text-slate-500',
            'border focus:outline-none focus:ring-2',
            'px-3 py-2 text-sm min-h-[80px] resize-y',
            'disabled:bg-slate-900 disabled:text-slate-500 disabled:cursor-not-allowed',

            // Border states
            hasError
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-700 focus:border-primary-500 focus:ring-primary-500/20',

            className
          )}
          {...props}
        />

        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              hasError ? 'text-red-400' : 'text-slate-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
