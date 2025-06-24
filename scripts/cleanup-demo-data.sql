-- Удаление всех демо данных из базы данных

-- Удаляем демо транзакции
DELETE FROM transactions WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%demo%' OR email LIKE '%test%' OR login LIKE '%demo%' OR login LIKE '%test%'
);

-- Удаляем демо инвестиции
DELETE FROM investments WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%demo%' OR email LIKE '%test%' OR login LIKE '%demo%' OR login LIKE '%test%'
);

-- Удаляем демо запросы на пополнение
DELETE FROM deposit_requests WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%demo%' OR email LIKE '%test%' OR login LIKE '%demo%' OR login LIKE '%test%'
);

-- Удаляем демо запросы на вывод
DELETE FROM withdrawal_requests WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%demo%' OR email LIKE '%test%' OR login LIKE '%demo%' OR login LIKE '%test%'
);

-- Удаляем демо профили пользователей
DELETE FROM user_profiles WHERE email LIKE '%demo%' OR email LIKE '%test%';

-- Удаляем демо пользователей (кроме админа)
DELETE FROM users WHERE 
  (email LIKE '%demo%' OR email LIKE '%test%' OR login LIKE '%demo%' OR login LIKE '%test%')
  AND email != 'admin@example.com';

-- Удаляем демо статистику
DELETE FROM statistics WHERE created_at < NOW() - INTERVAL '1 day';

-- Сбрасываем счетчики
UPDATE statistics SET 
  total_users = (SELECT COUNT(*) FROM users WHERE role_id != 1),
  total_deposits = 0,
  total_withdrawals = 0,
  total_profit = 0
WHERE id = 1;

-- Показываем оставшихся пользователей
SELECT id, login, email, full_name, balance, role_id, created_at 
FROM users 
ORDER BY created_at DESC;
