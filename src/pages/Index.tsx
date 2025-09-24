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
import { fetchCampaigns, fetchDashboardKPI, fetchJobTiming } from '@/lib/apiHelper';
import { Campaign } from '@/types/campaign';

const Index = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last_7_days');
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [kpiData, setKpiData] = useState<any>(null);
  const [previousKpiData, setPreviousKpiData] = useState<any>(null);
  const [lastJobTime, setLastJobTime] = useState<string | null>(null);

  // 🔹 Map current timeframe to its "previous" version
  const getPreviousRange = (range: string) => {
    if (range === 'last_7_days') return 'previous_7_days';
    if (range === 'last_30_days') return 'previous_30_days';
    return 'previous_30_days';
  };

  // 🔹 Load KPI data from the centralized function
  const loadKPIMetrics = async (dateRange: string = selectedDateRange) => {
    try {
      const currentKPI = await fetchDashboardKPI(dateRange);
      if (currentKPI) {
        setKpiData(currentKPI);
        console.log('KPI metrics fetched:', currentKPI);
      }

      // Load previous KPI data for comparison if enabled
      if (compareEnabled) {
        const prevRange = getPreviousRange(dateRange);
        const previousKPI = await fetchDashboardKPI(prevRange);
        if (previousKPI) {
          setPreviousKpiData(previousKPI);
        }
      } else {
        setPreviousKpiData(null);
      }
    } catch (error: any) {
      console.error('Failed to fetch KPI metrics:', error);
      // Set fallback data
      setKpiData(null);
      setPreviousKpiData(null);
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

  // 🔹 Load campaigns for table display
  const loadCampaigns = async (dateRange: string = selectedDateRange) => {
    try {
      setIsLoadingCampaigns(true);
      const currentData = await fetchCampaigns(dateRange);
      setCampaigns(currentData);
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
    loadKPIMetrics();
    loadJobTiming();
  }, []);


  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    loadCampaigns(range);
    loadKPIMetrics(range);
    loadJobTiming(range);
  };

  const handleCompareToggle = (enabled: boolean) => {
    setCompareEnabled(enabled);
    loadCampaigns(selectedDateRange);
    loadKPIMetrics(selectedDateRange);
  };

  const handleMetricClick = (metric: any) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMetric(null);
  };

  // Helper function to calculate delta percentage
  const calculateDelta = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Calculate Email Rev Share as a decimal (0-1)
  const emailRevShare = kpiData?.total_revenue > 0
    ? (kpiData?.email_revenue || 0) / kpiData.total_revenue
    : 0;

  // Calculate previous Email Rev Share for comparison
  let emailRevDelta = undefined;
  if (compareEnabled && previousKpiData) {
    const previousEmailRevShare = previousKpiData?.total_revenue > 0
      ? (previousKpiData?.email_revenue || 0) / previousKpiData.total_revenue
      : 0;
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
              value={kpiData?.total_revenue || 0}
              format="currency"
              delta={
                compareEnabled && previousKpiData
                  ? {
                    value: calculateDelta(kpiData?.total_revenue || 0, previousKpiData?.total_revenue || 0),
                    isPositive: (kpiData?.total_revenue || 0) >= (previousKpiData?.total_revenue || 0),
                  }
                  : undefined
              }
              sparkline={generateSparklineData()}
              isHighPerformance={(kpiData?.total_revenue || 0) > (previousKpiData?.total_revenue || 0)}
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
              value={kpiData?.campaign_revenue || 0}
              format="currency"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.campaign_revenue || 0, previousKpiData?.campaign_revenue || 0),
                isPositive: (kpiData?.campaign_revenue || 0) >= (previousKpiData?.campaign_revenue || 0)
              } : undefined}
              subtitle={
                (kpiData?.email_revenue || 0) > 0 ? (
                  <>
                    <span className="sm:hidden">{(((kpiData?.campaign_revenue || 0) / kpiData.email_revenue) * 100).toFixed(1)}% of email</span>
                    <span className="hidden sm:inline">{(((kpiData?.campaign_revenue || 0) / kpiData.email_revenue) * 100).toFixed(1)}% of email revenue</span>
                  </>
                ) : undefined
              }
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Flow Rev"
              value={kpiData?.flow_revenue || 0}
              format="currency"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.flow_revenue || 0, previousKpiData?.flow_revenue || 0),
                isPositive: (kpiData?.flow_revenue || 0) >= (previousKpiData?.flow_revenue || 0)
              } : undefined}
              subtitle={
                (kpiData?.email_revenue || 0) > 0 ? (
                  <>
                    <span className="sm:hidden">{(((kpiData?.flow_revenue || 0) / kpiData.email_revenue) * 100).toFixed(1)}% of email</span>
                    <span className="hidden sm:inline">{(((kpiData?.flow_revenue || 0) / kpiData.email_revenue) * 100).toFixed(1)}% of email revenue</span>
                  </>
                ) : undefined
              }
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="RPR"
              value={kpiData?.revenue_per_recipient || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.revenue_per_recipient || 0, previousKpiData?.revenue_per_recipient || 0),
                isPositive: (kpiData?.revenue_per_recipient || 0) >= (previousKpiData?.revenue_per_recipient || 0)
              } : undefined}
              sparkline={generateSparklineData()}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="AOV"
              value={kpiData?.average_order_value || 0}
              format="currency"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.average_order_value || 0, previousKpiData?.average_order_value || 0),
                isPositive: (kpiData?.average_order_value || 0) >= (previousKpiData?.average_order_value || 0)
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
              value={kpiData?.campaign_place_order_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.campaign_place_order_rate || 0, previousKpiData?.campaign_place_order_rate || 0),
                isPositive: (kpiData?.campaign_place_order_rate || 0) >= (previousKpiData?.campaign_place_order_rate || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Flow Placed Order Rate"
              value={kpiData?.flow_place_order_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.flow_place_order_rate || 0, previousKpiData?.flow_place_order_rate || 0),
                isPositive: (kpiData?.flow_place_order_rate || 0) >= (previousKpiData?.flow_place_order_rate || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Campaigns Sent"
              value={kpiData?.campaigns_sent || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.campaigns_sent || 0, previousKpiData?.campaigns_sent || 0),
                isPositive: (kpiData?.campaigns_sent || 0) >= (previousKpiData?.campaigns_sent || 0)
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
              value={kpiData?.open_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.open_rate || 0, previousKpiData?.open_rate || 0),
                isPositive: (kpiData?.open_rate || 0) >= (previousKpiData?.open_rate || 0)
              } : undefined}
              isHighPerformance={(kpiData?.open_rate || 0) > 0.25}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Click Rate"
              value={kpiData?.click_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.click_rate || 0, previousKpiData?.click_rate || 0),
                isPositive: (kpiData?.click_rate || 0) >= (previousKpiData?.click_rate || 0)
              } : undefined}
              isHighPerformance={(kpiData?.click_rate || 0) > 0.05}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Unsubscribe Rate"
              value={kpiData?.unsubscribe_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.unsubscribe_rate || 0, previousKpiData?.unsubscribe_rate || 0),
                isPositive: (kpiData?.unsubscribe_rate || 0) >= (previousKpiData?.unsubscribe_rate || 0)
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Spam Rate"
              value={kpiData?.spam_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.spam_rate || 0, previousKpiData?.spam_rate || 0),
                isPositive: (kpiData?.spam_rate || 0) >= (previousKpiData?.spam_rate || 0)
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Bounce Rate"
              value={kpiData?.bounce_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.bounce_rate || 0, previousKpiData?.bounce_rate || 0),
                isPositive: (kpiData?.bounce_rate || 0) >= (previousKpiData?.bounce_rate || 0)
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
              value={kpiData?.total_emails_sent || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.total_emails_sent || 0, previousKpiData?.total_emails_sent || 0),
                isPositive: (kpiData?.total_emails_sent || 0) >= (previousKpiData?.total_emails_sent || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Campaign Sends"
              value={kpiData?.campaign_sends || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.campaign_sends || 0, previousKpiData?.campaign_sends || 0),
                isPositive: (kpiData?.campaign_sends || 0) >= (previousKpiData?.campaign_sends || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Total Active Profiles"
              value={kpiData?.total_active_profiles || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.total_active_profiles || 0, previousKpiData?.total_active_profiles || 0),
                isPositive: (kpiData?.total_active_profiles || 0) >= (previousKpiData?.total_active_profiles || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Net Subscriber Growth"
              value={kpiData?.net_subscriber_growth || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.net_subscriber_growth || 0, previousKpiData?.net_subscriber_growth || 0),
                isPositive: (kpiData?.net_subscriber_growth || 0) >= (previousKpiData?.net_subscriber_growth || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
            <KPICard
              title="New Email Subscribers"
              value={kpiData?.new_email_subscribers || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.new_email_subscribers || 0, previousKpiData?.new_email_subscribers || 0),
                isPositive: (kpiData?.new_email_subscribers || 0) >= (previousKpiData?.new_email_subscribers || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="New SMS Subscribers"
              value={kpiData?.new_sms_subscribers || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.new_sms_subscribers || 0, previousKpiData?.new_sms_subscribers || 0),
                isPositive: (kpiData?.new_sms_subscribers || 0) >= (previousKpiData?.new_sms_subscribers || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Email Unsubscribes"
              value={kpiData?.email_unsubscribes || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.email_unsubscribes || 0, previousKpiData?.email_unsubscribes || 0),
                isPositive: (kpiData?.email_unsubscribes || 0) >= (previousKpiData?.email_unsubscribes || 0)
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="% Engaged (30d)"
              value={kpiData?.percentage_engaged || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.percentage_engaged || 0, previousKpiData?.percentage_engaged || 0),
                isPositive: (kpiData?.percentage_engaged || 0) >= (previousKpiData?.percentage_engaged || 0)
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
              value={kpiData?.subscriptions_started || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.subscriptions_started || 0, previousKpiData?.subscriptions_started || 0),
                isPositive: (kpiData?.subscriptions_started || 0) >= (previousKpiData?.subscriptions_started || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Active Subscriptions"
              value={kpiData?.active_subscriptions || 0}
              format="number"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.active_subscriptions || 0, previousKpiData?.active_subscriptions || 0),
                isPositive: (kpiData?.active_subscriptions || 0) >= (previousKpiData?.active_subscriptions || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Average Subscription Cycles"
              value={(kpiData?.average_subcription_cycles || 0).toFixed(1)}
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.average_subcription_cycles || 0, previousKpiData?.average_subcription_cycles || 0),
                isPositive: (kpiData?.average_subcription_cycles || 0) >= (previousKpiData?.average_subcription_cycles || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Monthly Recurring Revenue (MRR)"
              value={kpiData?.monthly_recurring_revenue || 0}
              format="currency"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.monthly_recurring_revenue || 0, previousKpiData?.monthly_recurring_revenue || 0),
                isPositive: (kpiData?.monthly_recurring_revenue || 0) >= (previousKpiData?.monthly_recurring_revenue || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <KPICard
              title="Churn Rate"
              value={kpiData?.churn_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.churn_rate || 0, previousKpiData?.churn_rate || 0),
                isPositive: (kpiData?.churn_rate || 0) >= (previousKpiData?.churn_rate || 0)
              } : undefined}
              isBadMetric={true}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Reactivation Rate"
              value={kpiData?.reactivation_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.reactivation_rate || 0, previousKpiData?.reactivation_rate || 0),
                isPositive: (kpiData?.reactivation_rate || 0) >= (previousKpiData?.reactivation_rate || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Dunning Success Rate"
              value={kpiData?.dunning_success_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.dunning_success_rate || 0, previousKpiData?.dunning_success_rate || 0),
                isPositive: (kpiData?.dunning_success_rate || 0) >= (previousKpiData?.dunning_success_rate || 0)
              } : undefined}
              onCardClick={handleMetricClick}
            />
            <KPICard
              title="Skip Rate"
              value={kpiData?.skip_rate || 0}
              format="percentage"
              delta={compareEnabled && previousKpiData ? {
                value: calculateDelta(kpiData?.skip_rate || 0, previousKpiData?.skip_rate || 0),
                isPositive: (kpiData?.skip_rate || 0) >= (previousKpiData?.skip_rate || 0)
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
