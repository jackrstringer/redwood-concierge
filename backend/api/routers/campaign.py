from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, cast, String, text
from sqlalchemy.dialects.postgresql import TIMESTAMP
from datetime import datetime, timedelta
from typing import List, Optional
from core.database import get_db
from models.campaign_models import Campaign, CampaignValuesReport 
from pydantic import BaseModel
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# In your FastAPI backend
class CampaignResponse(BaseModel):
    id: str
    updated_at: datetime
    name: str
    recipients: Optional[int] = 0
    open_rate: Optional[float] = 0.0
    click_rate: Optional[float] = 0.0
    revenue: Optional[float] = 0.0
    rpr: Optional[float] = 0.0  
    aov: Optional[float] = 0.0 
    placed_orders: Optional[int] = 0
    channel: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    previous_revenue: Optional[float] = None
    # Add all previous metrics fields
    previous_recipients: Optional[int] = None
    previous_open_rate: Optional[float] = None
    previous_click_rate: Optional[float] = None
    previous_placed_orders: Optional[float] = None
    previous_rpr: Optional[float] = None
    previous_aov: Optional[float] = None
    previous_bounce_rate: Optional[float] = None
    previous_delivered: Optional[int] = None
    previous_delivery_rate: Optional[float] = None
    previous_bounced: Optional[int] = None
    previous_opens: Optional[int] = None
    previous_clicks: Optional[int] = None
    # Current metrics
    bounce_rate: Optional[float] = 0.0
    delivered: Optional[int] = 0
    delivery_rate: Optional[float] = 0.0
    bounced: Optional[int] = 0
    opens: Optional[int] = 0
    clicks: Optional[int] = 0
    # Additional new statistics fields
    bounced_or_failed: Optional[int] = 0
    bounced_or_failed_rate: Optional[float] = 0.0
    click_to_open_rate: Optional[float] = 0.0
    clicks_unique: Optional[int] = 0
    conversion_rate: Optional[float] = 0.0
    conversion_uniques: Optional[int] = 0
    conversion_value: Optional[float] = 0.0
    conversions: Optional[int] = 0
    failed: Optional[int] = 0
    failed_rate: Optional[float] = 0.0
    opens_unique: Optional[int] = 0
    spam_complaint_rate: Optional[float] = 0.0
    spam_complaints: Optional[int] = 0
    unsubscribe_rate: Optional[float] = 0.0
    unsubscribe_uniques: Optional[int] = 0
    unsubscribes: Optional[int] = 0


@router.get("/campaigns", response_model=List[CampaignResponse])
async def get_campaigns(
    timeframe: str = Query("timeframe"),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Fetching campaigns for timeframe: {timeframe}")
        
        # Determine previous timeframe
        prev_timeframe = None
        if timeframe == 'last_7_days':
            prev_timeframe = 'previous_7_days'
        elif timeframe == 'last_30_days':
            prev_timeframe = 'previous_30_days'
        
        # Using view query for current data - only get data from the latest job_id globally
        query = text("""
            SELECT 
                vrd.id,
                vrd.updated_at,
                vrd.name,
                vrd.channel,
                vrd.type,
                vrd.status,
                vrd.recipients,
                vrd.open_rate,
                vrd.click_rate,
                (vrd.delivered * vrd.revenue_per_recipient) AS revenue,
                vrd.revenue_per_recipient,
                vrd.average_order_value,
                vrd.placed_orders,
                vrd.bounce_rate,
                vrd.delivered,
                vrd.delivery_rate,
                vrd.bounced,
                vrd.opens,
                vrd.clicks
            FROM 
                vw_report_data vrd
            WHERE 
                vrd.type = 'campaign'
                AND vrd.timeframe = :timeframe
                AND vrd.job_id = (
                    SELECT MAX(job_id)
                    FROM vw_report_data v
                    WHERE v.timeframe = :timeframe
                      AND v.type = 'campaign'
                )
        """)
        
        # Execute the query for current data
        results = db.execute(query, {"timeframe": timeframe}).fetchall()
        
        # Get previous data for comparison if needed
        previous_data = {}
        if prev_timeframe:
            prev_query = text("""
                SELECT 
                    vrd.id,
                    vrd.recipients,
                    vrd.open_rate,
                    vrd.click_rate,
                    vrd.placed_orders,
                    vrd.revenue_per_recipient,
                    vrd.average_order_value,
                    vrd.bounce_rate,
                    vrd.delivered,
                    vrd.delivery_rate,
                    vrd.bounced,
                    vrd.opens,
                    vrd.clicks,
                    (vrd.delivered * vrd.revenue_per_recipient) AS revenue
                FROM 
                    vw_report_data vrd
                WHERE 
                    vrd.type = 'campaign'
                    AND vrd.timeframe = :prev_timeframe
                    AND vrd.job_id = (
                        SELECT MAX(job_id)
                        FROM vw_report_data v
                        WHERE v.timeframe = :prev_timeframe
                          AND v.type = 'campaign'
                    )
            """)
            
            prev_results = db.execute(prev_query, {"prev_timeframe": prev_timeframe}).fetchall()
            # Create a nested dictionary for all previous metrics
            previous_data = {}
            for row in prev_results:
                previous_data[row.id] = {
                    'revenue': float(row.revenue) if row.revenue is not None else 0.0,
                    'recipients': int(row.recipients) if row.recipients is not None else 0,
                    'open_rate': float(row.open_rate) if row.open_rate is not None else 0.0,
                    'click_rate': float(row.click_rate) if row.click_rate is not None else 0.0,
                    'placed_orders': float(row.placed_orders) if row.placed_orders is not None else 0.0,
                    'rpr': float(row.revenue_per_recipient) if row.revenue_per_recipient is not None else 0.0,
                    'aov': float(row.average_order_value) if row.average_order_value is not None else 0.0,
                    'bounce_rate': float(row.bounce_rate) if row.bounce_rate is not None else 0.0,
                    'delivered': int(row.delivered) if row.delivered is not None else 0,
                    'delivery_rate': float(row.delivery_rate) if row.delivery_rate is not None else 0.0,
                    'bounced': int(row.bounced) if row.bounced is not None else 0,
                    'opens': int(row.opens) if row.opens is not None else 0,
                    'clicks': int(row.clicks) if row.clicks is not None else 0
                }
        
        campaigns = []
        for row in results:
            campaign_data = {
                "id": row.id,
                "updated_at": row.updated_at,
                "name": row.name,
                "recipients": row.recipients if row.recipients is not None else 0,
                "open_rate": float(row.open_rate) if row.open_rate is not None else 0.0,
                "click_rate": float(row.click_rate) if row.click_rate is not None else 0.0,
                "revenue": float(row.revenue) if row.revenue is not None else 0.0,
                "rpr": float(row.revenue_per_recipient) if row.revenue_per_recipient is not None else 0.0,
                "aov": float(row.average_order_value) if row.average_order_value is not None else 0.0,
                "placed_orders": float(row.placed_orders) if row.placed_orders is not None else 0.0,
                "channel": row.channel if row.channel is not None else None,
                "type": row.type if row.type is not None else None,
                "status": row.status if row.status is not None else None,
                "bounce_rate": float(row.bounce_rate) if row.bounce_rate is not None else 0.0,
                "delivered": int(row.delivered) if row.delivered is not None else 0,
                "delivery_rate": float(row.delivery_rate) if row.delivery_rate is not None else 0.0,
                "bounced": int(row.bounced) if row.bounced is not None else 0,
                "opens": int(row.opens) if row.opens is not None else 0,
                "clicks": int(row.clicks) if row.clicks is not None else 0
            }
            
            # Add all previous metrics if available
            if prev_timeframe and row.id in previous_data:
                prev_metrics = previous_data[row.id]
                campaign_data["previous_revenue"] = prev_metrics["revenue"]
                campaign_data["previous_recipients"] = prev_metrics["recipients"]
                campaign_data["previous_open_rate"] = prev_metrics["open_rate"]
                campaign_data["previous_click_rate"] = prev_metrics["click_rate"]
                campaign_data["previous_placed_orders"] = prev_metrics["placed_orders"]
                campaign_data["previous_rpr"] = prev_metrics["rpr"]
                campaign_data["previous_aov"] = prev_metrics["aov"]
                campaign_data["previous_bounce_rate"] = prev_metrics["bounce_rate"]
                campaign_data["previous_delivered"] = prev_metrics["delivered"]
                campaign_data["previous_delivery_rate"] = prev_metrics["delivery_rate"]
                campaign_data["previous_bounced"] = prev_metrics["bounced"]
                campaign_data["previous_opens"] = prev_metrics["opens"]
                campaign_data["previous_clicks"] = prev_metrics["clicks"]
                
            campaigns.append(CampaignResponse(**campaign_data))
        
        logger.info(f"Successfully fetched {len(campaigns)} campaigns")
        return campaigns
        
    except Exception as e:
        logger.error(f"Error fetching campaigns: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching campaigns: {str(e)}"
        )




