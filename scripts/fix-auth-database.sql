
-- Проверяем и создаем таблицы ролей
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставляем стандартные роли если их нет
INSERT INTO user_roles (id, name, display_name, description) VALUES 
(1, 'superadmin', 'Супер Администратор', 'Полный доступ ко всем функциям системы'),
(2, 'admin', 'Администратор', 'Доступ к админ-панели и управлению пользователями'),
(3, 'moderator', 'Модератор', 'Ограниченный доступ к админ-панели'),
(4, 'vip', 'VIP Пользователь', 'Премиум пользователь с дополнительными привилегиями'),
(5, 'user', 'Пользователь', 'Обычный пользователь системы')
ON CONFLICT (id) DO NOTHING;

-- Проверяем структуру таблицы users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS country_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Обновляем внешний ключ для role_id если не существует
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'users_role_id_fkey' 
                   AND table_name = 'users') THEN
        ALTER TABLE users ADD CONSTRAINT users_role_id_fkey 
        FOREIGN KEY (role_id) REFERENCES user_roles(id);
    END IF;
END $$;

-- Создаем тестового администратора
INSERT INTO users (
    email, 
    full_name, 
    password_hash, 
    phone, 
    country, 
    country_name,
    referral_code,
    role_id,
    status,
    is_active,
    email_verified,
    balance,
    total_invested,
    total_earned
) VALUES (
    'admin@test.com',
    'Администратор',
    '$2b$12$LKnZoLwE8Lj2c8vYvh.m7eVJ1xK5pZe9QnJ7b6iK9ZuOaT4G3H2P6', -- пароль: admin123
    '+7900000001',
    'RU',
    'Россия',
    'ADMIN001',
    1, -- superadmin
    'active',
    true,
    true,
    100000.00,
    0.00,
    0.00
) ON CONFLICT (email) DO UPDATE SET
    role_id = EXCLUDED.role_id,
    updated_at = NOW();

-- Создаем обычного пользователя для тестов
INSERT INTO users (
    email, 
    full_name, 
    password_hash, 
    phone, 
    country, 
    country_name,
    referral_code,
    role_id,
    status,
    is_active,
    email_verified,
    balance,
    total_invested,
    total_earned
) VALUES (
    'user@test.com',
    'Тестовый Пользователь',
    '$2b$12$LKnZoLwE8Lj2c8vYvh.m7eVJ1xK5pZe9QnJ7b6iK9ZuOaT4G3H2P6', -- пароль: user123
    '+7900000002',
    'RU',
    'Россия',
    'USER001',
    5, -- user
    'active',
    true,
    true,
    1000.00,
    0.00,
    0.00
) ON CONFLICT (email) DO UPDATE SET
    updated_at = NOW();
