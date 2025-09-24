from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, cast, String, text
from sqlalchemy.dialects.postgresql import TIMESTAMP
from datetime import datetime, timedelta
from typing import List, Optional
from core.database import get_db
from models.flow_models import Flow, FlowValuesReport 
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class FlowResponse(BaseModel):
    id: str
    updated_at: str
    name: str
    recipients: Optional[int] = 0
    open_rate: Optional[float] = 0.0
    click_rate: Optional[float] = 0.0
    revenue: Optional[float] = 0.0
    rpr: Optional[float] = 0.0  
    aov: Optional[float] = 0.0 
    status: Optional[str] = None
    trigger_type: Optional[str] = None
    previous_revenue: Optional[float] = None
    clicks: Optional[int] = 0
    bounced: Optional[int] = 0
    bounce_rate: Optional[float] = 0.0
    delivered: Optional[int] = 0
    delivery_rate: Optional[float] = 0.0
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
    unsubscribe_uniques: Optional[int] = 0
    unsubscribes: Optional[int] = 0


@router.get("/flows", response_model=List[FlowResponse])
async def get_flows(
    timeframe: str = Query("last_30_days"),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Fetching flows for timeframe: {timeframe}")
        
        # Determine previous timeframe
        prev_timeframe = None
        if timeframe == 'last_7_days':
            prev_timeframe = 'previous_7_days'
        elif timeframe == 'last_30_days':
            prev_timeframe = 'previous_30_days'
        
        # Using view query for current data
        query = text("""
            SELECT 
                id,
                updated_at,
                name,
                status,
                channel as trigger_type,
                recipients,
                open_rate,
                click_rate,
                (delivered * revenue_per_recipient) AS revenue,
                revenue_per_recipient,
                average_order_value,
                clicks,
                bounced,
                bounce_rate,
                delivered,
                delivery_rate
            FROM 
                vw_report_data
            WHERE 
                type = 'flow'
                AND timeframe = :timeframe
        """)
        
        # Execute the query for current data
        results = db.execute(query, {"timeframe": timeframe}).fetchall()
        
        # Get previous data for comparison if needed
        previous_data = {}
        if prev_timeframe:
            prev_query = text("""
                SELECT 
                    id,
                    (delivered * revenue_per_recipient) AS revenue
                FROM 
                    vw_report_data
                WHERE 
                    type = 'flow'
                    AND timeframe = :prev_timeframe
            """)
            
            prev_results = db.execute(prev_query, {"prev_timeframe": prev_timeframe}).fetchall()
            previous_data = {row.id: row.revenue for row in prev_results}
        
        flows = []
        for row in results:
            flow_data = {
                "id": row.id,
                "updated_at": row.updated_at,
                "name": row.name,
                "recipients": row.recipients if row.recipients is not None else 0,
                "open_rate": float(row.open_rate) if row.open_rate is not None else 0.0,
                "click_rate": float(row.click_rate) if row.click_rate is not None else 0.0,
                "revenue": float(row.revenue) if row.revenue is not None else 0.0,
                "rpr": float(row.revenue_per_recipient) if row.revenue_per_recipient is not None else 0.0,
                "aov": float(row.average_order_value) if row.average_order_value is not None else 0.0,
                "status": row.status if row.status is not None else None,
                "trigger_type": row.trigger_type if row.trigger_type is not None else None,
                # New fields
                "clicks": int(row.clicks) if row.clicks is not None else 0,
                "bounced": int(row.bounced) if row.bounced is not None else 0,
                "bounce_rate": float(row.bounce_rate) if row.bounce_rate is not None else 0.0,
                "delivered": int(row.delivered) if row.delivered is not None else 0,
                "delivery_rate": float(row.delivery_rate) if row.delivery_rate is not None else 0.0
            }
            
            # Add previous revenue if available
            if prev_timeframe and row.id in previous_data:
                flow_data["previous_revenue"] = float(previous_data[row.id]) if previous_data[row.id] is not None else 0.0
                
            flows.append(FlowResponse(**flow_data))
        
        logger.info(f"Successfully fetched {len(flows)} flows")
        return flows
        
    except Exception as e:
        logger.error(f"Error fetching flows: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching flows: {str(e)}"
        )

