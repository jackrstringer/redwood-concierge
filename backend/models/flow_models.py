# backend/models/flow_models.py
from sqlalchemy import Column, String, Integer, Numeric, Boolean
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from core.database import Base

class Flow(Base):
    __tablename__ = "flows"
    __table_args__ = {"extend_existing": True}

    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    status = Column(String(50))
    archived = Column(Boolean, default=False)
    created = Column(String, nullable=True)
    updated = Column(String, nullable=True)
    trigger_type = Column(String(50), nullable=True)
    relationships = Column(JSONB)
    links = Column(JSONB)
    raw_data = Column(JSONB)

    def __repr__(self):
        return f"<Flow(id={self.id}, name={self.name}, status={self.status})>"


class FlowValuesReport(Base):
    __tablename__ = "flow_report_values"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    flow_id = Column(String(100), nullable=False)
    timeframe = Column(String(50), nullable=False)   # today, last_7_days, etc.
    conversion_metric_id = Column(String(100), nullable=False)
    bounced_or_failed = Column(Integer)
    unsubscribe_rate = Column(Numeric)
    opens = Column(Integer)
    open_rate = Column(Numeric)
    click_rate = Column(Numeric)
    recipients = Column(Integer)
    revenue_per_recipient = Column(Numeric)
    average_order_value = Column(Numeric)
    # New fields
    clicks = Column(Integer)
    bounced = Column(Integer)
    bounce_rate = Column(Numeric)
    delivered = Column(Integer)
    delivery_rate = Column(Numeric)
    # Additional new statistics fields
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
    unsubscribe_uniques = Column(Integer)
    unsubscribes = Column(Integer)
    raw_data = Column(JSONB, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=True)
    job_id = Column(Integer, nullable=True)

    def __repr__(self):
        return f"<FlowValuesReport(id={self.id}, flow_id={self.flow_id})>"
