-- Создаем таблицы для настроек системы
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  site_name VARCHAR(255) DEFAULT 'InvestPro',
  site_description TEXT DEFAULT 'Профессиональная инвестиционная платформа',
  contact_email VARCHAR(255) DEFAULT 'X453925x@gmail.com',
  registration_enabled BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  min_deposit DECIMAL(10,2) DEFAULT 50,
  max_deposit DECIMAL(10,2) DEFAULT 50000,
  min_withdraw DECIMAL(10,2) DEFAULT 10,
  withdraw_fee DECIMAL(5,2) DEFAULT 2,
  referral_bonus DECIMAL(5,2) DEFAULT 5,
  welcome_bonus DECIMAL(10,2) DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appearance_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  secondary_color VARCHAR(7) DEFAULT '#10b981',
  accent_color VARCHAR(7) DEFAULT '#f59e0b',
  dark_mode BOOLEAN DEFAULT false,
  logo_url VARCHAR(255) DEFAULT '/logo.png',
  favicon_url VARCHAR(255) DEFAULT '/favicon.ico',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  deposit_notifications BOOLEAN DEFAULT true,
  withdraw_notifications BOOLEAN DEFAULT true,
  investment_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставляем начальные данные
INSERT INTO site_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT DO NOTHING;
INSERT INTO appearance_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT DO NOTHING;
INSERT INTO notification_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT DO NOTHING;
