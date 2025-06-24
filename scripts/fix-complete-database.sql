-- Удаляем все существующие таблицы
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS project_launches CASCADE;

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
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    total_withdrawn DECIMAL(15,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    referral_code VARCHAR(10) UNIQUE,
    referred_by INTEGER REFERENCES users(id),
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

-- Создаем профили пользователей
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    date_of_birth DATE,
    bio TEXT,
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
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2),
    daily_profit_rate DECIMAL(5,4) NOT NULL,
    duration_days INTEGER NOT NULL,
    total_return_rate DECIMAL(5,4) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем планы
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_profit_rate, duration_days, total_return_rate) VALUES
('Стартовый', 'Идеальный план для начинающих инвесторов', 100.00, 999.99, 0.015, 30, 0.45),
('Стандартный', 'Сбалансированный план с хорошей доходностью', 1000.00, 4999.99, 0.025, 45, 1.125),
('Премиум', 'Высокодоходный план для опытных инвесторов', 5000.00, 19999.99, 0.035, 60, 2.10),
('VIP', 'Эксклюзивный план с максимальной доходностью', 20000.00, NULL, 0.045, 90, 4.05);

-- Создаем транзакции
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем инвестиции
CREATE TABLE investments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запросы на депозит
CREATE TABLE deposit_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Создаем запросы на вывод
CREATE TABLE withdrawal_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Создаем уведомления
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем настройки
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем базовые настройки
INSERT INTO settings (key, value, description) VALUES
('site_name', 'InvestPro', 'Название сайта'),
('site_description', 'Профессиональная инвестиционная платформа', 'Описание сайта'),
('min_deposit', '100', 'Минимальная сумма депозита'),
('min_withdrawal', '50', 'Минимальная сумма вывода'),
('referral_bonus', '5', 'Реферальный бонус в процентах');

-- Создаем отзывы
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем запуски проектов
CREATE TABLE project_launches (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    launch_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем тестовых пользователей
INSERT INTO users (email, password_hash, full_name, balance, role_id, status, email_verified, referral_code) VALUES
('admin@nevinev.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Администратор', 10000.00, 1, 'active', true, 'ADMIN1'),
('user@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Тестовый Пользователь', 5000.00, 2, 'active', true, 'USER01'),
('investor@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Демо Инвестор', 2500.00, 2, 'active', true, 'DEMO01');

-- Создаем профили для тестовых пользователей
INSERT INTO user_profiles (user_id, bio, occupation, experience_level) VALUES
(1, 'Администратор платформы InvestPro', 'Системный администратор', 'expert'),
(2, 'Тестовый пользователь для проверки функций', 'Тестировщик', 'intermediate'),
(3, 'Демонстрационный аккаунт инвестора', 'Инвестор', 'beginner');

-- Создаем индексы для оптимизации
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

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
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
