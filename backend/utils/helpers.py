
import logging
import os
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

def validate_environment_variables():
    """
    Validate that all required environment variables are set
    """
    required_vars = [
        "KLAVIYO_PRIVATE_API_KEY",
        "CONVERSION_METRIC_ID",
        "TimeFrame",
        "DATABASE_URL"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        error_msg = f"Missing required environment variables: {', '.join(missing_vars)}"
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    logger.info("All required environment variables are set")

def get_environment_variables():
    """
    Get all required environment variables
    """
    validate_environment_variables()
    
    return {
        "api_key": os.getenv("KLAVIYO_PRIVATE_API_KEY"),
        "conversion_metric_id": os.getenv("CONVERSION_METRIC_ID"),
        "timeframe": os.getenv("TimeFrame"),
        "base_url": os.getenv("KLAVIYO_API_URL", "https://a.klaviyo.com/").rstrip("/") + "/api/campaign-values-reports"
    }

def get_current_utc_time():
    """
    Get current UTC time as a naive datetime object
    This ensures we're storing the correct UTC time in the database
    """
    utc_time = datetime.now(timezone.utc).replace(tzinfo=None)
    logger.debug(f"Current UTC time: {utc_time}")
    return utc_time