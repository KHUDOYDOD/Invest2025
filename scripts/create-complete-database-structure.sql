-- Создаем все необходимые таблицы для полного функционирования

-- 1. Таблица пользователей (если не существует)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password_hash VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    referral_code VARCHAR(50) UNIQUE,
    referred_by UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Профили пользователей
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    avatar_url TEXT,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Планы инвестирования
CREATE TABLE IF NOT EXISTS investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    total_return_percent DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Инвестиции
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES investment_plans(id),
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

-- 5. Транзакции
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, investment, profit, referral
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    description TEXT,
    method VARCHAR(100),
    wallet_address TEXT,
    transaction_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Заявки на пополнение
CREATE TABLE IF NOT EXISTS deposit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT,
    network VARCHAR(100),
    payment_details JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Заявки на вывод
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2),
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    network VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставляем демо планы инвестирования
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_percent, duration_days, total_return_percent) 
VALUES 
    ('Starter Plan', 'Идеально для начинающих инвесторов', 100, 999, 1.5, 30, 45),
    ('Professional Plan', 'Для опытных инвесторов', 1000, 4999, 2.0, 45, 90),
    ('VIP Plan', 'Максимальная доходность', 5000, 50000, 2.5, 60, 150),
    ('Gold Plan', 'Премиум инвестиции', 2500, 9999, 2.2, 40, 88)
ON CONFLICT (id) DO NOTHING;

-- Создаем функцию для обновления баланса
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_operation VARCHAR(10) -- 'add' or 'subtract'
)
RETURNS BOOLEAN AS $$
BEGIN
    IF p_operation = 'add' THEN
        UPDATE users SET balance = balance + p_amount WHERE id = p_user_id;
        UPDATE user_profiles SET balance = balance + p_amount WHERE user_id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        UPDATE users SET balance = balance - p_amount WHERE id = p_user_id;
        UPDATE user_profiles SET balance = balance - p_amount WHERE user_id = p_user_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_created_at ON investments(created_at DESC);

-- Добавляем тестового пользователя с балансом
INSERT INTO users (id, email, full_name, balance, total_invested, total_profit, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'test@example.com',
    'Test User',
    10000.00,
    5000.00,
    750.00,
    'active'
) ON CONFLICT (email) DO UPDATE SET
    balance = EXCLUDED.balance,
    total_invested = EXCLUDED.total_invested,
    total_profit = EXCLUDED.total_profit;

-- Добавляем профиль для тестового пользователя
INSERT INTO user_profiles (user_id, balance, total_invested, total_profit)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    10000.00,
    5000.00,
    750.00
) ON CONFLICT (user_id) DO UPDATE SET
    balance = EXCLUDED.balance,
    total_invested = EXCLUDED.total_invested,
    total_profit = EXCLUDED.total_profit;

COMMIT;
