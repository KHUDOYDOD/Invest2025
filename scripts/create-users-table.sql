-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    balance DECIMAL(10,2) DEFAULT 0.00,
    total_invested DECIMAL(10,2) DEFAULT 0.00,
    total_profit DECIMAL(10,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Вставляем тестового пользователя
INSERT INTO users (email, full_name, balance, total_invested, total_profit, referral_count) 
VALUES ('user@example.com', 'Иван Петров', 1500.00, 500.00, 150.00, 3)
ON CONFLICT (email) DO NOTHING;

-- Вставляем админа
INSERT INTO users (email, full_name, balance, total_invested, total_profit, referral_count) 
VALUES ('admin@example.com', 'Администратор', 10000.00, 0.00, 0.00, 0)
ON CONFLICT (email) DO NOTHING;
