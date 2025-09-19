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

# Set up logging
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
    # New fields
    clicks: Optional[int] = 0
    bounced: Optional[int] = 0
    bounce_rate: Optional[float] = 0.0
    delivered: Optional[int] = 0
    delivery_rate: Optional[float] = 0.0

class FlowAggregateMetricsResponse(BaseModel):
    total_revenue: Optional[float] = 0.0
    total_recipients: Optional[int] = 0
    aggregate_rpr: Optional[float] = 0.0  # Total Revenue / Total Recipients
    aggregate_aov: Optional[float] = 0.0  # Average Order Value
    previous_total_revenue: Optional[float] = None
    previous_total_recipients: Optional[int] = None
    previous_aggregate_rpr: Optional[float] = None
    previous_aggregate_aov: Optional[float] = None

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
        
        # Using raw SQL to get both current and previous data
        if prev_timeframe:
            query = text("""
                SELECT 
                    f.id,
                    f.updated,
                    f.name,
                    f.status,
                    f.trigger_type,
                    frv.recipients,
                    frv.open_rate,
                    frv.click_rate,
                    (frv.delivered * frv.revenue_per_recipient) AS revenue,
                    frv.revenue_per_recipient,
                    frv.average_order_value,
                    frv.clicks,
                    frv.bounced,
                    frv.bounce_rate,
                    frv.delivered,
                    frv.delivery_rate,
                    prev_frv.recipients * prev_frv.revenue_per_recipient AS previous_revenue
                FROM 
                    flows f
                JOIN 
                    flow_report_values frv ON f.id = frv.flow_id
                LEFT JOIN 
                    flow_report_values prev_frv ON f.id = prev_frv.flow_id
                    AND prev_frv.timeframe = :prev_timeframe
                WHERE 
                    frv.timeframe = :timeframe
            """)
            
            # Execute the query with parameters
            results = db.execute(query, {"timeframe": timeframe, "prev_timeframe": prev_timeframe}).fetchall()
        else:
            query = text("""
                SELECT 
                    f.id,
                    f.updated,
                    f.name,
                    f.status,
                    f.trigger_type,
                    frv.recipients,
                    frv.open_rate,
                    frv.click_rate,
                    (frv.delivered * frv.revenue_per_recipient) AS revenue,
                    frv.revenue_per_recipient,
                    frv.average_order_value,
                    frv.clicks,
                    frv.bounced,
                    frv.bounce_rate,
                    frv.delivered,
                    frv.delivery_rate
                FROM 
                    flows f
                JOIN 
                    flow_report_values frv ON f.id = frv.flow_id
                WHERE 
                    frv.timeframe = :timeframe
            """)
             
            # Execute the query with parameters
            results = db.execute(query, {"timeframe": timeframe}).fetchall()
        
        flows = []
        for row in results:
            flow_data = {
                "id": row.id,
                "updated_at": row.updated,
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
            if prev_timeframe and hasattr(row, 'previous_revenue'):
                flow_data["previous_revenue"] = float(row.previous_revenue) if row.previous_revenue is not None else 0.0
                
            flows.append(FlowResponse(**flow_data))
        
        logger.info(f"Successfully fetched {len(flows)} flows")
        return flows
        
    except Exception as e:
        logger.error(f"Error fetching flows: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching flows: {str(e)}"
        )

@router.get("/flows/aggregate-metrics", response_model=FlowAggregateMetricsResponse)
async def get_flow_aggregate_metrics(
    timeframe: str = Query("last_30_days"),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Fetching flow aggregate metrics for timeframe: {timeframe}")
        
        # Determine previous timeframe
        prev_timeframe = None
        if timeframe == 'last_7_days':
            prev_timeframe = 'previous_7_days'
        elif timeframe == 'last_30_days':
            prev_timeframe = 'previous_30_days'
        
        # Get current period aggregates
        current_query = text("""
            SELECT 
                SUM(frv.delivered * frv.revenue_per_recipient) AS total_revenue,
                SUM(frv.recipients) AS total_recipients,
                -- Simple average RPR for the timeframe
                AVG(frv.revenue_per_recipient) AS avg_revenue_per_recipient,
                -- Simple average AOV for the timeframe
                AVG(frv.average_order_value) AS avg_order_value
            FROM 
                flows f
            JOIN 
                flow_report_values frv ON f.id = frv.flow_id
            WHERE 
                frv.timeframe = :timeframe
                AND frv.recipients IS NOT NULL
                AND frv.revenue_per_recipient IS NOT NULL
        """)
        
        current_result = db.execute(current_query, {"timeframe": timeframe}).fetchone()
        
        # Calculate current period metrics
        total_revenue = float(current_result.total_revenue) if current_result.total_revenue is not None else 0.0
        total_recipients = int(current_result.total_recipients) if current_result.total_recipients is not None else 0
        
        # Use the averages calculated in the database query
        aggregate_rpr = float(current_result.avg_revenue_per_recipient) if current_result.avg_revenue_per_recipient is not None else 0.0
        aggregate_aov = float(current_result.avg_order_value) if current_result.avg_order_value is not None else 0.0
        
        response_data = {
            "total_revenue": total_revenue,
            "total_recipients": total_recipients,
            "aggregate_rpr": aggregate_rpr,
            "aggregate_aov": aggregate_aov
        }
        
        # Get previous period if comparison is needed
        if prev_timeframe:
            prev_query = text("""
                SELECT 
                    SUM(frv.delivered * frv.revenue_per_recipient) AS total_revenue,
                    SUM(frv.recipients) AS total_recipients,
                    -- Simple average RPR for the timeframe
                    AVG(frv.revenue_per_recipient) AS avg_revenue_per_recipient,
                    -- Simple average AOV for the timeframe
                    AVG(frv.average_order_value) AS avg_order_value
                FROM 
                    flows f
                JOIN 
                    flow_report_values frv ON f.id = frv.flow_id
                WHERE 
                    frv.timeframe = :prev_timeframe
                    AND frv.recipients IS NOT NULL
                    AND frv.revenue_per_recipient IS NOT NULL
            """)
            
            prev_result = db.execute(prev_query, {"prev_timeframe": prev_timeframe}).fetchone()
            
            if prev_result:
                prev_total_revenue = float(prev_result.total_revenue) if prev_result.total_revenue is not None else 0.0
                prev_total_recipients = int(prev_result.total_recipients) if prev_result.total_recipients is not None else 0
                
                # Use the averages calculated in the database query
                prev_aggregate_rpr = float(prev_result.avg_revenue_per_recipient) if prev_result.avg_revenue_per_recipient is not None else 0.0
                prev_aggregate_aov = float(prev_result.avg_order_value) if prev_result.avg_order_value is not None else 0.0
                
                response_data.update({
                    "previous_total_revenue": prev_total_revenue,
                    "previous_total_recipients": prev_total_recipients,
                    "previous_aggregate_rpr": prev_aggregate_rpr,
                    "previous_aggregate_aov": prev_aggregate_aov
                })
        
        logger.info(f"Successfully calculated flow aggregate metrics: RPR={aggregate_rpr:.4f}, AOV={aggregate_aov:.2f}")
        return FlowAggregateMetricsResponse(**response_data)
        
    except Exception as e:
        logger.error(f"Error fetching flow aggregate metrics: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching flow aggregate metrics: {str(e)}"
        )
