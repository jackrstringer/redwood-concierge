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

logger = logging.getLogger(__name__)

class DatabaseService:
    # --- CAMPAIGNS METHODS ---
    @staticmethod
    def get_top_campaign_ids(limit=2):
        """
        Get top campaign IDs from the database where status = 'Sent'
        """
        db: Session = SessionLocal()
        try:
            from sqlalchemy import select
            stmt = select(Campaign.id).where(Campaign.status == "Sent")
            result = db.execute(stmt).fetchall()
            campaign_ids = [row[0] for row in result]
            logger.info(f"Found {len(campaign_ids)} campaign IDs with status='Sent'")
            return campaign_ids
        except Exception as e:
            logger.error(f"Error fetching campaign IDs: {e}")
            return []
        finally:
            db.close()

    @staticmethod
    def save_campaign_values_report(response, campaign_id, timeframe, conversion_metric_id=None, job_id=None):
        """
        Save or update campaign values report in the database
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

            existing_report = db.query(CampaignValuesReport).filter(
                and_(
                    CampaignValuesReport.campaign_message_id == campaign_message_id,
                    CampaignValuesReport.timeframe == timeframe
                )
            ).first()

            if conversion_metric_id is None:
                conversion_metric_id = attributes.get("conversion_metric_id", "")

            current_utc_time = get_current_utc_time()

            if existing_report:
                DatabaseService._update_existing_report(
                    existing_report, results, campaign_id, campaign_relationship_id, 
                    timeframe, conversion_metric_id, report_id, current_utc_time, job_id
                )
                logger.info(f"Updated report for campaign_message_id {campaign_message_id} / timeframe {timeframe}")
            else:
                report = DatabaseService._create_new_report(
                    report_id, report_type, results, campaign_id, campaign_message_id, 
                    campaign_relationship_id, timeframe, conversion_metric_id, current_utc_time, job_id
                )
                db.add(report)
                db.flush()  # 🔑 ensures created_at is written immediately
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
    def get_completed_jobs(limit=2):
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
    def get_top_flow_ids(limit=2):
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
        Save or update flow values report in the database.
        Handles multiple results from Klaviyo API and aggregates statistics.
        """
        db: Session = SessionLocal()
        try:
            db.execute(text("SET TIME ZONE 'UTC'"))

            # Normalize timeframe (avoid duplicates like Last_7_Days vs last_7_days)
            timeframe = timeframe.lower().strip()

            data = report_data.get("data", {})
            attributes = data.get("attributes", {})
            results = attributes.get("results", [])

            logger.info(f"Processing {len(results)} results for flow_id {flow_id}")

            # Fallback save if no results
            if not results:
                logger.warning(f"No results found for flow_id {flow_id}")
                current_time = get_current_utc_time()
                existing_report = db.query(FlowValuesReport).filter(
                    and_(
                        FlowValuesReport.flow_id == flow_id,
                        FlowValuesReport.timeframe == timeframe
                    )
                ).first()

                if existing_report:
                    existing_report.raw_data = report_data
                    existing_report.updated_at = current_time
                    existing_report.job_id = job_id.id if job_id else None
                else:
                    flow_report = FlowValuesReport(
                        flow_id=flow_id,
                        timeframe=timeframe,
                        conversion_metric_id=conversion_metric_id,
                        job_id=job_id.id if job_id else None,
                        raw_data=report_data,
                        created_at=current_time,
                        updated_at=current_time
                    )
                    db.add(flow_report)

                db.commit()
                logger.info(f"Saved empty flow report for flow_id {flow_id} / timeframe {timeframe}")
                return

            # --- Aggregate statistics ---
            aggregated_stats = {
                "bounced_or_failed": 0,
                "unsubscribe_rate": 0,
                "opens": 0,
                "open_rate": 0,
                "click_rate": 0,
                "recipients": 0,
                "revenue_per_recipient": 0,
                "average_order_value": 0
            }

            total_recipients = 0
            total_opens = 0
            total_revenue = 0
            total_orders = 0
            weighted_unsubscribe_rate = 0
            weighted_click_rate = 0

            for result in results:
                groupings = result.get("groupings", {})
                statistics = result.get("statistics", {})

                flow_message_id = groupings.get("flow_message_id")
                send_channel = groupings.get("send_channel")

                logger.debug(f"Processing result: flow_message_id={flow_message_id}, send_channel={send_channel}")
                logger.debug(f"Statistics: {statistics}")

                # Extract stats safely
                recipients = statistics.get("recipients", 0) or 0
                opens = statistics.get("opens", 0) or 0
                bounced = statistics.get("bounced_or_failed", 0) or 0
                unsub_rate = statistics.get("unsubscribe_rate", 0) or 0
                click_rate = statistics.get("click_rate", 0) or 0
                revenue_per_recipient = statistics.get("revenue_per_recipient", 0) or 0
                avg_order_value = statistics.get("average_order_value", 0) or 0

                # Aggregate totals
                aggregated_stats["bounced_or_failed"] += bounced
                aggregated_stats["opens"] += opens
                aggregated_stats["recipients"] += recipients

                total_recipients += recipients
                total_opens += opens
                total_revenue += revenue_per_recipient * recipients

                # Weighted averages
                if recipients > 0:
                    weighted_unsubscribe_rate += unsub_rate * recipients
                    weighted_click_rate += click_rate * recipients
                    if avg_order_value > 0:
                        total_orders += recipients * (revenue_per_recipient / avg_order_value)

            # Calculate weighted averages
            if total_recipients > 0:
                aggregated_stats["unsubscribe_rate"] = weighted_unsubscribe_rate / total_recipients
                aggregated_stats["open_rate"] = total_opens / total_recipients
                aggregated_stats["click_rate"] = weighted_click_rate / total_recipients
                aggregated_stats["revenue_per_recipient"] = total_revenue / total_recipients
                if total_orders > 0:
                    aggregated_stats["average_order_value"] = total_revenue / total_orders

            logger.info(f"Aggregated statistics for flow {flow_id}: {aggregated_stats}")

            # --- Upsert into DB ---
            current_time = get_current_utc_time()
            existing_report = db.query(FlowValuesReport).filter(
                and_(
                    FlowValuesReport.flow_id == flow_id,
                    FlowValuesReport.timeframe == timeframe
                )
            ).first()

            if existing_report:
                # Update
                existing_report.bounced_or_failed = int(aggregated_stats["bounced_or_failed"])
                existing_report.unsubscribe_rate = aggregated_stats["unsubscribe_rate"]
                existing_report.opens = int(aggregated_stats["opens"])
                existing_report.open_rate = aggregated_stats["open_rate"]
                existing_report.click_rate = aggregated_stats["click_rate"]
                existing_report.recipients = int(aggregated_stats["recipients"])
                existing_report.revenue_per_recipient = aggregated_stats["revenue_per_recipient"]
                existing_report.average_order_value = aggregated_stats["average_order_value"]
                existing_report.raw_data = report_data
                existing_report.updated_at = current_time
                existing_report.job_id = job_id.id if job_id else None
                logger.info(f"Updated flow report for flow_id={flow_id}, timeframe={timeframe}")
            else:
                # Insert new
                flow_report = FlowValuesReport(
                    flow_id=flow_id,
                    timeframe=timeframe,
                    conversion_metric_id=conversion_metric_id,
                    job_id=job_id.id if job_id else None,
                    bounced_or_failed=int(aggregated_stats["bounced_or_failed"]),
                    unsubscribe_rate=aggregated_stats["unsubscribe_rate"],
                    opens=int(aggregated_stats["opens"]),
                    open_rate=aggregated_stats["open_rate"],
                    click_rate=aggregated_stats["click_rate"],
                    recipients=int(aggregated_stats["recipients"]),
                    revenue_per_recipient=aggregated_stats["revenue_per_recipient"],
                    average_order_value=aggregated_stats["average_order_value"],
                    raw_data=report_data,
                    created_at=current_time,
                    updated_at=current_time
                )
                db.add(flow_report)
                logger.info(f"Inserted new flow report for flow_id={flow_id}, timeframe={timeframe}")

            db.commit()
            logger.info(
                f"Saved flow report | flow_id={flow_id}, timeframe={timeframe}, "
                f"recipients={aggregated_stats['recipients']}, opens={aggregated_stats['opens']}, "
                f"rev/recip=${aggregated_stats['revenue_per_recipient']:.2f}"
            )

        except Exception as e:
            logger.error(f"Error saving flow report for flow_id {flow_id}: {e}")
            db.rollback()
        finally:
            db.close()
