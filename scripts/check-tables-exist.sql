-- Проверяем существование таблиц для запросов
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('deposit_requests', 'withdrawal_requests', 'users', 'transactions');
