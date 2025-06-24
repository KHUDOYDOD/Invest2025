-- Создание таблицы ролей
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Добавление ролей
INSERT INTO user_roles (name, display_name, description, permissions) VALUES
('super_admin', 'Супер Администратор', 'Полный доступ ко всем функциям', '{"admin": true, "users": true, "finance": true, "settings": true, "reports": true}'),
('admin', 'Администратор', 'Доступ к админ панели', '{"admin": true, "users": true, "finance": false, "settings": true, "reports": true}'),
('moderator', 'Модератор', 'Модерация контента и пользователей', '{"admin": false, "users": true, "finance": false, "settings": false, "reports": false}'),
('vip', 'VIP Пользователь', 'Премиум функции и привилегии', '{"admin": false, "users": false, "finance": false, "settings": false, "reports": false}'),
('user', 'Пользователь', 'Стандартный пользователь', '{"admin": false, "users": false, "finance": false, "settings": false, "reports": false}'),
('demo', 'Демо', 'Демонстрационный аккаунт', '{"admin": false, "users": false, "finance": false, "settings": false, "reports": false}')
ON CONFLICT (name) DO NOTHING;

-- Обновление таблицы пользователей для добавления роли
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES user_roles(id) DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Добавление тестовых пользователей с разными ролями
INSERT INTO users (
  id, login, email, full_name, password_hash, phone, country, 
  is_verified, is_active, balance, total_invested, total_earned, 
  referral_code, role_id, avatar_url, status, created_at, updated_at
) VALUES 
-- Супер Администратор
('00000000-0000-0000-0000-000000000001', 'superadmin', 'superadmin@example.com', 'Супер Администратор', '$2b$10$example.hash.for.testing.purposes.only', '+7900000001', 'Russia', true, true, 50000.00, 0.00, 0.00, 'SUPER001', 1, '/avatars/superadmin.png', 'active', NOW(), NOW()),

-- Администратор
('00000000-0000-0000-0000-000000000002', 'admin', 'admin@example.com', 'Главный Администратор', '$2b$10$example.hash.for.testing.purposes.only', '+7900000002', 'Russia', true, true, 25000.00, 0.00, 0.00, 'ADMIN001', 2, '/avatars/admin.png', 'active', NOW(), NOW()),

-- Модератор
('00000000-0000-0000-0000-000000000003', 'moderator', 'moderator@example.com', 'Анна Модераторова', '$2b$10$example.hash.for.testing.purposes.only', '+7900000003', 'Russia', true, true, 15000.00, 5000.00, 750.00, 'MOD001', 3, '/avatars/moderator.png', 'active', NOW(), NOW()),

-- VIP Пользователь
('00000000-0000-0000-0000-000000000004', 'vipuser', 'vip@example.com', 'Владимир VIP', '$2b$10$example.hash.for.testing.purposes.only', '+7900000004', 'Russia', true, true, 100000.00, 75000.00, 15000.00, 'VIP001', 4, '/avatars/vip.png', 'active', NOW(), NOW()),

-- Обычные пользователи
('00000000-0000-0000-0000-000000000005', 'user1', 'user1@example.com', 'Иван Петров', '$2b$10$example.hash.for.testing.purposes.only', '+7900000005', 'Russia', true, true, 10000.00, 8500.00, 1250.00, 'USER001', 5, '/avatars/user1.png', 'active', NOW(), NOW()),

('00000000-0000-0000-0000-000000000006', 'user2', 'user2@example.com', 'Мария Сидорова', '$2b$10$example.hash.for.testing.purposes.only', '+7900000006', 'Russia', true, true, 7500.00, 5000.00, 800.00, 'USER002', 5, '/avatars/user2.png', 'active', NOW(), NOW()),

('00000000-0000-0000-0000-000000000007', 'investor', 'investor@example.com', 'Алексей Инвесторов', '$2b$10$example.hash.for.testing.purposes.only', '+7900000007', 'Russia', true, true, 50000.00, 45000.00, 8500.00, 'INV001', 5, '/avatars/investor.png', 'active', NOW(), NOW()),

-- Демо пользователи
('00000000-0000-0000-0000-000000000008', 'demo', 'demo@example.com', 'Демо Пользователь', '$2b$10$example.hash.for.testing.purposes.only', '+7900000008', 'Russia', false, true, 1000.00, 0.00, 0.00, 'DEMO001', 6, '/avatars/demo.png', 'active', NOW(), NOW()),

('00000000-0000-0000-0000-000000000009', 'test', 'test@example.com', 'Тестовый Аккаунт', '$2b$10$example.hash.for.testing.purposes.only', '+7900000009', 'Russia', false, true, 5000.00, 2000.00, 300.00, 'TEST001', 6, '/avatars/test.png', 'active', NOW(), NOW()),

-- Заблокированный пользователь
('00000000-0000-0000-0000-000000000010', 'blocked', 'blocked@example.com', 'Заблокированный Пользователь', '$2b$10$example.hash.for.testing.purposes.only', '+7900000010', 'Russia', true, false, 0.00, 0.00, 0.00, 'BLOCK001', 5, '/avatars/blocked.png', 'blocked', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET
  login = EXCLUDED.login,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role_id = EXCLUDED.role_id,
  avatar_url = EXCLUDED.avatar_url,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Создание представления для удобного получения пользователей с ролями
CREATE OR REPLACE VIEW users_with_roles AS
SELECT 
  u.*,
  r.name as role_name,
  r.display_name as role_display_name,
  r.description as role_description,
  r.permissions as role_permissions
FROM users u
LEFT JOIN user_roles r ON u.role_id = r.id;
