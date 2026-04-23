/**
 * Sidebar Component (Organism)
 *
 * Navigation sidebar with collapsible menu, nested items, and mobile drawer.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Megaphone,
  Sparkles,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

// ============================================
// TYPES
// ============================================

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// ============================================
// NAVIGATION DATA
// ============================================

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    badge: 3,
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    href: '/campaigns',
    icon: Megaphone,
    children: [
      { id: 'all-campaigns', label: 'All Campaigns', href: '/campaigns', icon: Megaphone },
      { id: 'create', label: 'Create New', href: '/campaigns/create', icon: Megaphone },
      { id: 'templates', label: 'Templates', href: '/campaigns/templates', icon: Megaphone },
    ],
  },
  {
    id: 'audience',
    label: 'Audience',
    href: '/audience',
    icon: Users,
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    href: '/ai-insights',
    icon: Sparkles,
    badge: 12,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { id: 'general', label: 'General', href: '/settings', icon: Settings },
      { id: 'integrations', label: 'Integrations', href: '/settings/integrations', icon: Settings },
      { id: 'billing', label: 'Billing', href: '/settings/billing', icon: Settings },
    ],
  },
];

// ============================================
// SIDEBAR NAV ITEM COMPONENT
// ============================================

const SidebarNavItem: React.FC<{
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}> = ({ item, collapsed, depth = 0 }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = React.useState(isActive);

  const Icon = item.icon;

  // If sidebar is collapsed and has children, don't show children
  const showChildren = hasChildren && expanded && !collapsed;

  if (collapsed && depth > 0) return null;

  return (
    <div className={depth > 0 ? 'ml-2' : ''}>
      {hasChildren ? (
        // Parent item with children
        <>
          <button
            onClick={() => !collapsed && setExpanded(!expanded)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
              'text-sm font-medium transition-colors duration-200',
              'hover:bg-neutral-100',
              isActive
                ? 'text-primary-700 bg-primary-50'
                : 'text-neutral-600 hover:text-neutral-900',
              collapsed && 'justify-center'
            )}
          >
            <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-600')} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    expanded && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>

          {/* Children */}
          {showChildren && (
            <div className="mt-1 space-y-0.5 animate-fade-in">
              {item.children.map((child) => (
                <SidebarNavItem
                  key={child.id}
                  item={child}
                  collapsed={collapsed}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        // Regular item
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg',
            'text-sm font-medium transition-colors duration-200',
            'hover:bg-neutral-100',
            isActive
              ? 'text-primary-700 bg-primary-50'
              : 'text-neutral-600 hover:text-neutral-900',
            collapsed && 'justify-center'
          )}
        >
          <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-600')} />
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>
      )}
    </div>
  );
};

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50',
          'bg-white border-r border-neutral-200',
          'flex flex-col',
          'transition-all duration-300 ease-in-out',
          // Mobile
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop
          'lg:translate-x-0',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          'w-64'
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-lg text-neutral-900">CMO</span>
            )}
          </Link>

          {/* Mobile Close */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Desktop Toggle */}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <ChevronRight
              className={cn(
                'w-4 h-4 text-neutral-500 transition-transform duration-300',
                !collapsed && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* User Section (Bottom) */}
        <div className="p-3 border-t border-neutral-100">
          <Link
            href="/profile"
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg',
              'hover:bg-neutral-100 transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <Avatar
              src=""
              fallback="Alex Morgan"
              size="sm"
              status="online"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  Alex Morgan
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  alex@company.com
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};
