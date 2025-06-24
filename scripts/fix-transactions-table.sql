-- Удаляем старую таблицу если есть проблемы
DROP TABLE IF EXISTS transactions CASCADE;

-- Создаем новую таблицу транзакций
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    method VARCHAR(100),
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2),
    wallet_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индексы
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Добавляем тестовые данные
INSERT INTO transactions (user_id, type, amount, status, description, method, created_at) VALUES
('test-user-1', 'deposit', 1000.00, 'completed', 'Тестовое пополнение', 'Bitcoin', NOW()),
('test-user-1', 'investment', 500.00, 'active', 'Тестовая инвестиция', 'balance', NOW() - INTERVAL '1 hour'),
('test-user-1', 'withdrawal', 200.00, 'pending', 'Тестовый вывод', 'Ethereum', NOW() - INTERVAL '2 hours');

-- Проверяем что данные добавились
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
