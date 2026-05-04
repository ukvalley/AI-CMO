'use client';

/**
 * SOP Context Menu
 *
 * Lightweight right-click menu for SOP cards and rows. Click outside or
 * Escape to close. Positioned at the cursor.
 */

import React, { useEffect, useRef } from 'react';

export interface SopContextMenuItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
}

export function useSopContextMenu() {
  const [state, setState] = React.useState<{
    x: number;
    y: number;
    items: SopContextMenuItem[];
  } | null>(null);

  const open = (e: React.MouseEvent, items: SopContextMenuItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ x: e.clientX, y: e.clientY, items });
  };

  const close = () => setState(null);

  return { state, open, close };
}

export function SopContextMenu({
  state,
  onClose,
}: {
  state: { x: number; y: number; items: SopContextMenuItem[] } | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [state, onClose]);

  if (!state) return null;

  // Clamp to viewport so the menu is always visible
  const margin = 8;
  const menuW = 200;
  const menuH = state.items.length * 32 + 16;
  const x = Math.min(state.x, window.innerWidth - menuW - margin);
  const y = Math.min(state.y, window.innerHeight - menuH - margin);

  return (
    <div
      ref={ref}
      style={{ left: x, top: y }}
      className="fixed z-50 min-w-[200px] overflow-hidden rounded-md border border-slate-700 bg-slate-900 py-1 shadow-xl shadow-black/40"
      role="menu"
    >
      {state.items.map((item, i) => {
        if (item.divider) return <div key={i} className="my-1 border-t border-slate-800" />;
        const Icon = item.icon;
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={
              'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ' +
              (item.danger
                ? 'text-rose-400 hover:bg-rose-500/15'
                : 'text-slate-200 hover:bg-slate-800 hover:text-primary-300')
            }
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
