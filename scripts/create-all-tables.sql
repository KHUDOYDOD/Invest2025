-- Удаляем существующие таблицы если есть проблемы
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- Создаем таблицу транзакций
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу заявок на пополнение
CREATE TABLE deposit_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT,
    network VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    payment_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу заявок на вывод
CREATE TABLE withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    network VARCHAR(50),
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);

-- Добавляем тестовые данные
INSERT INTO transactions (user_id, type, amount, status, description, method) VALUES
('00000000-0000-0000-0000-000000000001', 'deposit', 1000.00, 'completed', 'Тестовое пополнение', 'Bitcoin'),
('00000000-0000-0000-0000-000000000001', 'investment', 500.00, 'active', 'Тестовая инвестиция', 'balance'),
('00000000-0000-0000-0000-000000000001', 'withdrawal', 200.00, 'pending', 'Тестовый вывод', 'Ethereum');

INSERT INTO deposit_requests (user_id, amount, method, status) VALUES
('00000000-0000-0000-0000-000000000001', 1000.00, 'Bitcoin', 'pending'),
('00000000-0000-0000-0000-000000000001', 500.00, 'Ethereum', 'completed');

INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, status) VALUES
('00000000-0000-0000-0000-000000000001', 200.00, 'Bitcoin', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'pending'),
('00000000-0000-0000-0000-000000000001', 100.00, 'Ethereum', '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c', 'completed');
