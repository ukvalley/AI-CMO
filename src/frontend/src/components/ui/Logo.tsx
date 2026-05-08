/**
 * Logo Component
 *
 * Mengo logo with different size variants.
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
  href?: string;
}

// ============================================
// SIZE STYLES
// ============================================

const sizeStyles = {
  sm: {
    container: 'w-8 h-8',
    text: 'text-lg',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-xl',
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-2xl',
  },
};

// ============================================
// COMPONENT
// ============================================

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  className,
  href = '/',
}) => {
  const logoContent = (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo Mark */}
      <div
        className={cn(
          'bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0',
          sizeStyles[size].container
        )}
      >
        <span className="text-white font-bold text-sm">AI</span>
      </div>

      {/* Logo Text */}
      {withText && (
        <span className={cn('font-bold text-neutral-900', sizeStyles[size].text)}>
          CMO
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
