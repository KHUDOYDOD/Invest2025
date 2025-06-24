-- =====================================================
-- ПОЛНАЯ БАЗА ДАННЫХ ДЛЯ ИНВЕСТИЦИОННОЙ ПЛАТФОРМЫ
-- =====================================================
-- Этот файл содержит всю структуру БД и данные для сайта
-- Запустите этот файл в PostgreSQL для полной настройки

-- Удаляем существующие таблицы если они есть
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS payment_settings CASCADE;
DROP TABLE IF EXISTS profit_settings CASCADE;
DROP TABLE IF EXISTS project_launches CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS appearance_settings CASCADE;
DROP TABLE IF EXISTS notification_settings CASCADE;

-- =====================================================
-- 1. СОЗДАНИЕ ТАБЛИЦ
-- =====================================================

-- Таблица ролей пользователей
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Основная таблица пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    role_id INTEGER REFERENCES user_roles(id) DEFAULT 5,
    login VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица профилей пользователей
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  middle_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20),
  nationality VARCHAR(100),
  marital_status VARCHAR(50),
  
  -- Контактная информация
  phone VARCHAR(50),
  alternative_phone VARCHAR(50),
  telegram_username VARCHAR(100),
  whatsapp_number VARCHAR(50),
  
  -- Адрес
  country VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  postal_code VARCHAR(20),
  region VARCHAR(100),
  
  -- Профессиональная информация
  occupation VARCHAR(100),
  employer VARCHAR(100),
  work_experience VARCHAR(50),
  monthly_income VARCHAR(50),
  source_of_funds VARCHAR(50),
  
  -- Образование
  education VARCHAR(50),
  university VARCHAR(100),
  graduation_year VARCHAR(10),
  specialization VARCHAR(100),
  
  -- Финансовая информация
  bank_name VARCHAR(100),
  account_number VARCHAR(100),
  routing_number VARCHAR(100),
  crypto_wallet VARCHAR(100),
  preferred_currency VARCHAR(10),
  
  -- Инвестиционный профиль
  investment_experience VARCHAR(50),
  risk_tolerance VARCHAR(50),
  investment_goals TEXT,
  expected_return VARCHAR(50),
  investment_horizon VARCHAR(50),
  
  -- Документы и верификация
  passport_number VARCHAR(50),
  passport_issue_date DATE,
  passport_expiry_date DATE,
  tax_id VARCHAR(50),
  
  -- Настройки безопасности
  two_factor_enabled BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Дополнительная информация
  bio TEXT,
  interests TEXT,
  languages TEXT,
  avatar TEXT,
  timezone VARCHAR(50),
  website VARCHAR(255),
  
  -- Системные поля
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица достижений пользователей
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  unlocked BOOLEAN DEFAULT false,
  progress INTEGER DEFAULT 0,
  unlock_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Таблица инвестиционных планов
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
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

-- Таблица инвестиций пользователей
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES investment_plans(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица транзакций
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- deposit, withdraw, profit, bonus, investment
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица запросов на пополнение
CREATE TABLE deposit_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- Таблица запросов на вывод
CREATE TABLE withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- Таблица настроек платежей
CREATE TABLE payment_settings (
    id SERIAL PRIMARY KEY,
    method_type VARCHAR(50) NOT NULL, -- 'card', 'crypto', 'sbp'
    method_name VARCHAR(100) NOT NULL,
    details JSONB NOT NULL, -- Store payment details as JSON
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек прибыли
CREATE TABLE profit_settings (
    id SERIAL PRIMARY KEY,
    accrual_interval INTEGER DEFAULT 86400, -- seconds (24 hours default)
    is_active BOOLEAN DEFAULT true,
    last_accrual TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица запусков проектов
CREATE TABLE project_launches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_launched BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  show_on_site BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  color_scheme VARCHAR(50) DEFAULT 'blue',
  icon_type VARCHAR(50) DEFAULT 'rocket',
  pre_launch_title VARCHAR(255),
  post_launch_title VARCHAR(255),
  pre_launch_description TEXT,
  post_launch_description TEXT,
  background_type VARCHAR(50) DEFAULT 'gradient',
  custom_css TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица статистики
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
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

-- Таблица настроек сайта
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  site_name VARCHAR(255) DEFAULT 'InvestPro',
  site_description TEXT DEFAULT 'Профессиональная инвестиционная платформа',
  contact_email VARCHAR(255) DEFAULT 'X453925x@gmail.com',
  registration_enabled BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  min_deposit DECIMAL(10,2) DEFAULT 50,
  max_deposit DECIMAL(10,2) DEFAULT 50000,
  min_withdraw DECIMAL(10,2) DEFAULT 10,
  withdraw_fee DECIMAL(5,2) DEFAULT 2,
  referral_bonus DECIMAL(5,2) DEFAULT 5,
  welcome_bonus DECIMAL(10,2) DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек внешнего вида
CREATE TABLE appearance_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  secondary_color VARCHAR(7) DEFAULT '#10b981',
  accent_color VARCHAR(7) DEFAULT '#f59e0b',
  dark_mode BOOLEAN DEFAULT false,
  logo_url VARCHAR(255) DEFAULT '/logo.png',
  favicon_url VARCHAR(255) DEFAULT '/favicon.ico',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек уведомлений
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  deposit_notifications BOOLEAN DEFAULT true,
  withdraw_notifications BOOLEAN DEFAULT true,
  investment_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. СОЗДАНИЕ ИНДЕКСОВ
-- =====================================================

-- Индексы для пользователей
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_login ON users(login);

-- Индексы для профилей
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_achievements_email ON user_achievements(user_email);

-- Индексы для инвестиций
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_plan_id ON investments(plan_id);
CREATE INDEX idx_investment_plans_active ON investment_plans(is_active);

-- Индексы для транзакций
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Индексы для запросов
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_deposit_requests_created_at ON deposit_requests(created_at DESC);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

-- Индексы для проектов
CREATE INDEX idx_project_launches_active ON project_launches(is_active);
CREATE INDEX idx_project_launches_show ON project_launches(show_on_site);
CREATE INDEX idx_project_launches_position ON project_launches(position);

-- =====================================================
-- 3. СОЗДАНИЕ ФУНКЦИЙ И ТРИГГЕРОВ
-- =====================================================

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON investment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profit_settings_updated_at BEFORE UPDATE ON profit_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция для обновления баланса пользователя
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_operation TEXT DEFAULT 'add'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    current_balance DECIMAL(15,2);
BEGIN
    -- Получаем текущий баланс
    SELECT COALESCE(balance, 0) INTO current_balance 
    FROM users 
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Выполняем операцию
    IF p_operation = 'add' THEN
        UPDATE users 
        SET balance = COALESCE(balance, 0) + p_amount,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        IF current_balance < p_amount THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
        
        UPDATE users 
        SET balance = COALESCE(balance, 0) - p_amount,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSE
        RAISE EXCEPTION 'Invalid operation';
    END IF;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating balance: %', SQLERRM;
END;
$$;

-- Функция для генерации реферального кода
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    code TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Генерируем случайный код из 8 символов
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Проверяем, не существует ли уже такой код
        SELECT COUNT(*) INTO exists_check FROM users WHERE referral_code = code;
        
        -- Если код уникален, выходим из цикла
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$;

-- =====================================================
-- 4. ВСТАВКА НАЧАЛЬНЫХ ДАННЫХ
-- =====================================================

-- Роли пользователей
INSERT INTO user_roles (name, display_name, description, permissions) VALUES
('super_admin', 'Супер Администратор', 'Полный доступ ко всем функциям', '{"admin": true, "users": true, "finance": true, "settings": true, "reports": true}'),
('admin', 'Администратор', 'Доступ к админ панели', '{"admin": true, "users": true, "finance": false, "settings": true, "reports": true}'),
('moderator', 'Модератор', 'Модерация контента и пользователей', '{"admin": false, "users": true, "finance": false, "settings": false, "reports": false}'),
('vip', 'VIP Пользователь', 'Премиум функции и привилегии', '{"admin": false, "users": false, "finance": false, "settings": false, "reports": false}'),
('user', 'Пользователь', 'Стандартный пользователь', '{"admin": false, "users": false, "finance": false, "settings": false, "reports": false}'),
('demo', 'Демо', 'Демонстрационный аккаунт', '{"admin": false, "users": false, "finance": false, "settings": false, "reports": false}')
ON CONFLICT (name) DO NOTHING;

-- Администратор
INSERT INTO users (
  id, login, email, full_name, password_hash, phone, country, 
  is_verified, is_active, balance, total_invested, total_earned, 
  referral_code, role_id, avatar_url, status, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'admin', 
  'admin@example.com', 
  'Главный Администратор', 
  '$2b$10$example.hash.for.testing.purposes.only', 
  '+7900000001', 
  'Russia', 
  true, 
  true, 
  100000.00, 
  0.00, 
  0.00, 
  'ADMIN001', 
  1, 
  '/avatars/admin.png', 
  'active', 
  NOW(), 
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  login = EXCLUDED.login,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role_id = EXCLUDED.role_id,
  updated_at = NOW();

-- Тестовый пользователь
INSERT INTO users (
  id, login, email, full_name, password_hash, phone, country, 
  is_verified, is_active, balance, total_invested, total_earned, 
  referral_code, role_id, avatar_url, status, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002', 
  'testuser', 
  'test@example.com', 
  'Тестовый Пользователь', 
  '$2b$10$example.hash.for.testing.purposes.only', 
  '+7900000002', 
  'Russia', 
  true, 
  true, 
  5000.00, 
  2000.00, 
  300.00, 
  'TEST001', 
  5, 
  '/avatars/test.png', 
  'active', 
  NOW(), 
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  login = EXCLUDED.login,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role_id = EXCLUDED.role_id,
  updated_at = NOW();

-- Инвестиционные планы
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

-- Настройки платежей
INSERT INTO payment_settings (method_type, method_name, details) VALUES
('card', 'Сбербанк', '{
    "card_number": "4444 5555 6666 7777", 
    "holder_name": "IVAN PETROV", 
    "bank_name": "Сбербанк", 
    "processing_time": "1-5 минут",
    "instructions": "Переведите указанную сумму на карту. Средства зачислятся автоматически после подтверждения платежа."
}'),
('sbp', 'СБП Сбербанк', '{
    "phone": "+7 922 123 45 67", 
    "bank_name": "Сбербанк", 
    "processing_time": "Мгновенно",
    "instructions": "Переведите через СБП на указанный номер телефона. Укажите в комментарии ваш email."
}'),
('crypto', 'USDT TRC-20', '{
    "address": "Dghggghggghhv45fhgghh", 
    "network": "TRON (TRC-20)", 
    "currency": "USDT",
    "processing_time": "5-15 минут",
    "instructions": "Отправьте USDT только в сети TRC-20! Отправка в другой сети приведет к потере средств."
}'),
('crypto', 'USDT TON', '{
    "address": "GryyggFhg6644ghhgghh", 
    "network": "TON", 
    "currency": "USDT",
    "processing_time": "3-10 минут",
    "instructions": "Отправьте USDT в сети TON на указанный адрес. Обязательно проверьте адрес перед отправкой."
}')
ON CONFLICT DO NOTHING;

-- Настройки прибыли
INSERT INTO profit_settings (accrual_interval, is_active, last_accrual) 
VALUES (86400, true, NOW())
ON CONFLICT DO NOTHING;

-- Запуск проекта
INSERT INTO project_launches (
  name, title, description, launch_date, is_launched, is_active, show_on_site,
  position, color_scheme, icon_type, pre_launch_title, post_launch_title,
  pre_launch_description, post_launch_description, background_type
) VALUES (
  'Initial Launch',
  'До запуска проекта',
  'Следите за обратным отсчетом до официального запуска',
  NOW() + INTERVAL '30 days',
  false, true, true, 1, 'blue', 'rocket',
  'До запуска проекта',
  'Проект запущен!',
  'Следите за обратным отсчетом до официального запуска',
  'Наша платформа успешно работает',
  'gradient'
) ON CONFLICT DO NOTHING;

-- Статистика
INSERT INTO statistics (
  id, users_count, users_change, investments_amount, investments_change,
  payouts_amount, payouts_change, profitability_rate, profitability_change
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  15420, 12.5, 2850000, 8.3, 1920000, 15.7, 24.8, 3.2
) ON CONFLICT (id) DO UPDATE SET
  users_count = EXCLUDED.users_count,
  users_change = EXCLUDED.users_change,
  investments_amount = EXCLUDED.investments_amount,
  investments_change = EXCLUDED.investments_change,
  payouts_amount = EXCLUDED.payouts_amount,
  payouts_change = EXCLUDED.payouts_change,
  profitability_rate = EXCLUDED.profitability_rate,
  profitability_change = EXCLUDED.profitability_change,
  updated_at = NOW();

-- Настройки сайта
INSERT INTO site_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') 
ON CONFLICT DO NOTHING;

INSERT INTO appearance_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') 
ON CONFLICT DO NOTHING;

INSERT INTO notification_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') 
ON CONFLICT DO NOTHING;

-- Профиль тестового пользователя
INSERT INTO user_profiles (
  email, first_name, last_name, middle_name, date_of_birth, gender, nationality, marital_status,
  phone, telegram_username, whatsapp_number,
  country, city, address, postal_code, region,
  occupation, employer, work_experience, monthly_income, source_of_funds,
  education, university, graduation_year, specialization,
  bank_name, account_number, crypto_wallet, preferred_currency,
  investment_experience, risk_tolerance, investment_goals, expected_return, investment_horizon,
  passport_number, passport_issue_date, passport_expiry_date, tax_id,
  two_factor_enabled, email_notifications, sms_notifications, push_notifications,
  bio, interests, languages, timezone, website
) VALUES (
  'test@example.com', 'Иван', 'Петров', 'Сергеевич', '1990-05-15', 'male', 'Россия', 'married',
  '+7 (999) 123-45-67', '@ivanpetrov', '+7 (999) 123-45-67',
  'russia', 'Москва', 'ул. Тверская, д. 1, кв. 100', '125009', 'Московская область',
  'Senior Developer', 'Tech Solutions LLC', '5-10', '100000-250000', 'salary',
  'master', 'МГУ им. М.В. Ломоносова', '2015', 'Информационные технологии',
  'Сбербанк', '40817810123456789012', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'usd',
  'intermediate', 'medium', 'Долгосрочный рост капитала', '15-25%', '5-10 лет',
  '1234 567890', '2020-01-15', '2030-01-15', '123456789012',
  true, true, false, true,
  'Опытный разработчик с 10+ летним стажем. Увлекаюсь инвестициями и финансовыми технологиями.', 
  'Программирование, Инвестиции, Путешествия', 
  'Русский (родной), Английский (свободно), Немецкий (базовый)', 
  'Europe/Moscow', 
  'https://ivanpetrov.dev'
) ON CONFLICT (email) DO NOTHING;

-- Достижения тестового пользователя
INSERT INTO user_achievements (user_email, title, description, icon, unlocked, progress, unlock_date) VALUES
('test@example.com', 'Первая инвестиция', 'Совершили первую инвестицию', '🎯', true, 100, '2025-01-15'),
('test@example.com', 'VIP статус', 'Достигли VIP уровня', '👑', true, 100, '2025-02-01'),
('test@example.com', 'Верификация', 'Прошли полную верификацию', '✅', true, 100, '2025-01-10'),
('test@example.com', 'Реферальный мастер', 'Пригласили 10+ друзей', '🤝', false, 70, NULL),
('test@example.com', 'Инвестор года', 'Лучший ROI в этом году', '🏆', false, 65, NULL),
('test@example.com', 'Миллионер', 'Достигли $1,000,000 в портфеле', '💎', false, 15, NULL)
ON CONFLICT DO NOTHING;

-- Тестовые запросы на пополнение
INSERT INTO deposit_requests (user_id, amount, method, payment_details, status, created_at) VALUES
('00000000-0000-0000-0000-000000000002', 500.00, 'Банковская карта', '{"card_number": "4444 5555 6666 7777", "holder_name": "IVAN PETROV"}', 'pending', NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-0000-000000000002', 1000.00, 'USDT TRC-20', '{"address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"}', 'pending', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000002', 250.00, 'СБП', '{"phone": "+7 922 123 45 67"}', 'approved', NOW() - INTERVAL '3 hours')
ON CONFLICT DO NOTHING;

-- Тестовые запросы на вывод
INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status, created_at) VALUES
('00000000-0000-0000-0000-000000000002', 300.00, 'Банковская карта', '4444 5555 6666 7777', 6.00, 294.00, 'pending', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000002', 150.00, 'USDT TRC-20', 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', 1.50, 148.50, 'pending', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. СОЗДАНИЕ ПРЕДСТАВЛЕНИЙ
-- =====================================================

-- Представление пользователей с ролями
CREATE OR REPLACE VIEW users_with_roles AS
SELECT 
  u.*,
  r.name as role_name,
  r.display_name as role_display_name,
  r.description as role_description,
  r.permissions as role_permissions
FROM users u
LEFT JOIN user_roles r ON u.role_id = r.id;

-- Представление активных инвестиций
CREATE OR REPLACE VIEW active_investments AS
SELECT 
  i.*,
  u.full_name as user_name,
  u.email as user_email,
  p.name as plan_name,
  p.daily_percent
FROM investments i
JOIN users u ON i.user_id = u.id
JOIN investment_plans p ON i.plan_id = p.id
WHERE i.status = 'active' AND i.end_date > NOW();

-- =====================================================
-- БАЗА ДАННЫХ ГОТОВА К ИСПОЛЬЗОВАНИЮ!
-- =====================================================

-- Для входа в админ панель используйте:
-- Email: admin@example.com
-- Password: X12345x

-- Для тестирования используйте:
-- Email: test@example.com  
-- Password: X12345x

-- Все таблицы созданы, данные загружены, индексы настроены!
