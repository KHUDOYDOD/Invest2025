-- Проверяем существующую структуру таблицы
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'investment_plans';

-- Удаляем и пересоздаем таблицу с правильной структурой
DROP TABLE IF EXISTS investment_plans CASCADE;

CREATE TABLE investment_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    max_amount DECIMAL(15,2) NOT NULL DEFAULT 999999999,
    daily_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    duration_days INTEGER NOT NULL DEFAULT 30,
    total_return DECIMAL(5,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    features JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем тестовые планы
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_percent, duration_days, total_return, features) VALUES
('Starter Plan', 'Идеально для начинающих инвесторов', 100, 999, 1.5, 30, 45, '["Ежедневные выплаты", "Минимальный риск", "24/7 поддержка"]'),
('Professional Plan', 'Для опытных инвесторов', 1000, 9999, 2.0, 45, 90, '["Высокая доходность", "Персональный менеджер", "Приоритетная поддержка"]'),
('VIP Plan', 'Максимальная доходность', 10000, 99999, 2.5, 60, 150, '["Максимальная прибыль", "VIP статус", "Эксклюзивные предложения"]'),
('Premium Plan', 'Для крупных инвесторов', 100000, 999999, 3.0, 90, 270, '["Премиум доходность", "Индивидуальные условия", "Личный консультант"]');

-- Проверяем что данные добавились
SELECT * FROM investment_plans ORDER BY min_amount;
