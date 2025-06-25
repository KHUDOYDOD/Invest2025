
-- Удаляем все существующие таблицы для чистого старта
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS news CASCADE;

-- Создаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Создаем таблицу ролей пользователей
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставляем роли
INSERT INTO user_roles (id, name, display_name, description) VALUES
(1, 'admin', 'Администратор', 'Полный доступ к системе'),
(2, 'user', 'Пользователь', 'Обычный пользователь системы');

-- 2. Создаем основную таблицу пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_earned DECIMAL(15,2) DEFAULT 0.00,
    referral_code VARCHAR(50) UNIQUE,
    referred_by UUID REFERENCES users(id),
    referral_count INTEGER DEFAULT 0,
    role_id INTEGER REFERENCES user_roles(id) DEFAULT 2,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Создаем таблицу инвестиционных планов
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    total_return_percent DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    features TEXT[] DEFAULT '{}',
    risk_level VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Создаем таблицу инвестиций
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    profit_earned DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    last_profit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Создаем таблицу транзакций
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, profit, investment, referral
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    transaction_hash VARCHAR(255),
    reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Создаем таблицу запросов на пополнение
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    payment_details JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- 7. Создаем таблицу запросов на вывод
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- 8. Создаем таблицу настроек сайта
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Создаем таблицу отзывов
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Создаем таблицу новостей
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для производительности
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Вставляем тестовые инвестиционные планы
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_percent, duration_days, total_return_percent, features) VALUES
('Стартовый план', 'Идеально для начинающих инвесторов', 100.00, 999.99, 1.50, 30, 45.00, ARRAY['Ежедневные выплаты', 'Поддержка 24/7']),
('Профессиональный план', 'Для опытных инвесторов', 1000.00, 4999.99, 2.00, 45, 90.00, ARRAY['Ежедневные выплаты', 'Персональный менеджер', 'Аналитика']),
('VIP план', 'Максимальная доходность', 5000.00, 50000.00, 2.50, 60, 150.00, ARRAY['Ежедневные выплаты', 'VIP поддержка', 'Эксклюзивные проекты']),
('Золотой план', 'Премиум инвестиции', 2500.00, 9999.99, 2.20, 40, 88.00, ARRAY['Ежедневные выплаты', 'Приоритетная поддержка']);

-- Вставляем демо пользователей с хэшированными паролями
-- Пароль для всех: demo123 (хэш bcrypt)
INSERT INTO users (email, full_name, password_hash, balance, role_id, status, referral_code) VALUES
('admin@example.com', 'Администратор', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 10000.00, 1, 'active', 'ADMIN001'),
('user@example.com', 'Тестовый Пользователь', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 5000.00, 2, 'active', 'USER001'),
('demo@example.com', 'Демо Инвестор', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 2500.00, 2, 'active', 'DEMO001');

-- Вставляем тестовые транзакции
INSERT INTO transactions (user_id, type, amount, status, description, method) 
SELECT 
    u.id,
    'deposit',
    1000.00,
    'completed',
    'Тестовое пополнение',
    'Bitcoin'
FROM users u WHERE u.email = 'user@example.com'
UNION ALL
SELECT 
    u.id,
    'profit',
    50.00,
    'completed',
    'Прибыль от инвестиций',
    'balance'
FROM users u WHERE u.email = 'user@example.com';

-- Вставляем настройки сайта
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('site_name', 'InvestPro', 'Название сайта'),
('min_deposit', '100', 'Минимальная сумма депозита'),
('max_deposit', '50000', 'Максимальная сумма депозита'),
('min_withdrawal', '10', 'Минимальная сумма вывода'),
('withdrawal_fee', '2', 'Комиссия за вывод в процентах'),
('referral_bonus', '5', 'Реферальный бонус в процентах');

-- Вставляем тестовые отзывы
INSERT INTO testimonials (name, position, content, rating) VALUES
('Иван Петров', 'Инвестор', 'Отличная платформа! Стабильные выплаты и профессиональная поддержка.', 5),
('Мария Сидорова', 'Трейдер', 'Пользуюсь уже полгода. Все выплаты приходят вовремя.', 5),
('Алексей Иванов', 'Предприниматель', 'Рекомендую всем! Надежная инвестиционная платформа.', 5);

-- Выводим статистику созданных таблиц
SELECT 
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename) as columns_count
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Выводим количество записей в основных таблицах
SELECT 'users' as table_name, COUNT(*) as records FROM users
UNION ALL
SELECT 'investment_plans', COUNT(*) FROM investment_plans
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials;

COMMIT;
