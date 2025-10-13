from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

# Get from .env only (no fallback)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not found in .env file")

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"options": "-c timezone=utc"}  
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        db.execute(text("SET TIME ZONE 'UTC'"))
        yield db
    finally:
        db.close()
