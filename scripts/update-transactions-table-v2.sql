-- Update transactions table with all required fields
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'deposit';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS method VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS reference VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
