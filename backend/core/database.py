# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# import os
# # from app.models.campaign import Campaign 
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:123@192.168.0.130:5432/campaigns")

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:123@192.168.0.130:5432/campaigns")

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