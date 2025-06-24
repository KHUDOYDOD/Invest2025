-- Create profit_settings table for auto profit accrual settings
CREATE TABLE IF NOT EXISTS profit_settings (
    id SERIAL PRIMARY KEY,
    accrual_interval INTEGER DEFAULT 86400, -- seconds (24 hours default)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings (24 hours = 86400 seconds)
INSERT INTO profit_settings (accrual_interval, is_active) VALUES (86400, true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profit_settings_updated_at BEFORE UPDATE ON profit_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
