
import axios from "axios";
import { Campaign } from "@/types/campaign";

// Helper function to convert date range to actual dates
const getDateRange = (range: string): { start: string; end: string } => {
  const now = new Date();
  const end = now.toISOString();
  let start: Date;

  switch (range) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'wtd': // Week to date
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      break;
    case 'mtd': // Month to date
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'last_7_days':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      break;
    case 'last_30_days':
    default:
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      break;
  }

  return {
    start: start.toISOString(),
    end
  };
};

// We're now using campaign-values-reports directly, so the message functions are not needed

// Fetch campaign values reports using POST with correct payload structure
const fetchCampaignValuesReport = async (campaignId: string, apiKey: string, dateRange: string = 'last_30_days') => {
  try {
    console.log(`📊 Fetching campaign values report for: ${campaignId} (${dateRange})`);
    
    // Convert date range to timeframe key
    const timeframeMap: Record<string, string> = {
      'today': 'today',
      'wtd': 'this_week',
      'mtd': 'this_month',
      'last_7_days': 'last_7_days',
      'last_30_days': 'last_30_days',
    };
    
    const payload = {
      data: {
        type: "campaign-values-report",
        attributes: {
          statistics: [
            "recipients",
            "open_rate",
            "click_rate",
            "revenue_per_recipient",
            "average_order_value"
          ],
          timeframe: {
            key: timeframeMap[dateRange] || 'last_30_days'
          },
          conversion_metric_id:'YsNXnq',
          filter: `equals(campaign_id,'${campaignId}')`
        }
      }
    };
    
    const res = await axios.post('/klaviyo/api/campaign-values-reports', payload, {
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'revision': '2025-07-15',
      },
    });
    
    console.log(`✅ Campaign values report success for ${campaignId}:`, res.data);
    return res.data?.data?.attributes || res.data?.data || null;
  } catch (err: any) {
    console.error(`❌ Failed to fetch campaign values report for ${campaignId}:`, {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message
    });
    return null;
  }
};

// Helper function to fetch campaign statistics
const fetchCampaignStatistics = async (campaignId: string, apiKey: string) => {
  try {
    const res = await axios.get(
      `/klaviyo/api/campaigns/${campaignId}/campaign-messages/`,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          Accept: "application/json",
          revision: "2025-07-15",
        },
      }
    );

    // Get the first message (usually the email message)
    const message = res.data?.data?.[0];
    if (!message) return null;

    // Fetch statistics for this message
    const statsRes = await axios.get(
      `/klaviyo/api/campaign-messages/${message.id}/campaign-message-statistics/`,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          Accept: "application/json",
          revision: "2025-07-15",
        },
      }
    );

    return statsRes.data?.data?.[0]?.attributes || null;
  } catch (err) {
    console.warn(`Failed to fetch statistics for campaign ${campaignId}:`, err);
    return null;
  }
};

export const fetchCampaigns = async (dateRange: string = 'last_30_days'): Promise<Campaign[]> => {
  try {
    const apiKey = import.meta.env.VITE_KLAVIYO_PRIVATE_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_KLAVIYO_PRIVATE_API_KEY is not defined in environment");
    }

    const { start, end } = getDateRange(dateRange);
    console.log(`Fetching campaigns for date range: ${dateRange} (${start} to ${end})`);
    
    // Build filter for email campaigns within the date range
    const filters = [
      `equals(messages.channel,'email')`,
      `greater-than(updated_at,${start})`,
      `less-than(updated_at,${end})`
    ].join(',');

    // First, fetch campaigns
    const campaignRes = await axios.get(
      `/klaviyo/api/campaigns?filter=${encodeURIComponent(filters)}`,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          Accept: "application/json",
          revision: "2025-07-15", 
        },
      }
    );

    const campaigns = campaignRes.data?.data || [];
    console.log(`Found ${campaigns.length} campaigns, fetching statistics...`);
    
    // Debug: Let's see what data is actually available
    if (campaigns.length > 0) {
      console.log('Sample campaign data:', JSON.stringify(campaigns[0], null, 2));
      console.log('Full response structure:', JSON.stringify(campaignRes.data, null, 2));
    }

    // Focus on campaign messages since that's working
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign: any) => { // Limit to 3 campaigns for debugging
        console.log(`\n=== Processing Campaign: ${campaign.attributes?.name} (${campaign.id}) ===`);
        
        // Fetch campaign values report (this should have all the metrics we need)
        const statsData = null;
       /*
        const statsData = await fetchCampaignValuesReport(campaign.id, apiKey, dateRange);
        
        if (statsData) {
          console.log('✅ Campaign values report data found:', Object.keys(statsData));
          console.log('Full campaign values report:', statsData);
        } else {
          console.log('❌ No campaign values report data found');
        }
        
        console.log('Available campaign attributes:', Object.keys(campaign.attributes || {}));
        */
        return {
          id: campaign.id || "",
          updated_at: campaign.attributes?.updated_at || "",
          name: campaign.attributes?.name || "",
          // Try to get recipients from statistics data first, then other sources
          recipients: statsData?.recipients || 
                     statsData?.sends || 
                     statsData?.delivered || 
                     campaign.attributes?.recipients || 0,
          // Look for metrics in statistics data
          open_rate: statsData?.open_rate || 
                    statsData?.opens_rate || 
                    (statsData?.opens && statsData?.delivered ? statsData.opens / statsData.delivered : 0) || 0,
          click_rate: statsData?.click_rate || 
                     statsData?.clicks_rate || 
                     (statsData?.clicks && statsData?.delivered ? statsData.clicks / statsData.delivered : 0) || 0,
          placed_orders: statsData?.placed_orders || 
                        statsData?.orders || 
                        statsData?.conversions || 0,
          revenue: statsData?.revenue || 
                  statsData?.total_revenue || 
                  statsData?.attributed_revenue || 0,
          rpr: statsData?.revenue_per_recipient || 
              (statsData?.revenue && statsData?.recipients ? statsData.revenue / statsData.recipients : 0) || 0,
          aov: statsData?.average_order_value || 
              (statsData?.revenue && statsData?.placed_orders ? statsData.revenue / statsData.placed_orders : 0) || 0,
        };
      })
    );

    return campaignsWithStats;
  } catch (err: any) {
    console.error("💥 Failed to fetch campaigns:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return [];
  }
};

