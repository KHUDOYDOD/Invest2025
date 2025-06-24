# InvestPro - Профессиональная инвестиционная платформа

![InvestPro](https://img.shields.io/badge/InvestPro-v1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)

## 📋 Описание проекта

InvestPro - это современная инвестиционная платформа, построенная на Next.js 14 с использованием TypeScript и Supabase в качестве базы данных. Платформа предоставляет полный функционал для управления инвестициями, пользователями и администрирования.

### 🚀 Основные возможности

- **Пользовательская панель**: Регистрация, авторизация, управление инвестициями
- **Админ-панель**: Полное управление платформой, пользователями, настройками
- **Инвестиционные планы**: Создание и управление тарифными планами
- **Финансовые операции**: Депозиты, выводы, реферальная система
- **Статистика**: Реальная аналитика и отчеты
- **Уведомления**: Email, SMS, Push уведомления
- **Адаптивный дизайн**: Полная поддержка мобильных устройств

## 🛠 Технологический стек

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **База данных**: Supabase (PostgreSQL)
- **UI компоненты**: shadcn/ui, Radix UI
- **Аутентификация**: Supabase Auth
- **Стилизация**: Tailwind CSS, CSS Modules
- **Иконки**: Lucide React

## 📦 Установка и настройка

### Предварительные требования

- Node.js 18.0 или выше
- npm или yarn
- Аккаунт Supabase

### 1. Клонирование репозитория

\`\`\`bash
git clone https://github.com/your-username/investpro.git
cd investpro
\`\`\`

### 2. Установка зависимостей

\`\`\`bash
npm install
# или
yarn install
\`\`\`

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URLs (автоматически генерируются Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database

# JWT Secret
SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_ANON_KEY=your_anon_key
\`\`\`

### 4. Настройка базы данных Supabase

#### 4.1 Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Скопируйте URL проекта и API ключи

#### 4.2 Выполнение SQL скриптов

Выполните следующие SQL команды в SQL Editor вашего Supabase проекта:

\`\`\`sql
-- Создание расширения для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создаем таблицу для общих настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) NOT NULL DEFAULT 'InvestPro',
  site_description TEXT NOT NULL DEFAULT 'Профессиональная инвестиционная платформа',
  contact_email VARCHAR(255) NOT NULL DEFAULT 'support@investpro.com',
  registration_enabled BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  min_deposit NUMERIC NOT NULL DEFAULT 50,
  max_deposit NUMERIC NOT NULL DEFAULT 50000,
  min_withdraw NUMERIC NOT NULL DEFAULT 10,
  withdraw_fee NUMERIC NOT NULL DEFAULT 2,
  referral_bonus NUMERIC NOT NULL DEFAULT 5,
  welcome_bonus NUMERIC NOT NULL DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для настроек внешнего вида
CREATE TABLE IF NOT EXISTS appearance_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  primary_color VARCHAR(20) NOT NULL DEFAULT '#3b82f6',
  secondary_color VARCHAR(20) NOT NULL DEFAULT '#10b981',
  accent_color VARCHAR(20) NOT NULL DEFAULT '#f59e0b',
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  logo_url VARCHAR(255) NOT NULL DEFAULT '/logo.png',
  favicon_url VARCHAR(255) NOT NULL DEFAULT '/favicon.ico',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для настроек уведомлений
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  deposit_notifications BOOLEAN NOT NULL DEFAULT true,
  withdraw_notifications BOOLEAN NOT NULL DEFAULT true,
  investment_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для инвестиционных планов
CREATE TABLE IF NOT EXISTS investment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  min_amount NUMERIC NOT NULL,
  max_amount NUMERIC NOT NULL,
  daily_percent NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  total_return NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для настроек платежей
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auto_approval BOOLEAN NOT NULL DEFAULT true,
  min_deposit NUMERIC NOT NULL DEFAULT 50,
  max_deposit NUMERIC NOT NULL DEFAULT 50000,
  min_withdraw NUMERIC NOT NULL DEFAULT 10,
  max_withdraw NUMERIC NOT NULL DEFAULT 10000,
  card_fee NUMERIC NOT NULL DEFAULT 0,
  crypto_fee NUMERIC NOT NULL DEFAULT 1,
  ewallet_fee NUMERIC NOT NULL DEFAULT 2,
  withdraw_fee NUMERIC NOT NULL DEFAULT 2,
  payment_methods JSONB NOT NULL DEFAULT '{"card": true, "crypto": true, "ewallet": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для профилей администраторов
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL DEFAULT 'Администратор',
  email VARCHAR(255) NOT NULL DEFAULT 'admin@investpro.com',
  phone VARCHAR(50) NOT NULL DEFAULT '+7 (999) 123-45-67',
  position VARCHAR(255) NOT NULL DEFAULT 'Главный администратор',
  avatar_url TEXT,
  password_hash TEXT,
  last_password_change TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для новостей
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для контента страниц
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key VARCHAR(50) NOT NULL UNIQUE,
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  about_text TEXT,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для статистики
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  users_count INTEGER NOT NULL DEFAULT 0,
  users_change NUMERIC NOT NULL DEFAULT 0,
  investments_amount NUMERIC NOT NULL DEFAULT 0,
  investments_change NUMERIC NOT NULL DEFAULT 0,
  payouts_amount NUMERIC NOT NULL DEFAULT 0,
  payouts_change NUMERIC NOT NULL DEFAULT 0,
  profitability_rate NUMERIC NOT NULL DEFAULT 0,
  profitability_change NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  balance NUMERIC DEFAULT 0,
  total_invested NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  referral_code VARCHAR(50) UNIQUE,
  referred_by UUID REFERENCES users(id),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для транзакций
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'deposit', 'withdraw', 'investment', 'profit', 'referral'
  amount NUMERIC NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  description TEXT,
  payment_method VARCHAR(50),
  transaction_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу для инвестиций пользователей
CREATE TABLE IF NOT EXISTS user_investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES investment_plans(id),
  amount NUMERIC NOT NULL,
  daily_profit NUMERIC NOT NULL,
  total_profit NUMERIC DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

#### 4.3 Вставка начальных данных

\`\`\`sql
-- Вставляем начальные данные
INSERT INTO site_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO appearance_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO notification_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO payment_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO admin_profiles (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO statistics (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO page_content (id, page_key, hero_title, hero_subtitle, about_text, contact_info) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'home',
  'Инвестируйте в будущее с InvestPro',
  'Профессиональная инвестиционная платформа с гарантированной доходностью и надежной защитой ваших средств.',
  'InvestPro - это современная инвестиционная платформа, которая предоставляет возможности для получения стабильного дохода...',
  'Email: support@investpro.com
Телефон: +7 (800) 123-45-67
Адрес: Москва, ул. Примерная, д. 1'
)
ON CONFLICT DO NOTHING;

-- Вставляем начальные инвестиционные планы
INSERT INTO investment_plans (name, min_amount, max_amount, daily_percent, duration, total_return, features)
VALUES 
  ('Стартер', 100, 499, 3, 30, 90, '["Ежедневные выплаты 3%", "Поддержка 24/7", "Мобильное приложение"]'),
  ('Профессионал', 500, 999, 5, 30, 150, '["Ежедневные выплаты 5%", "Персональный менеджер", "Приоритетная поддержка"]'),
  ('Премиум', 1000, 10000, 8, 30, 240, '["Ежедневные выплаты 8%", "VIP поддержка", "Эксклюзивные сигналы"]')
ON CONFLICT DO NOTHING;

-- Вставляем начальные новости
INSERT INTO news (title, content, category)
VALUES 
  ('Добро пожаловать на нашу платформу', 'Мы рады приветствовать вас на нашей инвестиционной платформе.', 'Общие'),
  ('Начинаем работу', 'Платформа готова к приему первых инвесторов.', 'Новости')
ON CONFLICT DO NOTHING;
\`\`\`

### 5. Запуск проекта

\`\`\`bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start
\`\`\`

Проект будет доступен по адресу: `http://localhost:3000`

## 🔐 Доступы и учетные записи

### Админ-панель

- **URL**: `/admin/login`
- **Email**: `admin@investpro.com`
- **Пароль**: Настраивается при первом входе

### Пользовательская панель

- **Регистрация**: `/register`
- **Вход**: `/login`
- **Панель**: `/dashboard`

## 📚 API Документация

### Основные эндпоинты

#### Настройки сайта
- `GET /api/settings/site` - Получить настройки сайта
- `PUT /api/settings/site` - Обновить настройки сайта

#### Внешний вид
- `GET /api/settings/appearance` - Получить настройки внешнего вида
- `PUT /api/settings/appearance` - Обновить настройки внешнего вида

#### Уведомления
- `GET /api/settings/notifications` - Получить настройки уведомлений
- `PUT /api/settings/notifications` - Обновить настройки уведомлений

#### Инвестиционные планы
- `GET /api/investment-plans` - Получить все планы
- `POST /api/investment-plans` - Создать новый план
- `PUT /api/investment-plans/[id]` - Обновить план
- `DELETE /api/investment-plans/[id]` - Удалить план

#### Статистика
- `GET /api/statistics` - Получить статистику
- `PUT /api/statistics` - Обновить статистику

#### Пользователи
- `GET /api/users` - Получить список пользователей
- `GET /api/users/[id]` - Получить пользователя по ID
- `PUT /api/users/[id]` - Обновить пользователя

#### Транзакции
- `GET /api/transactions` - Получить транзакции
- `POST /api/transactions` - Создать транзакцию
- `PUT /api/transactions/[id]` - Обновить статус транзакции

## 🎛 Функции админ-панели

### Управление сайтом (`/admin/site-management`)

1. **Общие настройки**
   - Название и описание сайта
   - Режим обслуживания
   - Настройки регистрации
   - Включение/отключение функций

2. **Финансовые настройки**
   - Лимиты депозитов и выводов
   - Комиссии и бонусы
   - Реферальная система

3. **Настройки уведомлений**
   - Email, SMS, Push уведомления
   - Настройки по типам операций

4. **Внешний вид**
   - Цветовая схема
   - Логотип и favicon
   - Темная/светлая тема

5. **Управление контентом**
   - Тексты главной страницы
   - Контактная информация
   - SEO настройки

6. **Статистика**
   - Управление счетчиками
   - Показатели для главной страницы

7. **Инвестиционные планы**
   - Создание новых тарифов
   - Редактирование существующих
   - Активация/деактивация

### Управление пользователями (`/admin/users`)

- Просмотр всех пользователей
- Редактирование профилей
- Блокировка/разблокировка
- Управление балансами
- История транзакций

### Управление инвестициями (`/admin/investments`)

- Просмотр всех инвестиций
- Управление статусами
- Расчет прибыли
- Отчеты по доходности

### Транзакции (`/admin/transactions`)

- Просмотр всех транзакций
- Подтверждение депозитов
- Обработка выводов
- Финансовые отчеты

## 🔧 Настройка и кастомизация

### Изменение цветовой схемы

1. Перейдите в админ-панель → Управление сайтом → Внешний вид
2. Измените основные цвета
3. Сохраните изменения

### Добавление новых инвестиционных планов

1. Админ-панель → Управление сайтом → Тарифы
2. Заполните форму создания нового тарифа
3. Укажите проценты, сроки и особенности
4. Сохраните в базу данных

### Настройка платежных систем

1. Обновите таблицу `payment_settings`
2. Добавьте API ключи платежных систем
3. Настройте webhook'и для автоматического подтверждения

## 🚨 Устранение неполадок

### Проблема: Настройки не сохраняются

**Решение:**
1. Проверьте подключение к Supabase
2. Убедитесь, что все таблицы созданы
3. Проверьте права доступа к базе данных
4. Посмотрите логи в консоли браузера

### Проблема: Ошибки при загрузке данных

**Решение:**
1. Проверьте переменные окружения
2. Убедитесь, что Supabase проект активен
3. Проверьте правильность API ключей

### Проблема: Стили не применяются

**Решение:**
1. Очистите кэш браузера
2. Перезапустите сервер разработки
3. Проверьте настройки Tailwind CSS

## 📝 Логирование и мониторинг

### Логи приложения

Логи доступны в:
- Консоли браузера (клиентские ошибки)
- Терминале сервера (серверные ошибки)
- Supabase Dashboard (ошибки базы данных)

### Мониторинг производительности

- Используйте Vercel Analytics для мониторинга
- Настройте Sentry для отслеживания ошибок
- Мониторьте производительность Supabase

## 🔒 Безопасность

### Рекомендации по безопасности

1. **Переменные окружения**
   - Никогда не коммитьте `.env.local`
   - Используйте сильные пароли
   - Регулярно обновляйте API ключи

2. **База данных**
   - Настройте Row Level Security (RLS)
   - Ограничьте доступ по IP
   - Регулярно делайте бэкапы

3. **Аутентификация**
   - Используйте двухфакторную аутентификацию
   - Настройте сессии с ограниченным временем жизни
   - Логируйте все административные действия

## 📈 Развертывание

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения
3. Настройте домен
4. Деплой произойдет автоматически

### Другие платформы

- **Netlify**: Поддерживает Next.js
- **Railway**: Простое развертывание с базой данных
- **DigitalOcean**: App Platform для контейнеров

## 🤝 Поддержка и сообщество

### Получение помощи

- **GitHub Issues**: Сообщения об ошибках и предложения
- **Email**: support@investpro.com
- **Документация**: Подробная документация в `/docs`

### Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 🙏 Благодарности

- **Next.js** - За отличный фреймворк
- **Supabase** - За удобную базу данных
- **shadcn/ui** - За красивые компоненты
- **Tailwind CSS** - За гибкую стилизацию

---

**InvestPro** - Создано с ❤️ для современных инвестиций
