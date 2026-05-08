/**
 * Sidebar Component (Organism) - MENGO Theme
 *
 * Navigation sidebar with collapsible menu, module groups, and mobile drawer.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Building2,
  ChevronRight,
  ChevronDown,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { MODULES, GROUPS, getModulesByGroup } from '@/lib/modules';
import { useCompanyStore, useAuthStore, useTaskStore } from '@/stores';
import * as Icons from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// ============================================
// SIDEBAR
// ============================================

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { runningTaskCount } = useTaskStore();
  const { getActiveCompany, companies, setActiveCompany } = useCompanyStore();
  const activeCompany = getActiveCompany();
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(GROUPS.map(g => g.id));

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50',
          'bg-[#0d1117] border-r border-white/10',
          'flex flex-col',
          'transition-all duration-300 ease-in-out',
          // Mobile
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop
          'lg:translate-x-0',
          collapsed ? 'lg:w-20' : 'lg:w-72',
          'w-72'
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Mengo"
              width={32}
              height={32}
              className="rounded-lg flex-shrink-0"
            />
            {!collapsed && (
              <span className="font-semibold text-lg text-white">Mengo</span>
            )}
          </Link>

          {/* Mobile Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="lg:hidden text-[#878e9a]"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Desktop Toggle */}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-[#1a1d21] hover:bg-[#21262d] transition-colors"
          >
            <ChevronRight
              className={cn(
                'w-4 h-4 text-[#878e9a] transition-transform duration-300',
                !collapsed && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Company Switcher */}
        {!collapsed && companies.length > 0 && (
          <div className="px-4 py-3 border-b border-white/10">
            <label className="text-xs text-[#686f7e] uppercase tracking-wide mb-2 block">
              Active Company
            </label>
            <select
              value={activeCompany?.id || ''}
              onChange={(e) => setActiveCompany(e.target.value)}
              className="w-full bg-[#1a1d21] text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-[#C8FF2E]/50"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg',
              'text-sm font-medium transition-colors duration-200',
              'hover:bg-[#1a1d21]',
              pathname === '/dashboard'
                ? 'text-[#C8FF2E] bg-[#C8FF2E]/10 border-l-2 border-[#C8FF2E]'
                : 'text-[#afb6c4] hover:text-white',
              collapsed && 'justify-center'
            )}
          >
            <LayoutDashboard className={cn('w-5 h-5 flex-shrink-0', pathname === '/dashboard' && 'text-[#C8FF2E]')} />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          {/* Companies */}
          <Link
            href="/companies"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg',
              'text-sm font-medium transition-colors duration-200',
              'hover:bg-[#1a1d21]',
              pathname === '/companies'
                ? 'text-[#C8FF2E] bg-[#C8FF2E]/10 border-l-2 border-[#C8FF2E]'
                : 'text-[#afb6c4] hover:text-white',
              collapsed && 'justify-center'
            )}
          >
            <Building2 className={cn('w-5 h-5 flex-shrink-0', pathname === '/companies' && 'text-[#C8FF2E]')} />
            {!collapsed && <span>Companies</span>}
          </Link>

          {/* Module Groups */}
          {!collapsed && GROUPS.map((group) => {
            const groupModules = getModulesByGroup(group.id).filter(m => m.status === 'active');
            if (groupModules.length === 0) return null;
            const isExpanded = expandedGroups.includes(group.id);

            return (
              <div key={group.id}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#686f7e] uppercase tracking-wide hover:text-white transition-colors"
                >
                  <span>{group.name}</span>
                  <ChevronDown
                    className={cn(
                      'w-3 h-3 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="space-y-1 mt-1">
                    {groupModules.map((module) => {
                      const Icon = (Icons[module.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;
                      const isActive = pathname === module.path || pathname?.startsWith(module.path + '/');
                      const hasBadge = module.badge === 'tasks' && runningTaskCount > 0;

                      return (
                        <Link
                          key={module.id}
                          href={module.path}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg',
                            'text-sm transition-colors duration-200',
                            'hover:bg-[#1a1d21]',
                            isActive
                              ? 'text-[#C8FF2E] bg-[#C8FF2E]/10 border-l-2 border-[#C8FF2E]'
                              : 'text-[#878e9a] hover:text-white'
                          )}
                        >
                          <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-[#C8FF2E]')} />
                          <span className="flex-1 truncate">{module.name}</span>
                          {hasBadge && (
                            <span className="px-1.5 py-0.5 text-xs bg-[#C8FF2E] text-[#0d1117] rounded-full font-semibold">
                              {runningTaskCount}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section (Bottom) */}
        <div className="p-3 border-t border-white/10">
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg',
              'hover:bg-[#1a1d21] transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <Avatar
              src={user?.avatar || ''}
              fallback={user?.name || 'User'}
              size="sm"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-xs text-[#686f7e] truncate capitalize">
                  {user?.role || 'Viewer'}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};
