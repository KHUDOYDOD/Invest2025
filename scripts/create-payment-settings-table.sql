-- Create payment_settings table for storing payment methods and details
CREATE TABLE IF NOT EXISTS payment_settings (
    id SERIAL PRIMARY KEY,
    method_type VARCHAR(50) NOT NULL, -- 'card', 'crypto', 'sbp'
    method_name VARCHAR(100) NOT NULL,
    details JSONB NOT NULL, -- Store payment details as JSON
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert payment methods with your specified details
INSERT INTO payment_settings (method_type, method_name, details) VALUES
('card', 'Сбербанк', '{
    "card_number": "4444 5555 6666 7777", 
    "holder_name": "IVAN PETROV", 
    "bank_name": "Сбербанк", 
    "processing_time": "1-5 минут",
    "instructions": "Переведите указанную сумму на карту. Средства зачислятся автоматически после подтверждения платежа."
}'),
('sbp', 'СБП Сбербанк', '{
    "phone": "+7 922 123 45 67", 
    "bank_name": "Сбербанк", 
    "processing_time": "Мгновенно",
    "instructions": "Переведите через СБП на указанный номер телефона. Укажите в комментарии ваш email."
}'),
('crypto', 'USDT TRC-20', '{
    "address": "Dghggghggghhv45fhgghh", 
    "network": "TRON (TRC-20)", 
    "currency": "USDT",
    "processing_time": "5-15 минут",
    "instructions": "Отправьте USDT только в сети TRC-20! Отправка в другой сети приведет к потере средств."
}'),
('crypto', 'USDT TON', '{
    "address": "GryyggFhg6644ghhgghh", 
    "network": "TON", 
    "currency": "USDT",
    "processing_time": "3-10 минут",
    "instructions": "Отправьте USDT в сети TON на указанный адрес. Обязательно проверьте адрес перед отправкой."
}');
