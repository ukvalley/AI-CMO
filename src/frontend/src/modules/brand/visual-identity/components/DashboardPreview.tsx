/**
 * Dashboard Preview Component
 *
 * Shows selected brand theme applied to a realistic dashboard UI.
 * Can be rendered at different scales.
 */

'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Filter,
  Download,
} from 'lucide-react';

import { IconStyle, ImageStyle } from './data';

interface DashboardPreviewProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
    mono: string;
  };
  typography?: {
    headingLineHeight: string;
    bodyLineHeight: string;
    headingLetterSpacing: string;
    bodyLetterSpacing: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    section: string;
    component: string;
    element: string;
  };
  iconStyle: IconStyle;
  imageStyle: ImageStyle;
  scale?: number;
  onOpenNewTab?: () => void;
}

export function DashboardPreview({
  colors,
  fonts,
  typography,
  borderRadius,
  spacing,
  iconStyle,
  imageStyle,
  scale = 1,
  onOpenNewTab
}: DashboardPreviewProps) {
  // Default typography values
  const headingLineHeight = typography?.headingLineHeight || '1.2';
  const bodyLineHeight = typography?.bodyLineHeight || '1.6';
  const headingLetterSpacing = typography?.headingLetterSpacing || '-0.02em';
  const bodyLetterSpacing = typography?.bodyLetterSpacing || '0';

  // Typography style helpers
  const headingStyle = {
    fontFamily: fonts.heading,
    lineHeight: headingLineHeight,
    letterSpacing: headingLetterSpacing,
  };
  const bodyStyle = {
    fontFamily: fonts.body,
    lineHeight: bodyLineHeight,
    letterSpacing: bodyLetterSpacing,
  };
  const [activeTab, setActiveTab] = useState('Month');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper to get icon props based on iconStyle
  const getIconProps = (sizeOverride?: number) => {
    const baseSize = sizeOverride || iconStyle.defaultSize;
    return {
      size: baseSize,
      strokeWidth: iconStyle.strokeWidth,
      fill: iconStyle.style === 'filled' ? 'currentColor' : 'none',
      style: {
        opacity: iconStyle.style === 'duotone' ? 0.85 : 1,
      } as React.CSSProperties,
    };
  };

  // Helper to get image/avatar style based on imageStyle
  const getImageStyle = (): React.CSSProperties => ({
    borderRadius: imageStyle.borderRadius,
    boxShadow: imageStyle.shadow,
    filter: imageStyle.filter,
    border: imageStyle.border === 'none' ? undefined : `${imageStyle.border} ${colors.secondary}`,
    borderColor: imageStyle.borderColor === 'primary' ? colors.primary : colors.secondary,
  });

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: ShoppingCart, label: 'Orders', active: false },
    { icon: Users, label: 'Customers', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$48,294', change: '+12.5%', trend: 'up', icon: DollarSign },
    { label: 'Active Users', value: '2,543', change: '+8.2%', trend: 'up', icon: Users },
    { label: 'Total Orders', value: '1,234', change: '-2.1%', trend: 'down', icon: ShoppingCart },
    { label: 'Conversion Rate', value: '3.24%', change: '+4.3%', trend: 'up', icon: BarChart3 },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Sarah Johnson', email: 'sarah@example.com', amount: '$299.00', status: 'completed', date: '2 mins ago', avatar: 'SJ' },
    { id: '#ORD-002', customer: 'Michael Chen', email: 'michael@example.com', amount: '$149.50', status: 'pending', date: '15 mins ago', avatar: 'MC' },
    { id: '#ORD-003', customer: 'Emma Williams', email: 'emma@example.com', amount: '$599.99', status: 'completed', date: '1 hour ago', avatar: 'EW' },
    { id: '#ORD-004', customer: 'James Brown', email: 'james@example.com', amount: '$89.00', status: 'cancelled', date: '2 hours ago', avatar: 'JB' },
    { id: '#ORD-005', customer: 'Lisa Davis', email: 'lisa@example.com', amount: '$450.00', status: 'pending', date: '3 hours ago', avatar: 'LD' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: `${colors.success}20`, color: colors.success, dot: colors.success };
      case 'pending':
        return { bg: `${colors.warning}20`, color: colors.warning, dot: colors.warning };
      case 'cancelled':
        return { bg: `${colors.error}20`, color: colors.error, dot: colors.error };
      default:
        return { bg: `${colors.info}20`, color: colors.info, dot: colors.info };
    }
  };

  const BASE_WIDTH = 1400;
  const BASE_HEIGHT = 900;

  const content = (
    <div
      className="rounded-xl overflow-hidden border-2 origin-top-left"
      style={{
        width: `${BASE_WIDTH}px`,
        height: `${BASE_HEIGHT}px`,
        borderColor: colors.secondary,
        backgroundColor: colors.background,
        ...bodyStyle,
      }}
    >
      {/* Header */}
      <div
        className="h-16 px-6 flex items-center justify-between border-b"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.secondary,
        }}
      >
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X {...getIconProps()} /> : <Menu {...getIconProps()} />}
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
                ...headingStyle,
              }}
            >
              B
            </div>
            <h1
              className="text-xl font-bold"
              style={{
                ...headingStyle,
                color: colors.text,
              }}
            >
              BrandDashboard
            </h1>
          </div>
        </div>

        {/* Center: Search */}
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg w-80"
          style={{
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            border: `1px solid ${colors.secondary}`,
          }}
        >
          <Search {...getIconProps(18)} style={{ color: colors.textMuted }} />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none outline-none flex-1 text-sm"
            style={{ color: colors.text }}
          />
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: colors.secondary,
              color: colors.textMuted,
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Right: Actions + Avatar */}
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:opacity-80 relative"
            style={{
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
            }}
          >
            <Bell {...getIconProps()} />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.error }}
            />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: colors.secondary }}>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                John Doe
              </p>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Admin
              </p>
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
                ...headingStyle,
                ...getImageStyle(),
              }}
            >
              JD
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex" style={{ height: 'calc(100% - 64px)' }}>
        {/* Sidebar */}
        <div
          className="w-64 py-6 flex flex-col gap-1 border-r flex-shrink-0"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.secondary,
          }}
        >
          <div className="px-4 mb-6">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: colors.textMuted }}
            >
              Main Menu
            </p>
          </div>

          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className="mx-3 px-4 py-3 rounded-lg flex items-center gap-3 transition-all"
              style={{
                backgroundColor: item.active ? colors.primary : 'transparent',
                color: item.active ? colors.background : colors.textMuted,
                borderRadius: borderRadius.md,
              }}
            >
              <item.icon {...getIconProps()} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.active && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: colors.background }}
                />
              )}
            </button>
          ))}

          <div className="mt-auto px-4 pt-6 border-t" style={{ borderColor: colors.secondary }}>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: `${colors.primary}10`,
                borderRadius: borderRadius.lg,
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                Pro Plan
              </p>
              <p className="text-xs mb-3" style={{ color: colors.textMuted }}>
                Your trial ends in 5 days
              </p>
              <button
                className="w-full py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  borderRadius: borderRadius.md,
                }}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto"
          style={{ padding: spacing.section }}
        >
          {/* Page Header */}
          <div className="flex items-center justify-between"
            style={{ marginBottom: spacing.section }}
          >
            <div>
              <h2
                className="text-2xl font-bold mb-1"
                style={{
                  ...headingStyle,
                  color: colors.text,
                }}
              >
                Overview
              </h2>
              <p style={{ color: colors.textMuted }}>
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  border: `1px solid ${colors.secondary}`,
                  borderRadius: borderRadius.md,
                }}
              >
                <Filter {...getIconProps(16)} />
                Filter
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  borderRadius: borderRadius.md,
                  ...headingStyle,
                }}
              >
                <Download {...getIconProps(16)} />
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4"
            style={{ gap: spacing.component, marginBottom: spacing.section }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border transition-shadow hover:shadow-lg"
                style={{
                  padding: spacing.component,
                  backgroundColor: colors.surface,
                  borderColor: colors.secondary,
                  borderRadius: borderRadius.lg,
                  boxShadow: `0 4px 6px ${colors.primary}08`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${colors.primary}15`,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <stat.icon {...getIconProps(24)} style={{ color: colors.primary }} />
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: stat.trend === 'up' ? `${colors.success}15` : `${colors.error}15`,
                      color: stat.trend === 'up' ? colors.success : colors.error,
                    }}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp {...getIconProps(14)} />
                    ) : (
                      <TrendingDown {...getIconProps(14)} />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p
                  className="text-3xl font-bold mb-1"
                  style={{
                    ...headingStyle,
                    color: colors.text,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ color: colors.textMuted }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Charts & Table Section */}
          <div className="grid grid-cols-3"
            style={{ gap: spacing.component }}
          >
            {/* Revenue Chart */}
            <div
              className="col-span-2 p-6 rounded-xl border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.secondary,
                borderRadius: borderRadius.lg,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{
                      ...headingStyle,
                      color: colors.text,
                    }}
                  >
                    Revenue Overview
                  </h3>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    Monthly revenue for the current year
                  </p>
                </div>
                <div className="flex gap-2">
                  {['Week', 'Month', 'Year'].map((period) => (
                    <button
                      key={period}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                      style={{
                        backgroundColor: activeTab === period ? colors.primary : colors.background,
                        color: activeTab === period ? colors.background : colors.textMuted,
                        borderRadius: borderRadius.md,
                        border: `1px solid ${activeTab === period ? colors.primary : colors.secondary}`,
                      }}
                      onClick={() => setActiveTab(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 flex items-end gap-3">
                {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 92].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${height}%`,
                        backgroundColor: i === 8 ? colors.accent : colors.primary,
                        opacity: i === 8 ? 1 : 0.7,
                        borderRadius: `${borderRadius.sm} ${borderRadius.sm} 0 0`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 px-1">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <span
                    key={month}
                    className="text-xs font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    {month}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.secondary,
                borderRadius: borderRadius.lg,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-lg font-semibold"
                  style={{
                    ...headingStyle,
                    color: colors.text,
                  }}
                >
                  Recent Orders
                </h3>
                <button
                  className="text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: colors.primary }}
                >
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.component }}>
                {recentOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80 cursor-pointer"
                      style={{
                        backgroundColor: colors.background,
                        borderRadius: borderRadius.md,
                      }}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          color: colors.primary,
                          ...getImageStyle(),
                        }}
                      >
                        {order.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: colors.text }}
                        >
                          {order.customer}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: colors.textMuted }}
                        >
                          {order.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: colors.text }}
                        >
                          {order.amount}
                        </p>
                        <div
                          className="flex items-center gap-1.5 mt-1"
                          style={{ color: statusStyle.color }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: statusStyle.dot }}
                          />
                          <span className="text-xs capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Component Showcase */}
          <div
            className="rounded-xl border"
            style={{
              marginTop: spacing.section,
              padding: spacing.component,
              backgroundColor: colors.surface,
              borderColor: colors.secondary,
              borderRadius: borderRadius.lg,
            }}
          >
            <h3
              className="text-lg font-semibold mb-6"
              style={{
                ...headingStyle,
                color: colors.text,
              }}
            >
              UI Components
            </h3>

            <div className="grid grid-cols-4"
              style={{ gap: spacing.component }}
            >
              {/* Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.element }}>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Buttons
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.element }}>
                  <button
                    className="w-full px-4 py-2.5 rounded-lg font-medium transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                      borderRadius: borderRadius.md,
                      ...headingStyle,
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="w-full px-4 py-2.5 rounded-lg font-medium border-2 transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: colors.secondary,
                      color: colors.text,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    Secondary
                  </button>
                </div>
              </div>

              {/* Form Elements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.component }}>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Form Elements
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.element }}>
                  <input
                    type="text"
                    placeholder="Enter your email..."
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.secondary,
                      color: colors.text,
                      borderRadius: borderRadius.md,
                    }}
                  />
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border outline-none"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.secondary,
                      color: colors.text,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <option>Select an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </div>
              </div>

              {/* Alerts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.component }}>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Alerts
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.element }}>
                  <div
                    className="px-4 py-3 rounded-lg text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: `${colors.success}15`,
                      color: colors.success,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <CheckCircle {...getIconProps(18)} />
                    <span className="font-medium">Success message</span>
                  </div>
                  <div
                    className="px-4 py-3 rounded-lg text-sm flex items-center gap-3"
                    style={{
                      backgroundColor: `${colors.warning}15`,
                      color: colors.warning,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <AlertCircle {...getIconProps(18)} />
                    <span className="font-medium">Warning message</span>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.component }}>
                <p
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Cards
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.element }}>
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.secondary,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <p className="text-sm font-medium" style={{ color: colors.text }}>
                        Card Title
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      Card content description here
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: `${colors.primary}10`,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <p className="text-sm font-medium" style={{ color: colors.primary }}>
                      Featured Card
                    </p>
                    <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                      With accent background
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If scale is 1 (full size), just return content
  if (scale === 1) {
    return content;
  }

  // Scaled version with container
  return (
    <div className="relative">
      {/* View in New Tab Button */}
      {onOpenNewTab && (
        <div className="flex justify-end mb-3">
          <button
            onClick={onOpenNewTab}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              borderRadius: borderRadius.md,
              ...headingStyle,
            }}
          >
            <ExternalLink {...getIconProps(16)} />
            View in New Tab
          </button>
        </div>
      )}

      {/* Scaled Container */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: `${BASE_WIDTH * scale}px`,
          height: `${BASE_HEIGHT * scale}px`,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
          }}
        >
          {content}
        </div>
      </div>

      {/* Scale indicator */}
      <p className="text-xs text-center mt-2 text-slate-500">
        Preview scaled to {Math.round(scale * 100)}% • <button
          onClick={onOpenNewTab}
          className="underline hover:no-underline"
          style={{ color: colors.primary }}
        >
          Open full size
        </button>
      </p>
    </div>
  );
}
