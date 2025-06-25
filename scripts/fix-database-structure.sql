
-- Полная настройка базы данных с исправлениями

-- Удаляем существующие таблицы
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS payment_settings CASCADE;
DROP TABLE IF EXISTS profit_settings CASCADE;
DROP TABLE IF EXISTS project_launches CASCADE;

-- Создаем таблицу пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_earned DECIMAL(15,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    role_id INTEGER DEFAULT 2, -- 1 = admin, 2 = user
    status VARCHAR(50) DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу планов инвестиций
CREATE TABLE investment_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL, -- в днях
    duration_days INTEGER NOT NULL, -- добавляем для совместимости
    status VARCHAR(50) DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    features JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу инвестиций
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу транзакций
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, profit, investment
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу запросов на пополнение
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT,
    network VARCHAR(50),
    payment_details JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending',
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу запросов на вывод
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    network VARCHAR(50),
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'pending',
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу статистики
CREATE TABLE statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Добавляем тестового админа
INSERT INTO users (email, full_name, password_hash, role_id, balance, is_active) VALUES 
('admin@example.com', 'Администратор', '$2b$10$hashedpassword', 1, 100000.00, true);

-- Добавляем тестового пользователя
INSERT INTO users (email, full_name, password_hash, role_id, balance, total_invested, total_earned, is_active) VALUES 
('user@example.com', 'Тестовый Пользователь', '$2b$10$hashedpassword', 2, 5000.00, 3000.00, 500.00, true);

-- Добавляем планы инвестиций
INSERT INTO investment_plans (name, min_amount, max_amount, daily_percent, duration, duration_days, features, is_active) VALUES
('Стартовый', 100.00, 999.99, 1.5, 30, 30, '["Минимальный риск", "Базовая поддержка"]', true),
('Стандартный', 1000.00, 4999.99, 2.0, 45, 45, '["Средний доход", "Приоритетная поддержка"]', true),
('Премиум', 5000.00, 19999.99, 2.5, 60, 60, '["Высокий доход", "VIP поддержка", "Персональный менеджер"]', true),
('VIP', 20000.00, 99999.99, 3.0, 90, 90, '["Максимальный доход", "Эксклюзивная поддержка", "Индивидуальные условия"]', true);

-- Добавляем статистику
INSERT INTO statistics (users_count, users_change, investments_amount, investments_change, payouts_amount, payouts_change, profitability_rate, profitability_change) VALUES
(15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2);

-- Добавляем тестовые транзакции
INSERT INTO transactions (user_id, type, amount, status, description, method) 
SELECT 
    id, 
    'deposit', 
    1000.00, 
    'completed', 
    'Тестовое пополнение', 
    'Bitcoin'
FROM users 
WHERE email = 'user@example.com';

INSERT INTO transactions (user_id, type, amount, status, description, method) 
SELECT 
    id, 
    'investment', 
    500.00, 
    'completed', 
    'Инвестиция в план "Стандартный"', 
    'balance'
FROM users 
WHERE email = 'user@example.com';

-- Создаем индексы для оптимизации
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_investment_plans_is_active ON investment_plans(is_active);

-- Проверяем что всё создано
SELECT 'users' as table_name, count(*) as records FROM users
UNION ALL
SELECT 'investment_plans' as table_name, count(*) as records FROM investment_plans
UNION ALL
SELECT 'transactions' as table_name, count(*) as records FROM transactions
UNION ALL
SELECT 'statistics' as table_name, count(*) as records FROM statistics;
