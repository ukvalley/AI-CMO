/**
 * Dashboard Page
 *
 * Main dashboard with stat cards and module grid for all 60+ modules.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MODULES, GROUPS, getModulesByGroup } from '@/lib/modules';
import { useDataStore, useTaskStore, useAuthStore } from '@/stores';
import { cn } from '@/utils/cn';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  icon: Icon,
  label,
  value,
  color = 'primary',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: 'primary' | 'success' | 'warning' | 'info';
}) {
  const colorClasses = {
    primary: 'bg-[#C8FF2E]/10 text-[#C8FF2E]',
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-400',
    info: 'bg-blue-500/10 text-blue-400',
  };

  return (
    <div className="bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-all">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-[#878e9a]">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODULE CARD COMPONENT
// ============================================

function ModuleCard({
  module,
  itemCount,
}: {
  module: (typeof MODULES)[0];
  itemCount: number;
}) {
  const Icon = (Icons[module.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;
  const group = GROUPS.find((g) => g.id === module.group);

  return (
    <Link
      href={module.path}
      className="group block bg-[#151920] backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-[#C8FF2E]/30 transition-all hover:shadow-[0_0_20px_rgba(200,255,46,0.1)]"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${group?.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: group?.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white group-hover:text-[#C8FF2E] transition-colors">
              {module.name}
            </h3>
            {itemCount > 0 && (
              <span className="text-xs bg-[#1a1d21] text-[#afb6c4] px-2 py-0.5 rounded-full border border-white/10">
                {itemCount}
              </span>
            )}
          </div>
          <p className="text-xs text-[#878e9a] mt-1 line-clamp-2">{module.description}</p>
          {module.hasAI && (
            <div className="flex items-center gap-1 mt-2">
              <Icons.Sparkles className="w-3 h-3 text-[#C8FF2E]" />
              <span className="text-[10px] text-[#C8FF2E]">AI-powered</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================
// DASHBOARD COMPONENT
// ============================================

export default function Dashboard() {
  const { getStats, data, activeCompanyId } = useDataStore();
  const { runningTaskCount } = useTaskStore();
  const { user } = useAuthStore();
  const stats = getStats();

  // Get module counts from data store
  const companyData = activeCompanyId ? data[activeCompanyId] : null;
  const getModuleCount = (moduleId: string): number => {
    if (!companyData) return 0;
    switch (moduleId) {
      case 'founders':
        return companyData.founders?.length || 0;
      case 'employees':
        return companyData.employees?.length || 0;
      case 'products':
        return companyData.products?.length || 0;
      case 'blogs':
        return companyData.blogs?.length || 0;
      case 'newsletters':
        return companyData.newsletters?.length || 0;
      case 'faqs':
        return companyData.faqs?.length || 0;
      case 'competitors':
        return companyData.competitors?.length || 0;
      default:
        return 0;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-[#878e9a] mt-1">
              Welcome back{user?.name ? `, ${user.name}` : ''}! Manage your marketing across all modules.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Icons.Building2}
            label="Companies"
            value={stats.companies}
            color="primary"
          />
          <StatCard
            icon={Icons.Users}
            label="Founders"
            value={stats.founders}
            color="success"
          />
          <StatCard
            icon={Icons.Users2}
            label="Employees"
            value={stats.employees}
            color="info"
          />
          <StatCard
            icon={Icons.Package}
            label="Products"
            value={stats.products}
            color="warning"
          />
          <StatCard
            icon={Icons.FileText}
            label="Blogs"
            value={stats.blogs}
            color="primary"
          />
          <StatCard
            icon={Icons.Mail}
            label="Newsletters"
            value={stats.newsletters}
            color="success"
          />
          <StatCard
            icon={Icons.HelpCircle}
            label="FAQs"
            value={stats.faqs}
            color="info"
          />
          <StatCard
            icon={Icons.Clock}
            label="Running Tasks"
            value={runningTaskCount}
            color={runningTaskCount > 0 ? 'warning' : 'primary'}
          />
        </div>

        {/* Module Grid by Group */}
        <div className="space-y-8">
          {GROUPS.map((group) => {
            const groupModules = getModulesByGroup(group.id).filter(
              (m) => m.status === 'active'
            );
            if (groupModules.length === 0) return null;

            return (
              <section key={group.id}>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-2 h-6 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h2 className="text-lg font-semibold text-white">{group.name}</h2>
                  <span className="text-sm text-[#878e9a]">
                    ({groupModules.length} modules)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupModules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      itemCount={getModuleCount(module.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
