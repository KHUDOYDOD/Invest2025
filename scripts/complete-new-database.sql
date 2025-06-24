-- ПОЛНАЯ НОВАЯ БАЗА ДАННЫХ С НУЛЯ
-- Удаляем все существующие таблицы
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Создаем таблицу ролей
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем роли
INSERT INTO roles (id, name, description, permissions) VALUES 
(1, 'admin', 'Администратор системы', '{"all": true}'),
(2, 'user', 'Обычный пользователь', '{"dashboard": true, "invest": true}');

-- Создаем таблицу пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Россия',
    city VARCHAR(100),
    address TEXT,
    date_of_birth DATE,
    avatar_url TEXT,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    total_withdrawn DECIMAL(15,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    referral_code VARCHAR(50) UNIQUE,
    referred_by UUID REFERENCES users(id),
    referral_earnings DECIMAL(15,2) DEFAULT 0.00,
    role_id INTEGER REFERENCES roles(id) DEFAULT 2,
    status VARCHAR(20) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT true,
    phone_verified BOOLEAN DEFAULT false,
    kyc_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем профили пользователей
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    website VARCHAR(255),
    telegram VARCHAR(100),
    whatsapp VARCHAR(100),
    occupation VARCHAR(255),
    company VARCHAR(255),
    education VARCHAR(255),
    experience_level VARCHAR(50) DEFAULT 'beginner',
    investment_goals TEXT,
    risk_tolerance VARCHAR(50) DEFAULT 'medium',
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(100) DEFAULT 'Europe/Moscow',
    language VARCHAR(10) DEFAULT 'ru',
    notifications_email BOOLEAN DEFAULT true,
    notifications_sms BOOLEAN DEFAULT false,
    notifications_push BOOLEAN DEFAULT true,
    privacy_profile VARCHAR(20) DEFAULT 'public',
    privacy_investments VARCHAR(20) DEFAULT 'private',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем планы инвестиций
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL, -- дни
    total_return DECIMAL(5,2) NOT NULL,
    features TEXT[],
    risk_level VARCHAR(20) DEFAULT 'medium',
    category VARCHAR(100) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    icon VARCHAR(100),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем инвестиции
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    profit_paid DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    last_profit_date TIMESTAMP,
    next_profit_date TIMESTAMP,
    auto_reinvest BOOLEAN DEFAULT false,
    reinvest_percent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запросы на пополнение
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    admin_comment TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    transaction_hash VARCHAR(255),
    confirmation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запросы на вывод
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_comment TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    transaction_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем транзакции
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, investment, profit, referral, bonus
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    transaction_hash VARCHAR(255),
    reference_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем уведомления
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем настройки системы
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем статистику
CREATE TABLE statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_users INTEGER DEFAULT 0,
    total_investments DECIMAL(15,2) DEFAULT 0.00,
    total_withdrawals DECIMAL(15,2) DEFAULT 0.00,
    total_profit_paid DECIMAL(15,2) DEFAULT 0.00,
    active_investments INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем функции
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_operation VARCHAR(10)
) RETURNS BOOLEAN AS $$
DECLARE
    current_balance DECIMAL(15,2);
BEGIN
    -- Получаем текущий баланс
    SELECT balance INTO current_balance FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    IF p_operation = 'add' THEN
        UPDATE users 
        SET balance = balance + p_amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        IF current_balance >= p_amount THEN
            UPDATE users 
            SET balance = balance - p_amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = p_user_id;
        ELSE
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Функция для обновления статистики
CREATE OR REPLACE FUNCTION update_statistics() RETURNS VOID AS $$
BEGIN
    INSERT INTO statistics (
        total_users,
        total_investments,
        total_withdrawals,
        total_profit_paid,
        active_investments,
        date
    ) VALUES (
        (SELECT COUNT(*) FROM users WHERE status = 'active'),
        (SELECT COALESCE(SUM(amount), 0) FROM investments WHERE status = 'active'),
        (SELECT COALESCE(SUM(final_amount), 0) FROM withdrawal_requests WHERE status = 'completed'),
        (SELECT COALESCE(SUM(profit_paid), 0) FROM investments),
        (SELECT COUNT(*) FROM investments WHERE status = 'active'),
        CURRENT_DATE
    )
    ON CONFLICT (date) DO UPDATE SET
        total_users = EXCLUDED.total_users,
        total_investments = EXCLUDED.total_investments,
        total_withdrawals = EXCLUDED.total_withdrawals,
        total_profit_paid = EXCLUDED.total_profit_paid,
        active_investments = EXCLUDED.active_investments;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггеры
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON investment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deposit_requests_updated_at BEFORE UPDATE ON deposit_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Вставляем тестовые планы инвестиций
INSERT INTO investment_plans (name, description, short_description, min_amount, max_amount, daily_percent, duration, total_return, features, risk_level, category, is_featured, icon, color) VALUES
('Стартер', 'Идеальный план для начинающих инвесторов с минимальными рисками', 'Безопасный старт в мире инвестиций', 100, 1000, 2.0, 30, 60.0, ARRAY['Ежедневные выплаты', 'Реинвестирование', 'Страхование вклада', '24/7 поддержка'], 'low', 'beginner', true, 'rocket', 'blue'),
('Премиум', 'Для опытных инвесторов с высокой доходностью и расширенными возможностями', 'Оптимальный баланс риска и доходности', 1000, 5000, 3.0, 15, 45.0, ARRAY['Ежедневные выплаты', 'Реинвестирование', 'Страхование вклада', 'Приоритетная поддержка', 'Персональный менеджер'], 'medium', 'advanced', true, 'crown', 'purple'),
('VIP Elite', 'Эксклюзивный план для VIP клиентов с максимальной доходностью', 'Премиум инвестиции для избранных', 5000, 50000, 4.0, 10, 40.0, ARRAY['Ежедневные выплаты', 'Реинвестирование', 'Полное страхование', 'VIP поддержка 24/7', 'Персональный менеджер', 'Эксклюзивные инвестиции', 'Приоритетный вывод'], 'high', 'vip', true, 'diamond', 'gold');

-- Создаем тестового администратора (пароль: admin123)
INSERT INTO users (email, password_hash, full_name, role_id, status, email_verified, balance, referral_code) VALUES
('admin@nevinev.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.OwqKW', 'Администратор Системы', 1, 'active', true, 0, 'ADMIN001');

-- Создаем тестового пользователя (пароль: user123)
INSERT INTO users (email, password_hash, full_name, role_id, status, email_verified, balance, referral_code, phone, city) VALUES
('user@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.OwqKW', 'Тестовый Пользователь', 2, 'active', true, 10000, 'USER001', '+7 999 123-45-67', 'Москва');

-- Создаем профили для тестовых пользователей
INSERT INTO user_profiles (user_id, bio, occupation, company, education, investment_goals, risk_tolerance) 
SELECT id, 'Опытный инвестор с многолетним стажем', 'Senior Developer', 'Tech Solutions LLC', 'Высшее техническое', 'Долгосрочный рост капитала и пассивный доход', 'medium'
FROM users WHERE email = 'user@test.com';

-- Вставляем системные настройки
INSERT INTO system_settings (key, value, type, description, is_public) VALUES
('site_name', 'InvestPro', 'string', 'Название сайта', true),
('site_description', 'Профессиональная инвестиционная платформа', 'string', 'Описание сайта', true),
('min_deposit', '50', 'number', 'Минимальная сумма депозита', true),
('min_withdrawal', '25', 'number', 'Минимальная сумма вывода', true),
('withdrawal_fee', '2', 'number', 'Комиссия за вывод (%)', true),
('referral_bonus', '5', 'number', 'Реферальный бонус (%)', true),
('support_email', 'support@nevinev.com', 'string', 'Email поддержки', true),
('support_phone', '+7 800 123-45-67', 'string', 'Телефон поддержки', true);

-- Создаем индексы для производительности
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_plan_id ON investments(plan_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Включаем RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности (разрешаем все для упрощения)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON investments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON deposit_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON withdrawal_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- Обновляем статистику
SELECT update_statistics();

-- Выводим информацию о созданных таблицах
SELECT 'НОВАЯ БАЗА ДАННЫХ УСПЕШНО СОЗДАНА!' as status;
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Показываем количество записей в каждой таблице
SELECT 
    'users' as table_name, 
    COUNT(*) as records 
FROM users
UNION ALL
SELECT 
    'investment_plans' as table_name, 
    COUNT(*) as records 
FROM investment_plans
UNION ALL
SELECT 
    'system_settings' as table_name, 
    COUNT(*) as records 
FROM system_settings;
