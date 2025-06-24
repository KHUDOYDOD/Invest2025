-- Проверяем существующие таблицы
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('deposit_requests', 'withdrawal_requests', 'users', 'transactions');

-- Проверяем структуру таблиц если они существуют
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'deposit_requests' 
AND table_schema = 'public';

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'withdrawal_requests' 
AND table_schema = 'public';
