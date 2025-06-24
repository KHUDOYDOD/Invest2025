-- Создание таблицы запросов на пополнение
CREATE TABLE IF NOT EXISTS deposit_requests (
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

-- Создание таблицы запросов на вывод
CREATE TABLE IF NOT EXISTS withdrawal_requests (
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

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_created_at ON deposit_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

-- Функция для обновления баланса пользователя
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_operation TEXT DEFAULT 'add'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_operation = 'add' THEN
        UPDATE users 
        SET balance = COALESCE(balance, 0) + p_amount,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSIF p_operation = 'subtract' THEN
        UPDATE users 
        SET balance = COALESCE(balance, 0) - p_amount,
            updated_at = NOW()
        WHERE id = p_user_id AND COALESCE(balance, 0) >= p_amount;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
    END IF;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Вставляем демо запросы для тестирования
INSERT INTO deposit_requests (user_id, amount, method, payment_details, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 500.00, 'Банковская карта', '{"card_number": "4444 5555 6666 7777", "holder_name": "IVAN PETROV"}', 'pending', NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-0000-000000000001', 1000.00, 'USDT TRC-20', '{"address": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"}', 'pending', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000001', 250.00, 'СБП', '{"phone": "+7 922 123 45 67"}', 'approved', NOW() - INTERVAL '3 hours')
ON CONFLICT DO NOTHING;

INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 300.00, 'Банковская карта', '4444 5555 6666 7777', 6.00, 294.00, 'pending', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000001', 150.00, 'USDT TRC-20', 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', 1.50, 148.50, 'pending', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;
