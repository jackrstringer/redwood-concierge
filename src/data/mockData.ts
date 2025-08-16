// Mock API data following the provided contracts

export const mockToplineKPIs = {
  window: { 
    label: "Last 30 days", 
    start: "2025-07-16T00:00:00Z", 
    end: "2025-08-15T23:59:59Z" 
  },
  cards: {
    total_revenue: 1197345.28,
    email_revenue: 842110.42,
    email_revenue_split: { email: 842110.42, other: 355234.86 },
    campaign_revenue: 512345.67,
    flow_revenue: 329764.75,
    rpr: 1.93,
    campaign_placed_order_rate: 0.021,
    flow_placed_order_rate: 0.027,
    aov: 74.12
  },
  delta_prev: { 
    total_revenue_pct: -0.10,
    email_revenue_pct: 0.08,
    campaign_revenue_pct: 0.15,
    flow_revenue_pct: 0.08,
    rpr_pct: 0.12,
    campaign_placed_order_rate_pct: -0.03,
    flow_placed_order_rate_pct: 0.05,
    aov_pct: 0.07,
    email_revenue_split_pct: 0.02
  }
};

export const mockEmailKPIs = {
  open_rate: 0.318,
  click_rate: 0.041,
  unsubscribe_rate: 0.0031,
  spam_rate: 0.0006,
  bounce_rate: 0.0042,
  delta_prev: {
    open_rate_pct: 0.04,
    click_rate_pct: 0.02,
    unsubscribe_rate_pct: -0.01,
    spam_rate_pct: -0.02,
    bounce_rate_pct: 0.01
  }
};

export const mockSendKPIs = {
  total_emails_sent: 612345,
  campaign_sends: 442110,
  campaigns_sent: 28,
  delta_prev: {
    total_emails_sent_pct: 0.18,
    campaign_sends_pct: 0.22,
    campaigns_sent_pct: 0.15
  }
};

export const mockListGrowthKPIs = {
  total_active_profiles: 1854321,
  new_subscribers: { email: 27412, sms: 10433 },
  unsubscribers: { email: 8122, sms: 2280 },
  net_growth: 27443,
  engaged_pct_30d: 0.41,
  delta_prev: {
    total_active_profiles_pct: 0.09,
    new_subscribers_email_pct: 0.14,
    new_subscribers_sms_pct: 0.28,
    unsubscribers_email_pct: -0.05,
    net_growth_pct: 0.16,
    engaged_pct_30d_pct: 0.03
  }
};

export const mockSubscriptionKPIs = {
  window: { start: "2025-07-16T00:00:00Z", end: "2025-08-15T23:59:59Z" },
  cards: {
    subs_started: 412,
    subs_active: 5832,
    avg_cycles: 4.7,
    mrr: 182345.00,
    churn_pct: 0.028,
    reactivation_pct: 0.142,
    dunning_success_pct: 0.63,
    skip_rate_pct: 0.094,
    avg_time_to_cancel_days: 86
  },
  delta_prev: {
    subs_started_pct: 0.24,
    subs_active_pct: 0.11,
    avg_cycles_pct: 0.06,
    mrr_pct: 0.13,
    churn_pct_pct: -0.08,
    reactivation_pct_pct: 0.19,
    dunning_success_pct_pct: 0.04,
    skip_rate_pct_pct: -0.02,
    avg_time_to_cancel_days_pct: 0.09
  },
  by_product: [
    { 
      sku: "HYDRO-01", 
      name: "Hydration Mix – Citrus", 
      active_subs: 2140, 
      mrr: 67120.00, 
      mrr_share_pct: 0.368 
    },
    { 
      sku: "HYDRO-02", 
      name: "Hydration Mix – Berry", 
      active_subs: 1755, 
      mrr: 55105.00, 
      mrr_share_pct: 0.302 
    },
    { 
      sku: "HYDRO-03", 
      name: "Hydration Mix – Mango", 
      active_subs: 1183, 
      mrr: 37150.00, 
      mrr_share_pct: 0.204 
    }
  ]
};

export const mockCampaigns = {
  campaigns: [
    {
      id: "cmp_01",
      sent_at: "2025-08-10T14:00:00Z",
      name: "Hydration Drop — Citrus",
      recipients: 120345,
      open_rate: 0.327,
      click_rate: 0.048,
      placed_orders: 2550,
      revenue: 184320.50,
      rpr: 1.53,
      aov: 72.28
    },
    {
      id: "cmp_02",
      sent_at: "2025-08-06T16:00:00Z",
      name: "Back-in-Stock — Mango",
      recipients: 84321,
      open_rate: 0.344,
      click_rate: 0.052,
      placed_orders: 1932,
      revenue: 146210.00,
      rpr: 1.73,
      aov: 75.70
    },
    {
      id: "cmp_03",
      sent_at: "2025-08-03T10:30:00Z",
      name: "Summer Hydration Sale",
      recipients: 156789,
      open_rate: 0.298,
      click_rate: 0.035,
      placed_orders: 1876,
      revenue: 128450.25,
      rpr: 0.82,
      aov: 68.45
    },
    {
      id: "cmp_04",
      sent_at: "2025-07-28T15:45:00Z",
      name: "New Berry Flavor Launch",
      recipients: 92341,
      open_rate: 0.356,
      click_rate: 0.055,
      placed_orders: 2122,
      revenue: 162890.75,
      rpr: 1.76,
      aov: 76.75
    }
  ]
};

// Sample sparkline data for KPI cards
export const generateSparklineData = (points: number = 12): number[] => {
  return Array.from({ length: points }, () => Math.random() * 100 + 20);
};