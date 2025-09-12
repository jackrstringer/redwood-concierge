#!/usr/bin/env python3
"""
Script to check and fix created_at column in campaign_jobs table
"""

from sqlalchemy.sql import text
from core.database import SessionLocal
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_and_fix_created_at_column():
    """Check and fix the created_at column in campaign_jobs table"""
    db = SessionLocal()
    try:
        # Check current column configuration
        check_sql = text("""
            SELECT column_name, column_default, is_nullable, data_type
            FROM information_schema.columns 
            WHERE table_name = 'campaign_jobs' 
            AND column_name = 'created_at';
        """)
        
        result = db.execute(check_sql).fetchone()
        logger.info(f"Current created_at column configuration: {result}")
        
        # Check current data in the table
        data_check_sql = text("SELECT id, type, created_at FROM campaign_jobs ORDER BY id;")
        jobs = db.execute(data_check_sql).fetchall()
        logger.info(f"Current jobs in table: {jobs}")
        
        # Fix the column default and update existing null values
        fix_sql = text("""
            DO $$ 
            BEGIN
                -- Set the default value for the created_at column
                ALTER TABLE campaign_jobs 
                ALTER COLUMN created_at SET DEFAULT timezone('utc', now());
                
                -- Update existing null values with current timestamp
                UPDATE campaign_jobs 
                SET created_at = timezone('utc', now()) 
                WHERE created_at IS NULL;
            END $$;
        """)
        
        db.execute(fix_sql)
        db.commit()
        logger.info("Successfully fixed created_at column and updated null values")
        
        # Verify the fix
        verify_sql = text("""
            SELECT column_name, column_default, is_nullable, data_type
            FROM information_schema.columns 
            WHERE table_name = 'campaign_jobs' 
            AND column_name = 'created_at';
        """)
        
        result = db.execute(verify_sql).fetchone()
        logger.info(f"Updated created_at column configuration: {result}")
        
        # Check updated data
        updated_jobs = db.execute(data_check_sql).fetchall()
        logger.info(f"Updated jobs in table: {updated_jobs}")
        
    except Exception as e:
        logger.error(f"Error fixing created_at column: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Checking and fixing created_at column in campaign_jobs table...")
    check_and_fix_created_at_column()
    logger.info("Fix completed!")
