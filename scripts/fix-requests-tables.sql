-- Удаляем старые таблицы если есть
DROP TABLE IF EXISTS deposit_requests CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;

-- Создаем таблицу запросов на пополнение
CREATE TABLE deposit_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    payment_details JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- Создаем таблицу запросов на вывод
CREATE TABLE withdrawal_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    method VARCHAR(100) NOT NULL,
    wallet_address TEXT NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- Создаем индексы
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_deposit_requests_created_at ON deposit_requests(created_at DESC);

CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

-- Функция для обновления баланса
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_operation TEXT DEFAULT 'add'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    current_balance DECIMAL(15,2);
BEGIN
    -- Получаем текущий баланс
    SELECT COALESCE(balance, 0) INTO current_balance 
    FROM users 
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Выполняем операцию
    IF p_operation = 'add' THEN
        UPDATE users 
        SET balance = COALESCE(balance, 0) + p_amount,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        IF current_balance < p_amount THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
        
        UPDATE users 
        SET balance = COALESCE(balance, 0) - p_amount,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSE
        RAISE EXCEPTION 'Invalid operation';
    END IF;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating balance: %', SQLERRM;
END;
$$;

-- Вставляем тестовые данные
INSERT INTO deposit_requests (user_id, amount, method, payment_details, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 500.00, 'Банковская карта', '{"card_number": "4444 5555 6666 7777", "holder_name": "IVAN PETROV"}', 'pending', NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-0000-000000000001', 1000.00, 'USDT TRC-20', '{"address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"}', 'pending', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000001', 250.00, 'СБП', '{"phone": "+7 922 123 45 67"}', 'pending', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 300.00, 'Банковская карта', '4444 5555 6666 7777', 6.00, 294.00, 'pending', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000001', 150.00, 'USDT TRC-20', 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', 1.50, 148.50, 'pending', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;
