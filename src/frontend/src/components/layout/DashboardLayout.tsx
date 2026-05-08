/**
 * Dashboard Layout (Template)
 *
 * Main application layout combining sidebar, header, AI chat panel, and content area.
 * Responsive with mobile drawer support.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIChatPanel } from '../ai/AIChatPanel';
import { useChatStore } from '@/stores';

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
  const { isOpen: chatOpen } = useChatStore();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);

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
