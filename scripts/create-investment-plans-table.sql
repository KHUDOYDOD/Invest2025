-- Создание таблицы инвестиционных планов
CREATE TABLE IF NOT EXISTS investment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL, -- в днях
    total_return DECIMAL(5,2) NOT NULL,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы инвестиций пользователей
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES investment_plans(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) NOT NULL,
    total_profit DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_investment_plans_active ON investment_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_investments_end_date ON investments(end_date);

-- Вставляем демо планы
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_percent, duration, total_return, features) VALUES
('Стартер', 'Идеальный план для начинающих инвесторов', 100, 1000, 2.0, 30, 60.0, '["Ежедневные выплаты", "Реинвестирование", "Страхование вклада", "24/7 поддержка"]'),
('Премиум', 'Для опытных инвесторов с высокой доходностью', 1000, 5000, 3.0, 15, 45.0, '["Ежедневные выплаты", "Реинвестирование", "Страхование вклада", "Приоритетная поддержка", "Персональный менеджер"]'),
('VIP Elite', 'Эксклюзивный план для VIP клиентов', 5000, 50000, 4.0, 10, 40.0, '["Ежедневные выплаты", "Реинвестирование", "Полное страхование", "VIP поддержка 24/7", "Персональный менеджер", "Эксклюзивные инвестиции", "Приоритетный вывод"]')
ON CONFLICT DO NOTHING;
