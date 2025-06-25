
# InvestPro - Полная документация проекта

## 📋 Обзор проекта

InvestPro - это современная платформа для инвестиций с административной панелью, пользовательским кабинетом и функциональностью регистрации/авторизации.

## 🛠 Технический стек

### Frontend
- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS фреймворк
- **Shadcn/ui** - Компоненты UI
- **React Hook Form** - Управление формами
- **Lucide React** - Иконки

### Backend
- **Next.js API Routes** - Серверная логика
- **PostgreSQL** - База данных
- **JWT** - Аутентификация
- **bcryptjs** - Хеширование паролей

### Деплой и разработка
- **Replit** - Платформа для разработки и деплоя
- **pnpm** - Менеджер пакетов

## 📦 Зависимости

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-collapsible": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-hover-card": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.2",
    "@radix-ui/react-navigation-menu": "^1.2.1",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.1",
    "@radix-ui/react-scroll-area": "^1.2.1",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-sheet": "^1.1.1",
    "@radix-ui/react-sidebar": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.3",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "embla-carousel-react": "^8.3.0",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.451.0",
    "next": "14.0.4",
    "pg": "^8.11.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.5",
    "@types/pg": "^8.10.9",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
```

## 🗄️ Структура базы данных

### Основные таблицы

1. **user_roles** - Роли пользователей
2. **users** - Пользователи системы
3. **investment_plans** - Инвестиционные планы
4. **investments** - Инвестиции пользователей
5. **transactions** - Транзакции
6. **settings** - Настройки системы
7. **statistics** - Статистика
8. **deposit_requests** - Заявки на пополнение
9. **withdrawal_requests** - Заявки на вывод

### SQL для создания всех таблиц

```sql
-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Роли пользователей
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Пользователи
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(3),
    country_name VARCHAR(100),
    referral_code VARCHAR(10) UNIQUE,
    referred_by UUID REFERENCES users(id),
    role_id INTEGER REFERENCES user_roles(id) DEFAULT 2,
    status VARCHAR(20) DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT true,
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_earned DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Инвестиционные планы
CREATE TABLE investment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_percent DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL,
    total_return DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    features TEXT[] DEFAULT '{}',
    description TEXT,
    risk_level VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Инвестиции
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES investment_plans(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_profit DECIMAL(15,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Транзакции
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    description TEXT,
    method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Переменные окружения

```env
# База данных
DATABASE_URL=postgresql://username:password@host:port/database

# Аутентификация
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# JWT
JWT_SECRET=your-jwt-secret-key

# Платежные системы (опционально)
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your_paypal_client_id

# Email (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🚀 Запуск проекта

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка для продакшена
pnpm build

# Запуск продакшен версии
pnpm start
```

## 📁 Структура проекта

```
├── app/                    # Next.js App Router
│   ├── admin/             # Административная панель
│   ├── api/               # API маршруты
│   ├── dashboard/         # Пользовательский кабинет
│   ├── login/             # Страница входа
│   └── register/          # Страница регистрации
├── components/            # React компоненты
│   ├── ui/               # UI компоненты (shadcn/ui)
│   ├── admin/            # Компоненты админки
│   └── dashboard/        # Компоненты кабинета
├── lib/                  # Утилиты и хелперы
├── hooks/                # React хуки
├── public/               # Статические файлы
└── scripts/              # SQL скрипты
```

## 🔧 Основные функции

### Аутентификация
- Регистрация с валидацией
- Вход в систему
- JWT токены
- Защищенные маршруты

### Пользовательский кабинет
- Просмотр баланса
- Создание инвестиций
- История транзакций
- Профиль пользователя

### Административная панель
- Управление пользователями
- Управление инвестиционными планами
- Статистика
- Транзакции

## 🛡️ Безопасность

- Хеширование паролей с bcrypt
- JWT токены для аутентификации
- Валидация данных
- SQL-инъекции защита
- CSRF защита

## 📊 Мониторинг

- Логирование запросов к БД
- Отслеживание ошибок
- Метрики производительности

## 🎨 UI/UX

- Адаптивный дизайн
- Dark/Light темы
- Анимации
- Мобильная версия

## 🔄 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход

### Пользователь
- `GET /api/dashboard/user` - Данные пользователя
- `GET /api/dashboard/balance` - Баланс
- `POST /api/investments` - Создать инвестицию

### Админ
- `GET /api/admin/users` - Список пользователей
- `GET /api/admin/stats` - Статистика
- `POST /api/admin/investment-plans` - Создать план

## 🐛 Отладка

### Логи базы данных
```javascript
console.log('Executed query', { text, duration, rows: res.rowCount })
```

### Проверка соединения с БД
```sql
SELECT 1;
```

### Просмотр структуры таблиц
```sql
\dt
\d users
```

## 📝 Команды для разработки

```bash
# Просмотр логов
pnpm dev

# Проверка типов
pnpm type-check

# Линтинг
pnpm lint

# Форматирование
pnpm format
```

Этот файл содержит всю необходимую информацию для понимания, настройки и доработки проекта InvestPro.
