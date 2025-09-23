from sqlalchemy import Column, String, Integer, Numeric, DateTime, select, Boolean, and_
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from core.database import Base

class Campaign(Base):
    __tablename__ = "campaigns"
    __table_args__ = {"extend_existing": True}

    id = Column(String(100), primary_key=True, index=True)
    type = Column(String(50), nullable=True)
    name = Column(String(255), nullable=False)
    status = Column(String(50))
    archived = Column(Boolean, default=False)
    created_at = Column(String, nullable=True)
    scheduled_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)
    send_time = Column(String, nullable=True)
    audiences = Column(JSONB)
    send_options = Column(JSONB)
    tracking_options = Column(JSONB)
    send_strategy = Column(JSONB)
    relationships = Column(JSONB)
    links = Column(JSONB)
    raw_data = Column(JSONB)
    channel = Column(String(10), nullable=True)
    job_id = Column(Integer, nullable=True)

    def __repr__(self):
        return f"<Campaign(id={self.id}, name={self.name}, channel={self.channel})>"
class CampaignValuesReport(Base):
    __tablename__ = "campaign_report_values"
    __table_args__ = {"extend_existing": True}  

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String(100))  
    report_type = Column(String(50), nullable=False)  
    campaign_id = Column(String(50), nullable=False)
    campaign_message_id = Column(String(50))
    send_channel = Column(String(50))
    campaign_relationship_id = Column(String(50)) 
    timeframe = Column(String(50), nullable=False) 
    conversion_metric_id = Column(String(100), nullable=False)
    recipients = Column(Integer)
    open_rate = Column(Numeric)
    click_rate = Column(Numeric)
    revenue_per_recipient = Column(Numeric)
    average_order_value = Column(Numeric)
    placed_orders = Column(Numeric)
    # New fields
    bounce_rate = Column(Numeric)
    delivered = Column(Integer)
    delivery_rate = Column(Numeric)
    bounced = Column(Integer)
    opens = Column(Integer)
    clicks = Column(Integer)
    # Additional new statistics fields
    bounced_or_failed = Column(Integer)
    bounced_or_failed_rate = Column(Numeric)
    click_to_open_rate = Column(Numeric)
    clicks_unique = Column(Integer)
    conversion_rate = Column(Numeric)
    conversion_uniques = Column(Integer)
    conversion_value = Column(Numeric)
    conversions = Column(Integer)
    failed = Column(Integer)
    failed_rate = Column(Numeric)
    opens_unique = Column(Integer)
    spam_complaint_rate = Column(Numeric)
    spam_complaints = Column(Integer)
    unsubscribe_rate = Column(Numeric)
    unsubscribe_uniques = Column(Integer)
    unsubscribes = Column(Integer)
    job_id = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=True)
    
    def __repr__(self):
        return f"<CampaignValuesReport(id={self.id}, campaign_id={self.campaign_id})>"