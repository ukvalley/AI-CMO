/**
 * Header Component (Organism)
 *
 * Top navigation bar with search, notifications, and user actions.
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
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { Badge } from '@/components/ui/Badge';

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

const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] = {
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
// NOTIFICATIONS DATA
// ============================================

const notifications = [
  {
    id: '1',
    title: 'Campaign "Summer Sale" completed',
    message: 'Your campaign reached 10K impressions',
    time: '2 min ago',
    unread: true,
    type: 'success' as const,
  },
  {
    id: '2',
    title: 'Budget alert',
    message: 'You\'ve spent 80% of your monthly budget',
    time: '1 hour ago',
    unread: true,
    type: 'warning' as const,
  },
  {
    id: '3',
    title: 'New AI insight available',
    message: 'We found optimization opportunities',
    time: '3 hours ago',
    unread: false,
    type: 'info' as const,
  },
];

// ============================================
// COMPONENT
// ============================================

export const Header: React.FC<HeaderProps> = ({ onMenuClick, collapsed }) => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname || '/dashboard');
  const [searchOpen, setSearchOpen] = React.useState(false);

  // User dropdown items
  const userDropdownItems = [
    { id: 'profile', label: 'Profile', icon: Settings, shortcut: '⌘P' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'divider1', label: '', divider: true },
    { id: 'logout', label: 'Sign out', icon: LogOut },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 z-30',
        'bg-white/80 backdrop-blur-xl',
        'border-b border-neutral-200',
        'transition-all duration-300',
        'lg:left-64',
        collapsed && 'lg:left-16'
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
            className="lg:hidden"
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
                      <ChevronRight className="w-4 h-4 text-neutral-400 mx-1" />
                    )}
                    {isLast ? (
                      <span className="font-medium text-neutral-900">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        className="text-neutral-500 hover:text-neutral-900 transition-colors"
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
          <h1 className="md:hidden font-semibold text-neutral-900">
            {breadcrumbs[breadcrumbs.length - 1]?.label}
          </h1>
        </div>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-2">
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
                size="sm"
                leftIcon={<Search className="w-4 h-4" />}
                className={cn(
                  'w-full transition-all duration-300',
                  !searchOpen && 'w-10 focus:w-64 cursor-pointer'
                )}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>

          {/* Notifications */}
          <Dropdown
            align="right"
            trigger={
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
                )}
              </Button>
            }
            items={[
              {
                id: 'header',
                label: 'Notifications',
                onClick: () => {},
                disabled: true,
              },
              { id: 'divider', label: '', divider: true },
              ...notifications.map((n) => ({
                id: n.id,
                label: n.title,
                onClick: () => console.log('Notification clicked:', n.id),
              })),
            ]}
          />

          {/* User Menu */}
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors">
                <Avatar
                  src=""
                  fallback="Alex Morgan"
                  size="sm"
                  status="online"
                />
                <span className="hidden sm:block text-sm font-medium text-neutral-700">
                  Alex
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
