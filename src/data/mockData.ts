// Mock API data with all values converted to 0

export const mockToplineKPIs = {
  window: { 
    label: "Last 0 days", 
    start: "0000-00-00T00:00:00Z", 
    end: "0000-00-00T00:00:00Z" 
  },
  cards: {
    total_revenue: 0,
    email_revenue: 0,
    email_revenue_split: { email: 0, other: 0 },
    campaign_revenue: 0,
    flow_revenue: 0,
    rpr: 0,
    campaign_placed_order_rate: 0,
    flow_placed_order_rate: 0,
    aov: 0
  },
  delta_prev: { 
    total_revenue_pct: 0,
    email_revenue_pct: 0,
    campaign_revenue_pct: 0,
    flow_revenue_pct: 0,
    rpr_pct: 0,
    campaign_placed_order_rate_pct: 0,
    flow_placed_order_rate_pct: 0,
    aov_pct: 0,
    email_revenue_split_pct: 0
  }
};

export const mockEmailKPIs = {
  open_rate: 0,
  click_rate: 0,
  unsubscribe_rate: 0,
  spam_rate: 0,
  bounce_rate: 0,
  delta_prev: {
    open_rate_pct: 0,
    click_rate_pct: 0,
    unsubscribe_rate_pct: 0,
    spam_rate_pct: 0,
    bounce_rate_pct: 0
  }
};

export const mockSendKPIs = {
  total_emails_sent: 0,
  campaign_sends: 0,
  campaigns_sent: 0,
  delta_prev: {
    total_emails_sent_pct: 0,
    campaign_sends_pct: 0,
    campaigns_sent_pct: 0
  }
};

export const mockListGrowthKPIs = {
  total_active_profiles: 0,
  new_subscribers: { email: 0, sms: 0 },
  unsubscribers: { email: 0, sms: 0 },
  net_growth: 0,
  engaged_pct_30d: 0,
  delta_prev: {
    total_active_profiles_pct: 0,
    new_subscribers_email_pct: 0,
    new_subscribers_sms_pct: 0,
    unsubscribers_email_pct: 0,
    net_growth_pct: 0,
    engaged_pct_30d_pct: 0
  }
};

export const mockSubscriptionKPIs = {
  window: { start: "0000-00-00T00:00:00Z", end: "0000-00-00T00:00:00Z" },
  cards: {
    subs_started: 0,
    subs_active: 0,
    avg_cycles: 0,
    mrr: 0,
    churn_pct: 0,
    reactivation_pct: 0,
    dunning_success_pct: 0,
    skip_rate_pct: 0,
    avg_time_to_cancel_days: 0
  },
  delta_prev: {
    subs_started_pct: 0,
    subs_active_pct: 0,
    avg_cycles_pct: 0,
    mrr_pct: 0,
    churn_pct_pct: 0,
    reactivation_pct_pct: 0,
    dunning_success_pct_pct: 0,
    skip_rate_pct_pct: 0,
    avg_time_to_cancel_days_pct: 0
  },
  by_product: [
    { sku: "", name: "", active_subs: 0, mrr: 0, mrr_share_pct: 0 },
    { sku: "", name: "", active_subs: 0, mrr: 0, mrr_share_pct: 0 },
    { sku: "", name: "", active_subs: 0, mrr: 0, mrr_share_pct: 0 }
  ]
};

export const mockCampaigns = {
  campaigns: [
    {
      id: "",
      sent_at: "0000-00-00T00:00:00Z",
      name: "",
      recipients: 0,
      open_rate: 0,
      click_rate: 0,
      placed_orders: 0,
      revenue: 0,
      rpr: 0,
      aov: 0
    },
    {
      id: "",
      sent_at: "0000-00-00T00:00:00Z",
      name: "",
      recipients: 0,
      open_rate: 0,
      click_rate: 0,
      placed_orders: 0,
      revenue: 0,
      rpr: 0,
      aov: 0
    },
    {
      id: "",
      sent_at: "0000-00-00T00:00:00Z",
      name: "",
      recipients: 0,
      open_rate: 0,
      click_rate: 0,
      placed_orders: 0,
      revenue: 0,
      rpr: 0,
      aov: 0
    },
    {
      id: "",
      sent_at: "0000-00-00T00:00:00Z",
      name: "",
      recipients: 0,
      open_rate: 0,
      click_rate: 0,
      placed_orders: 0,
      revenue: 0,
      rpr: 0,
      aov: 0
    }
  ]
};

// Sample sparkline data for KPI cards
export const generateSparklineData = (points: number = 12): number[] => {
  return Array.from({ length: points }, () => 0);
};
