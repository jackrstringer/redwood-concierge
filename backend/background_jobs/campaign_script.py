import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))


import requests
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
from urllib.parse import quote
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = os.getenv("KLAVIYO_PRIVATE_API_KEY")
if not API_KEY:
    raise ValueError("KLAVIYO_PRIVATE_API_KEY environment variable is missing.")

BASE_URL = os.getenv("KLAVIYO_API_URL", "https://a.klaviyo.com/").rstrip("/") + "/api/campaigns"
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is missing.")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Campaign(Base):
    __tablename__ = "campaigns"

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
    
    def __repr__(self):
        return f"<Campaign(id={self.id}, type={self.type}, name={self.name}, status={self.status})>"


def fetch_campaigns_email(channel: str = "email"):
    if channel not in ["email", "sms"]:
        raise ValueError("Channel must be either 'email' or 'sms'")

    filter_param = quote(f'equals(messages.channel,"{channel}")')
    url = f"{BASE_URL}?filter={filter_param}"

    revision_date = "2025-07-15"

    headers = {
        "Authorization": f"Klaviyo-API-Key {API_KEY}",
        "Accept": "application/json",
        "REVISION": revision_date,
    }

    print(f"Fetching {channel} campaigns from API with REVISION {revision_date}...")
    response = requests.get(url, headers=headers)

    try:
        response.raise_for_status()
    except requests.HTTPError as e:
        print("Error:", response.text)
        raise e

    return response.json()

def fetch_campaigns_sms(channel: str = "sms"):
    if channel not in ["email", "sms"]:
        raise ValueError("Channel must be either 'email' or 'sms'")

    filter_param = quote(f'equals(messages.channel,"{channel}")')
    url = f"{BASE_URL}?filter={filter_param}"

    revision_date = "2025-07-15"

    headers = {
        "Authorization": f"Klaviyo-API-Key {API_KEY}",
        "Accept": "application/json",
        "REVISION": revision_date,
    }

    print(f"Fetching {channel} campaigns from API with REVISION {revision_date}...")
    response = requests.get(url, headers=headers)

    try:
        response.raise_for_status()
    except requests.HTTPError as e:
        print("Error:", response.text)
        raise e

    return response.json()

def save_campaigns(campaigns_response, channel: str):
    """Save campaigns into PostgreSQL"""
    db = SessionLocal()
    campaigns = campaigns_response.get("data", [])
    for item in campaigns:
        campaign = Campaign(
            id=item["id"],
            type=item.get("type"),
            name=item["attributes"]["name"],
            status=item["attributes"]["status"],
            archived=item["attributes"]["archived"],
            created_at=item["attributes"].get("created_at"),
            scheduled_at=item["attributes"].get("scheduled_at"),
            updated_at=item["attributes"].get("updated_at"),
            send_time=item["attributes"].get("send_time"),
            audiences=item["attributes"].get("audiences"),
            send_options=item["attributes"].get("send_options"),
            tracking_options=item["attributes"].get("tracking_options"),
            send_strategy=item["attributes"].get("send_strategy"),
            relationships=item.get("relationships"),
            links=item.get("links"),
            channel=channel,
            raw_data=item,
        )
        db.merge(campaign)
    db.commit()
    db.close()


def main():
    Base.metadata.create_all(bind=engine)
    print("Fetching email campaigns from API...")
    campaigns = fetch_campaigns_email()
    print(f"Fetched {len(campaigns.get('data', []))} email campaigns")
    save_campaigns(campaigns, channel="email")

    print("Fetching SMS campaigns from API...")
    campaigns = fetch_campaigns_sms()
    print(f"Fetched {len(campaigns.get('data', []))} SMS campaigns")
    save_campaigns(campaigns, channel="sms")

    print("Campaigns saved to DB")


if __name__ == "__main__":
    main()
