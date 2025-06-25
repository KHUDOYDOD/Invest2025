
# 🚀 InvestPro - Полное руководство по установке и настройке

## 📋 Описание проекта

InvestPro - это современная инвестиционная платформа, построенная на Next.js 14 с использованием TypeScript и PostgreSQL. Платформа предоставляет полный функционал для управления инвестициями, пользователями и администрирования.

## 🛠 Технологический стек

### Frontend
- **Next.js 14** - React фреймворк с SSR
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS фреймворк
- **Framer Motion** - Анимации
- **Radix UI** - Компоненты интерфейса
- **React Hook Form** - Управление формами
- **Zod** - Валидация схем

### Backend
- **Next.js API Routes** - Серверные эндпоинты
- **PostgreSQL** - Основная база данных
- **JWT** - Аутентификация
- **bcryptjs** - Хеширование паролей

### Библиотеки и зависимости
```json
{
  "dependencies": {
    "@emotion/is-prop-valid": "latest",
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-alert-dialog": "1.1.4",
    "@radix-ui/react-aspect-ratio": "1.1.1",
    "@radix-ui/react-avatar": "1.1.2",
    "@radix-ui/react-checkbox": "1.1.3",
    "@radix-ui/react-collapsible": "1.1.2",
    "@radix-ui/react-context-menu": "2.2.4",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-hover-card": "1.1.4",
    "@radix-ui/react-label": "2.1.1",
    "@radix-ui/react-menubar": "1.1.4",
    "@radix-ui/react-navigation-menu": "1.2.3",
    "@radix-ui/react-popover": "1.1.4",
    "@radix-ui/react-progress": "1.1.1",
    "@radix-ui/react-radio-group": "1.2.2",
    "@radix-ui/react-scroll-area": "1.2.2",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slider": "1.2.2",
    "@radix-ui/react-slot": "1.1.1",
    "@radix-ui/react-switch": "1.1.2",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-toast": "1.2.4",
    "@radix-ui/react-toggle": "1.1.1",
    "@radix-ui/react-toggle-group": "1.1.1",
    "@radix-ui/react-tooltip": "1.1.6",
    "@supabase/supabase-js": "latest",
    "@types/bcryptjs": "^3.0.0",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/pg": "^8.15.4",
    "autoprefixer": "^10.4.20",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "4.1.0",
    "embla-carousel-react": "8.5.1",
    "framer-motion": "latest",
    "input-otp": "1.4.1",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.454.0",
    "next": "14.2.16",
    "next-themes": "^0.4.4",
    "openai": "^5.7.0",
    "pg": "^8.16.2",
    "react": "^18",
    "react-day-picker": "8.10.1",
    "react-dom": "^18",
    "react-hook-form": "^7.54.1",
    "react-resizable-panels": "^2.1.7",
    "recharts": "latest",
    "sonner": "latest",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.6",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8.5",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
}
```

## 🔧 Установка и настройка

### 1. Предварительные требования

**Системные требования:**
- Node.js 18.0+
- npm или yarn или pnpm
- PostgreSQL 12+
- Git

**Для Replit:**
- Аккаунт Replit
- Активная подписка для доступа к базе данных

### 2. Клонирование и установка

```bash
# Клонирование репозитория
git clone https://github.com/KHUDOYDOD/Investpromax.git
cd Investpromax

# Установка зависимостей
npm install
# или
yarn install
# или
pnpm install
```

### 3. Настройка переменных окружения

Создайте файл `.env.local`:

```env
# Основные настройки
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# База данных PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/investpro
POSTGRES_URL=postgresql://username:password@localhost:5432/investpro
POSTGRES_PRISMA_URL=postgresql://username:password@localhost:5432/investpro
POSTGRES_URL_NON_POOLING=postgresql://username:password@localhost:5432/investpro
POSTGRES_USER=username
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=investpro

# JWT и аутентификация
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Supabase (опционально)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Платежные системы (опционально)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email настройки (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OpenAI (опционально)
OPENAI_API_KEY=sk-...
```

### 4. Настройка базы данных

#### Создание базы данных PostgreSQL

```sql
-- Создание базы данных
CREATE DATABASE investpro;

-- Подключение к базе данных
\c investpro;

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### Полная структура базы данных

```sql
-- Создание таблицы ролей
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка базовых ролей
INSERT INTO roles (id, name, description) VALUES 
(1, 'admin', 'Администратор системы'),
(2, 'user', 'Обычный пользователь')
ON CONFLICT (id) DO NOTHING;

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  password_hash TEXT NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(10),
  country_name VARCHAR(100),
  balance NUMERIC(15,2) DEFAULT 0.00,
  total_invested NUMERIC(15,2) DEFAULT 0.00,
  total_earned NUMERIC(15,2) DEFAULT 0.00,
  referral_code VARCHAR(50) UNIQUE,
  referred_by UUID REFERENCES users(id),
  role_id INTEGER REFERENCES roles(id) DEFAULT 2,
  status VARCHAR(20) DEFAULT 'active',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы инвестиционных планов
CREATE TABLE IF NOT EXISTS investment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  min_amount NUMERIC(15,2) NOT NULL,
  max_amount NUMERIC(15,2) NOT NULL,
  daily_percent NUMERIC(5,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  total_return NUMERIC(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы транзакций
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'investment', 'profit', 'referral', 'bonus')),
  amount NUMERIC(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT,
  payment_method VARCHAR(50),
  transaction_hash VARCHAR(255),
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы инвестиций
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES investment_plans(id),
  amount NUMERIC(15,2) NOT NULL,
  daily_profit NUMERIC(15,2) NOT NULL,
  total_profit NUMERIC(15,2) DEFAULT 0.00,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы запросов на депозит
CREATE TABLE IF NOT EXISTS deposit_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_proof TEXT,
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы запросов на вывод
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_details TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) DEFAULT 'InvestPro',
  site_description TEXT DEFAULT 'Профессиональная инвестиционная платформа',
  contact_email VARCHAR(255) DEFAULT 'support@investpro.com',
  support_phone VARCHAR(50) DEFAULT '+7 (800) 123-45-67',
  registration_enabled BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  min_deposit NUMERIC(15,2) DEFAULT 50.00,
  max_deposit NUMERIC(15,2) DEFAULT 50000.00,
  min_withdraw NUMERIC(15,2) DEFAULT 10.00,
  max_withdraw NUMERIC(15,2) DEFAULT 10000.00,
  withdraw_fee NUMERIC(5,2) DEFAULT 2.00,
  referral_bonus NUMERIC(5,2) DEFAULT 5.00,
  welcome_bonus NUMERIC(15,2) DEFAULT 25.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы настроек платежей
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auto_approval BOOLEAN DEFAULT false,
  payment_methods JSONB DEFAULT '{"card": true, "crypto": true, "bank": true}',
  card_fee NUMERIC(5,2) DEFAULT 0.00,
  crypto_fee NUMERIC(5,2) DEFAULT 1.00,
  bank_fee NUMERIC(5,2) DEFAULT 2.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы настроек прибыли
CREATE TABLE IF NOT EXISTS profit_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auto_profit BOOLEAN DEFAULT true,
  profit_frequency VARCHAR(20) DEFAULT 'daily',
  profit_time TIME DEFAULT '12:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы запусков проектов
CREATE TABLE IF NOT EXISTS project_launches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  target_amount NUMERIC(15,2) NOT NULL,
  raised_amount NUMERIC(15,2) DEFAULT 0.00,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы отзывов
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка начальных данных
INSERT INTO site_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;
INSERT INTO payment_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;
INSERT INTO profit_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

-- Вставка тестовых инвестиционных планов
INSERT INTO investment_plans (name, min_amount, max_amount, daily_percent, duration_days, total_return, features) VALUES 
('Стартер', 100, 499, 3.00, 30, 90.00, '["Ежедневные выплаты 3%", "Поддержка 24/7", "Мобильное приложение"]'),
('Профессионал', 500, 999, 5.00, 30, 150.00, '["Ежедневные выплаты 5%", "Персональный менеджер", "Приоритетная поддержка"]'),
('Премиум', 1000, 10000, 8.00, 30, 240.00, '["Ежедневные выплаты 8%", "VIP поддержка", "Эксклюзивные сигналы"]'),
('VIP', 10000, 100000, 12.00, 30, 360.00, '["Ежедневные выплаты 12%", "Персональный консультант", "Эксклюзивные инвестиции"]')
ON CONFLICT DO NOTHING;

-- Создание администратора по умолчанию
INSERT INTO users (
  email, 
  full_name, 
  password_hash, 
  role_id, 
  status, 
  is_active, 
  email_verified,
  country,
  country_name
) VALUES (
  'admin@investpro.com',
  'Главный администратор',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- пароль: password
  1,
  'active',
  true,
  true,
  'RU',
  'Россия'
) ON CONFLICT DO NOTHING;

-- Создание индексов для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
```

### 5. Запуск проекта

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start

# Линтинг
npm run lint
```

## 🚀 Развертывание на Replit

### 1. Настройка .replit файла

```toml
modules = ["python-3.11", "nodejs-20", "postgresql-16"]

[nix]
channel = "stable-24_05"

[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "agent"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "InvestPro Server"

[[workflows.workflow]]
name = "InvestPro Server"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 3000

[[ports]]
localPort = 3000
externalPort = 80
```

### 2. Настройка переменных окружения в Replit

В Replit Secrets добавьте:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- Другие необходимые переменные

### 3. Автоматический скрипт установки

Создайте файл `install.sh`:

```bash
#!/bin/bash

echo "🚀 Начинаем установку InvestPro..."

# Установка зависимостей
echo "📦 Установка npm зависимостей..."
npm install

# Проверка переменных окружения
echo "🔍 Проверка переменных окружения..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL не установлен"
    exit 1
fi

# Создание базы данных
echo "🗄️ Настройка базы данных..."
if command -v psql &> /dev/null; then
    psql $DATABASE_URL -f complete-database-setup.sql
    echo "✅ База данных настроена"
else
    echo "⚠️ PostgreSQL не найден, пропускаем создание БД"
fi

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

echo "🎉 Установка завершена!"
echo "🌐 Запустите проект командой: npm run dev"
echo "🔗 Админ-панель: /admin/login"
echo "📧 Email админа: admin@investpro.com"
echo "🔑 Пароль админа: password"
```

## 📚 API Документация

### Основные эндпоинты

#### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/logout` - Выход из системы

#### Пользователи
- `GET /api/user` - Получить данные пользователя
- `PUT /api/user/profile` - Обновить профиль
- `GET /api/dashboard/all` - Данные дашборда

#### Транзакции
- `GET /api/transactions` - Список транзакций
- `POST /api/deposit` - Создать депозит
- `POST /api/withdraw` - Создать запрос на вывод

#### Инвестиции
- `GET /api/investment-plans` - Список планов
- `POST /api/investments` - Создать инвестицию
- `GET /api/dashboard/investments` - Инвестиции пользователя

#### Администрирование
- `POST /api/admin/auth` - Вход администратора
- `GET /api/admin/users` - Список пользователей
- `GET /api/admin/transactions` - Все транзакции
- `PUT /api/admin/transactions/[id]` - Обновить статус

## 🔧 Возможности и функции

### Пользовательские функции
- **Регистрация и авторизация** с выбором страны
- **Личный кабинет** с полной статистикой
- **Инвестиционные планы** с автоматическими выплатами
- **Депозиты и выводы** с различными методами
- **Реферальная система** с бонусами
- **История транзакций** с фильтрацией
- **Профиль пользователя** с настройками

### Административные функции
- **Управление пользователями** (просмотр, редактирование, блокировка)
- **Управление транзакциями** (подтверждение, отклонение)
- **Настройки сайта** (лимиты, комиссии, бонусы)
- **Управление планами** (создание, редактирование)
- **Статистика** в реальном времени
- **Управление запросами** на депозиты и выводы

### Технические возможности
- **JWT аутентификация** с защищенными роутами
- **Валидация данных** с помощью Zod
- **Responsive дизайн** для всех устройств
- **Темная/светлая тема** с переключением
- **Анимации** с Framer Motion
- **Оптимизированные запросы** к базе данных
- **Безопасность** с bcrypt шифрованием

## 🛡️ Безопасность

### Реализованные меры безопасности
- Хеширование паролей с bcrypt
- JWT токены с истечением
- Валидация входных данных
- SQL injection защита
- XSS защита
- CSRF защита
- Ограничения доступа по ролям

### Рекомендации по безопасности
- Используйте сильные пароли для базы данных
- Регулярно обновляйте зависимости
- Настройте HTTPS в продакшене
- Мониторьте логи безопасности
- Делайте регулярные бэкапы

## 🔄 Обслуживание и мониторинг

### Логирование
- Все критические операции логируются
- Ошибки базы данных отслеживаются
- API запросы мониторятся

### Бэкапы
```bash
# Создание бэкапа базы данных
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
psql $DATABASE_URL < backup_file.sql
```

### Обновления
```bash
# Обновление зависимостей
npm update

# Проверка уязвимостей
npm audit

# Автоматическое исправление
npm audit fix
```

## 📞 Поддержка

### Контакты
- **Email**: support@investpro.com
- **GitHub**: Issues в репозитории
- **Документация**: /docs в проекте

### Частые проблемы

**Проблема**: Ошибка подключения к базе данных
**Решение**: Проверьте DATABASE_URL в переменных окружения

**Проблема**: Не работает аутентификация
**Решение**: Убедитесь, что JWT_SECRET установлен

**Проблема**: Стили не загружаются
**Решение**: Запустите `npm run build` и перезапустите сервер

## 🚀 Готовые команды для быстрого старта

```bash
# Полная установка одной командой
curl -sSL https://raw.githubusercontent.com/KHUDOYDOD/Investpromax/main/install.sh | bash

# Или пошагово:
git clone https://github.com/KHUDOYDOD/Investpromax.git
cd Investpromax
npm install
cp .env.example .env.local
# Отредактируйте .env.local
npm run dev
```

---

**InvestPro** - Профессиональная инвестиционная платформа с полным функционалом
