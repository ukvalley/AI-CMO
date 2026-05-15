/**
 * Header Component (Organism) - MENGO Theme
 *
 * Top navigation bar with search, notifications, save indicator, and user actions.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const breadcrumbs = generateBreadcrumbs(pathname || '/dashboard');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const hasUnsavedChanges = useDataStore(s => s.hasUnsavedChanges);
  const isSaving = useDataStore(s => s.isSaving);
  const lastSaved = useDataStore(s => s.lastSaved);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const activeCompany = useCompanyStore(s => s.getActiveCompany());

  React.useEffect(() => { setMounted(true); }, []);

  // User dropdown items
  const userDropdownItems = [
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'divider1', label: '', divider: true },
    {
      id: 'logout',
      label: 'Sign out',
      icon: LogOut,
      onClick: () => { logout(); router.push('/login'); }
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 z-30',
        'bg-[#0d1117]/95 backdrop-blur-xl',
        'border-b border-white/10',
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
            className="lg:hidden text-[#878e9a]"
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
                      <ChevronRight className="w-4 h-4 text-[#686f7e] mx-1" />
                    )}
                    {isLast ? (
                      <span className="font-medium text-white">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        className="text-[#878e9a] hover:text-white transition-colors"
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
          <h1 className="md:hidden font-semibold text-white">
            {breadcrumbs[breadcrumbs.length - 1]?.label}
          </h1>
        </div>

        {/* Right: Save Indicator, Search, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Save Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isSaving ? (
              <>
                <Save className="w-4 h-4 text-[#C8FF2E] animate-pulse" />
                <span className="text-[#C8FF2E] hidden sm:inline">Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="w-4 h-4 text-[#C8FF2E]" />
                <span className="text-[#C8FF2E] hidden sm:inline">Unsaved</span>
              </>
            ) : lastSaved ? (
              <>
                <Save className="w-4 h-4 text-[#C8FF2E]" />
                <span className="text-[#C8FF2E] hidden sm:inline">Saved</span>
              </>
            ) : null}
          </div>

          {/* Active Company Badge */}
          {mounted && activeCompany && (
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/20">
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
                  'w-full transition-all duration-300 bg-[#1a1d21] border-white/10 text-white',
                  'placeholder:text-[#686f7e]',
                  !searchOpen && 'w-10 focus:w-64 cursor-pointer'
                )}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686f7e]" />
            </div>
          </div>

          {/* User Menu */}
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1a1d21] transition-colors">
                <Avatar
                  src={user?.avatar || ''}
                  fallback={user?.name || 'User'}
                  size="sm"
                />
                <span className="hidden sm:block text-sm font-medium text-white">
                  {mounted ? (user?.name?.split(' ')[0] || 'Guest') : ''}
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
