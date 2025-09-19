import logging
import time
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

from services.database_service import DatabaseService  # <-- add this import

load_dotenv()
logger = logging.getLogger(__name__)

API_KEY = os.getenv("KLAVIYO_PRIVATE_API_KEY")

# Separate base URLs for campaign and flow reports
CAMPAIGN_BASE_URL = os.getenv("KLAVIYO_API_URL", "https://a.klaviyo.com/").rstrip("/") + "/api/campaign-values-reports"
FLOW_BASE_URL = os.getenv("KLAVIYO_API_URL", "https://a.klaviyo.com/").rstrip("/") + "/api/flow-values-reports"


class APIService:
    @staticmethod
    def fetch_campaign_values_report(campaign_id: str, timeframe: str, conversion_metric_id: str, max_retries=3):
        """
        Fetch campaign values report from Klaviyo API with retry handling + database logging
        """
        payload = {
            "data": {
                "type": "campaign-values-report",
                "attributes": {
                    "statistics": [
                        "recipients",
                        "open_rate",
                        "click_rate",
                        "revenue_per_recipient",
                        "average_order_value",
                        "opens",
                        "clicks",
                        "bounced",
                        "bounce_rate",
                        "delivered",
                        "delivery_rate"
                    ],
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
            "revision": "2025-07-15",
        }

        retries = 0
        while retries < max_retries:
            response = requests.post(CAMPAIGN_BASE_URL, json=payload, headers=headers)

            # Log API call
            DatabaseService.log_api_call(
                status=str(response.status_code),
                response_body=response.json() if response.headers.get("Content-Type") == "application/json" else {"raw": response.text}
            )

            if response.status_code == 429:
                try:
                    error_detail = response.json()["errors"][0]["detail"]
                    wait_time = int(error_detail.split()[-2])

                    if wait_time > 3600:
                        logger.error(f"Rate limit exceeded: {wait_time/3600:.1f} hours. Daily cap hit.")
                        raise Exception("Daily rate limit exceeded. Please try again tomorrow.")

                    logger.warning(f"Rate limited. Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    retries += 1
                    continue

                except Exception as e:
                    logger.error(f"Rate limit parse error: {e}")
                    time.sleep(30)
                    retries += 1
                    continue

            if response.status_code >= 400:
                logger.error(f"Campaign report request failed: {response.status_code} {response.text}")
                logger.error(f"Payload: {payload}")
                response.raise_for_status()

            return response.json()

        raise Exception(f"Failed to fetch campaign report after {max_retries} retries.")

    @staticmethod
    def fetch_flow_report_values(flow_id: str, timeframe: str, conversion_metric_id: str, max_retries=3):
        """
        Fetch flow values report from Klaviyo API with retry handling + database logging
        """
        body = {
            "data": {
                "type": "flow-values-report",
                "attributes": {
                    "statistics": [
                        "bounced_or_failed",
                        "unsubscribe_rate",
                        "opens",
                        "open_rate",
                        "click_rate",
                        "recipients",
                        "revenue_per_recipient",
                        "average_order_value",
                        "clicks",
                        "bounced",
                        "bounce_rate",
                        "delivered",
                        "delivery_rate"
                    ],
                    "timeframe": {"key": timeframe},
                    "conversion_metric_id": conversion_metric_id,
                    "filter": f"equals(flow_id,'{flow_id}')"
                }
            }
        }

        headers = {
            "Authorization": f"Klaviyo-API-Key {API_KEY}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "revision": "2025-07-15",
        }

        logger.info(f"Fetching Flow Report | flow_id={flow_id}, timeframe={timeframe}")

        retries = 0
        while retries < max_retries:
            response = requests.post(FLOW_BASE_URL, headers=headers, json=body)

            # Log API call
            DatabaseService.log_api_call(
                status=str(response.status_code),
                response_body=response.json() if response.headers.get("Content-Type") == "application/json" else {"raw": response.text}
            )

            if response.status_code == 429:
                try:
                    detail = response.json()["errors"][0]["detail"]
                    wait_time = int(detail.split()[-2])
                    logger.warning(f"Rate limit hit. Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                except Exception:
                    logger.warning("Rate limit parse failed, retrying after 30s")
                    time.sleep(30)
                retries += 1
                continue

            if response.status_code == 200:
                data = response.json()
                results = data.get("data", {}).get("attributes", {}).get("results", [])
                logger.info(f"Flow API returned {len(results)} results for flow_id={flow_id}")
                return data

            logger.error(f"Flow report failed ({response.status_code}): {response.text}")
            retries += 1
            time.sleep(5)

        raise Exception(f"Failed to fetch flow report after {max_retries} retries.")
