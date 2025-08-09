-- Создание 5 реалистичных демо-аккаунтов с балансом $500 каждому
-- Пароли для всех: password123

-- Мария Смирнова
INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) VALUES
('user-maria-demo', 'Мария Смирнова', 'maria.smirnova@gmail.com', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 500.00, 'user', '+7 926 123 4567', '2024-12-15 10:30:00', NOW())
ON CONFLICT (email) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  balance = EXCLUDED.balance;

-- Алексей Петров  
INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) VALUES
('user-alexei-demo', 'Алексей Петров', 'alexei.petrov@yandex.ru', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 500.00, 'user', '+7 915 987 6543', '2024-12-20 14:45:00', NOW())
ON CONFLICT (email) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  balance = EXCLUDED.balance;

-- Елена Козлова
INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) VALUES
('user-elena-demo', 'Елена Козлова', 'elena.kozlova@mail.ru', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 500.00, 'user', '+7 903 456 7890', '2025-01-05 09:15:00', NOW())
ON CONFLICT (email) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  balance = EXCLUDED.balance;

-- Дмитрий Волков
INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) VALUES
('user-dmitri-demo', 'Дмитрий Волков', 'dmitri.volkov@outlook.com', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 500.00, 'user', '+7 962 321 0987', '2025-01-10 16:20:00', NOW())
ON CONFLICT (email) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  balance = EXCLUDED.balance;

-- Анна Соколова
INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) VALUES
('user-anna-demo', 'Анна Соколова', 'anna.sokolova@rambler.ru', '$2b$10$rO0H6QcF3V9L.5n3rY8aeuQmD1yCp9VX2QzJ7TfA5l8L9rU0kJ1aC', 500.00, 'user', '+7 945 654 3210', '2025-01-15 11:30:00', NOW())
ON CONFLICT (email) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  balance = EXCLUDED.balance;

-- Добавляем депозитные транзакции для каждого пользователя
INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at) VALUES
('user-maria-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'bank_transfer', '2024-12-15 10:35:00', NOW()),
('user-alexei-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'card', '2024-12-20 14:50:00', NOW()),
('user-elena-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'crypto', '2025-01-05 09:20:00', NOW()),
('user-dmitri-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'bank_transfer', '2025-01-10 16:25:00', NOW()),
('user-anna-demo', 'deposit', 500.00, 'completed', 'Стартовый депозит', 'card', '2025-01-15 11:35:00', NOW());

-- Добавляем инвестиции для некоторых пользователей
INSERT INTO investments (user_id, plan_id, amount, status, total_profit, created_at, updated_at) VALUES
('user-maria-demo', 1, 200.00, 'active', 15.50, '2024-12-16 12:00:00', NOW()),
('user-elena-demo', 2, 300.00, 'active', 45.80, '2025-01-06 10:30:00', NOW()),
('user-anna-demo', 1, 150.00, 'active', 12.25, '2025-01-16 14:15:00', NOW());

-- Добавляем транзакции инвестирования
INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at) VALUES
('user-maria-demo', 'investment', 200.00, 'completed', 'Инвестирование в план "Стартовый"', 'balance', '2024-12-16 12:00:00', NOW()),
('user-elena-demo', 'investment', 300.00, 'completed', 'Инвестирование в план "Продвинутый"', 'balance', '2025-01-06 10:30:00', NOW()),
('user-anna-demo', 'investment', 150.00, 'completed', 'Инвестирование в план "Стартовый"', 'balance', '2025-01-16 14:15:00', NOW());

-- Обновляем баланс пользователей после инвестиций
UPDATE users SET balance = 300.00 WHERE id = 'user-maria-demo';
UPDATE users SET balance = 200.00 WHERE id = 'user-elena-demo'; 
UPDATE users SET balance = 350.00 WHERE id = 'user-anna-demo';

-- Добавляем дополнительные транзакции для активности
INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at) VALUES
('user-alexei-demo', 'withdrawal', 100.00, 'pending', 'Вывод на банковскую карту', 'bank_transfer', '2024-12-25 15:30:00', NOW()),
('user-dmitri-demo', 'deposit', 200.00, 'pending', 'Дополнительное пополнение', 'crypto', '2025-01-12 09:45:00', NOW()),
('user-maria-demo', 'withdrawal', 50.00, 'completed', 'Частичный вывод', 'card', '2024-12-20 18:20:00', NOW());