-- Проверяем структуру таблиц запросов
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('deposit_requests', 'withdrawal_requests')
ORDER BY table_name, ordinal_position;

-- Проверяем существующие запросы
SELECT 'deposit_requests' as table_name, COUNT(*) as count FROM deposit_requests
UNION ALL
SELECT 'withdrawal_requests' as table_name, COUNT(*) as count FROM withdrawal_requests;

-- Показываем последние запросы
SELECT 'DEPOSIT' as type, id, user_id, amount, method, status, created_at 
FROM deposit_requests 
ORDER BY created_at DESC 
LIMIT 5;

SELECT 'WITHDRAWAL' as type, id, user_id, amount, method, status, created_at 
FROM withdrawal_requests 
ORDER BY created_at DESC 
LIMIT 5;
