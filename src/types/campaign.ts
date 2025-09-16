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
  previous_revenue?: number; // Add this optional property

}