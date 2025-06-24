-- Проверяем существование таблицы транзакций
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
ORDER BY ordinal_position;

-- Проверяем данные в таблице
SELECT COUNT(*) as total_transactions FROM transactions;

-- Показываем последние транзакции
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;

-- Проверяем уникальных пользователей
SELECT DISTINCT user_id FROM transactions;
