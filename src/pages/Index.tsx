import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { MetricDetailModal } from '@/components/dashboard/MetricDetailModal';
import { CampaignsTable } from '@/components/dashboard/CampaignsTable';
import { SubscriptionTable } from '@/components/dashboard/SubscriptionTable';
import { SectionInsights } from '@/components/dashboard/SectionInsights';
import {
  mockToplineKPIs,
  mockEmailKPIs,
  mockSendKPIs,
  mockListGrowthKPIs,
  mockSubscriptionKPIs,
  mockCampaigns,
  generateSparklineData
} from '@/data/mockData';

const Index = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last_30_days');
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set dark mode as default
    document.documentElement.classList.add('dark');
  }, []);

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    // In a real app, this would trigger API calls
    console.log('Date range changed to:', range);
  };

  const handleCompareToggle = (enabled: boolean) => {
    setCompareEnabled(enabled);
    // In a real app, this would show delta indicators
    console.log('Compare mode:', enabled);
  };

  const handleMetricClick = (metric: any) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  if (!mounted) {
    return <div className="min-h-screen dashboard-bg" />;
  }

  return (
    <div className="min-h-screen dashboard-bg overflow-x-hidden max-w-full">
      <DashboardHeader 
        onDateRangeChange={handleDateRangeChange}
        onCompareToggle={handleCompareToggle}
      />
      
      <div className="p-4 sm:p-6 space-y-8 max-w-full overflow-x-hidden">
        {/* Core Revenue Metrics */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Core Revenue Metrics</h2>
          <SectionInsights sectionName="Core Revenue Metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <KPICard
              title="Total Revenue"
              value={mockToplineKPIs.cards.total_revenue}
              format="currency"
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.total_revenue_pct,
                isPositive: mockToplineKPIs.delta_prev.total_revenue_pct > 0
              } : undefined}
              sparkline={generateSparklineData()}
              isHighPerformance={mockToplineKPIs.delta_prev.total_revenue_pct > 0.1}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Email Rev Share"
              value={`${((mockToplineKPIs.cards.email_revenue_split.email / mockToplineKPIs.cards.total_revenue) * 100).toFixed(1)}%`}
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.email_revenue_split_pct,
                isPositive: mockToplineKPIs.delta_prev.email_revenue_split_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Campaign Rev"
              value={mockToplineKPIs.cards.campaign_revenue}
              format="currency"
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.campaign_revenue_pct,
                isPositive: mockToplineKPIs.delta_prev.campaign_revenue_pct > 0
              } : undefined}
              subtitle={
                <>
                  <span className="sm:hidden">{((mockToplineKPIs.cards.campaign_revenue / mockToplineKPIs.cards.email_revenue) * 100).toFixed(1)}% of email</span>
                  <span className="hidden sm:inline">{((mockToplineKPIs.cards.campaign_revenue / mockToplineKPIs.cards.email_revenue) * 100).toFixed(1)}% of email revenue</span>
                </>
              }
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Flow Rev"
              value={mockToplineKPIs.cards.flow_revenue}
              format="currency"
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.flow_revenue_pct,
                isPositive: mockToplineKPIs.delta_prev.flow_revenue_pct > 0
              } : undefined}
              subtitle={
                <>
                  <span className="sm:hidden">{((mockToplineKPIs.cards.flow_revenue / mockToplineKPIs.cards.email_revenue) * 100).toFixed(1)}% of email</span>
                  <span className="hidden sm:inline">{((mockToplineKPIs.cards.flow_revenue / mockToplineKPIs.cards.email_revenue) * 100).toFixed(1)}% of email revenue</span>
                </>
              }
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="RPR"
              value={mockToplineKPIs.cards.rpr.toFixed(2)}
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.rpr_pct,
                isPositive: mockToplineKPIs.delta_prev.rpr_pct > 0
              } : undefined}
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="AOV"
              value={mockToplineKPIs.cards.aov}
              format="currency"
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.aov_pct,
                isPositive: mockToplineKPIs.delta_prev.aov_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
        </section>

        {/* Performance Metrics */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Performance Metrics</h2>
          <SectionInsights sectionName="Performance Metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <KPICard
              title="Placed Order Rate"
              value={mockToplineKPIs.cards.campaign_placed_order_rate}
              format="percentage"
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.campaign_placed_order_rate_pct,
                isPositive: mockToplineKPIs.delta_prev.campaign_placed_order_rate_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Flow Placed Order Rate"
              value={mockToplineKPIs.cards.flow_placed_order_rate}
              format="percentage"
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.flow_placed_order_rate_pct,
                isPositive: mockToplineKPIs.delta_prev.flow_placed_order_rate_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Campaigns Sent"
              value={mockSendKPIs.campaigns_sent}
              format="number"
              delta={compareEnabled ? {
                value: mockSendKPIs.delta_prev.campaigns_sent_pct,
                isPositive: mockSendKPIs.delta_prev.campaigns_sent_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
        </section>

        {/* Email KPIs */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Email Performance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <KPICard
              title="Open Rate"
              value={mockEmailKPIs.open_rate}
              format="percentage"
              delta={compareEnabled ? {
                value: mockEmailKPIs.delta_prev.open_rate_pct,
                isPositive: mockEmailKPIs.delta_prev.open_rate_pct > 0
              } : undefined}
              isHighPerformance={mockEmailKPIs.open_rate > 0.25}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Click Rate"
              value={mockEmailKPIs.click_rate}
              format="percentage"
              delta={compareEnabled ? {
                value: mockEmailKPIs.delta_prev.click_rate_pct,
                isPositive: mockEmailKPIs.delta_prev.click_rate_pct > 0
              } : undefined}
              isHighPerformance={mockEmailKPIs.click_rate > 0.05}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Unsubscribe Rate"
              value={mockEmailKPIs.unsubscribe_rate}
              format="percentage"
              delta={compareEnabled ? {
                value: mockEmailKPIs.delta_prev.unsubscribe_rate_pct,
                isPositive: mockEmailKPIs.delta_prev.unsubscribe_rate_pct > 0
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Spam Rate"
              value={mockEmailKPIs.spam_rate}
              format="percentage"
              delta={compareEnabled ? {
                value: mockEmailKPIs.delta_prev.spam_rate_pct,
                isPositive: mockEmailKPIs.delta_prev.spam_rate_pct > 0
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Bounce Rate"
              value={mockEmailKPIs.bounce_rate}
              format="percentage"
              delta={compareEnabled ? {
                value: mockEmailKPIs.delta_prev.bounce_rate_pct,
                isPositive: mockEmailKPIs.delta_prev.bounce_rate_pct > 0
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
          </div>
        </section>

        {/* Send Volume & List Growth */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Send Volume & List Growth</h2>
          <SectionInsights sectionName="Send Volume Metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <KPICard
              title="Total Emails Sent"
              value={mockSendKPIs.total_emails_sent}
              format="number"
              delta={compareEnabled ? {
                value: mockSendKPIs.delta_prev.total_emails_sent_pct,
                isPositive: mockSendKPIs.delta_prev.total_emails_sent_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Campaign Sends"
              value={mockSendKPIs.campaign_sends}
              format="number"
              delta={compareEnabled ? {
                value: mockSendKPIs.delta_prev.campaign_sends_pct,
                isPositive: mockSendKPIs.delta_prev.campaign_sends_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Total Active Profiles"
              value={mockListGrowthKPIs.total_active_profiles}
              format="number"
              delta={compareEnabled ? {
                value: mockListGrowthKPIs.delta_prev.total_active_profiles_pct,
                isPositive: mockListGrowthKPIs.delta_prev.total_active_profiles_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Net Subscriber Growth"
              value={mockListGrowthKPIs.net_growth}
              format="number"
              delta={compareEnabled ? {
                value: mockListGrowthKPIs.delta_prev.net_growth_pct,
                isPositive: mockListGrowthKPIs.delta_prev.net_growth_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
            <KPICard
              title="New Email Subscribers"
              value={mockListGrowthKPIs.new_subscribers.email}
              format="number"
              delta={compareEnabled ? {
                value: mockListGrowthKPIs.delta_prev.new_subscribers_email_pct,
                isPositive: mockListGrowthKPIs.delta_prev.new_subscribers_email_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="New SMS Subscribers"
              value={mockListGrowthKPIs.new_subscribers.sms}
              format="number"
              delta={compareEnabled ? {
                value: mockListGrowthKPIs.delta_prev.new_subscribers_sms_pct,
                isPositive: mockListGrowthKPIs.delta_prev.new_subscribers_sms_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Email Unsubscribes"
              value={mockListGrowthKPIs.unsubscribers.email}
              format="number"
              delta={compareEnabled ? {
                value: mockListGrowthKPIs.delta_prev.unsubscribers_email_pct,
                isPositive: mockListGrowthKPIs.delta_prev.unsubscribers_email_pct > 0
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="% Engaged (30d)"
              value={mockListGrowthKPIs.engaged_pct_30d}
              format="percentage"
              delta={compareEnabled ? {
                value: mockListGrowthKPIs.delta_prev.engaged_pct_30d_pct,
                isPositive: mockListGrowthKPIs.delta_prev.engaged_pct_30d_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
        </section>

        {/* Metric Detail Modal */}
        <MetricDetailModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          metric={selectedMetric}
        />

        {/* Subscription Insights */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Recharge Subscription Insights</h2>
          <SectionInsights sectionName="Subscription Metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <KPICard
              title="Subscriptions Started"
              value={mockSubscriptionKPIs.cards.subs_started}
              format="number"
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.subs_started_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.subs_started_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Active Subscriptions"
              value={mockSubscriptionKPIs.cards.subs_active}
              format="number"
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.subs_active_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.subs_active_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Average Subscription Cycles"
              value={mockSubscriptionKPIs.cards.avg_cycles.toFixed(1)}
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.avg_cycles_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.avg_cycles_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Monthly Recurring Revenue (MRR)"
              value={mockSubscriptionKPIs.cards.mrr}
              format="currency"
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.mrr_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.mrr_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <KPICard
              title="Churn Rate"
              value={mockSubscriptionKPIs.cards.churn_pct}
              format="percentage"
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.churn_pct_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.churn_pct_pct > 0
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Reactivation Rate"
              value={mockSubscriptionKPIs.cards.reactivation_pct}
              format="percentage"
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.reactivation_pct_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.reactivation_pct_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Dunning Success Rate"
              value={mockSubscriptionKPIs.cards.dunning_success_pct}
              format="percentage"
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.dunning_success_pct_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.dunning_success_pct_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Skip Rate"
              value={mockSubscriptionKPIs.cards.skip_rate_pct}
              format="percentage"
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.skip_rate_pct_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.skip_rate_pct_pct > 0
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Avg Time to Cancel"
              value={`${mockSubscriptionKPIs.cards.avg_time_to_cancel_days} days`}
              delta={compareEnabled ? {
                value: mockSubscriptionKPIs.delta_prev.avg_time_to_cancel_days_pct,
                isPositive: mockSubscriptionKPIs.delta_prev.avg_time_to_cancel_days_pct > 0
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
          <SubscriptionTable products={mockSubscriptionKPIs.by_product} />
        </section>

        {/* Campaigns Table */}
        <section>
          <CampaignsTable campaigns={mockCampaigns.campaigns} />
        </section>
      </div>
    </div>
  );
};

export default Index;
