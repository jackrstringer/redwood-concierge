from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from core.database import get_db
from pydantic import BaseModel
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class KPIResponse(BaseModel):
    # Current metrics
    total_revenue: Optional[float] = 0.0
    email_revenue: Optional[float] = 0.0
    campaign_revenue: Optional[float] = 0.0
    flow_revenue: Optional[float] = 0.0
    revenue_per_recipient: Optional[float] = 0.0
    average_order_value: Optional[float] = 0.0
    campaign_place_order_rate: Optional[float] = 0.0
    flow_place_order_rate: Optional[float] = 0.0
    campaigns_sent: Optional[int] = 0
    open_rate: Optional[float] = 0.0
    click_rate: Optional[float] = 0.0
    unsubscribe_rate: Optional[float] = 0.0
    spam_rate: Optional[float] = 0.0
    bounce_rate: Optional[float] = 0.0
    total_emails_sent: Optional[int] = 0
    campaign_sends: Optional[int] = 0
    total_active_profiles: Optional[int] = 0
    net_subscriber_growth: Optional[int] = 0
    new_email_subscribers: Optional[int] = 0
    new_sms_subscribers: Optional[int] = 0
    email_unsubscribes: Optional[int] = 0
    percentage_engaged: Optional[float] = 0.0
    subscriptions_started: Optional[int] = 0
    active_subscriptions: Optional[int] = 0
    average_subcription_cycles: Optional[float] = 0.0
    monthly_recurring_revenue: Optional[float] = 0.0
    churn_rate: Optional[float] = 0.0
    reactivation_rate: Optional[float] = 0.0
    dunning_success_rate: Optional[float] = 0.0
    skip_rate: Optional[float] = 0.0
    # Previous metrics for delta calculations
    previous_total_revenue: Optional[float] = None
    previous_email_revenue: Optional[float] = None
    previous_campaign_revenue: Optional[float] = None
    previous_flow_revenue: Optional[float] = None
    previous_revenue_per_recipient: Optional[float] = None
    previous_average_order_value: Optional[float] = None
    previous_campaign_place_order_rate: Optional[float] = None
    previous_flow_place_order_rate: Optional[float] = None
    previous_campaigns_sent: Optional[int] = None
    previous_open_rate: Optional[float] = None
    previous_click_rate: Optional[float] = None
    previous_unsubscribe_rate: Optional[float] = None
    previous_spam_rate: Optional[float] = None
    previous_bounce_rate: Optional[float] = None


@router.get("/dashboard-kpi", response_model=KPIResponse)
async def get_dashboard_kpi(
    timeframe: str = Query("last_7_days"),
    db: Session = Depends(get_db)
):
    """
    Get dashboard KPI metrics using the PostgreSQL get_kpis function
    
    Args:
        timeframe: Either 'last_7_days' or 'last_30_days'
    """
    try:
        logger.info(f"Fetching dashboard KPI metrics for timeframe: {timeframe}")
        
        # Validate timeframe
        if timeframe not in ['last_7_days', 'last_30_days']:
            raise HTTPException(
                status_code=400,
                detail="Invalid timeframe. Must be 'last_7_days' or 'last_30_days'"
            )
        
        # Call the PostgreSQL function - it returns 2 rows (current and previous)
        query = text("SELECT * FROM get_kpis(:timeframe)")
        results = db.execute(query, {"timeframe": timeframe}).fetchall()
        
        if not results or len(results) == 0:
            logger.warning(f"No KPI data returned for timeframe: {timeframe}")
            return KPIResponse()
        
        # First row is current data, second row is previous data (if exists)
        current_result = results[0]
        previous_result = results[1] if len(results) > 1 else None
        
        # Helper function to safely convert values
        def safe_float(value):
            return float(value) if value is not None else 0.0
        
        def safe_int(value):
            return int(value) if value is not None else 0
        
        # Convert current result to dict
        kpi_data = {
            # Current metrics
            "total_revenue": safe_float(current_result.total_revenue),
            "email_revenue": safe_float(current_result.email_revenue),
            "campaign_revenue": safe_float(current_result.campaign_revenue),
            "flow_revenue": safe_float(current_result.flow_revenue),
            "revenue_per_recipient": safe_float(current_result.revenue_per_recipient),
            "average_order_value": safe_float(current_result.average_order_value),
            "campaign_place_order_rate": safe_float(current_result.campaign_place_order_rate),
            "flow_place_order_rate": safe_float(current_result.flow_place_order_rate),
            "campaigns_sent": safe_int(current_result.campaigns_sent),
            "open_rate": safe_float(current_result.open_rate),
            "click_rate": safe_float(current_result.click_rate),
            "unsubscribe_rate": safe_float(current_result.unsubscribe_rate),
            "spam_rate": safe_float(current_result.spam_rate),
            "bounce_rate": safe_float(current_result.bounce_rate),
            "total_emails_sent": safe_int(current_result.total_emails_sent),
            "campaign_sends": safe_int(current_result.campaign_sends),
            "total_active_profiles": safe_int(current_result.total_active_profiles),
            "net_subscriber_growth": safe_int(current_result.net_subscriber_growth),
            "new_email_subscribers": safe_int(current_result.new_email_subscribers),
            "new_sms_subscribers": safe_int(current_result.new_sms_subscribers),
            "email_unsubscribes": safe_int(current_result.email_unsubscribes),
            "percentage_engaged": safe_float(current_result.percentage_engaged),
            "subscriptions_started": safe_int(current_result.subscriptions_started),
            "active_subscriptions": safe_int(current_result.active_subscriptions),
            "average_subcription_cycles": safe_float(current_result.average_subcription_cycles),
            "monthly_recurring_revenue": safe_float(current_result.monthly_recurring_revenue),
            "churn_rate": safe_float(current_result.churn_rate),
            "reactivation_rate": safe_float(current_result.reactivation_rate),
            "dunning_success_rate": safe_float(current_result.dunning_success_rate),
            "skip_rate": safe_float(current_result.skip_rate),
        }
        
        # Add previous data if available
        if previous_result:
            kpi_data.update({
                "previous_total_revenue": safe_float(previous_result.total_revenue),
                "previous_email_revenue": safe_float(previous_result.email_revenue),
                "previous_campaign_revenue": safe_float(previous_result.campaign_revenue),
                "previous_flow_revenue": safe_float(previous_result.flow_revenue),
                "previous_revenue_per_recipient": safe_float(previous_result.revenue_per_recipient),
                "previous_average_order_value": safe_float(previous_result.average_order_value),
                "previous_campaign_place_order_rate": safe_float(previous_result.campaign_place_order_rate),
                "previous_flow_place_order_rate": safe_float(previous_result.flow_place_order_rate),
                "previous_campaigns_sent": safe_int(previous_result.campaigns_sent),
                "previous_open_rate": safe_float(previous_result.open_rate),
                "previous_click_rate": safe_float(previous_result.click_rate),
                "previous_unsubscribe_rate": safe_float(previous_result.unsubscribe_rate),
                "previous_spam_rate": safe_float(previous_result.spam_rate),
                "previous_bounce_rate": safe_float(previous_result.bounce_rate),
            })
        
        logger.info(f"Successfully fetched KPI metrics for {timeframe}")
        return KPIResponse(**kpi_data)
        
    except Exception as e:
        logger.error(f"Error fetching dashboard KPI metrics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching KPI metrics: {str(e)}"
        )
