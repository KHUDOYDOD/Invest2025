-- Создание локальной базы данных с таблицами и демо-пользователями

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0,
  role VARCHAR(50) DEFAULT 'user',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы инвестиционных планов
CREATE TABLE IF NOT EXISTS investment_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  min_amount DECIMAL(15, 2) NOT NULL,
  max_amount DECIMAL(15, 2) NOT NULL,
  roi_percentage DECIMAL(5, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы транзакций
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  payment_method VARCHAR(100),
  transaction_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы инвестиций
CREATE TABLE IF NOT EXISTS investments (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(id),
  plan_id INTEGER REFERENCES investment_plans(id),
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  total_profit DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка инвестиционных планов
INSERT INTO investment_plans (name, min_amount, max_amount, roi_percentage, duration_days) VALUES
('Стартовый', 10, 999, 8, 30),
('Продвинутый', 1000, 4999, 12, 60),
('Профессиональный', 5000, 50000, 20, 90);

-- Создание администратора
INSERT INTO users (id, full_name, email, password_hash, balance, role, created_at) VALUES
('admin-user-id', 'Администратор', 'zabon3', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 5000.00, 'admin', NOW());

-- Создание 5 реалистичных пользователей
INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at) VALUES
('user-maria-demo', 'Мария Смирнова', 'maria.smirnova@gmail.com', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 300.00, 'user', '+7 926 123 4567', '2024-12-15 10:30:00'),
('user-alexei-demo', 'Алексей Петров', 'alexei.petrov@yandex.ru', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 500.00, 'user', '+7 915 987 6543', '2024-12-20 14:45:00'),
('user-elena-demo', 'Елена Козлова', 'elena.kozlova@mail.ru', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 200.00, 'user', '+7 903 456 7890', '2025-01-05 09:15:00'),
('user-dmitri-demo', 'Дмитрий Волков', 'dmitri.volkov@outlook.com', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 500.00, 'user', '+7 962 321 0987', '2025-01-10 16:20:00'),
('user-anna-demo', 'Анна Соколова', 'anna.sokolova@rambler.ru', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 350.00, 'user', '+7 945 654 3210', '2025-01-15 11:30:00');

-- Добавление транзакций депозитов
INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at) VALUES
('user-maria-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'bank_transfer', '2024-12-15 10:35:00'),
('user-alexei-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'card', '2024-12-20 14:50:00'),
('user-elena-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'crypto', '2025-01-05 09:20:00'),
('user-dmitri-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'bank_transfer', '2025-01-10 16:25:00'),
('user-anna-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'card', '2025-01-15 11:35:00');

-- Добавление инвестиций
INSERT INTO investments (user_id, plan_id, amount, status, total_profit, created_at) VALUES
('user-maria-demo', 1, 200.00, 'active', 15.50, '2024-12-16 12:00:00'),
('user-elena-demo', 2, 300.00, 'active', 45.80, '2025-01-06 10:30:00'),
('user-anna-demo', 1, 150.00, 'active', 12.25, '2025-01-16 14:15:00');

-- Добавление транзакций инвестирования
INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at) VALUES
('user-maria-demo', 'investment', 200.00, 'completed', 'Инвестирование в план "Стартовый"', 'balance', '2024-12-16 12:00:00'),
('user-elena-demo', 'investment', 300.00, 'completed', 'Инвестирование в план "Продвинутый"', 'balance', '2025-01-06 10:30:00'),
('user-anna-demo', 'investment', 150.00, 'completed', 'Инвестирование в план "Стартовый"', 'balance', '2025-01-16 14:15:00');

-- Дополнительные транзакции для активности
INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at) VALUES
('user-alexei-demo', 'withdrawal', 100.00, 'pending', 'Вывод на банковскую карту', 'bank_transfer', '2024-12-25 15:30:00'),
('user-dmitri-demo', 'deposit', 200.00, 'pending', 'Дополнительное пополнение', 'crypto', '2025-01-12 09:45:00'),
('user-maria-demo', 'withdrawal', 50.00, 'completed', 'Частичный вывод', 'card', '2024-12-20 18:20:00');