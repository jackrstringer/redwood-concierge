# backend/flows_value_report_script_fixed.py
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import logging
import time
import argparse
import signal
import sys
from dotenv import load_dotenv
from core.database import SessionLocal, Base, engine
from models.flow_models import Flow, FlowValuesReport
from services.api_service import APIService
from services.database_service import DatabaseService
from utils.helpers import get_environment_variables

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global flag for graceful shutdown
should_continue = True

def signal_handler(signum, frame):
    global should_continue
    logger.info("Received interrupt signal. Finishing current flow and stopping...")
    should_continue = False

def run_flow_values_report(timeframe: str = "last_30_days", max_flows: int = None):
    """Main process to fetch and save flow values report"""
    global should_continue
    
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    env_vars = get_environment_variables()
    
    # ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # get live metric flows from DB (filtered by status='live' and trigger_type='Metric')
    flow_ids = DatabaseService.get_top_flow_ids()
    
    # Limit flows if specified
    if max_flows:
        flow_ids = flow_ids[:max_flows]
        logger.info(f"Limited to first {max_flows} flows for testing")
    
    if not flow_ids:
        logger.warning("No live metric flows found in the database (status='live' and trigger_type='Metric'). Exiting.")
        return

    logger.info(f"Will process {len(flow_ids)} live metric flows for timeframe: {timeframe}")
    
    # create a job record
    job_id = DatabaseService.create_new_job(
        type="flow_report_values", channel="", timeframe=timeframe
    )
    if not job_id:
        logger.error("Failed to create job. Exiting.")
        return

    request_delay = 30
    logger.info(f"Waiting {request_delay} seconds before starting requests...")
    time.sleep(request_delay)
    
    processed_count = 0
    saved_count = 0
    skipped_count = 0
    error_count = 0
    
    try:
        for i, flow_id in enumerate(flow_ids):
            if not should_continue:
                logger.info("Stopping processing due to interrupt signal")
                break
                
            try:
                logger.info(f"Processing flow ID: {flow_id} ({i+1}/{len(flow_ids)})")
                
                # fetch report from API
                report = APIService.fetch_flow_report_values(
                    flow_id=flow_id,
                    timeframe=timeframe,
                    conversion_metric_id=env_vars["conversion_metric_id"],
                    job_id=job_id.id if job_id else None
                )

                # Save report data if API call was successful
                if report:
                    logger.info(f"Flow {flow_id} returned data, saving...")
                    # save to DB (will handle empty results internally)
                    DatabaseService.save_flow_report_values(
                        report, flow_id, timeframe,
                        conversion_metric_id=env_vars["conversion_metric_id"],
                        job_id=job_id
                    )
                    saved_count += 1
                    logger.info(f"✓ Successfully saved flow ID: {flow_id}")
                else:
                    logger.warning(f"No report data for flow {flow_id}")
                    skipped_count += 1

                processed_count += 1
                
                # Add delay between requests
                if i < len(flow_ids) - 1 and should_continue:
                    logger.info(f"Waiting {request_delay} seconds before next request...")
                    time.sleep(request_delay)
                    
            except Exception as e:
                error_count += 1
                if "Daily rate limit exceeded" in str(e):
                    logger.error("Daily rate limit exceeded. Stopping processing for today.")
                    break
                logger.error(f"Failed to process flow ID {flow_id}: {e}")
                if i < len(flow_ids) - 1 and should_continue:
                    logger.info(f"Waiting {request_delay} seconds before next request after error...")
                    time.sleep(request_delay)
                    
    except KeyboardInterrupt:
        logger.info("Received KeyboardInterrupt. Stopping gracefully...")
    except Exception as e:
        logger.error(f"Unexpected error in main loop: {e}")
    finally:
        # Print summary
        logger.info(f"\n=== Processing Summary ===")
        logger.info(f"Flows processed: {processed_count}/{len(flow_ids)}")
        logger.info(f"Flows saved: {saved_count}")
        logger.info(f"Flows skipped: {skipped_count}")
        logger.info(f"Errors: {error_count}")
        
        # Mark job as completed
        if job_id:
            logger.info(f"Marking job {job_id.id} as completed")
            DatabaseService.mark_job_completed(job_id.id)
            logger.info(f"Job {job_id.id} marked as completed")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch flow values report for specified timeframe")
    parser.add_argument(
        "--timeframe", 
        type=str, 
        default="last_7_days",
        help="Timeframe for the flow values report (e.g. last_7_days, last_30_days)"
    )
    parser.add_argument(
        "--max-flows", 
        type=int, 
        default=None,
        help="Maximum number of flows to process (for testing)"
    )
    
    args = parser.parse_args()
    logger.info(f"Starting flow values report script with timeframe: {args.timeframe}")
    if args.max_flows:
        logger.info(f"Limited to {args.max_flows} flows for testing")
    
    run_flow_values_report(args.timeframe, args.max_flows)
