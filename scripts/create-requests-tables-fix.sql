-- Создаем таблицы для запросов на пополнение и вывод
CREATE TABLE IF NOT EXISTS deposit_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    payment_details JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending',
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

-- Добавляем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);

-- Проверяем что таблицы созданы
SELECT 'deposit_requests' as table_name, COUNT(*) as count FROM deposit_requests
UNION ALL
SELECT 'withdrawal_requests' as table_name, COUNT(*) as count FROM withdrawal_requests;
