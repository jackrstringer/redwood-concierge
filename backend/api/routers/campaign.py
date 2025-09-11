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
    updated_at: str
    name: str
    recipients: Optional[int] = 0
    open_rate: Optional[float] = 0.0
    click_rate: Optional[float] = 0.0
    revenue: Optional[float] = 0.0
    rpr: Optional[float] = 0.0  
    aov: Optional[float] = 0.0 
    placed_orders: Optional[int] = 0
    channel: Optional[str] = None
    previous_revenue: Optional[float] = None  

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
        
        # Using raw SQL to get both current and previous data
        if prev_timeframe:
            query = text("""
                SELECT 
                    c.id,
                    c.updated_at,
                    c.name,
                    c.channel,
                    crv.recipients,
                    crv.open_rate,
                    crv.click_rate,
                    (crv.recipients * crv.revenue_per_recipient) AS revenue,
                    crv.revenue_per_recipient,
                    crv.average_order_value,
                    crv.placed_orders,
                    prev_crv.recipients * prev_crv.revenue_per_recipient AS previous_revenue
                FROM 
                    campaigns c
                JOIN 
                    campaign_report_values crv ON c.id = crv.campaign_id
                LEFT JOIN 
                    campaign_report_values prev_crv ON c.id = prev_crv.campaign_id 
                    AND prev_crv.timeframe = :prev_timeframe
                WHERE 
                    crv.timeframe = :timeframe
            """)
            
            # Execute the query with parameters
            results = db.execute(query, {"timeframe": timeframe, "prev_timeframe": prev_timeframe}).fetchall()
        else:
            query = text("""
                SELECT 
                    c.id,
                    c.updated_at,
                    c.name,
                    c.channel,
                    crv.recipients,
                    crv.open_rate,
                    crv.click_rate,
                    (crv.recipients * crv.revenue_per_recipient) AS revenue,
                    crv.revenue_per_recipient,
                    crv.average_order_value,
                    crv.placed_orders
                FROM 
                    campaigns c
                JOIN 
                    campaign_report_values crv ON c.id = crv.campaign_id
                WHERE 
                    crv.timeframe = :timeframe
            """)
            
            # Execute the query with parameters
            results = db.execute(query, {"timeframe": timeframe}).fetchall()
        
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
                "channel": row.channel if row.channel is not None else None
            }
            
            # Add previous revenue if available
            if prev_timeframe and hasattr(row, 'previous_revenue'):
                campaign_data["previous_revenue"] = float(row.previous_revenue) if row.previous_revenue is not None else 0.0
                
            campaigns.append(CampaignResponse(**campaign_data))
        
        logger.info(f"Successfully fetched {len(campaigns)} campaigns")
        return campaigns
        
    except Exception as e:
        logger.error(f"Error fetching campaigns: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching campaigns: {str(e)}"
        )