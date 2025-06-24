-- Полная настройка базы данных для инвестиционной платформы
-- Удаляем существующие таблицы если они есть
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;

-- Создаем таблицу пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    referral_code VARCHAR(50) UNIQUE,
    referred_by UUID REFERENCES users(id),
    role_id INTEGER DEFAULT 2, -- 1 = admin, 2 = user
    status VARCHAR(20) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем профили пользователей
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    date_of_birth DATE,
    avatar_url TEXT,
    telegram VARCHAR(100),
    whatsapp VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем планы инвестиций
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL, -- в днях
    total_return DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем инвестиции
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_profit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем транзакции
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, investment, profit, referral
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, cancelled
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    reference VARCHAR(255),
    admin_comment TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем запросы на пополнение
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    admin_comment TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    admin_comment TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем настройки сайта
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем статистику
CREATE TABLE statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_users INTEGER DEFAULT 0,
    total_deposits DECIMAL(15,2) DEFAULT 0.00,
    total_withdrawals DECIMAL(15,2) DEFAULT 0.00,
    total_investments DECIMAL(15,2) DEFAULT 0.00,
    total_profit_paid DECIMAL(15,2) DEFAULT 0.00,
    active_investments INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем функцию для обновления баланса
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_operation VARCHAR(10) -- 'add' или 'subtract'
)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance DECIMAL(15,2);
BEGIN
    -- Получаем текущий баланс
    SELECT balance INTO current_balance FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Проверяем операцию
    IF p_operation = 'add' THEN
        UPDATE users SET 
            balance = balance + p_amount,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        IF current_balance < p_amount THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
        
        UPDATE users SET 
            balance = balance - p_amount,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSE
        RAISE EXCEPTION 'Invalid operation. Use add or subtract';
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Создаем функцию для генерации реферального кода
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(50) AS $$
DECLARE
    code VARCHAR(50);
    exists_check INTEGER;
BEGIN
    LOOP
        code := 'REF' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        SELECT COUNT(*) INTO exists_check FROM users WHERE referral_code = code;
        EXIT WHEN exists_check = 0;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггеры ко всем таблицам
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON investment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deposit_requests_updated_at BEFORE UPDATE ON deposit_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Создаем триггер для автоматической генерации реферального кода
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_referral_code BEFORE INSERT ON users FOR EACH ROW EXECUTE FUNCTION set_referral_code();

-- Создаем индексы для оптимизации
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);

-- Вставляем планы инвестиций
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_percent, duration, total_return) VALUES
('Стартер', 'Идеальный план для начинающих инвесторов', 100, 999, 1.5, 30, 45),
('Стандарт', 'Сбалансированный план с хорошей доходностью', 1000, 4999, 2.0, 45, 90),
('Премиум', 'Высокодоходный план для опытных инвесторов', 5000, 19999, 2.5, 60, 150),
('VIP', 'Эксклюзивный план с максимальной доходностью', 20000, 100000, 3.0, 90, 270);

-- Создаем администратора
INSERT INTO users (email, password_hash, full_name, balance, role_id, status, email_verified) VALUES
('admin@nevinev.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Администратор', 0, 1, 'active', true);

-- Создаем тестового пользователя
INSERT INTO users (email, password_hash, full_name, balance, role_id, status, email_verified) VALUES
('test@nevinev.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Тестовый пользователь', 25000, 2, 'active', true);

-- Вставляем настройки сайта
INSERT INTO site_settings (key, value, description) VALUES
('site_name', 'NEVINEV Investment', 'Название сайта'),
('site_description', 'Надежная инвестиционная платформа', 'Описание сайта'),
('min_deposit', '50', 'Минимальная сумма пополнения'),
('min_withdrawal', '25', 'Минимальная сумма вывода'),
('withdrawal_fee', '2', 'Комиссия за вывод в процентах'),
('referral_bonus', '5', 'Реферальный бонус в процентах'),
('support_email', 'support@nevinev.com', 'Email поддержки'),
('support_telegram', '@nevinev_support', 'Telegram поддержки');

-- Вставляем начальную статистику
INSERT INTO statistics (total_users, total_deposits, total_withdrawals, total_investments, total_profit_paid, active_investments) VALUES
(2, 0, 0, 0, 0, 0);

-- Создаем представления для удобных запросов
CREATE VIEW user_dashboard_view AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.balance,
    u.total_invested,
    u.total_profit,
    u.referral_count,
    u.role_id,
    COUNT(i.id) as active_investments_count,
    COALESCE(SUM(i.daily_profit), 0) as daily_profit_total
FROM users u
LEFT JOIN investments i ON u.id = i.user_id AND i.status = 'active'
GROUP BY u.id, u.email, u.full_name, u.balance, u.total_invested, u.total_profit, u.referral_count, u.role_id;

-- Создаем функцию для начисления прибыли
CREATE OR REPLACE FUNCTION accrue_daily_profits()
RETURNS INTEGER AS $$
DECLARE
    investment_record RECORD;
    profit_count INTEGER := 0;
BEGIN
    FOR investment_record IN 
        SELECT * FROM investments 
        WHERE status = 'active' 
        AND last_profit_date < CURRENT_DATE
        AND end_date > NOW()
    LOOP
        -- Начисляем прибыль
        PERFORM update_user_balance(investment_record.user_id, investment_record.daily_profit, 'add');
        
        -- Обновляем общую прибыль по инвестиции
        UPDATE investments SET 
            total_profit = total_profit + investment_record.daily_profit,
            last_profit_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = investment_record.id;
        
        -- Обновляем общую прибыль пользователя
        UPDATE users SET 
            total_profit = total_profit + investment_record.daily_profit,
            updated_at = NOW()
        WHERE id = investment_record.user_id;
        
        -- Создаем транзакцию
        INSERT INTO transactions (user_id, type, amount, status, description, method, final_amount)
        VALUES (
            investment_record.user_id,
            'profit',
            investment_record.daily_profit,
            'completed',
            'Ежедневная прибыль от инвестиции',
            'Автоначисление',
            investment_record.daily_profit
        );
        
        profit_count := profit_count + 1;
    END LOOP;
    
    RETURN profit_count;
END;
$$ LANGUAGE plpgsql;

COMMIT;
