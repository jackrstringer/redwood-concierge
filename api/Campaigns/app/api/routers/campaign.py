
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, cast, String
from sqlalchemy.dialects.postgresql import TIMESTAMP
from datetime import datetime, timedelta
from typing import List, Optional
from app.core.database import get_db
from app.models.campaign_models import Campaign, CampaignValuesReport 

from pydantic import BaseModel

router = APIRouter()

class CampaignResponse(BaseModel):
    id: str
    updated_at: str
    name: str
    recipients: Optional[int] = 0
    open_rate: Optional[float] = 0.0
    click_rate: Optional[float] = 0.0
    placed_orders: Optional[int] = 0
    revenue: Optional[float] = 0.0
    rpr: Optional[float] = 0.0  
    aov: Optional[float] = 0.0 

def get_date_range(range_str: str) -> tuple[datetime, datetime]:
    now = datetime.utcnow()
    end = now
    start: datetime

    if range_str == 'today':
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_str == 'wtd':  
        start = now - timedelta(days=now.weekday())
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_str == 'mtd': 
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif range_str == 'last_7_days':
        start = now - timedelta(days=7)
    elif range_str == 'last_30_days':
        start = now - timedelta(days=30)
    else:
        start = now - timedelta(days=30)

    return start, end

@router.get("/campaigns", response_model=List[CampaignResponse])
async def get_campaigns(
    date_range: str = Query("last_30_days", description="Date range for campaigns"),
    db: Session = Depends(get_db)
):
    try:
        start, end = get_date_range(date_range)

        query = (
            db.query(
                Campaign.id,
                Campaign.updated_at,
                Campaign.name,
                CampaignValuesReport.recipients,
                CampaignValuesReport.open_rate,
                CampaignValuesReport.click_rate,
                CampaignValuesReport.placed_orders,
                CampaignValuesReport.revenue,
                CampaignValuesReport.revenue_per_recipient,
                CampaignValuesReport.average_order_value
            )
            .join(CampaignValuesReport, Campaign.id == CampaignValuesReport.campaign_id, isouter=True)
            .filter(
                cast(Campaign.updated_at, TIMESTAMP) >= start,
                cast(Campaign.updated_at, TIMESTAMP) <= end
            )
        )

        results = query.all()

        campaigns = []
        for row in results:
            campaign_data = {
                "id": row.id,
                "updated_at": row.updated_at,
                "name": row.name,
                "recipients": row.recipients if row.recipients is not None else 0,
                "open_rate": float(row.open_rate) if row.open_rate is not None else 0.0,
                "click_rate": float(row.click_rate) if row.click_rate is not None else 0.0,
                "placed_orders": row.placed_orders if row.placed_orders is not None else 0,
                "revenue": float(row.revenue) if row.revenue is not None else 0.0,
                "rpr": float(row.revenue_per_recipient) if row.revenue_per_recipient is not None else 0.0,
                "aov": float(row.average_order_value) if row.average_order_value is not None else 0.0,
            }
            campaigns.append(CampaignResponse(**campaign_data))

        return campaigns

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))