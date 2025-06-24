-- Удаляем существующие таблицы если есть
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
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
    balance DECIMAL(15,2) DEFAULT 0,
    total_invested DECIMAL(15,2) DEFAULT 0,
    total_profit DECIMAL(15,2) DEFAULT 0,
    total_withdrawn DECIMAL(15,2) DEFAULT 0,
    referral_count INTEGER DEFAULT 0,
    referral_code VARCHAR(10) UNIQUE,
    referred_by UUID REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id) DEFAULT 2,
    status VARCHAR(20) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    kyc_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индексы для быстрого поиска
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_role_id ON users(role_id);

-- Создаем профили пользователей
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    occupation VARCHAR(100),
    experience_level VARCHAR(20) DEFAULT 'beginner',
    risk_tolerance VARCHAR(20) DEFAULT 'medium',
    investment_goals TEXT,
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    notifications_email BOOLEAN DEFAULT true,
    notifications_sms BOOLEAN DEFAULT false,
    notifications_push BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем инвестиционные планы
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2),
    daily_profit_rate DECIMAL(5,4) NOT NULL,
    duration_days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем тестовые планы
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_profit_rate, duration_days) VALUES
('Стартовый', 'Идеально для начинающих инвесторов', 100, 999, 0.015, 30),
('Стандартный', 'Оптимальный баланс риска и доходности', 1000, 4999, 0.025, 45),
('Премиум', 'Для опытных инвесторов', 5000, 19999, 0.035, 60),
('VIP', 'Максимальная доходность', 20000, NULL, 0.045, 90);

-- Создаем таблицу инвестиций
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу транзакций
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- deposit, withdrawal, profit, referral
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, cancelled
    description TEXT,
    payment_method VARCHAR(50),
    transaction_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запросы на депозит
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запросы на вывод
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем уведомления
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем тестовых пользователей с правильными хешами паролей
-- Пароль: admin123 (bcrypt hash)
INSERT INTO users (email, password_hash, full_name, role_id, status, email_verified, balance) VALUES
('admin@nevinev.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hODqlHxEm', 'Администратор', 1, 'active', true, 10000);

-- Пароль: user123 (bcrypt hash)
INSERT INTO users (email, password_hash, full_name, role_id, status, email_verified, balance, referral_code) VALUES
('user@test.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тестовый Пользователь', 2, 'active', true, 1000, 'TEST123');

-- Пароль: demo123 (bcrypt hash)
INSERT INTO users (email, password_hash, full_name, role_id, status, email_verified, balance, referral_code) VALUES
('demo@nevinev.com', '$2a$12$8B8W8qQqkrZr8s8s8s8s8s8s8s8s8s8s8s8s8s8s8s8s8s8s8s8s8s', 'Демо Пользователь', 2, 'active', true, 500, 'DEMO123');

-- Создаем профили для пользователей
INSERT INTO user_profiles (user_id, bio, occupation, experience_level) 
SELECT id, 'Администратор системы', 'IT Специалист', 'expert' FROM users WHERE email = 'admin@nevinev.com';

INSERT INTO user_profiles (user_id, bio, occupation, experience_level) 
SELECT id, 'Тестовый пользователь', 'Инвестор', 'intermediate' FROM users WHERE email = 'user@test.com';

INSERT INTO user_profiles (user_id, bio, occupation, experience_level) 
SELECT id, 'Демо пользователь', 'Новичок', 'beginner' FROM users WHERE email = 'demo@nevinev.com';

-- Создаем приветственные уведомления
INSERT INTO notifications (user_id, title, message, type)
SELECT id, 'Добро пожаловать!', 'Добро пожаловать в InvestPro! Ваш аккаунт успешно создан.', 'welcome'
FROM users WHERE email IN ('admin@nevinev.com', 'user@test.com', 'demo@nevinev.com');

-- Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создаем триггеры для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deposit_requests_updated_at BEFORE UPDATE ON deposit_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Выводим информацию о созданных пользователях
SELECT 'База данных успешно создана!' as status;
SELECT 'Тестовые пользователи:' as info;
SELECT email, full_name, 
       CASE WHEN role_id = 1 THEN 'admin' ELSE 'user' END as role,
       CASE 
         WHEN email = 'admin@nevinev.com' THEN 'admin123'
         WHEN email = 'user@test.com' THEN 'user123'
         WHEN email = 'demo@nevinev.com' THEN 'demo123'
       END as password
FROM users ORDER BY role_id, email;
