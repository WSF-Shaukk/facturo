-- Add updated_at column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Make sure all required columns exist and have proper defaults
ALTER TABLE users
ALTER COLUMN email SET NOT NULL,
ALTER COLUMN is_pro SET DEFAULT false,
ALTER COLUMN monthly_invoice_count SET DEFAULT 0,
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP; 