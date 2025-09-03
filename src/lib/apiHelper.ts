
import axios from "axios";
import { Campaign } from "@/types/campaign";

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const apiKey = import.meta.env.VITE_KLAVIYO_PRIVATE_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_KLAVIYO_PRIVATE_API_KEY is not defined in environment");
    }

    const res = await axios.get(
      `/klaviyo/api/campaigns?filter=equals(messages.channel,'email')`,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          Accept: "application/json",
          revision: "2025-07-15", 
        },
      }
    );

    const mapped =
      res.data?.data?.map((c: any) => ({
        id: c.id || "",
        updated_at: c.attributes?.updated_at || "",
        name: c.attributes?.name || "",
        recipients: c.attributes?.recipients || 0,
        open_rate: c.attributes?.metrics?.open_rate || 0,
        click_rate: c.attributes?.metrics?.click_rate || 0,
        placed_orders: c.attributes?.metrics?.placed_orders || 0,
        revenue: c.attributes?.metrics?.revenue || 0,
        rpr: c.attributes?.metrics?.rpr || 0,
        aov: c.attributes?.metrics?.aov || 0,
      })) ?? [];

    return mapped;
  } catch (err: any) {
    console.error("💥 Failed to fetch campaigns:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return [];
  }
};

