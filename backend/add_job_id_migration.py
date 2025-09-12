#!/usr/bin/env python3
"""
Migration script to add job_id column to campaign_report_values table
"""

from sqlalchemy.sql import text
from core.database import SessionLocal, engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_job_id_column():
    """Add job_id column to campaign_report_values table"""
    db = SessionLocal()
    try:
        # Check if column already exists
        check_column_sql = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'campaign_report_values' 
            AND column_name = 'job_id';
        """)
        
        result = db.execute(check_column_sql).fetchone()
        
        if result:
            logger.info("job_id column already exists in campaign_report_values table")
            return
        
        # Add the column
        alter_sql = text("ALTER TABLE campaign_report_values ADD COLUMN job_id INTEGER;")
        db.execute(alter_sql)
        db.commit()
        logger.info("Successfully added job_id column to campaign_report_values table")
        
    except Exception as e:
        logger.error(f"Error adding job_id column: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Running migration to add job_id column...")
    add_job_id_column()
    logger.info("Migration completed!")
