-- Create campaign_jobs table
-- Script generated for data import purposes

CREATE TABLE campaign_jobs (
    id INTEGER,
    created_at TIME WITHOUT TIME ZONE,
    type CHARACTER VARYING,
    channel CHARACTER VARYING,
    timeframe CHARACTER VARYING
);

-- Optional: Add comments to describe the table and columns
COMMENT ON TABLE campaign_jobs IS 'Table to store campaign job information';
COMMENT ON COLUMN campaign_jobs.id IS 'Unique identifier for campaign job';
COMMENT ON COLUMN campaign_jobs.created_at IS 'Time when the campaign job was created';
COMMENT ON COLUMN campaign_jobs.type IS 'Type of campaign job';
COMMENT ON COLUMN campaign_jobs.channel IS 'Channel for the campaign';
COMMENT ON COLUMN campaign_jobs.timeframe IS 'Timeframe for the campaign execution';

-- Optional: If you want to add constraints later, uncomment and modify as needed
-- ALTER TABLE campaign_jobs ADD CONSTRAINT pk_campaign_jobs PRIMARY KEY (id);
-- ALTER TABLE campaign_jobs ALTER COLUMN id SET NOT NULL;
-- ALTER TABLE campaign_jobs ALTER COLUMN created_at SET NOT NULL;
