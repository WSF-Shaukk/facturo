-- Update invoices table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS business_tin TEXT,
ADD COLUMN IF NOT EXISTS business_rc_number TEXT,
ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(5,2) DEFAULT 7.5,
ADD COLUMN IF NOT EXISTS prices_include_vat BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_terms TEXT DEFAULT 'Due on Receipt',
ADD COLUMN IF NOT EXISTS payment_terms_custom TEXT,
ADD COLUMN IF NOT EXISTS business_phone TEXT,
ADD COLUMN IF NOT EXISTS business_email TEXT,
ADD COLUMN IF NOT EXISTS client_tin TEXT;

-- Drop existing constraints if they exist
ALTER TABLE invoices
DROP CONSTRAINT IF EXISTS valid_tin_format,
DROP CONSTRAINT IF EXISTS valid_rc_number_format,
DROP CONSTRAINT IF EXISTS valid_vat_rate;

-- Add validation for VAT rate
ALTER TABLE invoices
ADD CONSTRAINT valid_vat_rate 
CHECK (vat_rate IS NULL OR (vat_rate >= 0 AND vat_rate <= 100));

-- Update users table to include business details
ALTER TABLE users
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS business_tin TEXT,
ADD COLUMN IF NOT EXISTS business_rc_number TEXT,
ADD COLUMN IF NOT EXISTS vat_registered BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(5,2) DEFAULT 7.5,
ADD COLUMN IF NOT EXISTS prices_include_vat BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS default_payment_terms TEXT DEFAULT 'Due on Receipt';

-- Drop existing user constraints if they exist
ALTER TABLE users
DROP CONSTRAINT IF EXISTS valid_user_tin_format,
DROP CONSTRAINT IF EXISTS valid_user_rc_number_format,
DROP CONSTRAINT IF EXISTS valid_user_vat_rate;

-- Add validation for user TIN format
ALTER TABLE users
ADD CONSTRAINT valid_user_tin_format 
CHECK (business_tin IS NULL OR business_tin ~ '^[0-9]{8,14}(-[0-9]{4})?$');

-- Add validation for user RC number format
ALTER TABLE users
ADD CONSTRAINT valid_user_rc_number_format 
CHECK (business_rc_number IS NULL OR business_rc_number ~ '^(RC)?[0-9]{1,15}$');

-- Add validation for user VAT rate
ALTER TABLE users
ADD CONSTRAINT valid_user_vat_rate 
CHECK (vat_rate IS NULL OR (vat_rate >= 0 AND vat_rate <= 100)); 