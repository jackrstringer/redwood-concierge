# backend/campaign_value_report_script.py

import logging
import time
import argparse
from dotenv import load_dotenv
from core.database import SessionLocal, Base, engine
from models.campaign_models import Campaign, CampaignValuesReport
from services.api_service import APIService
from services.database_service import DatabaseService
from utils.helpers import get_environment_variables

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_campaign_values_report(timeframe: str = "last_30_days"):
    """Main process to fetch and save campaign values report"""
    env_vars = get_environment_variables()
    
    # ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # get campaigns from DB
    campaign_ids = DatabaseService.get_top_campaign_ids(limit=2)
    
    if not campaign_ids:
        logger.warning("No campaign IDs found in the database. Exiting.")
        return
    
    # create a job record
    job_id = DatabaseService.create_new_job(
        type="campaign_report_values", channel="", timeframe=timeframe
    )
    if not job_id:
        logger.error("Failed to create job. Exiting.")
        return

    request_delay = 30
    logger.info("Waiting 30 seconds before starting requests...")
    time.sleep(request_delay)
    
    try:
        for i, campaign_id in enumerate(campaign_ids):
            try:
                logger.info(f"Processing campaign ID: {campaign_id} ({i+1}/{len(campaign_ids)})")
                
                # fetch report from API
                report = APIService.fetch_campaign_values_report(
                    campaign_id=campaign_id,
                    timeframe=timeframe,
                    conversion_metric_id=env_vars["conversion_metric_id"]
                )

                # save to DB (keeps existing data for other timeframes intact)
                DatabaseService.save_campaign_values_report(
                    report, campaign_id, timeframe,
                    conversion_metric_id=env_vars["conversion_metric_id"],
                    job_id=job_id
                )

                logger.info(f"Successfully processed campaign ID: {campaign_id}")
                
                if i < len(campaign_ids) - 1:
                    logger.info(f"Waiting {request_delay} seconds before next request...")
                    time.sleep(request_delay)
                    
            except Exception as e:
                if "Daily rate limit exceeded" in str(e):
                    logger.error("Daily rate limit exceeded. Stopping processing for today.")
                    break
                logger.error(f"Failed to process campaign ID {campaign_id}: {e}")
                if i < len(campaign_ids) - 1:
                    logger.info(f"Waiting {request_delay} seconds before next request after error...")
                    time.sleep(request_delay)
    finally:
        # Mark job as completed
        if job_id:
            logger.info(f"Marking job {job_id.id} as completed")
            DatabaseService.mark_job_completed(job_id.id)
            logger.info(f"Job {job_id.id} marked as completed")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch campaign values report for specified timeframe")
    parser.add_argument(
        "--timeframe", 
        type=str, 
        default="last_30_days",
        help="Timeframe for the campaign values report (e.g. last_7_days, last_30_days)"
    )
    
    args = parser.parse_args()
    logger.info(f"Starting campaign values report script with timeframe: {args.timeframe}")
    run_campaign_values_report(args.timeframe)
