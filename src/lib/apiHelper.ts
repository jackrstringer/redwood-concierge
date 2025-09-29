// lib/apiHelper.ts
import axios from "axios";
import { Campaign, Flow } from "@/types/campaign";

interface KPIResponse {
  // Current metrics
  total_revenue: number;
  email_revenue: number;
  campaign_revenue: number;
  flow_revenue: number;
  revenue_per_recipient: number;
  average_order_value: number;
  campaign_place_order_rate: number;
  flow_place_order_rate: number;
  campaigns_sent: number;
  open_rate: number;
  click_rate: number;
  unsubscribe_rate: number;
  spam_rate: number;
  bounce_rate: number;
  total_emails_sent: number;
  campaign_sends: number;
  total_active_profiles: number;
  net_subscriber_growth: number;
  new_email_subscribers: number;
  new_sms_subscribers: number;
  email_unsubscribes: number;
  percentage_engaged: number;
  subscriptions_started: number;
  active_subscriptions: number;
  average_subcription_cycles: number;
  monthly_recurring_revenue: number;
  churn_rate: number;
  reactivation_rate: number;
  dunning_success_rate: number;
  skip_rate: number;
  // Previous metrics for delta calculations
  previous_total_revenue?: number | null;
  previous_email_revenue?: number | null;
  previous_campaign_revenue?: number | null;
  previous_flow_revenue?: number | null;
  previous_revenue_per_recipient?: number | null;
  previous_average_order_value?: number | null;
  previous_campaign_place_order_rate?: number | null;
  previous_flow_place_order_rate?: number | null;
  previous_campaigns_sent?: number | null;
  previous_open_rate?: number | null;
  previous_click_rate?: number | null;
  previous_unsubscribe_rate?: number | null;
  previous_spam_rate?: number | null;
  previous_bounce_rate?: number | null;
}


interface JobTimingResponse {
  last_job_created_at: string | null;
  timeframe: string;
  job_type: string;
}

export const fetchCampaigns = async (timeframe: string = 'last_30_days'): Promise<Campaign[]> => {
  try {
    console.log(`Fetching campaigns for date range: ${timeframe}`);
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns`, {
      params: { timeframe }
    });
    
    const campaigns = response.data || [];
    console.log(`Found ${campaigns.length} campaigns`);
    
    return campaigns;
  } catch (err: any) {
    console.error("Failed to fetch campaigns:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return [];
  }
};

export const fetchDashboardKPI = async (timeframe: string = 'last_7_days'): Promise<KPIResponse | null> => {
  try {
    console.log(`Fetching dashboard KPI for timeframe: ${timeframe}`);
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard-kpi`, {
      params: { timeframe }
    });
    
    console.log('Dashboard KPI fetched:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch dashboard KPI:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return null;
  }
};

export const fetchFlows = async (timeframe: string = 'last_30_days'): Promise<Flow[]> => {
  try {
    console.log(`Fetching flows for date range: ${timeframe}`);
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flows`, {
      params: { timeframe }
    });
    
    const flows = response.data || [];
    console.log(`Found ${flows.length} flows`);
    
    return flows;
  } catch (err: any) {
    console.error("Failed to fetch flows:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return [];
  }
};



export const fetchJobTiming = async (timeframe: string, jobType: string = 'campaign_report_values'): Promise<JobTimingResponse | null> => {
  try {
    console.log(`Fetching job timing for timeframe: ${timeframe}, jobType: ${jobType}`);
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/last-execution`, {
      params: { timeframe, job_type: jobType }
    });
    
    console.log('Job timing fetched:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch job timing:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return null;
  }
};
