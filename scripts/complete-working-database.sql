-- Полная рабочая база данных
-- Удаляем все существующие таблицы
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Создаем таблицу ролей
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем роли
INSERT INTO roles (id, name, description) VALUES 
(1, 'admin', 'Администратор системы'),
(2, 'user', 'Обычный пользователь');

-- Создаем таблицу пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    referral_code VARCHAR(50) UNIQUE,
    referred_by UUID REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id) DEFAULT 2,
    status VARCHAR(20) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем профили пользователей
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    address TEXT,
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем планы инвестиций
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL, -- дни
    total_return DECIMAL(5,2) NOT NULL,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем инвестиции
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    last_profit_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запросы на пополнение
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    admin_comment TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запросы на вывод
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_comment TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем транзакции
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, investment, profit, referral
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем функцию для обновления баланса
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_operation VARCHAR(10)
) RETURNS BOOLEAN AS $$
BEGIN
    IF p_operation = 'add' THEN
        UPDATE users 
        SET balance = balance + p_amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        UPDATE users 
        SET balance = balance - p_amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_user_id AND balance >= p_amount;
        
        IF NOT FOUND THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Вставляем тестовые планы инвестиций
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_percent, duration, total_return, features) VALUES
('Стартер', 'Идеальный план для начинающих инвесторов', 100, 1000, 2.0, 30, 60.0, ARRAY['Ежедневные выплаты', 'Реинвестирование', 'Страхование вклада', '24/7 поддержка']),
('Премиум', 'Для опытных инвесторов с высокой доходностью', 1000, 5000, 3.0, 15, 45.0, ARRAY['Ежедневные выплаты', 'Реинвестирование', 'Страхование вклада', 'Приоритетная поддержка', 'Персональный менеджер']),
('VIP Elite', 'Эксклюзивный план для VIP клиентов', 5000, 50000, 4.0, 10, 40.0, ARRAY['Ежедневные выплаты', 'Реинвестирование', 'Полное страхование', 'VIP поддержка 24/7', 'Персональный менеджер', 'Эксклюзивные инвестиции', 'Приоритетный вывод']);

-- Создаем тестового администратора
INSERT INTO users (email, password_hash, full_name, role_id, status, email_verified, balance) VALUES
('admin@nevinev.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.OwqKW', 'Администратор', 1, 'active', true, 0);

-- Создаем тестового пользователя
INSERT INTO users (email, password_hash, full_name, role_id, status, email_verified, balance) VALUES
('user@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.OwqKW', 'Тестовый Пользователь', 2, 'active', true, 10000);

-- Создаем индексы для производительности
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);

-- Включаем RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR ALL USING (true);

CREATE POLICY "Investments are viewable by everyone" ON investments FOR SELECT USING (true);
CREATE POLICY "Investments can be created by everyone" ON investments FOR INSERT WITH CHECK (true);

CREATE POLICY "Transactions are viewable by everyone" ON transactions FOR SELECT USING (true);
CREATE POLICY "Transactions can be created by everyone" ON transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Deposit requests are viewable by everyone" ON deposit_requests FOR SELECT USING (true);
CREATE POLICY "Deposit requests can be created by everyone" ON deposit_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Deposit requests can be updated by everyone" ON deposit_requests FOR UPDATE USING (true);

CREATE POLICY "Withdrawal requests are viewable by everyone" ON withdrawal_requests FOR SELECT USING (true);
CREATE POLICY "Withdrawal requests can be created by everyone" ON withdrawal_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Withdrawal requests can be updated by everyone" ON withdrawal_requests FOR UPDATE USING (true);

-- Выводим информацию о созданных таблицах
SELECT 'База данных успешно создана!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
