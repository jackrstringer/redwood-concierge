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
  generateSparklineData,
} from '@/data/mockData';
import { fetchCampaigns, fetchAggregateMetrics, fetchFlowAggregateMetrics, fetchCombinedAggregateMetrics, fetchJobTiming } from '@/lib/apiHelper';
import { Campaign } from '@/types/campaign';

const Index = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last_7_days');
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [previousRevenue, setPreviousRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); 
  const [aggregateRPR, setAggregateRPR] = useState(0);
  const [aggregateAOV, setAggregateAOV] = useState(0);
  const [previousAggregateRPR, setPreviousAggregateRPR] = useState(0);
  const [previousAggregateAOV, setPreviousAggregateAOV] = useState(0);
  const [campaignRevenue, setCampaignRevenue] = useState(0);
  const [previousCampaignRevenue, setPreviousCampaignRevenue] = useState(0);
  const [flowRevenue, setFlowRevenue] = useState(0);
  const [previousFlowRevenue, setPreviousFlowRevenue] = useState(0);
  const [lastJobTime, setLastJobTime] = useState<string | null>(null);

  // 🔹 Map current timeframe to its "previous" version
  const getPreviousRange = (range: string) => {
    if (range === 'last_7_days') return 'previous_7_days';
    if (range === 'last_30_days') return 'previous_30_days';
    return 'previous_30_days';
  };

  // 🔹 Load combined aggregate metrics (RPR and AOV from both campaigns and flows)
  const loadAggregateMetrics = async (dateRange: string = selectedDateRange) => {
    try {
      const metrics = await fetchCombinedAggregateMetrics(dateRange);
      if (metrics) {
        setAggregateRPR(metrics.aggregate_rpr);
        setAggregateAOV(metrics.aggregate_aov);

        if (compareEnabled && metrics.previous_aggregate_rpr !== undefined && metrics.previous_aggregate_aov !== undefined) {
          setPreviousAggregateRPR(metrics.previous_aggregate_rpr);
          setPreviousAggregateAOV(metrics.previous_aggregate_aov);
        } else {
          setPreviousAggregateRPR(0);
          setPreviousAggregateAOV(0);
        }

        console.log('Combined metrics breakdown:', {
          total_rpr: metrics.aggregate_rpr,
          campaign_rpr: metrics.campaign_aggregate_rpr,
          flow_rpr: metrics.flow_aggregate_rpr,
          total_aov: metrics.aggregate_aov,
          campaign_aov: metrics.campaign_aggregate_aov,
          flow_aov: metrics.flow_aggregate_aov
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch combined aggregate metrics:', error);
      // Fallback to mock data if API fails
      setAggregateRPR(mockToplineKPIs.cards.rpr);
      setAggregateAOV(mockToplineKPIs.cards.aov);
    }
  };

  // 🔹 Load flow aggregate metrics
  const loadFlowAggregateMetrics = async (dateRange: string = selectedDateRange) => {
    try {
      const flowMetrics = await fetchFlowAggregateMetrics(dateRange);
      if (flowMetrics) {
        setFlowRevenue(flowMetrics.total_revenue);

        if (compareEnabled && flowMetrics.previous_total_revenue !== undefined) {
          setPreviousFlowRevenue(flowMetrics.previous_total_revenue);
        } else {
          setPreviousFlowRevenue(0);
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch flow aggregate metrics:', error);
      // Fallback to 0 if API fails
      setFlowRevenue(0);
      setPreviousFlowRevenue(0);
    }
  };

  // 🔹 Load job timing
  const loadJobTiming = async (dateRange: string = selectedDateRange) => {
    try {
      const jobTiming = await fetchJobTiming(dateRange, 'campaign_report_values');
      if (jobTiming && jobTiming.last_job_created_at) {
        setLastJobTime(jobTiming.last_job_created_at);
      } else {
        setLastJobTime(null);
      }
    } catch (error: any) {
      console.error('Failed to fetch job timing:', error);
      setLastJobTime(null);
    }
  };

  // 🔹 Load campaigns and handle compare logic
  const loadCampaigns = async (dateRange: string = selectedDateRange) => {
    try {
      setIsLoadingCampaigns(true);
      // fetch current
      const currentData = await fetchCampaigns(dateRange);
      setCampaigns(currentData);

      // Total revenue calculation is handled in useEffect

      // Calculate campaign revenue (total revenue for campaigns with type='campaign')
      const campaignTypeData = currentData.filter(c => c.type === 'campaign');
      const currentCampaignRevenue = campaignTypeData.reduce((sum, c) => sum + (c.revenue || 0), 0);
      setCampaignRevenue(currentCampaignRevenue);

      // fetch previous only if compare is enabled
      if (compareEnabled) {
        const prevRange = getPreviousRange(dateRange);
        const prevData = await fetchCampaigns(prevRange);
        // Previous revenue calculation is handled in useEffect

        // Calculate previous campaign revenue (total revenue for campaigns with type='campaign')
        const prevCampaignTypeData = prevData.filter(c => c.type === 'campaign');
        const prevCampaignRevenue = prevCampaignTypeData.reduce((sum, c) => sum + (c.revenue || 0), 0);
        setPreviousCampaignRevenue(prevCampaignRevenue);
      } else {
        setPreviousCampaignRevenue(0);
      }
    } catch (error: any) {
      console.error('Failed to fetch campaigns in index.tsx:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
    // initial load
    loadCampaigns();
    loadAggregateMetrics();
    loadFlowAggregateMetrics();
    loadJobTiming();
  }, []);

  // Update total revenue when campaign or flow revenue changes
  useEffect(() => {
    const campaignTotalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
    setTotalRevenue(campaignTotalRevenue + flowRevenue);
  }, [campaigns, flowRevenue]);

  // Update previous revenue calculation
  useEffect(() => {
    if (compareEnabled) {
      // Calculate previous campaign revenue
      const prevCampaignRevenue = campaigns.reduce((sum, c) => sum + (c.previous_revenue || 0), 0);
      setPreviousRevenue(prevCampaignRevenue + previousFlowRevenue);
    } else {
      setPreviousRevenue(0);
    }
  }, [campaigns, previousFlowRevenue, compareEnabled]);

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    loadCampaigns(range);
    loadAggregateMetrics(range);
    loadFlowAggregateMetrics(range);
    loadJobTiming(range);
  };

  const handleCompareToggle = (enabled: boolean) => {
    setCompareEnabled(enabled);
    loadCampaigns(selectedDateRange);
    loadAggregateMetrics(selectedDateRange);
    loadFlowAggregateMetrics(selectedDateRange);
  };

  const handleMetricClick = (metric: any) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  // Calculate total email revenue
  const totalEmailRevenue = campaigns
    .filter(c => c.channel === 'email')
    .reduce((sum, c) => sum + (c.revenue || 0), 0);

  // Calculate Email Rev Share as a decimal (0-1)
  const emailRevShare = totalRevenue > 0
    ? totalEmailRevenue / totalRevenue
    : 0;

  // Calculate previous period email revenue and delta
  let previousEmailRevenue = 0;
  let previousEmailRevShare = 0;
  let emailRevDelta = undefined;

  if (compareEnabled) {
    // Calculate previous email revenue
    previousEmailRevenue = campaigns
      .filter(c => c.channel === 'email')
      .reduce((sum, c) => sum + (c.previous_revenue || 0), 0);

    // Calculate previous Email Rev Share as a decimal
    previousEmailRevShare = previousRevenue > 0
      ? previousEmailRevenue / previousRevenue
      : 0;

    // Calculate the delta as percentage points (not percentage change)
    emailRevDelta = emailRevShare - previousEmailRevShare;
  }

  if (!mounted) {
    return <div className="min-h-screen dashboard-bg" />;
  }

  return (
    <div className="min-h-screen dashboard-bg overflow-x-hidden max-w-full">
      <DashboardHeader
        onDateRangeChange={handleDateRangeChange}
        onCompareToggle={handleCompareToggle}
        lastJobTime={lastJobTime}
      />
      <div className="p-4 sm:p-6 space-y-8 max-w-full overflow-x-hidden">
        {/* Core Revenue Metrics */}
        <section>
          <h2 className="text-xl font-semibold dashboard-text mb-4">
            Core Revenue Metrics
          </h2>
          <SectionInsights sectionName="Core Revenue Metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <KPICard
              title="Total Revenue"
              value={totalRevenue} // Now using the state variable
              format="currency"
              delta={
                compareEnabled && previousRevenue > 0
                  ? {
                    value:
                      ((totalRevenue - previousRevenue) / previousRevenue) *
                      100,
                    isPositive: totalRevenue >= previousRevenue,
                  }
                  : undefined
              }
              sparkline={generateSparklineData()}
              isHighPerformance={totalRevenue > previousRevenue}
              onCardClick={handleMetricClick}
            />
            {/* Email Rev Share Card */}
            <KPICard
              title="Email Rev Share"
              value={emailRevShare}
              format="percentage"
              delta={emailRevDelta !== undefined ? {
                value: emailRevDelta,
                isPositive: emailRevDelta >= 0
              } : undefined}
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Campaign Rev"
              value={campaignRevenue}
              format="currency"
              delta={compareEnabled && previousCampaignRevenue > 0 ? {
                value: ((campaignRevenue - previousCampaignRevenue) / previousCampaignRevenue),
                isPositive: campaignRevenue >= previousCampaignRevenue
              } : undefined}
              subtitle={
                totalEmailRevenue > 0 ? (
                  <>
                    <span className="sm:hidden">{((campaignRevenue / totalEmailRevenue) * 100).toFixed(1)}% of email</span>
                    <span className="hidden sm:inline">{((campaignRevenue / totalEmailRevenue) * 100).toFixed(1)}% of email revenue</span>
                  </>
                ) : undefined
              }
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Flow Rev"
              value={flowRevenue}
              format="currency"
              delta={compareEnabled && previousFlowRevenue > 0 ? {
                value: ((flowRevenue - previousFlowRevenue) / previousFlowRevenue),
                isPositive: flowRevenue >= previousFlowRevenue
              } : undefined}
              subtitle={
                totalEmailRevenue > 0 ? (
                  <>
                    <span className="sm:hidden">{((flowRevenue / totalEmailRevenue) * 100).toFixed(1)}% of email</span>
                    <span className="hidden sm:inline">{((flowRevenue / totalEmailRevenue) * 100).toFixed(1)}% of email revenue</span>
                  </>
                ) : undefined
              }
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="RPR"
              value={aggregateRPR}
              format="percentage"
              delta={compareEnabled && previousAggregateRPR > 0 ? {
                value: ((aggregateRPR - previousAggregateRPR) / previousAggregateRPR),
                isPositive: aggregateRPR >= previousAggregateRPR
              } : undefined}
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="AOV"
              value={aggregateAOV}
              format="currency"
              delta={compareEnabled && previousAggregateAOV > 0 ? {
                value: ((aggregateAOV - previousAggregateAOV) / previousAggregateAOV),
                isPositive: aggregateAOV >= previousAggregateAOV
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
          <CampaignsTable campaigns={campaigns} isLoading={isLoadingCampaigns} dateRange={selectedDateRange} />
        </section>
      </div>
    </div>
  );
};

export default Index;
