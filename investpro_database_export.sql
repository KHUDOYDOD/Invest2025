-- =============================================================
-- InvestPro Database Export
-- Экспорт базы данных инвестиционной платформы
-- Дата: 12 августа 2025
-- =============================================================

-- Создание таблиц
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS investment_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Таблица пользователей
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    role VARCHAR(20) DEFAULT 'user',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица планов инвестирования
CREATE TABLE investment_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    roi_percentage DECIMAL(5,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица транзакций
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    payment_method VARCHAR(50),
    transaction_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица инвестиций
CREATE TABLE investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    plan_id INTEGER NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES investment_plans(id) ON DELETE CASCADE
);

-- =============================================================
-- ДАННЫЕ
-- =============================================================

-- Планы инвестирования
INSERT INTO investment_plans (id, name, min_amount, max_amount, roi_percentage, duration_days, created_at) VALUES
(1, 'Стартовый', 10.00, 999.00, 8.00, 30, '2025-08-09 08:56:28.886237'),
(2, 'Продвинутый', 1000.00, 4999.00, 12.00, 60, '2025-08-09 08:56:28.886237'),
(3, 'Профессиональный', 5000.00, 50000.00, 20.00, 90, '2025-08-09 08:56:28.886237');

-- Пользователи (все пароли: password123 для демо, zabon3 для админа)
INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) VALUES
('1', 'Администратор', 'zabon3', '$2b$10$QQjTFxcL4iMFE8VHdMvOkeSgBb4E108JC2aM/JmC.XyaUMNRIPWr2', 5000.00, 'admin', NULL, '2025-08-09 08:56:28.959849', '2025-08-09 08:56:28.959849'),
('user-maria-demo', 'Мария Смирнова', 'maria.smirnova@gmail.com', '$2b$10$MttSQXQD.m25picHHLuL2eJrEMzECYO.SPgbfCb8UlLfeUTSWaiLW', 300.00, 'user', '+7 926 123 4567', '2024-12-15 10:30:00', '2025-08-09 08:56:29.03727'),
('user-alexei-demo', 'Алексей Петров', 'alexei.petrov@yandex.ru', '$2b$10$MttSQXQD.m25picHHLuL2eJrEMzECYO.SPgbfCb8UlLfeUTSWaiLW', 500.00, 'user', '+7 915 987 6543', '2024-12-20 14:45:00', '2025-08-09 08:56:29.03727'),
('user-elena-demo', 'Елена Козлова', 'elena.kozlova@mail.ru', '$2b$10$MttSQXQD.m25picHHLuL2eJrEMzECYO.SPgbfCb8UlLfeUTSWaiLW', 200.00, 'user', '+7 903 456 7890', '2025-01-05 09:15:00', '2025-08-09 08:56:29.03727'),
('user-dmitri-demo', 'Дмитрий Волков', 'dmitri.volkov@outlook.com', '$2b$10$MttSQXQD.m25picHHLuL2eJrEMzECYO.SPgbfCb8UlLfeUTSWaiLW', 500.00, 'user', '+7 962 321 0987', '2025-01-10 16:20:00', '2025-08-09 08:56:29.03727'),
('user-anna-demo', 'Анна Соколова', 'anna.sokolova@rambler.ru', '$2b$10$MttSQXQD.m25picHHLuL2eJrEMzECYO.SPgbfCb8UlLfeUTSWaiLW', 350.00, 'user', '+7 945 654 3210', '2025-01-15 11:30:00', '2025-08-09 08:56:29.03727');

-- Транзакции
INSERT INTO transactions (id, user_id, type, amount, status, description, payment_method, transaction_hash, created_at, updated_at) VALUES
-- Депозиты демо пользователей
('e44b1589-cdb1-4760-baf0-d59120e8aee0', 'user-maria-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'bank_transfer', NULL, '2024-12-15 10:35:00', '2025-08-09 08:56:29.110926'),
('b40ef9a3-4e87-4832-bf07-9889d7280370', 'user-alexei-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'card', NULL, '2024-12-20 14:50:00', '2025-08-09 08:56:29.110926'),
('29a7b073-059d-4d11-8f09-6fa60cc97123', 'user-elena-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'crypto', NULL, '2025-01-05 09:20:00', '2025-08-09 08:56:29.110926'),
('68cfe8ac-d460-4b1b-8d6a-b5dfd5065cb4', 'user-dmitri-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'bank_transfer', NULL, '2025-01-10 16:25:00', '2025-08-09 08:56:29.110926'),
('4aa542bb-6c85-4b07-b371-3a35c0f1c4f2', 'user-anna-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'card', NULL, '2025-01-15 11:35:00', '2025-08-09 08:56:29.110926'),

-- Инвестиции демо пользователей
('7f48f9a0-b21c-47e0-99c0-293eff5624ef', 'user-maria-demo', 'investment', 200.00, 'completed', 'Инвестирование в план "Стартовый"', 'balance', NULL, '2024-12-16 12:00:00', '2025-08-09 08:56:29.26275'),
('f3632d5a-3b8f-4882-bd91-7e70693f11ee', 'user-elena-demo', 'investment', 300.00, 'completed', 'Инвестирование в план "Продвинутый"', 'balance', NULL, '2025-01-06 10:30:00', '2025-08-09 08:56:29.26275'),
('2fa102e8-07b7-4804-a317-cbbfa2e42807', 'user-anna-demo', 'investment', 150.00, 'completed', 'Инвестирование в план "Стартовый"', 'balance', NULL, '2025-01-16 14:15:00', '2025-08-09 08:56:29.26275'),

-- Выводы и дополнительные транзакции
('b00b505b-d988-481e-b102-e0a732d481e1', 'user-alexei-demo', 'withdrawal', 100.00, 'pending', 'Вывод на банковскую карту', 'bank_transfer', NULL, '2024-12-25 15:30:00', '2025-08-09 08:56:29.335333'),
('8003d1cd-23a8-4470-b631-281c9020cb46', 'user-dmitri-demo', 'deposit', 200.00, 'pending', 'Дополнительное пополнение', 'crypto', NULL, '2025-01-12 09:45:00', '2025-08-09 08:56:29.335333'),
('967ac0b9-fbdb-43ce-87f4-31b38dbc8fdd', 'user-maria-demo', 'withdrawal', 50.00, 'completed', 'Частичный вывод', 'card', NULL, '2024-12-20 18:20:00', '2025-08-09 08:56:29.335333'),

-- Транзакции администратора
('0ec7dfbe-2f37-455b-9484-6c9ebd383696', '1', 'deposit', 1000.00, 'completed', 'Тестовое пополнение', NULL, NULL, '2025-08-12 15:17:09.33795', '2025-08-12 15:17:09.33795'),
('9c00cb6b-bc0d-43a7-94e9-ef5dc2213e4c', '1', 'investment', 300.00, 'completed', 'Инвестиция в Базовый план', NULL, NULL, '2025-08-12 15:17:09.33795', '2025-08-12 15:17:09.33795'),
('67efd0cb-4cca-4385-935a-198bc0203f39', '1', 'profit', 25.00, 'completed', 'Прибыль от инвестиций', NULL, NULL, '2025-08-12 15:17:09.33795', '2025-08-12 15:17:09.33795');

-- Инвестиции
INSERT INTO investments (id, user_id, plan_id, amount, status, total_profit, created_at, updated_at) VALUES
-- Инвестиции демо пользователей
('c54d8b72-d908-4291-90b6-1395c1116b0a', 'user-maria-demo', 1, 200.00, 'active', 15.50, '2024-12-16 12:00:00', '2025-08-09 08:56:29.188256'),
('5ca73f4f-a2b1-460d-87c6-315362c08ea1', 'user-elena-demo', 2, 300.00, 'active', 45.80, '2025-01-06 10:30:00', '2025-08-09 08:56:29.188256'),
('e9053888-7093-40eb-ad72-ad82639fdd07', 'user-anna-demo', 1, 150.00, 'active', 12.25, '2025-01-16 14:15:00', '2025-08-09 08:56:29.188256'),

-- Инвестиции администратора
('0feeee70-68e0-42c7-98c7-0533d97bc48b', '1', 1, 300.00, 'active', 25.00, '2025-08-12 15:17:10.451472', '2025-08-12 15:17:10.451472'),
('b3912e47-604f-46b1-ae06-24d6b23262ec', '1', 2, 500.00, 'active', 45.00, '2025-08-12 15:17:10.451472', '2025-08-12 15:17:10.451472');

-- =============================================================
-- ПОЯСНЕНИЯ К АККАУНТАМ
-- =============================================================

-- АДМИНИСТРАТИВНЫЙ АККАУНТ:
-- Email/Login: zabon3
-- Пароль: zabon3
-- Роль: admin
-- Баланс: $5000

-- ДЕМО ПОЛЬЗОВАТЕЛИ:
-- Все демо пользователи имеют пароль: password123
-- 1. maria.smirnova@gmail.com (Мария Смирнова) - баланс $300
-- 2. alexei.petrov@yandex.ru (Алексей Петров) - баланс $500  
-- 3. elena.kozlova@mail.ru (Елена Козлова) - баланс $200
-- 4. dmitri.volkov@outlook.com (Дмитрий Волков) - баланс $500
-- 5. anna.sokolova@rambler.ru (Анна Соколова) - баланс $350

-- =============================================================
-- СТАТИСТИКА БАЗЫ ДАННЫХ:
-- • Всего пользователей: 6 (1 админ + 5 демо)
-- • Всего транзакций: 14
-- • Всего инвестиций: 5  
-- • Планов инвестирования: 3
-- • Общая сумма инвестиций: $1,450
-- • Общая прибыль: $143.55
-- =============================================================

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_plan_id ON investments(plan_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);

-- Обновление последовательностей
SELECT setval('investment_plans_id_seq', (SELECT MAX(id) FROM investment_plans));

COMMIT;