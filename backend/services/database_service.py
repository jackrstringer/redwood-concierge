# import logging
# from datetime import datetime, timezone
# from sqlalchemy.sql import text
# from sqlalchemy.orm import Session
# from sqlalchemy import and_
# from app.utils.helpers import get_current_utc_time

# from app.core.database import SessionLocal
# from app.models.campaign_models import Campaign, CampaignValuesReport

# logger = logging.getLogger(__name__)

# class DatabaseService:
#     @staticmethod
#     def get_top_campaign_ids(limit=1):
#         """
#         Get top campaign IDs from the database
#         """
#         db: Session = SessionLocal()
#         try:
#             from sqlalchemy import select
#             stmt = select(Campaign.id).limit(limit)
#             result = db.execute(stmt).fetchall()
#             campaign_ids = [row[0] for row in result]
#             logger.info(f"Found {len(campaign_ids)} campaign IDs in the database")
#             return campaign_ids
#         except Exception as e:
#             logger.error(f"Error fetching campaign IDs from database: {e}")
#             return []
#         finally:
#             db.close()

#     @staticmethod
#     def save_campaign_values_report(response, campaign_id):
#         """
#         Save or update campaign values report in the database
#         """
#         db: Session = SessionLocal()
#         try:
#             db.execute(text("SET TIME ZONE 'UTC'"))
            
#             data = response.get("data", {})
#             report_id = data.get("id") 
#             report_type = data.get("type")
            
#             if not report_id:
#                 logger.warning("No data.id found in response")
#                 return
            
#             attributes = data.get("attributes", {})
#             results = attributes.get("results", [])
#             timeframe = attributes.get("timeframe", {}).get("key", "last_7_days")
            
#             relationships = data.get("relationships", {})
#             campaigns_data = relationships.get("campaigns", {}).get("data", [])
#             campaign_relationship_id = None
#             if campaigns_data and len(campaigns_data) > 0:
#                 campaign_relationship_id = campaigns_data[0].get("id")
            
#             campaign_message_id = campaign_id
#             if results:
#                 result = results[0]
#                 groupings = result.get("groupings", {})
#                 campaign_message_id = groupings.get("campaign_message_id", campaign_id)
            
#             existing_report = db.query(CampaignValuesReport).filter(
#                 and_(
#                     CampaignValuesReport.campaign_message_id == campaign_message_id,
#                     CampaignValuesReport.timeframe == timeframe
#                 )
#             ).first()
            
#             conversion_metric_id = attributes.get("conversion_metric_id", "")
#             current_utc_time = datetime.now(timezone.utc)
            
#             if existing_report:
#                 DatabaseService._update_existing_report(
#                     existing_report, results, campaign_id, campaign_relationship_id, 
#                     timeframe, conversion_metric_id, report_id, current_utc_time
#                 )
#                 logger.info(f"Updated report for campaign_message_id {campaign_message_id} with timeframe {timeframe}")
#             else:
#                 report = DatabaseService._create_new_report(
#                     report_id, report_type, results, campaign_id, campaign_message_id, 
#                     campaign_relationship_id, timeframe, conversion_metric_id, current_utc_time
#                 )
#                 db.add(report)
#                 logger.info(f"Added new report for campaign_message_id {campaign_message_id} with timeframe {timeframe}")
            
#             db.commit()
#         except Exception as e:
#             logger.error(f"Error saving to database: {e}")
#             db.rollback()
#         finally:
#             db.close()

#     @staticmethod
#     def _update_existing_report(existing_report, results, campaign_id, campaign_relationship_id, 
#                                timeframe, conversion_metric_id, report_id, current_utc_time):
#         """Helper method to update an existing report"""
#         if results:
#             result = results[0] 
#             groupings = result.get("groupings", {})
#             statistics = result.get("statistics", {})
            
#             existing_report.campaign_id = groupings.get("campaign_id")
#             existing_report.campaign_message_id = groupings.get("campaign_message_id")
#             existing_report.send_channel = groupings.get("send_channel")
#             existing_report.campaign_relationship_id = campaign_relationship_id
#             existing_report.recipients = statistics.get("recipients")
#             existing_report.open_rate = statistics.get("open_rate")
#             existing_report.click_rate = statistics.get("click_rate")
#             existing_report.revenue_per_recipient = statistics.get("revenue_per_recipient")
#             existing_report.average_order_value = statistics.get("average_order_value")
#         else:
#             existing_report.campaign_id = campaign_id
#             existing_report.campaign_message_id = campaign_id
#             existing_report.send_channel = None
#             existing_report.campaign_relationship_id = campaign_relationship_id
#             existing_report.recipients = 0
#             existing_report.open_rate = 0
#             existing_report.click_rate = 0
#             existing_report.revenue_per_recipient = 0
#             existing_report.average_order_value = 0
        
#         existing_report.timeframe = timeframe 
#         existing_report.conversion_metric_id = conversion_metric_id
#         existing_report.report_id = report_id  
#         existing_report.updated_at = current_utc_time

#     @staticmethod
#     def _create_new_report(report_id, report_type, results, campaign_id, campaign_message_id, 
#                            campaign_relationship_id, timeframe, conversion_metric_id, current_utc_time):
#         """Helper method to create a new report"""
#         if results:
#             result = results[0] 
#             groupings = result.get("groupings", {})
#             statistics = result.get("statistics", {})
            
#             return CampaignValuesReport(
#                 report_id=report_id,  
#                 report_type=report_type,  
#                 campaign_id=groupings.get("campaign_id"),
#                 campaign_message_id=groupings.get("campaign_message_id"),
#                 send_channel=groupings.get("send_channel"),
#                 campaign_relationship_id=campaign_relationship_id,
#                 timeframe=timeframe,  
#                 conversion_metric_id=conversion_metric_id,
#                 recipients=statistics.get("recipients"),
#                 open_rate=statistics.get("open_rate"),
#                 click_rate=statistics.get("click_rate"),
#                 revenue_per_recipient=statistics.get("revenue_per_recipient"),
#                 average_order_value=statistics.get("average_order_value"),
#                 created_at=current_utc_time,
#             )
#         else:
#             return CampaignValuesReport(
#                 report_id=report_id,  
#                 report_type=report_type,  
#                 campaign_id=campaign_id,
#                 campaign_message_id=campaign_id,
#                 send_channel=None,
#                 campaign_relationship_id=campaign_relationship_id,
#                 timeframe=timeframe,  
#                 conversion_metric_id=conversion_metric_id,
#                 recipients=0,
#                 open_rate=0,
#                 click_rate=0,
#                 revenue_per_recipient=0,
#                 average_order_value=0,
#                 created_at=current_utc_time,
#             )

import logging
from datetime import datetime, timezone
from sqlalchemy.sql import text
from sqlalchemy.orm import Session
from sqlalchemy import and_
from utils.helpers import get_current_utc_time
from core.database import SessionLocal
from models.campaign_models import Campaign, CampaignValuesReport

logger = logging.getLogger(__name__)

class DatabaseService:
    @staticmethod
    def get_top_campaign_ids(limit=15):
        """
        Get top campaign IDs from the database
        """
        db: Session = SessionLocal()
        try:
            from sqlalchemy import select
            stmt = select(Campaign.id).limit(limit)
            result = db.execute(stmt).fetchall()
            campaign_ids = [row[0] for row in result]
            logger.info(f"Found {len(campaign_ids)} campaign IDs in the database")
            return campaign_ids
        except Exception as e:
            logger.error(f"Error fetching campaign IDs from database: {e}")
            return []
        finally:
            db.close()
    
    @staticmethod
    def save_campaign_values_report(response, campaign_id, conversion_metric_id=None):
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
            timeframe = attributes.get("timeframe", {}).get("key", "last_7_days")
            
            relationships = data.get("relationships", {})
            campaigns_data = relationships.get("campaigns", {}).get("data", [])
            campaign_relationship_id = None
            if campaigns_data and len(campaigns_data) > 0:
                campaign_relationship_id = campaigns_data[0].get("id")
            
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
            
            # Use the passed conversion_metric_id if provided, otherwise try to get it from attributes
            if conversion_metric_id is None:
                conversion_metric_id = attributes.get("conversion_metric_id", "")
            
            current_utc_time = datetime.now(timezone.utc)
            
            if existing_report:
                DatabaseService._update_existing_report(
                    existing_report, results, campaign_id, campaign_relationship_id, 
                    timeframe, conversion_metric_id, report_id, current_utc_time
                )
                logger.info(f"Updated report for campaign_message_id {campaign_message_id} with timeframe {timeframe}")
            else:
                report = DatabaseService._create_new_report(
                    report_id, report_type, results, campaign_id, campaign_message_id, 
                    campaign_relationship_id, timeframe, conversion_metric_id, current_utc_time
                )
                db.add(report)
                logger.info(f"Added new report for campaign_message_id {campaign_message_id} with timeframe {timeframe}")
            
            db.commit()
        except Exception as e:
            logger.error(f"Error saving to database: {e}")
            db.rollback()
        finally:
            db.close()
    
    @staticmethod
    def _update_existing_report(existing_report, results, campaign_id, campaign_relationship_id, 
                               timeframe, conversion_metric_id, report_id, current_utc_time):
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
    
    @staticmethod
    def _create_new_report(report_id, report_type, results, campaign_id, campaign_message_id, 
                           campaign_relationship_id, timeframe, conversion_metric_id, current_utc_time):
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
            )