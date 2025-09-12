from sqlalchemy import Column, String, DateTime, Boolean,Integer,func,text
from sqlalchemy.dialects.postgresql import JSONB
from core.database import Base
from sqlalchemy.dialects.postgresql import TIMESTAMP
from core.database import Base
class Campaign(Base):
    __tablename__ = "campaigns"
    __table_args__ = {"extend_existing": True}  # Add this line

    id = Column(Integer, primary_key=True, index=True, autoincrement=True) 
    name = Column(String(255), nullable=False)
    status = Column(String(50))
    archived = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True), 
        server_default=text("timezone('utc', now())"),
        nullable=False
    )
    scheduled_at = Column(DateTime)
    updated_at = Column(DateTime)
    send_time = Column(DateTime)

    audiences = Column(JSONB)
    send_options = Column(JSONB)
    tracking_options = Column(JSONB)
    send_strategy = Column(JSONB)
    relationships = Column(JSONB)

    raw_data = Column(JSONB) 


    def __repr__(self):
        return f"<Campaign(id={self.id}, name={self.name}, status={self.status})>"
