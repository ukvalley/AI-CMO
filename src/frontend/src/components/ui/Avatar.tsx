/**
 * Avatar Component (Atom)
 *
 * User profile image with fallback initials.
 */

import React from 'react';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

// ============================================
// SIZE STYLES
// ============================================

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

const statusPositionStyles: Record<AvatarSize, string> = {
  xs: '-bottom-0.5 -right-0.5',
  sm: '-bottom-0.5 -right-0.5',
  md: '-bottom-0.5 -right-0.5',
  lg: '-bottom-1 -right-1',
  xl: '-bottom-1 -right-1',
};

const statusColors: Record<string, string> = {
  online: 'bg-success-500 border-white',
  offline: 'bg-neutral-400 border-white',
  busy: 'bg-error-500 border-white',
  away: 'bg-warning-500 border-white',
};

// ============================================
// INITIALS HELPER
// ============================================

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================
// COMPONENT
// ============================================

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  fallback,
  status,
  className,
  ...props
}) => {
  const [error, setError] = React.useState(false);

  const showFallback = !src || error;
  const initials = fallback ? getInitials(fallback) : '?';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        'rounded-full overflow-hidden',
        'bg-gradient-to-br from-primary-100 to-primary-200',
        'flex-shrink-0',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="font-medium text-primary-700">
          {initials}
        </span>
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            'absolute rounded-full border-2',
            statusSizeStyles[size],
            statusPositionStyles[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

// ============================================
// AVATAR GROUP
// ============================================

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 4,
  className,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div
      className={cn('flex items-center -space-x-2', className)}
      {...props}
    >
      {visibleChildren}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative z-10 flex items-center justify-center',
            'w-10 h-10 rounded-full',
            'bg-neutral-200 text-neutral-600',
            'text-xs font-medium',
            'ring-2 ring-white'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
