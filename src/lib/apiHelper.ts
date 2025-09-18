
// import axios from "axios";
// import { Campaign } from "@/types/campaign";

// const getDateRange = (range: string): { start: string; end: string } => {
//   const now = new Date();
//   const end = now.toISOString();
//   let start: Date;

//   switch (range) {
//     case 'today':
//       start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       break;
//     case 'wtd': 
//       const dayOfWeek = now.getDay();
//       start = new Date(now);
//       start.setDate(now.getDate() - dayOfWeek);
//       start.setHours(0, 0, 0, 0);
//       break;
//     case 'mtd': 
//       start = new Date(now.getFullYear(), now.getMonth(), 1);
//       break;
//     case 'last_7_days':
//       start = new Date(now);
//       start.setDate(now.getDate() - 7);
//       break;
//     case 'last_30_days':
//     default:
//       start = new Date(now);
//       start.setDate(now.getDate() - 30);
//       break;
//   }

//   return {
//     start: start.toISOString(),
//     end
//   };
// };


// // const fetchCampaignValuesReport = async (campaignId: string, apiKey: string, dateRange: string = 'last_30_days') => {
// //   try {
// //     console.log(`📊 Fetching campaign values report for: ${campaignId} (${dateRange})`);
    
// //     const timeframeMap: Record<string, string> = {
// //       'today': 'today',
// //       'wtd': 'this_week',
// //       'mtd': 'this_month',
// //       'last_7_days': 'last_7_days',
// //       'last_30_days': 'last_30_days',
// //     };
    
// //     const payload = {
// //       data: {
// //         type: "campaign-values-report",
// //         attributes: {
// //           statistics: [
// //             "recipients",
// //             "open_rate",
// //             "click_rate",
// //             "revenue_per_recipient",
// //             "average_order_value"
// //           ],
// //           timeframe: {
// //             key: timeframeMap[dateRange] || 'last_30_days'
// //           },
// //           conversion_metric_id:'YsNXnq',
// //           filter: `equals(campaign_id,'${campaignId}')`
// //         }
// //       }
// //     };
    
// //     const res = await axios.post('/klaviyo/api/campaign-values-reports', payload, {
// //       headers: {
// //         'Authorization': `Klaviyo-API-Key ${apiKey}`,
// //         'Accept': 'application/vnd.api+json',
// //         'Content-Type': 'application/vnd.api+json',
// //         'revision': '2025-07-15',
// //       },
// //     });
    
// //     console.log(`✅ Campaign values report success for ${campaignId}:`, res.data);
// //     return res.data?.data?.attributes || res.data?.data || null;
// //   } catch (err: any) {
// //     console.error(`❌ Failed to fetch campaign values report for ${campaignId}:`, {
// //       status: err.response?.status,
// //       statusText: err.response?.statusText,
// //       data: err.response?.data,
// //       message: err.message
// //     });
// //     return null;
// //   }
// // };

// // const fetchCampaignStatistics = async (campaignId: string, apiKey: string) => {
// //   try {
// //     const res = await axios.get(
// //       `/klaviyo/api/campaigns/${campaignId}/campaign-messages/`,
// //       {
// //         headers: {
// //           Authorization: `Klaviyo-API-Key ${apiKey}`,
// //           Accept: "application/json",
// //           revision: "2025-07-15",
// //         },
// //       }
// //     );

// //     const message = res.data?.data?.[0];
// //     if (!message) return null;

// //     const statsRes = await axios.get(
// //       `/klaviyo/api/campaign-messages/${message.id}/campaign-message-statistics/`,
// //       {
// //         headers: {
// //           Authorization: `Klaviyo-API-Key ${apiKey}`,
// //           Accept: "application/json",
// //           revision: "2025-07-15",
// //         },
// //       }
// //     );

// //     return statsRes.data?.data?.[0]?.attributes || null;
// //   } catch (err) {
// //     console.warn(`Failed to fetch statistics for campaign ${campaignId}:`, err);
// //     return null;
// //   }
// // };

// export const fetchCampaigns = async (dateRange: string = 'last_30_days'): Promise<Campaign[]> => {
//   try {
//     const apiKey = import.meta.env.VITE_KLAVIYO_PRIVATE_API_KEY;
//     if (!apiKey) {
//       throw new Error("VITE_KLAVIYO_PRIVATE_API_KEY is not defined in environment");
//     }

//     const { start, end } = getDateRange(dateRange);
//     console.log(`Fetching campaigns for date range: ${dateRange} (${start} to ${end})`);
    
//     const filters = [
//       `equals(messages.channel,'email')`,
//       `greater-than(updated_at,${start})`,
//       `less-than(updated_at,${end})`
//     ].join(',');

//     const campaignRes = await axios.get(
//       `/klaviyo/api/campaigns?filter=${encodeURIComponent(filters)}`,
//       {
//         headers: {
//           Authorization: `Klaviyo-API-Key ${apiKey}`,
//           Accept: "application/json",
//           revision: "2025-07-15", 
//         },
//       }
//     );

//     const campaigns = campaignRes.data?.data || [];
//     console.log(`Found ${campaigns.length} campaigns, fetching statistics...`);
    
//     if (campaigns.length > 0) {
//       console.log('Sample campaign data:', JSON.stringify(campaigns[0], null, 2));
//       console.log('Full response structure:', JSON.stringify(campaignRes.data, null, 2));
//     }

//     const campaignsWithStats = await Promise.all(
//       campaigns.map(async (campaign: any) => { 
//         console.log(`\n=== Processing Campaign: ${campaign.attributes?.name} (${campaign.id}) ===`);
        
//         const statsData = null;
       
//         return {
//           id: campaign.id || "",
//           updated_at: campaign.attributes?.updated_at || "",
//           name: campaign.attributes?.name || "",
//           recipients: statsData?.recipients || 
//                      statsData?.sends || 
//                      statsData?.delivered || 
//                      campaign.attributes?.recipients || 0,
//           open_rate: statsData?.open_rate || 
//                     statsData?.opens_rate || 
//                     (statsData?.opens && statsData?.delivered ? statsData.opens / statsData.delivered : 0) || 0,
//           click_rate: statsData?.click_rate || 
//                      statsData?.clicks_rate || 
//                      (statsData?.clicks && statsData?.delivered ? statsData.clicks / statsData.delivered : 0) || 0,
//           placed_orders: statsData?.placed_orders || 
//                         statsData?.orders || 
//                         statsData?.conversions || 0,
//           revenue: statsData?.revenue || 
//                   statsData?.total_revenue || 
//                   statsData?.attributed_revenue || 0,
//           rpr: statsData?.revenue_per_recipient || 
//               (statsData?.revenue && statsData?.recipients ? statsData.revenue / statsData.recipients : 0) || 0,
//           aov: statsData?.average_order_value || 
//               (statsData?.revenue && statsData?.placed_orders ? statsData.revenue / statsData.placed_orders : 0) || 0,
//         };
//       })
//     );

//     return campaignsWithStats;
//   } catch (err: any) {
//     console.error("💥 Failed to fetch campaigns:", {
//       message: err.message,
//       status: err.response?.status,
//       data: err.response?.data,
//     });
//     return [];
//   }
// };


// lib/apiHelper.ts
import axios from "axios";
import { Campaign } from "@/types/campaign";

interface AggregateMetrics {
  total_revenue: number;
  total_recipients: number;
  total_placed_orders: number;
  aggregate_rpr: number;
  aggregate_aov: number;
  previous_total_revenue?: number;
  previous_total_recipients?: number;
  previous_total_placed_orders?: number;
  previous_aggregate_rpr?: number;
  previous_aggregate_aov?: number;
}

interface Flow {
  id: string;
  updated_at: string;
  name: string;
  recipients: number;
  open_rate: number;
  click_rate: number;
  revenue: number;
  rpr: number;
  aov: number;
  status: string;
  trigger_type: string;
  previous_revenue?: number;
}

interface FlowAggregateMetrics {
  total_revenue: number;
  total_recipients: number;
  aggregate_rpr: number;
  aggregate_aov: number;
  previous_total_revenue?: number;
  previous_total_recipients?: number;
  previous_aggregate_rpr?: number;
  previous_aggregate_aov?: number;
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

export const fetchAggregateMetrics = async (timeframe: string = 'last_30_days'): Promise<AggregateMetrics | null> => {
  try {
    console.log(`Fetching aggregate metrics for timeframe: ${timeframe}`);
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns/aggregate-metrics`, {
      params: { timeframe }
    });
    
    console.log('Aggregate metrics fetched:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch aggregate metrics:", {
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

export const fetchFlowAggregateMetrics = async (timeframe: string = 'last_30_days'): Promise<FlowAggregateMetrics | null> => {
  try {
    console.log(`Fetching flow aggregate metrics for timeframe: ${timeframe}`);
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flows/aggregate-metrics`, {
      params: { timeframe }
    });
    
    console.log('Flow aggregate metrics fetched:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch flow aggregate metrics:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return null;
  }
};
