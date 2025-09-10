
import logging
import time
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

load_dotenv()
logger = logging.getLogger(__name__)
API_KEY = os.getenv("KLAVIYO_PRIVATE_API_KEY")
BASE_URL = os.getenv("KLAVIYO_API_URL", "https://a.klaviyo.com/").rstrip("/") + "/api/campaign-values-reports"

class APIService:
    @staticmethod
    def fetch_campaign_values_report(campaign_id: str, timeframe: str, conversion_metric_id: str, max_retries=3):
        """
        Fetch campaign values report from Klaviyo API with 30-second delay pattern
        """
        payload = {
            "data": {
                "type": "campaign-values-report",
                "attributes": {
                    "statistics": ["recipients", "open_rate", "click_rate", "revenue_per_recipient", "average_order_value"],
                    "timeframe": {"key": timeframe},  
                    "conversion_metric_id": conversion_metric_id,
                    "filter": f"equals(campaign_message_id,'{campaign_id}')"
                }
            }
        }
        
        headers = {
            "Authorization": f"Klaviyo-API-Key {API_KEY}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "REVISION": "2024-07-15",
        }
        
        retries = 0
        while retries < max_retries:
            print(payload)
            response = requests.post(BASE_URL, json=payload, headers=headers)
            print(f"Response status code: {response.status_code}")
            print(f"Response content: {response.text}")
            
            if response.status_code == 429:
                try:
                    error_detail = response.json()["errors"][0]["detail"]
                    wait_time = int(error_detail.split()[-2])
                    
                    if wait_time > 3600:
                        logger.error(f"Rate limit exceeded. API requires waiting {wait_time} seconds ({wait_time/3600:.1f} hours).")
                        logger.error("This suggests we've hit the daily rate limit. Processing will stop for today.")
                        raise Exception("Daily rate limit exceeded. Please try again tomorrow.")
                    
                    logger.warning(f"Rate limited. Waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                    retries += 1
                    continue
                        
                except Exception as e:
                    logger.error(f"Error parsing wait time: {e}")
                    wait_time = 30  
                    logger.warning(f"Rate limited. Waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                    retries += 1
                    continue
                
            if response.status_code >= 400:
                logger.error(f"Request failed with status {response.status_code}: {response.text}")
                logger.error(f"Payload sent: {payload}")
                response.raise_for_status()
                
            return response.json()
            
        raise Exception(f"Failed to fetch report after {max_retries} retries due to rate limiting.")