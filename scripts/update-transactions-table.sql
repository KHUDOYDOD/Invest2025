-- Add new columns to transactions table if they don't exist
DO $$ 
BEGIN
    -- Add method column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'method') THEN
        ALTER TABLE transactions ADD COLUMN method VARCHAR(100);
    END IF;
    
    -- Add fee column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'fee') THEN
        ALTER TABLE transactions ADD COLUMN fee DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Add final_amount column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'final_amount') THEN
        ALTER TABLE transactions ADD COLUMN final_amount DECIMAL(10,2);
    END IF;
    
    -- Add wallet_address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wallet_address' AND column_name = 'wallet_address') THEN
        ALTER TABLE transactions ADD COLUMN wallet_address TEXT;
    END IF;
    
    -- Add reference column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'reference') THEN
        ALTER TABLE transactions ADD COLUMN reference VARCHAR(255);
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_created_at ON transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type_status ON transactions(type, status);
