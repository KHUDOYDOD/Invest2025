-- Проверяем существование таблиц
SELECT 'deposit_requests' as table_name, count(*) as count FROM deposit_requests
UNION ALL
SELECT 'withdrawal_requests' as table_name, count(*) as count FROM withdrawal_requests
UNION ALL
SELECT 'transactions' as table_name, count(*) as count FROM transactions;

-- Проверяем структуру таблиц
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'deposit_requests' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'withdrawal_requests' 
ORDER BY ordinal_position;

-- Проверяем последние записи
SELECT * FROM deposit_requests ORDER BY created_at DESC LIMIT 5;
SELECT * FROM withdrawal_requests ORDER BY created_at DESC LIMIT 5;
SELECT * FROM transactions WHERE type IN ('deposit', 'withdrawal') ORDER BY created_at DESC LIMIT 10;
