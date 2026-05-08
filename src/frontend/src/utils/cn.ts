/**
 * cn - Class Name Utility
 *
 * Combines Tailwind classes with proper precedence using clsx and tailwind-merge.
 * Handles conditional classes and resolves Tailwind conflicts.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind conflict resolution
 * @param inputs - Class names to merge
 * @returns Merged class string
 *
 * @example
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500'
 * cn('px-4', condition && 'px-6') // 'px-6' (if condition is true)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
