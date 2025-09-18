# backend/flow_script.py

import os
import requests
from sqlalchemy import create_engine, Column, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = os.getenv("KLAVIYO_PRIVATE_API_KEY")
if not API_KEY:
    raise ValueError("KLAVIYO_PRIVATE_API_KEY environment variable is missing.")

BASE_URL = os.getenv("KLAVIYO_API_URL", "https://a.klaviyo.com/").rstrip("/") + "/api/flows"
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is missing.")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Flow(Base):
    __tablename__ = "flows"

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


def fetch_flows():
    url = f"{BASE_URL}"
    revision_date = "2025-07-15"

    headers = {
        "Authorization": f"Klaviyo-API-Key {API_KEY}",
        "Accept": "application/json",
        "REVISION": revision_date,
    }

    print(f"Fetching flows from API with REVISION {revision_date}...")
    response = requests.get(url, headers=headers)

    try:
        response.raise_for_status()
    except requests.HTTPError as e:
        print("Error:", response.text)
        raise e

    return response.json()


def save_flows(flows_response):
    """Save flows into PostgreSQL"""
    db = SessionLocal()
    flows = flows_response.get("data", [])
    for item in flows:
        flow = Flow(
            id=item["id"],
            name=item["attributes"]["name"],
            status=item["attributes"]["status"],
            archived=item["attributes"]["archived"],
            created=item["attributes"].get("created"),
            updated=item["attributes"].get("updated"),
            trigger_type=item["attributes"].get("trigger_type"),
            relationships=item.get("relationships"),
            links=item.get("links"),
            raw_data=item,
        )
        db.merge(flow)  # insert or update
    db.commit()
    db.close()


def main():
    Base.metadata.create_all(bind=engine)
    print("Fetching flows from API...")
    flows = fetch_flows()
    print(f"Fetched {len(flows.get('data', []))} flows")
    save_flows(flows)
    print("Flows saved to DB")


if __name__ == "__main__":
    main()
