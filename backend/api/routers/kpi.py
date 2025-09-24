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


@router.get("/dashboard-kpi", response_model=KPIResponse)
async def get_dashboard_kpi(
    timeframe: str = Query("last_7_days"),
    db: Session = Depends(get_db)
):
    """
    Get dashboard KPI metrics using the PostgreSQL get_dashboard_kpi function
    
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
        
        # Call the PostgreSQL function
        query = text("SELECT * FROM get_dashboard_kpi(:timeframe)")
        result = db.execute(query, {"timeframe": timeframe}).fetchone()
        
        if not result:
            logger.warning(f"No KPI data returned for timeframe: {timeframe}")
            return KPIResponse()
        
        # Convert result to dict and create response
        kpi_data = {
            "total_revenue": float(result.total_revenue) if result.total_revenue is not None else 0.0,
            "email_revenue": float(result.email_revenue) if result.email_revenue is not None else 0.0,
            "campaign_revenue": float(result.campaign_revenue) if result.campaign_revenue is not None else 0.0,
            "flow_revenue": float(result.flow_revenue) if result.flow_revenue is not None else 0.0,
            "revenue_per_recipient": float(result.revenue_per_recipient) if result.revenue_per_recipient is not None else 0.0,
            "average_order_value": float(result.average_order_value) if result.average_order_value is not None else 0.0,
            "campaign_place_order_rate": float(result.campaign_place_order_rate) if result.campaign_place_order_rate is not None else 0.0,
            "flow_place_order_rate": float(result.flow_place_order_rate) if result.flow_place_order_rate is not None else 0.0,
            "campaigns_sent": int(result.campaigns_sent) if result.campaigns_sent is not None else 0,
            "open_rate": float(result.open_rate) if result.open_rate is not None else 0.0,
            "click_rate": float(result.click_rate) if result.click_rate is not None else 0.0,
            "unsubscribe_rate": float(result.unsubscribe_rate) if result.unsubscribe_rate is not None else 0.0,
            "spam_rate": float(result.spam_rate) if result.spam_rate is not None else 0.0,
            "bounce_rate": float(result.bounce_rate) if result.bounce_rate is not None else 0.0,
            "total_emails_sent": int(result.total_emails_sent) if result.total_emails_sent is not None else 0,
            "campaign_sends": int(result.campaign_sends) if result.campaign_sends is not None else 0,
            "total_active_profiles": int(result.total_active_profiles) if result.total_active_profiles is not None else 0,
            "net_subscriber_growth": int(result.net_subscriber_growth) if result.net_subscriber_growth is not None else 0,
            "new_email_subscribers": int(result.new_email_subscribers) if result.new_email_subscribers is not None else 0,
            "new_sms_subscribers": int(result.new_sms_subscribers) if result.new_sms_subscribers is not None else 0,
            "email_unsubscribes": int(result.email_unsubscribes) if result.email_unsubscribes is not None else 0,
            "percentage_engaged": float(result.percentage_engaged) if result.percentage_engaged is not None else 0.0,
            "subscriptions_started": int(result.subscriptions_started) if result.subscriptions_started is not None else 0,
            "active_subscriptions": int(result.active_subscriptions) if result.active_subscriptions is not None else 0,
            "average_subcription_cycles": float(result.average_subcription_cycles) if result.average_subcription_cycles is not None else 0.0,
            "monthly_recurring_revenue": float(result.monthly_recurring_revenue) if result.monthly_recurring_revenue is not None else 0.0,
            "churn_rate": float(result.churn_rate) if result.churn_rate is not None else 0.0,
            "reactivation_rate": float(result.reactivation_rate) if result.reactivation_rate is not None else 0.0,
            "dunning_success_rate": float(result.dunning_success_rate) if result.dunning_success_rate is not None else 0.0,
            "skip_rate": float(result.skip_rate) if result.skip_rate is not None else 0.0,
        }
        
        logger.info(f"Successfully fetched KPI metrics for {timeframe}")
        return KPIResponse(**kpi_data)
        
    except Exception as e:
        logger.error(f"Error fetching dashboard KPI metrics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching KPI metrics: {str(e)}"
        )
