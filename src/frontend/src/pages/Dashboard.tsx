/**
 * Dashboard Page
 *
 * Main dashboard with KPI cards, charts, and recent activity.
 */

'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard, SimpleLineChart, BarChart, DonutChart } from '@/components/dashboard/ChartCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/Button';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import {
  DollarSign,
  Users,
  MousePointerClick,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// ============================================
// MOCK DATA
// ============================================

const kpiData = [
  {
    title: 'Total Revenue',
    value: 124500,
    change: { value: 12.5, timeframe: 'last month', trend: 'up' as const },
    icon: DollarSign,
    format: 'currency' as const,
  },
  {
    title: 'Active Users',
    value: 8423,
    change: { value: 8.2, timeframe: 'last month', trend: 'up' as const },
    icon: Users,
    format: 'compact' as const,
  },
  {
    title: 'Conversion Rate',
    value: 3.24,
    change: { value: -0.8, timeframe: 'last month', trend: 'down' as const },
    icon: MousePointerClick,
    format: 'percentage' as const,
  },
  {
    title: 'Avg. Order Value',
    value: 84.5,
    change: { value: 5.3, timeframe: 'last month', trend: 'up' as const },
    icon: TrendingUp,
    format: 'currency' as const,
  },
];

const trafficData = [
  { label: 'Mon', value: 4000 },
  { label: 'Tue', value: 3000 },
  { label: 'Wed', value: 5000 },
  { label: 'Thu', value: 2780 },
  { label: 'Fri', value: 1890 },
  { label: 'Sat', value: 2390 },
  { label: 'Sun', value: 3490 },
];

const campaignData = [
  { label: 'Email', value: 45, color: '#3b82f6' },
  { label: 'Social', value: 30, color: '#8b5cf6' },
  { label: 'Search', value: 15, color: '#10b981' },
  { label: 'Direct', value: 10, color: '#f59e0b' },
];

const sourceData = [
  { label: 'Google', value: 3500, color: '#3b82f6' },
  { label: 'Facebook', value: 2800, color: '#8b5cf6' },
  { label: 'LinkedIn', value: 1800, color: '#10b981' },
  { label: 'Twitter', value: 1200, color: '#06b6d4' },
  { label: 'Direct', value: 1000, color: '#f59e0b' },
  { label: 'Other', value: 700, color: '#6b7280' },
];

const recentCampaigns = [
  { id: '1', name: 'Summer Sale 2024', status: 'Active', impressions: '125.4K', ctr: '4.2%', spend: '$4,250', roas: '3.8x' },
  { id: '2', name: 'Product Launch', status: 'Paused', impressions: '89.2K', ctr: '3.8%', spend: '$2,100', roas: '2.5x' },
  { id: '3', name: 'Brand Awareness Q2', status: 'Active', impressions: '234.1K', ctr: '2.1%', spend: '$8,500', roas: '1.9x' },
  { id: '4', name: 'Retargeting Campaign', status: 'Active', impressions: '45.3K', ctr: '6.5%', spend: '$1,200', roas: '5.2x' },
  { id: '5', name: 'Holiday Special', status: 'Scheduled', impressions: '-', ctr: '-', spend: '$0', roas: '-' },
];

const campaignColumns = [
  { key: 'name', header: 'Campaign Name', sortable: true },
  {
    key: 'status',
    header: 'Status',
    formatter: (value: string) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Active'
            ? 'bg-success-50 text-success-700'
            : value === 'Paused'
            ? 'bg-warning-50 text-warning-700'
            : 'bg-neutral-100 text-neutral-600'
        }`}
      >
        {value}
      </span>
    ),
  },
  { key: 'impressions', header: 'Impressions', align: 'right' as const },
  { key: 'ctr', header: 'CTR', align: 'right' as const },
  { key: 'spend', header: 'Spend', align: 'right' as const },
  { key: 'roas', header: 'ROAS', align: 'right' as const },
];

const aiInsights = [
  {
    id: '1',
    title: 'Budget Optimization Opportunity',
    description: 'Increase spend on "Retargeting Campaign" by 20% for projected 15% ROAS improvement.',
    impact: 'High',
    type: 'recommendation',
  },
  {
    id: '2',
    title: 'Audience Segment Declining',
    description: 'The 25-34 age segment engagement dropped 12% this week. Consider refreshing creative.',
    impact: 'Medium',
    type: 'alert',
  },
  {
    id: '3',
    title: 'Best Performing Creative',
    description: 'Video ad variant B has 2.3x higher CTR than average. Scale to other campaigns.',
    impact: 'High',
    type: 'insight',
  },
];

// ============================================
// COMPONENT
// ============================================

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="heading-2">Dashboard</h1>
            <p className="text-neutral-500 mt-1">
              Welcome back! Here's what's happening with your campaigns.
            </p>
          </div>
          <Button leftIcon={<Sparkles className="w-4 h-4" />}>
            Generate AI Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'ai-insights', label: 'AI Insights' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {/* Overview Tab */}
      <TabPanel tabId="overview" activeTab={activeTab}>
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi) => (
              <KPICard key={kpi.title} {...kpi} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2">
              <ChartCard
                title="Traffic Overview"
                subtitle="Website visits and engagement metrics"
              >
                <SimpleLineChart data={trafficData} />
              </ChartCard>
            </div>

            {/* Campaign Distribution */}
            <ChartCard
              title="Campaign Distribution"
              subtitle="Spend by channel"
            >
              <DonutChart
                data={campaignData}
                centerLabel="Total"
                centerValue="$15.2K"
              />
            </ChartCard>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Campaigns Table */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="heading-5">Recent Campaigns</h2>
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View All
                  </Button>
                </div>
                <DataTable
                  data={recentCampaigns}
                  columns={campaignColumns}
                  pagination={{
                    page: 1,
                    pageSize: 5,
                    total: 24,
                    onPageChange: () => {},
                  }}
                />
              </div>
            </div>

            {/* AI Insights */}
            <div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="heading-5">AI Insights</h2>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  {aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-primary-200 hover:shadow-soft-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            insight.type === 'alert'
                              ? 'bg-warning-50 text-warning-600'
                              : insight.type === 'recommendation'
                              ? 'bg-primary-50 text-primary-600'
                              : 'bg-secondary-50 text-secondary-600'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-neutral-900">
                              {insight.title}
                            </h3>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                insight.impact === 'High'
                                  ? 'bg-error-50 text-error-700'
                                  : 'bg-warning-50 text-warning-700'
                              }`}
                            >
                              {insight.impact}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel tabId="analytics" activeTab={activeTab}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Traffic by Source">
              <BarChart data={sourceData} />
            </ChartCard>

            <ChartCard title="Conversion Funnel">
              <div className="h-64 flex items-center justify-center text-neutral-400">
                Funnel chart placeholder
              </div>
            </ChartCard>
          </div>
        </div>
      </TabPanel>

      {/* Campaigns Tab */}
      <TabPanel tabId="campaigns" activeTab={activeTab}>
        <DataTable
          data={recentCampaigns}
          columns={campaignColumns}
          pagination={{
            page: 1,
            pageSize: 10,
            total: 24,
            onPageChange: () => {},
          }}
        />
      </TabPanel>

      {/* AI Insights Tab */}
      <TabPanel tabId="ai-insights" activeTab={activeTab}>
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    insight.type === 'alert'
                      ? 'bg-warning-50 text-warning-600'
                      : insight.type === 'recommendation'
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-secondary-50 text-secondary-600'
                  }`}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="heading-5">{insight.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        insight.impact === 'High'
                          ? 'bg-error-50 text-error-700'
                          : 'bg-warning-50 text-warning-700'
                      }`}
                    >
                      {insight.impact} Impact
                    </span>
                  </div>
                  <p className="text-neutral-600 mt-2">{insight.description}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <Button size="sm">Apply Recommendation</Button>
                    <Button variant="ghost" size="sm">Dismiss</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabPanel>
    </DashboardLayout>
  );
}
