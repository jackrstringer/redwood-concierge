#!/usr/bin/env python3
"""
Script to fix campaign_jobs table id column to be auto-increment
"""

from sqlalchemy.sql import text
from core.database import SessionLocal
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_campaign_jobs_id():
    """Fix campaign_jobs id column to be auto-increment"""
    db = SessionLocal()
    try:
        # Check current id column setup
        check_sql = text("""
            SELECT column_name, column_default, is_nullable, data_type
            FROM information_schema.columns 
            WHERE table_name = 'campaign_jobs' 
            AND column_name = 'id';
        """)
        
        result = db.execute(check_sql).fetchone()
        logger.info(f"Current id column configuration: {result}")
        
        # Create a sequence if it doesn't exist and set it as default
        sequence_sql = text("""
            DO $$ 
            BEGIN
                -- Create sequence if it doesn't exist
                CREATE SEQUENCE IF NOT EXISTS campaign_jobs_id_seq;
                
                -- Set the sequence as the default for the id column
                ALTER TABLE campaign_jobs ALTER COLUMN id SET DEFAULT nextval('campaign_jobs_id_seq');
                
                -- Make sure the sequence is owned by the id column
                ALTER SEQUENCE campaign_jobs_id_seq OWNED BY campaign_jobs.id;
                
                -- Set the sequence value to be higher than any existing ids
                PERFORM setval('campaign_jobs_id_seq', COALESCE((SELECT MAX(id) FROM campaign_jobs), 0) + 1, false);
            END $$;
        """)
        
        db.execute(sequence_sql)
        db.commit()
        logger.info("Successfully configured campaign_jobs id column to auto-increment")
        
        # Verify the change
        verify_sql = text("""
            SELECT column_name, column_default, is_nullable, data_type
            FROM information_schema.columns 
            WHERE table_name = 'campaign_jobs' 
            AND column_name = 'id';
        """)
        
        result = db.execute(verify_sql).fetchone()
        logger.info(f"Updated id column configuration: {result}")
        
    except Exception as e:
        logger.error(f"Error fixing campaign_jobs id column: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Fixing campaign_jobs id column...")
    fix_campaign_jobs_id()
    logger.info("Fix completed!")
