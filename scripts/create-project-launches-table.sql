-- Create project_launches table
CREATE TABLE IF NOT EXISTS project_launches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_launched BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  show_on_site BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  color_scheme VARCHAR(50) DEFAULT 'blue',
  icon_type VARCHAR(50) DEFAULT 'rocket',
  pre_launch_title VARCHAR(255),
  post_launch_title VARCHAR(255),
  pre_launch_description TEXT,
  post_launch_description TEXT,
  background_type VARCHAR(50) DEFAULT 'gradient',
  custom_css TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a sample project launch
INSERT INTO project_launches (
  name,
  title,
  description,
  launch_date,
  is_launched,
  is_active,
  show_on_site,
  position,
  color_scheme,
  icon_type,
  pre_launch_title,
  post_launch_title,
  pre_launch_description,
  post_launch_description,
  background_type
) VALUES (
  'Initial Launch',
  'До запуска проекта',
  'Следите за обратным отсчетом до официального запуска',
  NOW() + INTERVAL '30 days',
  false,
  true,
  true,
  1,
  'blue',
  'rocket',
  'До запуска проекта',
  'Проект запущен!',
  'Следите за обратным отсчетом до официального запуска',
  'Наша платформа успешно работает',
  'gradient'
) ON CONFLICT DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_project_launches_active ON project_launches(is_active);
CREATE INDEX IF NOT EXISTS idx_project_launches_show ON project_launches(show_on_site);
CREATE INDEX IF NOT EXISTS idx_project_launches_position ON project_launches(position);
