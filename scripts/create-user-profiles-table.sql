-- Создание таблицы профилей пользователей
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  middle_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20),
  nationality VARCHAR(100),
  marital_status VARCHAR(50),
  
  -- Контактная информация
  phone VARCHAR(50),
  alternative_phone VARCHAR(50),
  telegram_username VARCHAR(100),
  whatsapp_number VARCHAR(50),
  
  -- Адрес
  country VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  postal_code VARCHAR(20),
  region VARCHAR(100),
  
  -- Профессиональная информация
  occupation VARCHAR(100),
  employer VARCHAR(100),
  work_experience VARCHAR(50),
  monthly_income VARCHAR(50),
  source_of_funds VARCHAR(50),
  
  -- Образование
  education VARCHAR(50),
  university VARCHAR(100),
  graduation_year VARCHAR(10),
  specialization VARCHAR(100),
  
  -- Финансовая информация
  bank_name VARCHAR(100),
  account_number VARCHAR(100),
  routing_number VARCHAR(100),
  crypto_wallet VARCHAR(100),
  preferred_currency VARCHAR(10),
  
  -- Инвестиционный профиль
  investment_experience VARCHAR(50),
  risk_tolerance VARCHAR(50),
  investment_goals TEXT,
  expected_return VARCHAR(50),
  investment_horizon VARCHAR(50),
  
  -- Документы и верификация
  passport_number VARCHAR(50),
  passport_issue_date DATE,
  passport_expiry_date DATE,
  tax_id VARCHAR(50),
  
  -- Настройки безопасности
  two_factor_enabled BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Дополнительная информация
  bio TEXT,
  interests TEXT,
  languages TEXT,
  avatar TEXT,
  timezone VARCHAR(50),
  website VARCHAR(255),
  
  -- Системные поля
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Добавление тестового пользователя, если его еще нет
INSERT INTO user_profiles (
  email, first_name, last_name, middle_name, date_of_birth, gender, nationality, marital_status,
  phone, telegram_username, whatsapp_number,
  country, city, address, postal_code, region,
  occupation, employer, work_experience, monthly_income, source_of_funds,
  education, university, graduation_year, specialization,
  bank_name, account_number, crypto_wallet, preferred_currency,
  investment_experience, risk_tolerance, investment_goals, expected_return, investment_horizon,
  passport_number, passport_issue_date, passport_expiry_date, tax_id,
  two_factor_enabled, email_notifications, sms_notifications, push_notifications,
  bio, interests, languages, timezone, website
)
SELECT 
  'user@example.com', 'Иван', 'Петров', 'Сергеевич', '1990-05-15', 'male', 'Россия', 'married',
  '+7 (999) 123-45-67', '@ivanpetrov', '+7 (999) 123-45-67',
  'russia', 'Москва', 'ул. Тверская, д. 1, кв. 100', '125009', 'Московская область',
  'Senior Developer', 'Tech Solutions LLC', '5-10', '100000-250000', 'salary',
  'master', 'МГУ им. М.В. Ломоносова', '2015', 'Информационные технологии',
  'Сбербанк', '40817810123456789012', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'usd',
  'intermediate', 'medium', 'Долгосрочный рост капитала', '15-25%', '5-10 лет',
  '1234 567890', '2020-01-15', '2030-01-15', '123456789012',
  true, true, false, true,
  'Опытный разработчик с 10+ летним стажем. Увлекаюсь инвестициями и финансовыми технологиями.', 
  'Программирование, Инвестиции, Путешествия', 
  'Русский (родной), Английский (свободно), Немецкий (базовый)', 
  'Europe/Moscow', 
  'https://ivanpetrov.dev'
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE email = 'user@example.com'
);

-- Создание таблицы для достижений пользователей
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  unlocked BOOLEAN DEFAULT false,
  progress INTEGER DEFAULT 0,
  unlock_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Создание индекса для быстрого поиска достижений пользователя
CREATE INDEX IF NOT EXISTS idx_user_achievements_email ON user_achievements(user_email);

-- Добавление тестовых достижений для пользователя
INSERT INTO user_achievements (user_email, title, description, icon, unlocked, progress, unlock_date)
SELECT 'user@example.com', 'Первая инвестиция', 'Совершили первую инвестицию', '🎯', true, 100, '2025-01-15'
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE email = 'user@example.com')
AND NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_email = 'user@example.com' AND title = 'Первая инвестиция');

INSERT INTO user_achievements (user_email, title, description, icon, unlocked, progress, unlock_date)
SELECT 'user@example.com', 'VIP статус', 'Достигли VIP уровня', '👑', true, 100, '2025-02-01'
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE email = 'user@example.com')
AND NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_email = 'user@example.com' AND title = 'VIP статус');

INSERT INTO user_achievements (user_email, title, description, icon, unlocked, progress, unlock_date)
SELECT 'user@example.com', 'Верификация', 'Прошли полную верификацию', '✅', true, 100, '2025-01-10'
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE email = 'user@example.com')
AND NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_email = 'user@example.com' AND title = 'Верификация');

INSERT INTO user_achievements (user_email, title, description, icon, unlocked, progress)
SELECT 'user@example.com', 'Реферальный мастер', 'Пригласили 10+ друзей', '🤝', false, 70
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE email = 'user@example.com')
AND NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_email = 'user@example.com' AND title = 'Реферальный мастер');

INSERT INTO user_achievements (user_email, title, description, icon, unlocked, progress)
SELECT 'user@example.com', 'Инвестор года', 'Лучший ROI в этом году', '🏆', false, 65
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE email = 'user@example.com')
AND NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_email = 'user@example.com' AND title = 'Инвестор года');

INSERT INTO user_achievements (user_email, title, description, icon, unlocked, progress)
SELECT 'user@example.com', 'Миллионер', 'Достигли $1,000,000 в портфеле', '💎', false, 15
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE email = 'user@example.com')
AND NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_email = 'user@example.com' AND title = 'Миллионер');
