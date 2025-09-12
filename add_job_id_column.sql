-- Add job_id column to campaign_report_values table
-- This column will link campaign reports to the jobs that generated them

ALTER TABLE campaign_report_values 
ADD COLUMN job_id INTEGER;
