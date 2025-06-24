-- Создаем таблицы для запросов на пополнение и вывод

-- Удаляем существующие таблицы если есть
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;

-- Создаем таблицу запросов на пополнение
CREATE TABLE deposit_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(50) NOT NULL,
    payment_details JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Создаем таблицу запросов на вывод
CREATE TABLE withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(50) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Создаем индексы для быстрого поиска
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_deposit_requests_created_at ON deposit_requests(created_at DESC);

CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

-- Добавляем тестовые данные
INSERT INTO deposit_requests (user_id, amount, method, payment_details, status) 
SELECT 
    id, 
    100.00, 
    'Bitcoin', 
    '{"wallet": "test_wallet"}',
    'pending'
FROM users 
WHERE email = 'user@example.com' 
LIMIT 1;

INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status)
SELECT 
    id, 
    50.00, 
    'Bitcoin', 
    '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    2.50,
    47.50,
    'pending'
FROM users 
WHERE email = 'user@example.com' 
LIMIT 1;

-- Проверяем созданные данные
SELECT 'Deposit Requests' as table_name, COUNT(*) as count FROM deposit_requests
UNION ALL
SELECT 'Withdrawal Requests' as table_name, COUNT(*) as count FROM withdrawal_requests;
