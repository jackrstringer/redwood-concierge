


import logging
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
from app.core.database import SessionLocal, Base, engine
from app.models.campaign_models import Campaign, CampaignValuesReport
from app.services.api_service import APIService
from app.services.database_service import DatabaseService
from app.utils.helpers import get_environment_variables

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    env_vars = get_environment_variables()
    
    Base.metadata.create_all(bind=engine)
    
    campaign_ids = DatabaseService.get_top_campaign_ids(limit=15)
    
    if not campaign_ids:
        logger.warning("No campaign IDs found in the database. Exiting.")
        return
    
    request_delay = 30
    
    logger.info("Waiting 30 seconds before starting requests...")
    time.sleep(30)
    
    for i, campaign_id in enumerate(campaign_ids):
        try:
            logger.info(f"Processing campaign ID: {campaign_id} ({i+1}/{len(campaign_ids)})")
            
            report = APIService.fetch_campaign_values_report(
                campaign_id=campaign_id,
                timeframe=env_vars["timeframe"],
                conversion_metric_id=env_vars["conversion_metric_id"]

            )
            
            DatabaseService.save_campaign_values_report(report, campaign_id,conversion_metric_id=env_vars["conversion_metric_id"])
            
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

if __name__ == "__main__":
    main()