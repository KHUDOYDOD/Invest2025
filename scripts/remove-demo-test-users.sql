-- Удаление демо и тестовых пользователей
DELETE FROM users WHERE 
  login IN ('demo', 'test', 'user1', 'user2', 'vipuser', 'moderator', 'investor') 
  OR email LIKE '%demo%' 
  OR email LIKE '%test%'
  OR role_id IN (6); -- демо роль

-- Удаление демо роли
DELETE FROM user_roles WHERE name IN ('demo');

-- Показать оставшихся пользователей
SELECT id, login, email, full_name, role_id FROM users ORDER BY id;
