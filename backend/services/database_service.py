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
        Get flow IDs from the database where status='live' and trigger_type='Metric'
        ordered by creation date descending
        """
        db: Session = SessionLocal()
        try:
            flows = (
                db.query(Flow.id)
                .filter(Flow.status == 'live')
                #.filter(Flow.trigger_type == 'Metric')
                .order_by(Flow.created.desc())
                .all()
            )
            flow_ids = [f[0] for f in flows]
            logger.info(f"Found {len(flow_ids)} live metric flows")
            return flow_ids
        except Exception as e:
            logger.error(f"Error fetching live metric flow IDs: {e}")
            return []
        finally:
            db.close()

    @staticmethod
    def save_flow_report_values(report_data, flow_id, timeframe, conversion_metric_id=None, job_id=None):
        """
        Insert flow values report into the database (insert-only, no updates).
        Handles multiple results from Klaviyo API and aggregates statistics.
        - Sums count metrics across results
        - Computes weighted averages for rate metrics (weighted by recipients when available)
        - Computes revenue_per_recipient and average_order_value based on totals
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
                logger.info(f"No results found for flow_id {flow_id}, saving empty record with NULL values.")

            # Define metric categories
            count_metrics = [
                "recipients", "opens", "clicks", "bounced", "delivered",
                "bounced_or_failed", "clicks_unique", "conversion_uniques",
                "conversions", "failed", "opens_unique", "spam_complaints",
                "unsubscribe_uniques", "unsubscribes"
            ]
            rate_metrics = [
                "open_rate", "click_rate", "bounce_rate", "delivery_rate",
                "bounced_or_failed_rate", "click_to_open_rate", "conversion_rate",
                "failed_rate", "spam_complaint_rate", "unsubscribe_rate"
            ]
            value_metrics = [
                "revenue_per_recipient", "average_order_value", "conversion_value"
            ]

            # Aggregation accumulators
            aggregated_counts = {m: 0 for m in count_metrics}
            # Weighted sums for rates
            weighted_rate_sums = {m: 0.0 for m in rate_metrics}
            weighted_rate_weights = 0
            # Totals for computing value metrics
            total_recipients = 0
            total_revenue = 0.0
            total_orders_est = 0.0

            for result in results:
                stats = result.get("statistics", {}) or {}
                recipients = (stats.get("recipients") or 0) or 0

                # Sum counts
                for m in count_metrics:
                    v = stats.get(m)
                    if v is not None:
                        try:
                            aggregated_counts[m] += int(v)
                        except Exception:
                            # Some counts may come as strings or decimals, coerce safely
                            try:
                                aggregated_counts[m] += int(float(v))
                            except Exception:
                                pass

                # Weighted average for rates using recipients as weight when available
                weight = recipients if recipients and recipients > 0 else 0
                if weight > 0:
                    for m in rate_metrics:
                        rv = stats.get(m)
                        if rv is not None:
                            try:
                                weighted_rate_sums[m] += float(rv) * weight
                                # Only add weight once per result
                            except Exception:
                                pass
                    weighted_rate_weights += weight

                # Handle value metrics via totals
                rpr = stats.get("revenue_per_recipient") or 0
                aov = stats.get("average_order_value") or 0
                conv_value = stats.get("conversion_value") or 0

                # revenue total = recipients * revenue_per_recipient
                try:
                    total_revenue += float(rpr) * float(recipients)
                except Exception:
                    pass

                # Estimate orders = revenue / AOV
                try:
                    if aov and float(aov) > 0:
                        total_orders_est += (float(rpr) * float(recipients)) / float(aov)
                except Exception:
                    pass

                total_recipients += recipients

            # Compute final aggregated values
            aggregated_values = {}
            aggregated_values.update(aggregated_counts)

            # Rates as weighted averages
            for m in rate_metrics:
                if weighted_rate_weights > 0 and weighted_rate_sums[m] != 0:
                    aggregated_values[m] = weighted_rate_sums[m] / weighted_rate_weights
                else:
                    aggregated_values[m] = None

            # Value metrics
            if total_recipients > 0:
                aggregated_values["revenue_per_recipient"] = total_revenue / total_recipients
            else:
                aggregated_values["revenue_per_recipient"] = None

            if total_orders_est > 0:
                try:
                    aggregated_values["average_order_value"] = total_revenue / total_orders_est
                except Exception:
                    aggregated_values["average_order_value"] = None
            else:
                aggregated_values["average_order_value"] = None

            # For conversion_value, sum directly if present in any results
            # If not present, leave as None
            conv_value_total = 0.0
            conv_value_seen = False
            for result in results:
                stats = result.get("statistics", {}) or {}
                cv = stats.get("conversion_value")
                if cv is not None:
                    try:
                        conv_value_total += float(cv)
                        conv_value_seen = True
                    except Exception:
                        pass
            aggregated_values["conversion_value"] = conv_value_total if conv_value_seen else None

            current_time = get_current_utc_time()

            # Insert-only with full field mapping
            flow_report = FlowValuesReport(
                flow_id=flow_id,
                timeframe=timeframe,
                conversion_metric_id=conversion_metric_id or "",
                job_id=job_id.id if job_id else None,
                # counts
                bounced_or_failed=aggregated_values.get("bounced_or_failed"),
                opens=aggregated_values.get("opens"),
                clicks=aggregated_values.get("clicks"),
                bounced=aggregated_values.get("bounced"),
                delivered=aggregated_values.get("delivered"),
                clicks_unique=aggregated_values.get("clicks_unique"),
                conversion_uniques=aggregated_values.get("conversion_uniques"),
                conversions=aggregated_values.get("conversions"),
                failed=aggregated_values.get("failed"),
                opens_unique=aggregated_values.get("opens_unique"),
                spam_complaints=aggregated_values.get("spam_complaints"),
                unsubscribe_uniques=aggregated_values.get("unsubscribe_uniques"),
                unsubscribes=aggregated_values.get("unsubscribes"),
                recipients=aggregated_values.get("recipients"),
                # rates
                open_rate=aggregated_values.get("open_rate"),
                click_rate=aggregated_values.get("click_rate"),
                bounce_rate=aggregated_values.get("bounce_rate"),
                delivery_rate=aggregated_values.get("delivery_rate"),
                bounced_or_failed_rate=aggregated_values.get("bounced_or_failed_rate"),
                click_to_open_rate=aggregated_values.get("click_to_open_rate"),
                conversion_rate=aggregated_values.get("conversion_rate"),
                failed_rate=aggregated_values.get("failed_rate"),
                spam_complaint_rate=aggregated_values.get("spam_complaint_rate"),
                unsubscribe_rate=aggregated_values.get("unsubscribe_rate"),
                # values
                revenue_per_recipient=aggregated_values.get("revenue_per_recipient"),
                average_order_value=aggregated_values.get("average_order_value"),
                conversion_value=aggregated_values.get("conversion_value"),
                # meta
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
                     request_body: dict = None, response_body: dict = None, error_message: str = None, job_id: int = None):
        """
        Store an API log entry in the database.
        
        Args:
            status: Status of the API call (success/error)
            endpoint: The API endpoint URL
            script_name: Name of the script making the call
            status_code: HTTP status code
            request_body: Request payload
            response_body: Response data
            error_message: Error message if any
            job_id: ID of the job this API call belongs to
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
                job_id=job_id,
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
