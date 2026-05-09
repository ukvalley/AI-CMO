/**
 * Mobile App Dashboard Preview Component
 *
 * Shows selected brand theme applied to a mobile app UI.
 */

'use client';

import React, { useState } from 'react';
import {
  Home,
  Wallet,
  PieChart,
  User,
  Bell,
  Search,
  ArrowUp,
  ArrowDown,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';
import { IconStyle, ImageStyle } from './data';

interface MobileAppPreviewProps {
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
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  iconStyle: IconStyle;
  imageStyle: ImageStyle;
}

export function MobileAppPreview({
  colors,
  fonts,
  borderRadius,
  iconStyle,
  imageStyle,
}: MobileAppPreviewProps) {
  const [activeTab, setActiveTab] = useState('home');

  // Helper to get icon props based on iconStyle
  const getIconProps = (sizeOverride?: number) => {
    const baseSize = sizeOverride || iconStyle.defaultSize;
    return {
      size: baseSize,
      strokeWidth: iconStyle.strokeWidth,
      fill: iconStyle.style === 'filled' ? 'currentColor' : 'none',
    };
  };

  const quickActions = [
    { icon: ArrowUp, label: 'Send', color: colors.primary },
    { icon: ArrowDown, label: 'Receive', color: colors.success },
    { icon: CreditCard, label: 'Cards', color: colors.accent },
    { icon: MoreHorizontal, label: 'More', color: colors.textMuted },
  ];

  const transactions = [
    { id: 1, title: 'Netflix Subscription', date: 'Today, 2:30 PM', amount: '-$15.99', type: 'expense', icon: 'N' },
    { id: 2, title: 'Salary Deposit', date: 'Yesterday, 9:00 AM', amount: '+$3,500.00', type: 'income', icon: 'S' },
    { id: 3, title: 'Grocery Store', date: 'Yesterday, 6:45 PM', amount: '-$127.50', type: 'expense', icon: 'G' },
  ];

  const BASE_WIDTH = 375;
  const BASE_HEIGHT = 812;

  return (
    <div
      className="relative overflow-hidden border-2"
      style={{
        width: `${BASE_WIDTH}px`,
        height: `${BASE_HEIGHT}px`,
        backgroundColor: colors.background,
        borderColor: colors.secondary,
        borderRadius: borderRadius.xl,
        fontFamily: fonts.body,
      }}
    >
      {/* Status Bar */}
      <div
        className="h-12 flex items-center justify-between px-6"
        style={{ backgroundColor: colors.surface }}
      >
        <span className="text-sm font-semibold" style={{ color: colors.text }}>9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.text }} />
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.text }} />
          <div className="w-6 h-3 rounded-sm border" style={{ borderColor: colors.text }} />
        </div>
      </div>

      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: colors.surface }}
      >
        <div>
          <p className="text-sm" style={{ color: colors.textMuted }}>Good morning,</p>
          <h1 className="text-xl font-bold" style={{ color: colors.text, fontFamily: fonts.heading }}>
            John Doe
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Search {...getIconProps(18)} style={{ color: colors.primary }} />
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Bell {...getIconProps(18)} style={{ color: colors.primary }} />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.error }}
            />
          </button>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              fontFamily: fonts.heading,
              borderRadius: imageStyle.borderRadius,
            }}
          >
            JD
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-6 py-6 space-y-6 overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
        {/* Balance Card */}
        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: colors.primary,
            borderRadius: borderRadius.lg,
          }}
        >
          <p className="text-sm opacity-80" style={{ color: colors.background }}>
            Total Balance
          </p>
          <h2
            className="text-3xl font-bold mt-1"
            style={{ color: colors.background, fontFamily: fonts.heading }}
          >
            $24,562.80
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <div
              className="px-3 py-1 rounded-full flex items-center gap-1"
              style={{ backgroundColor: `${colors.background}20` }}
            >
              <ArrowUp size={14} style={{ color: colors.background }} />
              <span className="text-xs font-medium" style={{ color: colors.background }}>
                +12.5%
              </span>
            </div>
            <span className="text-xs opacity-60" style={{ color: colors.background }}>
              this month
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between">
          {quickActions.map((action) => (
            <button key={action.label} className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: `${action.color}15`,
                  borderRadius: borderRadius.md,
                }}
              >
                <action.icon {...getIconProps(24)} style={{ color: action.color }} />
              </div>
              <span className="text-xs" style={{ color: colors.textMuted }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: colors.text, fontFamily: fonts.heading }}>
              Recent Transactions
            </h3>
            <button className="text-sm" style={{ color: colors.primary }}>
              See All
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: colors.surface, borderRadius: borderRadius.md }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                    borderRadius: imageStyle.borderRadius,
                  }}
                >
                  {tx.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: colors.text }}>
                    {tx.title}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {tx.date}
                  </p>
                </div>
                <span
                  className="font-semibold text-sm"
                  style={{ color: tx.type === 'income' ? colors.success : colors.text }}
                >
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 px-6 flex items-center justify-between"
        style={{
          backgroundColor: colors.surface,
          borderTop: `1px solid ${colors.secondary}`,
        }}
      >
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'wallet', icon: Wallet, label: 'Wallet' },
          { id: 'stats', icon: PieChart, label: 'Stats' },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center gap-1"
          >
            <item.icon
              {...getIconProps(24)}
              style={{
                color: activeTab === item.id ? colors.primary : colors.textMuted,
              }}
            />
            <span
              className="text-xs"
              style={{
                color: activeTab === item.id ? colors.primary : colors.textMuted,
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
