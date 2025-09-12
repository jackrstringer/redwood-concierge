#!/usr/bin/env python3
"""
Script to fix created_at column type to timestamp with timezone in campaign_jobs table
"""

from sqlalchemy.sql import text
from core.database import SessionLocal
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_created_at_column_type():
    """Fix the created_at column type to timestamp with timezone"""
    db = SessionLocal()
    try:
        # Check current column type
        check_sql = text("""
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'campaign_jobs' 
            AND column_name = 'created_at';
        """)
        
        result = db.execute(check_sql).fetchone()
        logger.info(f"Current created_at column: {result}")
        
        # Fix the column type
        fix_sql = text("""
            DO $$ 
            BEGIN
                -- Change the column type to timestamp with time zone
                ALTER TABLE campaign_jobs 
                ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE 
                USING CASE 
                    WHEN created_at IS NOT NULL THEN 
                        (CURRENT_DATE + created_at) AT TIME ZONE 'UTC'
                    ELSE 
                        timezone('utc', now()) 
                END;
                
                -- Set the default value
                ALTER TABLE campaign_jobs 
                ALTER COLUMN created_at SET DEFAULT timezone('utc', now());
                
                -- Make sure it's not nullable  
                ALTER TABLE campaign_jobs 
                ALTER COLUMN created_at SET NOT NULL;
            END $$;
        """)
        
        db.execute(fix_sql)
        db.commit()
        logger.info("Successfully fixed created_at column type to timestamp with time zone")
        
        # Verify the fix
        verify_result = db.execute(check_sql).fetchone()
        logger.info(f"Updated created_at column: {verify_result}")
        
        # Check the data
        data_sql = text("SELECT id, type, created_at FROM campaign_jobs ORDER BY id;")
        jobs = db.execute(data_sql).fetchall()
        logger.info(f"Jobs with updated timestamps: {jobs}")
        
    except Exception as e:
        logger.error(f"Error fixing created_at column type: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Fixing created_at column type...")
    fix_created_at_column_type()
    logger.info("Fix completed!")
