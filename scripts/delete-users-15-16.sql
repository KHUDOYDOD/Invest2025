-- Удаление пользователей с ID 15 и 16
DELETE FROM user_profiles WHERE user_id IN (15, 16);
DELETE FROM users WHERE id IN (15, 16);

-- Проверяем, что пользователи удалены
SELECT id, username, full_name, role FROM users WHERE id IN (15, 16);

-- Показываем оставшихся пользователей
SELECT id, username, full_name, role, created_at 
FROM users 
ORDER BY id;
