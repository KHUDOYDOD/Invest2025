-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  users_count INTEGER DEFAULT 15420,
  users_change DECIMAL(5,2) DEFAULT 12.5,
  investments_amount BIGINT DEFAULT 2850000,
  investments_change DECIMAL(5,2) DEFAULT 8.3,
  payouts_amount BIGINT DEFAULT 1920000,
  payouts_change DECIMAL(5,2) DEFAULT 15.7,
  profitability_rate DECIMAL(5,2) DEFAULT 24.8,
  profitability_change DECIMAL(5,2) DEFAULT 3.2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial statistics data
INSERT INTO statistics (
  id,
  users_count,
  users_change,
  investments_amount,
  investments_change,
  payouts_amount,
  payouts_change,
  profitability_rate,
  profitability_change
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  15420,
  12.5,
  2850000,
  8.3,
  1920000,
  15.7,
  24.8,
  3.2
) ON CONFLICT (id) DO UPDATE SET
  users_count = EXCLUDED.users_count,
  users_change = EXCLUDED.users_change,
  investments_amount = EXCLUDED.investments_amount,
  investments_change = EXCLUDED.investments_change,
  payouts_amount = EXCLUDED.payouts_amount,
  payouts_change = EXCLUDED.payouts_change,
  profitability_rate = EXCLUDED.profitability_rate,
  profitability_change = EXCLUDED.profitability_change,
  updated_at = NOW();

-- Create trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_statistics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_statistics_updated_at 
BEFORE UPDATE ON statistics
FOR EACH ROW EXECUTE FUNCTION update_statistics_updated_at();
