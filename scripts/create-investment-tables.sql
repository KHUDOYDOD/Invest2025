-- Создаем таблицы в правильном порядке с учетом зависимостей

-- 1. Сначала создаем таблицу пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    referral_code VARCHAR(50) UNIQUE,
    referred_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Создаем таблицу инвестиционных планов
CREATE TABLE IF NOT EXISTS investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    min_amount DECIMAL(10,2) NOT NULL,
    max_amount DECIMAL(10,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL, -- в днях
    total_return DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    features TEXT[] DEFAULT '{}',
    description TEXT,
    risk_level VARCHAR(50),
    recommended_for TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Создаем таблицу инвестиций
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES investment_plans(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    daily_profit DECIMAL(10,2) NOT NULL,
    total_profit DECIMAL(10,2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Создаем таблицу транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- deposit, withdraw, profit, bonus, investment
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем тестового пользователя
INSERT INTO users (id, email, password_hash, full_name, balance) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'test@example.com',
    '$2a$10$dummy.hash.for.testing',
    'Test User',
    10000.00
) ON CONFLICT (id) DO NOTHING;

-- Добавляем инвестиционные планы
INSERT INTO investment_plans (
    name, min_amount, max_amount, daily_percent, duration, total_return, 
    is_active, features, description, risk_level, recommended_for
) VALUES
(
    'Стартер', 100, 499, 3.0, 30, 90,
    true, 
    ARRAY['Ежедневные выплаты 3%', 'Поддержка 24/7', 'Мобильное приложение'],
    'Идеальный план для начинающих инвесторов', 
    'Низкий', 
    'Новички в инвестировании'
),
(
    'Профессионал', 500, 999, 5.0, 30, 150,
    true, 
    ARRAY['Ежедневные выплаты 5%', 'Персональный менеджер', 'Приоритетная поддержка', 'Аналитика'],
    'Сбалансированный план для опытных инвесторов', 
    'Средний', 
    'Опытные инвесторы'
),
(
    'Премиум', 1000, 10000, 8.0, 30, 240,
    true, 
    ARRAY['Ежедневные выплаты 8%', 'VIP поддержка', 'Эксклюзивные сигналы', 'Личный аналитик'],
    'Высокодоходный план для серьезных инвесторов', 
    'Высокий', 
    'Профессиональные инвесторы'
),
(
    'VIP', 10000, 50000, 12.0, 30, 360,
    true, 
    ARRAY['Максимальная доходность 12%', 'Индивидуальный подход', 'Приоритетная поддержка'],
    'Эксклюзивный план для крупных инвесторов', 
    'Очень высокий', 
    'Крупные инвесторы'
)
ON CONFLICT (name) DO UPDATE SET
    min_amount = EXCLUDED.min_amount,
    max_amount = EXCLUDED.max_amount,
    daily_percent = EXCLUDED.daily_percent,
    duration = EXCLUDED.duration,
    total_return = EXCLUDED.total_return,
    features = EXCLUDED.features,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Создаем индексы для лучшей производительности
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_investments_plan_id ON investments(plan_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_investment_plans_active ON investment_plans(is_active);

-- Добавляем триггеры для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON investment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
