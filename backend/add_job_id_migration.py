#!/usr/bin/env python3
"""
Migration script to add job_id column to api_logs table
"""

from sqlalchemy.sql import text
from core.database import SessionLocal
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_job_id_column():
    """Add job_id column to api_logs table"""
    db = SessionLocal()
    try:
        # Check if column already exists
        check_column_sql = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'api_logs' 
            AND column_name = 'job_id';
        """)
        
        result = db.execute(check_column_sql).fetchone()
        
        if result:
            logger.info("job_id column already exists in api_logs table")
            return
        
        # Add the column
        alter_sql = text("ALTER TABLE api_logs ADD COLUMN job_id INTEGER;")
        db.execute(alter_sql)

        # Add foreign key constraint
        fk_sql = text("""
            ALTER TABLE api_logs
            ADD CONSTRAINT fk_api_logs_jobs
            FOREIGN KEY (job_id) REFERENCES jobs(id);
        """)
        db.execute(fk_sql)

        db.commit()
        logger.info("Successfully added job_id column to api_logs table with foreign key")
        
    except Exception as e:
        logger.error(f"Error adding job_id column: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Running migration to add job_id column to api_logs...")
    add_job_id_column()
    logger.info("Migration completed!")
