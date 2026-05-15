/**
 * Dashboard Layout (Template)
 *
 * Main application layout combining sidebar, header, AI chat panel, and content area.
 * Responsive with mobile drawer support.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/utils/cn';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useChatStore } from '@/stores/chatStore';

// Dynamic import AIChatPanel — heavy component not needed on initial load
const AIChatPanel = dynamic(() => import('../ai/AIChatPanel').then(mod => ({ default: mod.AIChatPanel })), {
  ssr: false,
  loading: () => null,
});

// ============================================
// TYPES
// ============================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const chatOpen = useChatStore(s => s.isOpen);

  const toggleSidebar = React.useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const openMobileMenu = React.useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = React.useCallback(() => setMobileMenuOpen(false), []);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />

      {/* Header */}
      <Header
        onMenuClick={openMobileMenu}
        collapsed={sidebarCollapsed}
      />

      {/* AI Chat Panel */}
      <AIChatPanel />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          // Sidebar offset
          'lg:pl-72',
          sidebarCollapsed && 'lg:pl-20',
          // Chat panel offset
          chatOpen && 'lg:pr-80'
        )}
      >
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};