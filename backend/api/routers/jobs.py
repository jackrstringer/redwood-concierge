from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from typing import Optional
from core.database import get_db
from pydantic import BaseModel
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class JobTimingResponse(BaseModel):
    last_job_created_at: Optional[datetime] = None
    timeframe: str
    job_type: str

@router.get("/jobs/last-execution", response_model=JobTimingResponse)
async def get_last_job_execution(
    timeframe: str = Query(..., description="Timeframe for the job (e.g., last_7_days, last_30_days)"),
    job_type: str = Query("campaign_report_values", description="Type of job to query"),
    db: Session = Depends(get_db)
):
    """
    Get the most recent job execution time for a specific timeframe and job type
    """
    try:
        logger.info(f"Fetching last job execution for timeframe: {timeframe}, job_type: {job_type}")
        
        query = text("""
            SELECT j.created_at
            FROM jobs j
            WHERE j.timeframe = :timeframe
              AND j."type" = :job_type
            ORDER BY j.created_at DESC
            LIMIT 1;
        """)
        
        result = db.execute(query, {"timeframe": timeframe, "job_type": job_type}).fetchone()
        
        last_job_created_at = None
        if result:
            last_job_created_at = result.created_at
        
        logger.info(f"Last job execution found: {last_job_created_at}")
        
        return JobTimingResponse(
            last_job_created_at=last_job_created_at,
            timeframe=timeframe,
            job_type=job_type
        )
        
    except Exception as e:
        logger.error(f"Error fetching last job execution: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while fetching job timing: {str(e)}"
        )
