-- Полная настройка базы данных

-- Удаляем существующие таблицы
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS project_launches CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;

-- Создаем таблицу пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    role_id INTEGER DEFAULT 2, -- 1 = admin, 2 = user
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем админа
INSERT INTO users (email, full_name, password_hash, role_id, balance) VALUES 
('admin@example.com', 'Администратор', 'X12345x', 1, 100000.00);

-- Создаем таблицу планов инвестиций
CREATE TABLE investment_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL, -- в днях
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем планы инвестиций
INSERT INTO investment_plans (name, min_amount, max_amount, daily_percent, duration) VALUES
('Стартовый', 100.00, 999.99, 1.5, 30),
('Стандартный', 1000.00, 4999.99, 2.0, 45),
('Премиум', 5000.00, 19999.99, 2.5, 60),
('VIP', 20000.00, 99999.99, 3.0, 90);

-- Создаем таблицу инвестиций
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу запросов на пополнение
CREATE TABLE deposit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    payment_details JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу запросов на вывод
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(100) NOT NULL,
    wallet_address VARCHAR(255),
    fee DECIMAL(15,2) DEFAULT 0.00,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу статистики
CREATE TABLE statistics (
    id SERIAL PRIMARY KEY,
    total_users INTEGER DEFAULT 0,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_withdrawn DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    active_investments INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем начальную статистику
INSERT INTO statistics (total_users, total_invested, total_withdrawn, total_profit, active_investments) 
VALUES (1, 0.00, 0.00, 0.00, 0);

-- Создаем таблицу запусков проектов
CREATE TABLE project_launches (
    id SERIAL PRIMARY KEY,
    launch_date TIMESTAMP NOT NULL,
    pre_launch_title VARCHAR(255),
    is_launched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем запуск проекта (уже запущен)
INSERT INTO project_launches (launch_date, pre_launch_title, is_launched) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '1 day', 'Платформа запущена!', TRUE);

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
        RETURN FALSE;
    END IF;
    
    -- Проверяем операцию
    IF p_operation = 'add' THEN
        UPDATE users SET balance = balance + p_amount, updated_at = CURRENT_TIMESTAMP WHERE id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        IF current_balance >= p_amount THEN
            UPDATE users SET balance = balance - p_amount, updated_at = CURRENT_TIMESTAMP WHERE id = p_user_id;
        ELSE
            RETURN FALSE; -- Недостаточно средств
        END IF;
    ELSE
        RETURN FALSE; -- Неверная операция
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Создаем функцию для обновления статистики
CREATE OR REPLACE FUNCTION update_statistics()
RETURNS VOID AS $$
BEGIN
    UPDATE statistics SET
        total_users = (SELECT COUNT(*) FROM users WHERE role_id = 2),
        total_invested = (SELECT COALESCE(SUM(total_invested), 0) FROM users),
        total_profit = (SELECT COALESCE(SUM(total_profit), 0) FROM users),
        active_investments = (SELECT COUNT(*) FROM investments WHERE status = 'active'),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

-- Создаем индексы для оптимизации
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);

-- Создаем триггер для автоматического обновления статистики
CREATE OR REPLACE FUNCTION trigger_update_statistics()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_statistics();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_user_change
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_update_statistics();

CREATE TRIGGER update_stats_on_investment_change
    AFTER INSERT OR UPDATE OR DELETE ON investments
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_update_statistics();
