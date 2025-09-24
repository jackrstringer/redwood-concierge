import logging
from datetime import datetime, timezone
from sqlalchemy.sql import text
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.jobs import CampaignJob
from utils.helpers import get_current_utc_time
from core.database import SessionLocal
from models.campaign_models import Campaign, CampaignValuesReport
from models.flow_models import Flow, FlowValuesReport
from models.api_logs import APILog

logger = logging.getLogger(__name__)

class DatabaseService:
    # --- CAMPAIGNS METHODS ---
    @staticmethod
    def get_top_campaign_ids():
        """
        Get all campaign IDs from the database (no status filter).
        """
        db: Session = SessionLocal()
        try:
            from sqlalchemy import select
            stmt = select(Campaign.id)   # removed the WHERE condition
            result = db.execute(stmt).fetchall()
            campaign_ids = [row[0] for row in result]
            logger.info(f"Found {len(campaign_ids)} campaign IDs")
            return campaign_ids
        except Exception as e:
            logger.error(f"Error fetching campaign IDs: {e}")
            return []
        finally:
            db.close()

    @staticmethod
    def get_campaign_ids_by_timeframe(timeframe: str):
        """
        Get campaign IDs based on timeframe using send_time filtering.
        
        Args:
            timeframe (str): 'last_7_days' or 'last_30_days'
            
        Returns:
            list: List of campaign IDs that were sent within the timeframe
        """
        db: Session = SessionLocal()
        try:
            if timeframe == "last_7_days":
                query = text("""
                    SELECT id FROM campaigns
                    WHERE send_time BETWEEN (NOW() AT TIME ZONE 'UTC' - INTERVAL '7 days')
                                        AND (NOW() AT TIME ZONE 'UTC')
                    ORDER BY send_time DESC
                """)
            elif timeframe == "last_30_days":
                query = text("""
                    SELECT id FROM campaigns
                    WHERE send_time BETWEEN (NOW() AT TIME ZONE 'UTC' - INTERVAL '30 days')
                                        AND (NOW() AT TIME ZONE 'UTC')
                    ORDER BY send_time DESC
                """)
            else:
                logger.warning(f"Unknown timeframe '{timeframe}', falling back to all campaigns")
                return DatabaseService.get_top_campaign_ids()
            
            result = db.execute(query).fetchall()
            campaign_ids = [row[0] for row in result]
            logger.info(f"Found {len(campaign_ids)} campaign IDs for timeframe '{timeframe}'")
            
            if not campaign_ids:
                logger.warning(f"No campaigns found for timeframe '{timeframe}'. You may want to check the send_time data or extend the date range.")
            
            return campaign_ids
            
        except Exception as e:
            logger.error(f"Error fetching campaign IDs for timeframe '{timeframe}': {e}")
            # Fallback to the original method if there's an error
            logger.info("Falling back to get_top_campaign_ids()")
            return DatabaseService.get_top_campaign_ids()
        finally:
            db.close()


    @staticmethod
    def save_campaign_values_report(response, campaign_id, timeframe, conversion_metric_id=None, job_id=None):
        """
        Insert campaign values report in the database (insert-only, no updates)
        """
        db: Session = SessionLocal()
        try:
            db.execute(text("SET TIME ZONE 'UTC'"))

            data = response.get("data", {})
            report_id = data.get("id") 
            report_type = data.get("type")

            if not report_id:
                logger.warning("No data.id found in response")
                return

            attributes = data.get("attributes", {})
            results = attributes.get("results", [])

            relationships = data.get("relationships", {})
            campaigns_data = relationships.get("campaigns", {}).get("data", [])
            campaign_relationship_id = campaigns_data[0].get("id") if campaigns_data else None

            campaign_message_id = campaign_id
            if results:
                result = results[0]
                groupings = result.get("groupings", {})
                campaign_message_id = groupings.get("campaign_message_id", campaign_id)

            if conversion_metric_id is None:
                conversion_metric_id = attributes.get("conversion_metric_id", "")

            current_utc_time = get_current_utc_time()

            # --- INSERT ONLY, remove update logic ---
            report = DatabaseService._create_new_report(
                report_id, report_type, results, campaign_id, campaign_message_id, 
                campaign_relationship_id, timeframe, conversion_metric_id, current_utc_time, job_id
            )
            db.add(report)
            db.flush()
            logger.info(f"Added new report for campaign_message_id {campaign_message_id} / timeframe {timeframe}")

            db.commit()
        except Exception as e:
            logger.error(f"Error saving campaign values report: {e}")
            db.rollback()
        finally:
            db.close()

    @staticmethod
    def _update_existing_report(existing_report, results, campaign_id, campaign_relationship_id, 
                               timeframe, conversion_metric_id, report_id, current_utc_time, job_id):
        """Helper method to update an existing report"""
        if results:
            result = results[0] 
            groupings = result.get("groupings", {})
            statistics = result.get("statistics", {})

            existing_report.campaign_id = groupings.get("campaign_id")
            existing_report.campaign_message_id = groupings.get("campaign_message_id")
            existing_report.send_channel = groupings.get("send_channel")
            existing_report.campaign_relationship_id = campaign_relationship_id
            existing_report.recipients = statistics.get("recipients")
            existing_report.open_rate = statistics.get("open_rate")
            existing_report.click_rate = statistics.get("click_rate")
            existing_report.revenue_per_recipient = statistics.get("revenue_per_recipient")
            existing_report.average_order_value = statistics.get("average_order_value")
            existing_report.opens = statistics.get("opens")
            existing_report.clicks = statistics.get("clicks")
            existing_report.bounced = statistics.get("bounced")
            existing_report.bounce_rate = statistics.get("bounce_rate")
            existing_report.delivered = statistics.get("delivered")
            existing_report.delivery_rate = statistics.get("delivery_rate")
            # Additional new statistics fields
            existing_report.bounced_or_failed = statistics.get("bounced_or_failed")
            existing_report.bounced_or_failed_rate = statistics.get("bounced_or_failed_rate")
            existing_report.click_to_open_rate = statistics.get("click_to_open_rate")
            existing_report.clicks_unique = statistics.get("clicks_unique")
            existing_report.conversion_rate = statistics.get("conversion_rate")
            existing_report.conversion_uniques = statistics.get("conversion_uniques")
            existing_report.conversion_value = statistics.get("conversion_value")
            existing_report.conversions = statistics.get("conversions")
            existing_report.failed = statistics.get("failed")
            existing_report.failed_rate = statistics.get("failed_rate")
            existing_report.opens_unique = statistics.get("opens_unique")
            existing_report.spam_complaint_rate = statistics.get("spam_complaint_rate")
            existing_report.spam_complaints = statistics.get("spam_complaints")
            existing_report.unsubscribe_rate = statistics.get("unsubscribe_rate")
            existing_report.unsubscribe_uniques = statistics.get("unsubscribe_uniques")
            existing_report.unsubscribes = statistics.get("unsubscribes")
        else:
            existing_report.campaign_id = campaign_id
            existing_report.campaign_message_id = campaign_id
            existing_report.send_channel = None
            existing_report.campaign_relationship_id = campaign_relationship_id
            existing_report.recipients = 0
            existing_report.open_rate = 0
            existing_report.click_rate = 0
            existing_report.revenue_per_recipient = 0
            existing_report.average_order_value = 0
            existing_report.opens = 0
            existing_report.clicks = 0
            existing_report.bounced = 0
            existing_report.bounce_rate = 0
            existing_report.delivered = 0
            existing_report.delivery_rate = 0
            # Additional new statistics fields defaults
            existing_report.bounced_or_failed = 0
            existing_report.bounced_or_failed_rate = 0
            existing_report.click_to_open_rate = 0
            existing_report.clicks_unique = 0
            existing_report.conversion_rate = 0
            existing_report.conversion_uniques = 0
            existing_report.conversion_value = 0
            existing_report.conversions = 0
            existing_report.failed = 0
            existing_report.failed_rate = 0
            existing_report.opens_unique = 0
            existing_report.spam_complaint_rate = 0
            existing_report.spam_complaints = 0
            existing_report.unsubscribe_rate = 0
            existing_report.unsubscribe_uniques = 0
            existing_report.unsubscribes = 0

        existing_report.timeframe = timeframe 
        existing_report.conversion_metric_id = conversion_metric_id
        existing_report.report_id = report_id  
        existing_report.updated_at = current_utc_time
        existing_report.job_id = job_id.id if job_id else None

    @staticmethod
    def _create_new_report(report_id, report_type, results, campaign_id, campaign_message_id, 
                           campaign_relationship_id, timeframe, conversion_metric_id, current_utc_time, job_id):
        """Helper method to create a new report"""
        if results:
            result = results[0] 
            groupings = result.get("groupings", {})
            statistics = result.get("statistics", {})

            return CampaignValuesReport(
                report_id=report_id,  
                report_type=report_type,  
                campaign_id=groupings.get("campaign_id"),
                campaign_message_id=groupings.get("campaign_message_id"),
                send_channel=groupings.get("send_channel"),
                campaign_relationship_id=campaign_relationship_id,
                timeframe=timeframe,  
                conversion_metric_id=conversion_metric_id,
                recipients=statistics.get("recipients"),
                open_rate=statistics.get("open_rate"),
                click_rate=statistics.get("click_rate"),
                revenue_per_recipient=statistics.get("revenue_per_recipient"),
                average_order_value=statistics.get("average_order_value"),
                # Note: placed_orders not available from API, will be NULL
                # New fields
                opens=statistics.get("opens"),
                clicks=statistics.get("clicks"),
                bounced=statistics.get("bounced"),
                bounce_rate=statistics.get("bounce_rate"),
                delivered=statistics.get("delivered"),
                delivery_rate=statistics.get("delivery_rate"),
                # Additional new statistics fields
                bounced_or_failed=statistics.get("bounced_or_failed"),
                bounced_or_failed_rate=statistics.get("bounced_or_failed_rate"),
                click_to_open_rate=statistics.get("click_to_open_rate"),
                clicks_unique=statistics.get("clicks_unique"),
                conversion_rate=statistics.get("conversion_rate"),
                conversion_uniques=statistics.get("conversion_uniques"),
                conversion_value=statistics.get("conversion_value"),
                conversions=statistics.get("conversions"),
                failed=statistics.get("failed"),
                failed_rate=statistics.get("failed_rate"),
                opens_unique=statistics.get("opens_unique"),
                spam_complaint_rate=statistics.get("spam_complaint_rate"),
                spam_complaints=statistics.get("spam_complaints"),
                unsubscribe_rate=statistics.get("unsubscribe_rate"),
                unsubscribe_uniques=statistics.get("unsubscribe_uniques"),
                unsubscribes=statistics.get("unsubscribes"),
                created_at=current_utc_time,
                job_id=job_id.id if job_id else None
            )
        else:
            return CampaignValuesReport(
                report_id=report_id,  
                report_type=report_type,  
                campaign_id=campaign_id,
                campaign_message_id=campaign_id,
                send_channel=None,
                campaign_relationship_id=campaign_relationship_id,
                timeframe=timeframe,  
                conversion_metric_id=conversion_metric_id,
                recipients=0,
                open_rate=0,
                click_rate=0,
                revenue_per_recipient=0,
                average_order_value=0,
                # Note: placed_orders not available from API, will be NULL
                # New fields defaults
                opens=0,
                clicks=0,
                bounced=0,
                bounce_rate=0,
                delivered=0,
                delivery_rate=0,
                # Additional new statistics fields defaults
                bounced_or_failed=0,
                bounced_or_failed_rate=0,
                click_to_open_rate=0,
                clicks_unique=0,
                conversion_rate=0,
                conversion_uniques=0,
                conversion_value=0,
                conversions=0,
                failed=0,
                failed_rate=0,
                opens_unique=0,
                spam_complaint_rate=0,
                spam_complaints=0,
                unsubscribe_rate=0,
                unsubscribe_uniques=0,
                unsubscribes=0,
                created_at=current_utc_time,
                job_id=job_id.id if job_id else None
            )

    # --- JOB METHODS ---
    @staticmethod
    def create_new_job(type, channel, timeframe):
        """
        Create a new campaign job in the database.
        Guarantees created_at is saved immediately.
        """
        db: Session = SessionLocal()
        try:
            new_job = CampaignJob(
                type=type,
                channel=channel,
                timeframe=timeframe,
                created_at=get_current_utc_time(),
                completed_at=None 
            )
            db.add(new_job)
            db.flush()  # Ensure created_at is persisted
            db.commit()
            db.refresh(new_job)
            logger.info(f"Created new job with ID {new_job.id} at {new_job.created_at}")
            return new_job
        except Exception as e:
            logger.error(f"Error creating new job: {e}")
            db.rollback()
            return None
        finally:
            db.close()

    @staticmethod
    def mark_job_completed(job_id: int):
        """
        Mark a campaign job as completed by setting completed_at to current UTC time.
        Ensures completed_at >= created_at.
        """
        db: Session = SessionLocal()
        try:
            job = db.query(CampaignJob).filter(CampaignJob.id == job_id).first()
            if not job:
                logger.warning(f"No job found with id={job_id}")
                return None

            now = get_current_utc_time()
            # Handle timezone comparison safely
            if job.created_at:
                # Convert created_at to naive datetime if it's timezone-aware
                created_at_naive = job.created_at.replace(tzinfo=None) if job.created_at.tzinfo else job.created_at
                if now < created_at_naive:
                    now = created_at_naive

            job.completed_at = now
            db.commit()
            db.refresh(job)
            logger.info(f"Job {job_id} marked completed at {job.completed_at}")
            return job
        except Exception as e:
            db.rollback()
            logger.error(f"Error marking job {job_id} as completed: {e}")
            return None
        finally:
            db.close()

    @staticmethod
    def get_completed_jobs():
        """
        Fetch jobs that have been completed (completed_at IS NOT NULL).
        """
        db: Session = SessionLocal()
        try:
            jobs = (
                db.query(CampaignJob)
                .filter(CampaignJob.completed_at.isnot(None))
                .order_by(CampaignJob.completed_at.desc())
                .all()
            )
            logger.info(f"Found {len(jobs)} completed jobs")
            return jobs
        except Exception as e:
            logger.error(f"Error fetching completed jobs: {e}")
            return []
        finally:
            db.close()

    # --- FLOWS METHODS ---
    @staticmethod
    def get_top_flow_ids():
        """
        Get top flow IDs from the database ordered by creation date
        """
        db: Session = SessionLocal()
        try:
            flows = db.query(Flow.id).order_by(Flow.created.desc()).all()
            return [f[0] for f in flows]
        except Exception as e:
            logger.error(f"Error fetching flow IDs: {e}")
            return []
        finally:
            db.close()

    @staticmethod
    def save_flow_report_values(report_data, flow_id, timeframe, conversion_metric_id=None, job_id=None):
        """
        Insert flow values report into the database (insert-only, no updates).
        Handles multiple results from Klaviyo API and aggregates statistics.
        """
        db: Session = SessionLocal()
        try:
            db.execute(text("SET TIME ZONE 'UTC'"))

            # Normalize timeframe
            timeframe = timeframe.lower().strip()

            data = report_data.get("data", {})
            attributes = data.get("attributes", {})
            results = attributes.get("results", [])

            logger.info(f"Processing {len(results)} results for flow_id {flow_id}")

            if not results:
                logger.warning(f"No results found for flow_id {flow_id}, skipping save.")
                return

            # Check if any meaningful stats exist
            has_meaningful_data = any(
                (r.get("statistics", {}).get("recipients", 0) or
                r.get("statistics", {}).get("opens", 0) or
                r.get("statistics", {}).get("clicks", 0) or
                r.get("statistics", {}).get("delivered", 0) or
                r.get("statistics", {}).get("revenue_per_recipient", 0) or
                r.get("statistics", {}).get("conversions", 0))
                for r in results
            )

            if not has_meaningful_data:
                logger.warning(f"No meaningful data found for flow_id {flow_id}, skipping save.")
                return

            # Aggregate statistics
            aggregated_stats = {}
            total_recipients = 0
            total_opens = 0
            total_revenue = 0
            total_orders = 0

            for result in results:
                stats = result.get("statistics", {})
                recipients = stats.get("recipients", 0) or 0
                opens = stats.get("opens", 0) or 0
                revenue_per_recipient = stats.get("revenue_per_recipient", 0) or 0
                avg_order_value = stats.get("average_order_value", 0) or 0

                aggregated_stats.setdefault("recipients", 0)
                aggregated_stats.setdefault("opens", 0)
                aggregated_stats.setdefault("revenue_per_recipient", 0)
                aggregated_stats["recipients"] += recipients
                aggregated_stats["opens"] += opens
                total_recipients += recipients
                total_opens += opens
                total_revenue += revenue_per_recipient * recipients
                if avg_order_value > 0:
                    total_orders += recipients * (revenue_per_recipient / avg_order_value)

            if total_recipients > 0:
                aggregated_stats["revenue_per_recipient"] = total_revenue / total_recipients
                if total_orders > 0:
                    aggregated_stats["average_order_value"] = total_revenue / total_orders

            current_time = get_current_utc_time()

            # Insert-only
            flow_report = FlowValuesReport(
                flow_id=flow_id,
                timeframe=timeframe,
                conversion_metric_id=conversion_metric_id,
                job_id=job_id.id if job_id else None,
                recipients=int(aggregated_stats.get("recipients", 0)),
                opens=int(aggregated_stats.get("opens", 0)),
                revenue_per_recipient=aggregated_stats.get("revenue_per_recipient", 0),
                average_order_value=aggregated_stats.get("average_order_value", 0),
                raw_data=report_data,
                created_at=current_time,
                updated_at=current_time
            )

            db.add(flow_report)
            db.commit()
            logger.info(f"Inserted new flow report for flow_id={flow_id}, timeframe={timeframe}")

        except Exception as e:
            logger.error(f"Error saving flow report for flow_id {flow_id}: {e}")
            db.rollback()
        finally:
            db.close()

    @staticmethod
    def log_api_call(status: str, endpoint: str, script_name: str = None, status_code: int = None, 
                     request_body: dict = None, response_body: dict = None, error_message: str = None):
        """
        Store an API log entry in the database.
        """
        db: Session = SessionLocal()
        try:
            log_entry = APILog(
                script_name=script_name,
                endpoint=endpoint,
                status_code=status_code,
                status=status,
                request_body=request_body,
                response_body=response_body,
                error_message=error_message,
                created_at=get_current_utc_time()
            )
            db.add(log_entry)
            db.commit()
            db.refresh(log_entry)
            logger.info(f"API log saved with id={log_entry.id}, endpoint={endpoint}, status={status}")
            return log_entry
        except Exception as e:
            logger.error(f"Error saving API log: {e}")
            db.rollback()
            return None
        finally:
            db.close()
