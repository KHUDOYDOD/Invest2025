# 📊 Инструкция по импорту базы данных InvestPro

## 📁 Файл экспорта
**Файл:** `investpro_database_export.sql`  
**Размер:** ~15KB  
**Дата создания:** 12 августа 2025

## 🗄️ Содержимое базы данных
- **Пользователи:** 6 (1 админ + 5 демо)
- **Транзакции:** 14 записей
- **Инвестиции:** 5 активных
- **Планы инвестирования:** 3 тарифа
- **Общая сумма инвестиций:** $1,450
- **Общая прибыль:** $143.55

## 👥 Учетные записи

### Администратор
- **Email/Логин:** `zabon3`
- **Пароль:** `zabon3`
- **Роль:** admin
- **Баланс:** $5,000

### Демо пользователи (пароль для всех: `password123`)
1. **Мария Смирнова** - `maria.smirnova@gmail.com` (баланс $300)
2. **Алексей Петров** - `alexei.petrov@yandex.ru` (баланс $500)
3. **Елена Козлова** - `elena.kozlova@mail.ru` (баланс $200)
4. **Дмитрий Волков** - `dmitri.volkov@outlook.com` (баланс $500)
5. **Анна Соколова** - `anna.sokolova@rambler.ru` (баланс $350)

## 🚀 Способы импорта

### 1. Через pgAdmin (рекомендуется)
```bash
1. Откройте pgAdmin
2. Создайте новую базу данных "investpro"
3. Нажмите правой кнопкой на базу → Query Tool
4. Откройте файл investpro_database_export.sql
5. Выполните весь скрипт (F5)
```

### 2. Через командную строку PostgreSQL
```bash
# Создайте базу данных
createdb investpro

# Импортируйте данные
psql -d investpro -f investpro_database_export.sql
```

### 3. Через Docker PostgreSQL
```bash
# Скопируйте файл в контейнер
docker cp investpro_database_export.sql postgres_container:/tmp/

# Выполните импорт
docker exec -i postgres_container psql -U postgres -d investpro < /tmp/investpro_database_export.sql
```

### 4. Через Supabase/Neon/Railway
```bash
1. Создайте новый проект PostgreSQL
2. Откройте SQL Editor
3. Скопируйте весь код из investpro_database_export.sql
4. Выполните запрос
```

## ⚙️ Переменные окружения

После импорта обновите `.env.local`:
```bash
DATABASE_URL=postgresql://username:password@host:port/investpro
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🔧 Структура таблиц
- `users` - пользователи системы
- `investment_plans` - планы инвестирования
- `transactions` - все финансовые транзакции  
- `investments` - активные инвестиции пользователей

## ✅ Проверка импорта
После импорта выполните:
```sql
-- Проверьте количество записей
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL  
SELECT 'investments', COUNT(*) FROM investments
UNION ALL
SELECT 'investment_plans', COUNT(*) FROM investment_plans;
```

Ожидаемые результаты:
- users: 6
- transactions: 14
- investments: 5
- investment_plans: 3

## 🔐 Безопасность
- Все пароли захешированы с bcrypt
- JWT токены требуют правильного секретного ключа
- SQL файл содержит только тестовые данные
- Рекомендуется сменить пароли в продакшене

## 📞 Поддержка
Если возникли проблемы с импортом:
1. Убедитесь что PostgreSQL версии 12+
2. Проверьте права доступа пользователя БД
3. Убедитесь что база данных пустая перед импортом
4. Проверьте синтаксис подключения к БД