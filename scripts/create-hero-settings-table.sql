
-- Создание таблицы для настроек Hero секции
CREATE TABLE IF NOT EXISTS hero_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enabled BOOLEAN NOT NULL DEFAULT true,
  title TEXT NOT NULL DEFAULT 'Инвестируйте с умом, получайте стабильный доход',
  subtitle TEXT NOT NULL DEFAULT 'Профессиональная инвестиционная платформа с ежедневными выплатами, высокой доходностью и гарантированной безопасностью',
  badge_text TEXT NOT NULL DEFAULT 'Платформа работает с 2025 года',
  button1_text TEXT NOT NULL DEFAULT 'Начать инвестировать',
  button1_link TEXT NOT NULL DEFAULT '/register',
  button2_text TEXT NOT NULL DEFAULT 'Войти в систему',
  button2_link TEXT NOT NULL DEFAULT '/login',
  show_buttons BOOLEAN NOT NULL DEFAULT true,
  background_animation BOOLEAN NOT NULL DEFAULT true,
  show_stats BOOLEAN NOT NULL DEFAULT true,
  stats_users TEXT NOT NULL DEFAULT '15K+',
  stats_users_label TEXT NOT NULL DEFAULT 'Активных инвесторов',
  stats_invested TEXT NOT NULL DEFAULT '$2.8M',
  stats_invested_label TEXT NOT NULL DEFAULT 'Общие инвестиции',
  stats_return TEXT NOT NULL DEFAULT '24.8%',
  stats_return_label TEXT NOT NULL DEFAULT 'Средняя доходность',
  stats_reliability TEXT NOT NULL DEFAULT '99.9%',
  stats_reliability_label TEXT NOT NULL DEFAULT 'Надежность',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставляем начальные настройки
INSERT INTO hero_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
