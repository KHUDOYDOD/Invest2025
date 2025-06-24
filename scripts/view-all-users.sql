-- Просмотр всех пользователей с их данными
SELECT 
    id,
    email,
    full_name,
    password_hash,
    role_id,
    CASE 
        WHEN role_id = 1 THEN 'admin'
        WHEN role_id = 2 THEN 'user'
        ELSE 'unknown'
    END as role_name,
    status,
    balance,
    total_invested,
    total_profit,
    referral_code,
    referral_count,
    email_verified,
    last_login,
    login_count,
    created_at,
    updated_at
FROM users 
ORDER BY id ASC;
