/**
 * Header Component (Organism)
 *
 * Top navigation bar with search, notifications, save indicator, and user actions.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { useDataStore, useAuthStore, useCompanyStore } from '@/stores';

// ============================================
// TYPES
// ============================================

interface HeaderProps {
  onMenuClick: () => void;
  collapsed: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================
// BREADCRUMB GENERATOR
// ============================================

const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/dashboard' }];

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
    });
  });

  return breadcrumbs;
};

// ============================================
// COMPONENT
// ============================================

export const Header: React.FC<HeaderProps> = ({ onMenuClick, collapsed }) => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname || '/dashboard');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { hasUnsavedChanges, isSaving, lastSaved } = useDataStore();
  const { user, logout } = useAuthStore();
  const { getActiveCompany } = useCompanyStore();
  const activeCompany = getActiveCompany();

  // User dropdown items
  const userDropdownItems = [
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'divider1', label: '', divider: true },
    {
      id: 'logout',
      label: 'Sign out',
      icon: LogOut,
      onClick: logout
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 z-30',
        'bg-slate-900/95 backdrop-blur-xl',
        'border-b border-slate-800',
        'transition-all duration-300',
        'lg:left-72',
        collapsed && 'lg:left-20'
      )}
      style={{ left: 0 }}
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-slate-400"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Breadcrumbs (Desktop) */}
          <nav className="hidden md:flex items-center text-sm">
            <ol className="flex items-center gap-2">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li key={item.label} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="w-4 h-4 text-slate-500 mx-1" />
                    )}
                    {isLast ? (
                      <span className="font-medium text-slate-200">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Page Title (Mobile) */}
          <h1 className="md:hidden font-semibold text-slate-200">
            {breadcrumbs[breadcrumbs.length - 1]?.label}
          </h1>
        </div>

        {/* Right: Save Indicator, Search, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Save Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isSaving ? (
              <>
                <Save className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 hidden sm:inline">Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 hidden sm:inline">Unsaved</span>
              </>
            ) : lastSaved ? (
              <>
                <Save className="w-4 h-4 text-green-400" />
                <span className="text-green-400 hidden sm:inline">Saved</span>
              </>
            ) : null}
          </div>

          {/* Active Company Badge */}
          {activeCompany && (
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
              {activeCompany.name}
            </span>
          )}

          {/* Search */}
          <div
            className={cn(
              'hidden md:flex items-center transition-all duration-300',
              searchOpen ? 'w-64' : 'w-auto'
            )}
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search..."
                inputSize="sm"
                className={cn(
                  'w-full transition-all duration-300 bg-slate-800 border-slate-700 text-slate-200',
                  'placeholder:text-slate-500',
                  !searchOpen && 'w-10 focus:w-64 cursor-pointer'
                )}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* User Menu */}
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition-colors">
                <Avatar
                  src={user?.avatar || ''}
                  fallback={user?.name || 'User'}
                  size="sm"
                />
                <span className="hidden sm:block text-sm font-medium text-slate-200">
                  {user?.name?.split(' ')[0] || 'Guest'}
                </span>
              </button>
            }
            items={userDropdownItems}
          />
        </div>
      </div>
    </header>
  );
};
