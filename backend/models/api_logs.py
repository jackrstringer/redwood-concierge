from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from core.database import Base

class APILog(Base):
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    script_name = Column(String(100), nullable=True)
    endpoint = Column(String(255), nullable=False)
    status_code = Column(Integer, nullable=True)
    status = Column(String(50), nullable=False)
    request_body = Column(JSONB, nullable=True)   
    response_body = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    job_id = Column(Integer, nullable=True)
    