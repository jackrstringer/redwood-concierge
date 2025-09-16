from sqlalchemy import Column, String, DateTime, Boolean, Integer, func, text
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from core.database import Base

class CampaignJob(Base):
    __tablename__ = "campaign_jobs"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)
    channel = Column(String(50), nullable=False)
    timeframe = Column(String(50), nullable=False)
    created_at = Column(
        DateTime(timezone=True), 
        server_default=text("timezone('utc', now())"),
        nullable=False
    )
    completed_at = Column(
    DateTime(timezone=True),
    server_default=text("timezone('utc', now())"),
    nullable=True
)
