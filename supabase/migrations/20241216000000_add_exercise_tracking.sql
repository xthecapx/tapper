-- Add exercise tracking to the existing system
-- This migration adds exercise logging capability alongside tapper tracking

-- Add exercise column to existing tapper_logs table
ALTER TABLE tapper_logs ADD COLUMN is_exercise boolean DEFAULT false;

-- Update the unique constraint to allow multiple entries per day
-- (one for tapper, one for exercise, or both in same record)
ALTER TABLE tapper_logs DROP CONSTRAINT tapper_logs_user_id_log_date_key;

-- Add a new constraint that prevents duplicate records for the same user, date, and activity type
-- We'll use a composite unique constraint on user_id, log_date, and activity_type
-- First, add an activity_type column to differentiate between tapper and exercise logs
ALTER TABLE tapper_logs ADD COLUMN activity_type text CHECK (activity_type IN ('tapper', 'exercise', 'both')) DEFAULT 'tapper';

-- For existing records, set activity_type based on is_tapper value
UPDATE tapper_logs SET activity_type = 'tapper' WHERE is_tapper = true;

-- Now we'll restructure to allow both activities per day
-- Drop the old constraint and create a new approach

-- Actually, let's keep it simple and allow both flags in the same record
-- Remove the activity_type column we just added since we can use both boolean flags
ALTER TABLE tapper_logs DROP COLUMN activity_type;

-- Create a unique constraint that allows one record per user per date
ALTER TABLE tapper_logs ADD CONSTRAINT tapper_logs_user_date_unique UNIQUE(user_id, log_date);

-- Add indexes for better query performance
CREATE INDEX idx_tapper_logs_exercise ON tapper_logs(is_exercise) WHERE is_exercise = true;
CREATE INDEX idx_tapper_logs_user_date ON tapper_logs(user_id, log_date);

-- Update the existing policies to handle exercise tracking
-- The existing policies already allow everyone to read and modify logs, so they'll work for exercise too

-- Add a comment to document the table structure
COMMENT ON TABLE tapper_logs IS 'Tracks daily activities: tapper (junk food) and exercise status for users';
COMMENT ON COLUMN tapper_logs.is_tapper IS 'Whether the user had tapper (junk food) on this date';
COMMENT ON COLUMN tapper_logs.is_exercise IS 'Whether the user exercised on this date';