export interface Campaign {
  id: string;
  updated_at: string;
  name: string;
  recipients: number;
  open_rate: number;
  click_rate: number;
  placed_orders: number;
  revenue: number;
  rpr: number;
  aov: number;
  status?: string; 
  createdAt?: string; 
  channel?: string;
  type?: string;
  // Previous metrics for delta calculations
  previous_revenue?: number;
  previous_recipients?: number;
  previous_open_rate?: number;
  previous_click_rate?: number;
  previous_placed_orders?: number;
  previous_rpr?: number;
  previous_aov?: number;
  previous_bounce_rate?: number;
  previous_delivered?: number;
  previous_delivery_rate?: number;
  previous_bounced?: number;
  previous_opens?: number;
  previous_clicks?: number;
  // Additional current metrics
  bounce_rate?: number;
  delivered?: number;
  delivery_rate?: number;
  bounced?: number;
  opens?: number;
  clicks?: number;
}

// Flow interface
export interface Flow {
  id: string;
  updated_at: string;
  name: string;
  recipients: number;
  open_rate: number;
  click_rate: number;
  revenue: number;
  rpr: number;
  aov: number;
  status?: string;
  trigger_type?: string;
  clicks: number;
  bounced: number;
  bounce_rate: number;
  delivered: number;
  delivery_rate: number;
  // Previous metrics for delta calculations
  previous_revenue?: number;
  previous_recipients?: number;
  previous_open_rate?: number;
  previous_click_rate?: number;
  previous_rpr?: number;
  previous_aov?: number;
  previous_clicks?: number;
  previous_bounced?: number;
  previous_bounce_rate?: number;
  previous_delivered?: number;
  previous_delivery_rate?: number;
}
