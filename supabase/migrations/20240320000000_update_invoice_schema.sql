-- First, add columns as nullable
ALTER TABLE invoices
DROP COLUMN IF EXISTS amount,
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS date TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'FCFA',
ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT,
ALTER COLUMN pdf_url DROP NOT NULL;

-- Update existing rows with default values
UPDATE invoices
SET 
  invoice_number = CASE 
    WHEN invoice_number IS NULL THEN 'FACT-' || id
    ELSE invoice_number 
  END,
  date = CASE 
    WHEN date IS NULL THEN CURRENT_DATE::text
    ELSE date 
  END,
  client_name = CASE 
    WHEN client_name IS NULL THEN 'Unknown Client'
    ELSE client_name 
  END,
  items = CASE 
    WHEN items IS NULL THEN '[]'::jsonb
    ELSE items 
  END,
  currency = CASE 
    WHEN currency IS NULL THEN 'FCFA'
    ELSE currency 
  END,
  total = CASE 
    WHEN total IS NULL THEN 0
    ELSE total 
  END;

-- Now make columns NOT NULL
ALTER TABLE invoices
ALTER COLUMN invoice_number SET NOT NULL,
ALTER COLUMN date SET NOT NULL,
ALTER COLUMN client_name SET NOT NULL,
ALTER COLUMN items SET NOT NULL,
ALTER COLUMN currency SET NOT NULL,
ALTER COLUMN total SET NOT NULL;

-- Add constraints
ALTER TABLE invoices
DROP CONSTRAINT IF EXISTS invoice_number_unique,
ADD CONSTRAINT invoice_number_unique UNIQUE (user_id, invoice_number);

-- Create an index for faster queries
DROP INDEX IF EXISTS idx_invoices_user_date;
CREATE INDEX idx_invoices_user_date ON invoices(user_id, date);

-- Add a check constraint for valid currencies
ALTER TABLE invoices
DROP CONSTRAINT IF EXISTS valid_currency,
ADD CONSTRAINT valid_currency CHECK (
  currency IN ('FCFA', '€', '$', 'NGN', 'KES')
);

-- Drop the status constraint and column
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS valid_status,
DROP COLUMN IF EXISTS status;

-- Add a check constraint for positive total
ALTER TABLE invoices
DROP CONSTRAINT IF EXISTS positive_total,
ADD CONSTRAINT positive_total CHECK (total >= 0);

-- Add validation for items structure
CREATE OR REPLACE FUNCTION validate_invoice_items()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if items is an array
  IF NOT jsonb_typeof(NEW.items) = 'array' THEN
    RAISE EXCEPTION 'items must be an array';
  END IF;

  -- Validate each item in the array
  IF NOT (
    SELECT bool_and(
      item ? 'id' AND
      item ? 'description' AND
      item ? 'quantity' AND
      item ? 'price' AND
      item ? 'subtotal' AND
      (item->>'quantity')::numeric >= 1 AND
      (item->>'price')::numeric >= 0 AND
      (item->>'subtotal')::numeric >= 0
    )
    FROM jsonb_array_elements(NEW.items) AS item
  ) THEN
    RAISE EXCEPTION 'Invalid item structure or values';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for items validation
DROP TRIGGER IF EXISTS validate_invoice_items_trigger ON invoices;
CREATE TRIGGER validate_invoice_items_trigger
  BEFORE INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION validate_invoice_items(); 