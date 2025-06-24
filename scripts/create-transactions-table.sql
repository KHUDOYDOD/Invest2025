-- Создаем таблицу транзакций если она не существует
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, investment, profit, referral
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, cancelled
    description TEXT,
    method VARCHAR(100), -- payment method
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Добавляем несколько тестовых транзакций
INSERT INTO transactions (user_id, type, amount, status, description, method) VALUES
('00000000-0000-0000-0000-000000000001', 'deposit', 1000.00, 'completed', 'Пополнение баланса', 'Bitcoin'),
('00000000-0000-0000-0000-000000000001', 'investment', 500.00, 'active', 'Инвестиция в план "Стандарт"', 'balance'),
('00000000-0000-0000-0000-000000000001', 'profit', 25.00, 'completed', 'Прибыль от инвестиции', 'auto')
ON CONFLICT (id) DO NOTHING;
