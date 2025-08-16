import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { CampaignsTable } from '@/components/dashboard/CampaignsTable';
import { SubscriptionTable } from '@/components/dashboard/SubscriptionTable';
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
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) {
    return <div className="min-h-screen dashboard-bg" />;
  }

  return (
    <div className="min-h-screen dashboard-bg">
      <DashboardHeader 
        onDateRangeChange={handleDateRangeChange}
        onCompareToggle={handleCompareToggle}
      />
      
      <div className="p-6 space-y-8">
        {/* Top Line Revenue */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Top Line Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Revenue"
              value={mockToplineKPIs.cards.total_revenue}
              format="currency"
              delta={compareEnabled ? {
                value: mockToplineKPIs.delta_prev.total_revenue_pct,
                isPositive: mockToplineKPIs.delta_prev.total_revenue_pct > 0
              } : undefined}
              sparkline={generateSparklineData()}
            />
            <KPICard
              title="Campaign Revenue"
              value={mockToplineKPIs.cards.campaign_revenue}
              format="currency"
              sparkline={generateSparklineData()}
            />
            <KPICard
              title="Flow Revenue"
              value={mockToplineKPIs.cards.flow_revenue}
              format="currency"
              sparkline={generateSparklineData()}
            />
            <KPICard
              title="Revenue per Recipient"
              value={`$${mockToplineKPIs.cards.rpr.toFixed(2)}`}
              sparkline={generateSparklineData()}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPICard
              title="Campaign Placed Order Rate"
              value={mockToplineKPIs.cards.campaign_placed_order_rate}
              format="percentage"
            />
            <KPICard
              title="Flow Placed Order Rate"
              value={mockToplineKPIs.cards.flow_placed_order_rate}
              format="percentage"
            />
            <KPICard
              title="Average Order Value"
              value={mockToplineKPIs.cards.aov}
              format="currency"
            />
            <KPICard
              title="Email vs All Revenue"
              value={`${((mockToplineKPIs.cards.email_revenue_split.email / mockToplineKPIs.cards.total_revenue) * 100).toFixed(1)}%`}
            />
          </div>
        </section>

        {/* Email KPIs */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Email Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPICard
              title="Open Rate"
              value={mockEmailKPIs.open_rate}
              format="percentage"
            />
            <KPICard
              title="Click Rate"
              value={mockEmailKPIs.click_rate}
              format="percentage"
            />
            <KPICard
              title="Unsubscribe Rate"
              value={mockEmailKPIs.unsubscribe_rate}
              format="percentage"
            />
            <KPICard
              title="Spam Complaint Rate"
              value={mockEmailKPIs.spam_rate}
              format="percentage"
            />
            <KPICard
              title="Bounce Rate"
              value={mockEmailKPIs.bounce_rate}
              format="percentage"
            />
          </div>
        </section>

        {/* Send Volume & List Growth */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Send Volume & List Growth</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Emails Sent"
              value={mockSendKPIs.total_emails_sent}
              format="number"
            />
            <KPICard
              title="Campaign Sends"
              value={mockSendKPIs.campaign_sends}
              format="number"
            />
            <KPICard
              title="Total Active Profiles"
              value={mockListGrowthKPIs.total_active_profiles}
              format="number"
            />
            <KPICard
              title="Net Subscriber Growth"
              value={mockListGrowthKPIs.net_growth}
              format="number"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPICard
              title="New Email Subscribers"
              value={mockListGrowthKPIs.new_subscribers.email}
              format="number"
            />
            <KPICard
              title="New SMS Subscribers"
              value={mockListGrowthKPIs.new_subscribers.sms}
              format="number"
            />
            <KPICard
              title="Email Unsubscribes"
              value={mockListGrowthKPIs.unsubscribers.email}
              format="number"
            />
            <KPICard
              title="% Engaged (30d)"
              value={mockListGrowthKPIs.engaged_pct_30d}
              format="percentage"
            />
          </div>
        </section>

        {/* Subscription Insights */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">Recharge Subscription Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Subscriptions Started"
              value={mockSubscriptionKPIs.cards.subs_started}
              format="number"
            />
            <KPICard
              title="Active Subscriptions"
              value={mockSubscriptionKPIs.cards.subs_active}
              format="number"
            />
            <KPICard
              title="Average Subscription Cycles"
              value={mockSubscriptionKPIs.cards.avg_cycles.toFixed(1)}
            />
            <KPICard
              title="Monthly Recurring Revenue"
              value={mockSubscriptionKPIs.cards.mrr}
              format="currency"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Churn Rate"
              value={mockSubscriptionKPIs.cards.churn_pct}
              format="percentage"
            />
            <KPICard
              title="Reactivation Rate"
              value={mockSubscriptionKPIs.cards.reactivation_pct}
              format="percentage"
            />
            <KPICard
              title="Dunning Success Rate"
              value={mockSubscriptionKPIs.cards.dunning_success_pct}
              format="percentage"
            />
            <KPICard
              title="Skip Rate"
              value={mockSubscriptionKPIs.cards.skip_rate_pct}
              format="percentage"
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
