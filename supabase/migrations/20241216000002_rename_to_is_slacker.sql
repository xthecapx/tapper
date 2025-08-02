-- Rename is_exercise to is_slacker and flip the boolean logic
-- This makes the logic more intuitive: track negative behaviors consistently

-- First rename the column
ALTER TABLE tapper_logs RENAME COLUMN is_exercise TO is_slacker;

-- Flip the boolean values to match the new slacker logic
UPDATE tapper_logs 
SET is_slacker = CASE 
  WHEN is_slacker IS NULL THEN NULL          -- Keep old records as NULL (not tracked)
  WHEN is_slacker = true THEN false          -- Was exercising -> not slacker  
  WHEN is_slacker = false THEN true          -- Was not exercising -> is slacker
END;

-- Update the comment to reflect the new logic
COMMENT ON COLUMN tapper_logs.is_slacker IS 'Whether the user was a slacker (no exercise) on this date. NULL = not tracked (old records), false = exercised, true = slacker';

-- Update indexes
DROP INDEX IF EXISTS idx_tapper_logs_exercise;
CREATE INDEX idx_tapper_logs_slacker ON tapper_logs(is_slacker) WHERE is_slacker = true;