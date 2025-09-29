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
    # Add all previous metrics fields
    previous_recipients: Optional[int] = None
    previous_open_rate: Optional[float] = None
    previous_click_rate: Optional[float] = None
    previous_rpr: Optional[float] = None
    previous_aov: Optional[float] = None
    previous_clicks: Optional[int] = None
    previous_bounced: Optional[int] = None
    previous_bounce_rate: Optional[float] = None
    previous_delivered: Optional[int] = None
    previous_delivery_rate: Optional[float] = None
    # Current metrics
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
        
        # Using view query for current data - only get data from the latest job_id globally
        query = text("""
            SELECT 
                vrd.id,
                vrd.updated_at,
                vrd.name,
                vrd.status,
                vrd.channel as trigger_type,
                vrd.recipients,
                vrd.open_rate,
                vrd.click_rate,
                (vrd.delivered * vrd.revenue_per_recipient) AS revenue,
                vrd.revenue_per_recipient,
                vrd.average_order_value,
                vrd.clicks,
                vrd.bounced,
                vrd.bounce_rate,
                vrd.delivered,
                vrd.delivery_rate
            FROM 
                vw_report_data vrd
            WHERE 
                vrd.type = 'flow'
                AND vrd.timeframe = :timeframe
                AND vrd.job_id = (
                    SELECT MAX(job_id)
                    FROM vw_report_data v
                    WHERE v.timeframe = :timeframe
                      AND v.type = 'flow'
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
                    vrd.revenue_per_recipient,
                    vrd.average_order_value,
                    vrd.clicks,
                    vrd.bounced,
                    vrd.bounce_rate,
                    vrd.delivered,
                    vrd.delivery_rate,
                    (vrd.delivered * vrd.revenue_per_recipient) AS revenue
                FROM 
                    vw_report_data vrd
                WHERE 
                    vrd.type = 'flow'
                    AND vrd.timeframe = :prev_timeframe
                    AND vrd.job_id = (
                        SELECT MAX(job_id)
                        FROM vw_report_data v
                        WHERE v.timeframe = :prev_timeframe
                          AND v.type = 'flow'
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
                    'rpr': float(row.revenue_per_recipient) if row.revenue_per_recipient is not None else 0.0,
                    'aov': float(row.average_order_value) if row.average_order_value is not None else 0.0,
                    'clicks': int(row.clicks) if row.clicks is not None else 0,
                    'bounced': int(row.bounced) if row.bounced is not None else 0,
                    'bounce_rate': float(row.bounce_rate) if row.bounce_rate is not None else 0.0,
                    'delivered': int(row.delivered) if row.delivered is not None else 0,
                    'delivery_rate': float(row.delivery_rate) if row.delivery_rate is not None else 0.0
                }
        
        flows = []
        for row in results:
            flow_data = {
                "id": row.id,
                "updated_at": str(row.updated_at) if row.updated_at is not None else "",
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
            
            # Add all previous metrics if available
            if prev_timeframe and row.id in previous_data:
                prev_metrics = previous_data[row.id]
                flow_data["previous_revenue"] = prev_metrics["revenue"]
                flow_data["previous_recipients"] = prev_metrics["recipients"]
                flow_data["previous_open_rate"] = prev_metrics["open_rate"]
                flow_data["previous_click_rate"] = prev_metrics["click_rate"]
                flow_data["previous_rpr"] = prev_metrics["rpr"]
                flow_data["previous_aov"] = prev_metrics["aov"]
                flow_data["previous_clicks"] = prev_metrics["clicks"]
                flow_data["previous_bounced"] = prev_metrics["bounced"]
                flow_data["previous_bounce_rate"] = prev_metrics["bounce_rate"]
                flow_data["previous_delivered"] = prev_metrics["delivered"]
                flow_data["previous_delivery_rate"] = prev_metrics["delivery_rate"]
                
            flows.append(FlowResponse(**flow_data))
        
        logger.info(f"Successfully fetched {len(flows)} flows")
        return flows
        
    except Exception as e:
        logger.error(f"Error fetching flows: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching flows: {str(e)}"
        )

