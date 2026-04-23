/**
 * Dropdown Component (Molecule)
 *
 * Accessible dropdown menu with keyboard navigation.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
  divider?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const enabledItems = items.filter((item) => !item.disabled && !item.divider);
      const enabledIndices = items
        .map((item, i) => (!item.disabled && !item.divider ? i : -1))
        .filter((i) => i !== -1);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const currentIdx = enabledIndices.indexOf(prev);
            const nextIdx = (currentIdx + 1) % enabledIndices.length;
            return enabledIndices[nextIdx];
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const currentIdx = enabledIndices.indexOf(prev);
            const prevIdx =
              currentIdx === 0 ? enabledIndices.length - 1 : currentIdx - 1;
            return enabledIndices[prevIdx];
          });
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            items[highlightedIndex]?.onClick?.();
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, items]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Set first enabled item as highlighted
      const firstEnabled = items.findIndex((item) => !item.disabled && !item.divider);
      setHighlightedIndex(firstEnabled);
    }
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-popover mt-2 w-56',
            'bg-white rounded-lg',
            'shadow-soft-lg border border-neutral-100',
            'animate-fade-in animate-scale-in origin-top',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <hr
                    key={`divider-${index}`}
                    className="my-1 border-neutral-100"
                  />
                );
              }

              const Icon = item.icon;
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick?.();
                      setIsOpen(false);
                    }
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full px-4 py-2 text-left',
                    'flex items-center justify-between',
                    'text-sm text-neutral-700',
                    'transition-colors duration-150',
                    'focus:outline-none',
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-neutral-50 cursor-pointer',
                    isHighlighted && 'bg-neutral-50'
                  )}
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    {Icon && (<Icon className="w-4 h-4 text-neutral-400" />)}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <kbd className="text-xs text-neutral-400 font-mono">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
