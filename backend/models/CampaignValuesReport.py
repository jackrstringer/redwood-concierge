from sqlalchemy import create_engine, Column, String, Integer, Numeric, DateTime, select, Boolean, and_
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import text
from dotenv import load_dotenv
import logging
import os
import time
import requests
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import TIMESTAMP
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
Base = declarative_base()
class CampaignValuesReport(Base):
    __tablename__ = "campaign_report_values"
    
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
    created_at =  Column( TIMESTAMP, nullable=True)
    updated_at = Column( TIMESTAMP, nullable=True)

    
    def __repr__(self):
        return f"<CampaignValuesReport(id={self.id}, campaign_id={self.campaign_id})>"