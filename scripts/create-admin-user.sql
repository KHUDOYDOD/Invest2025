-- Create admin user table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user
-- Username: admin
-- Password: admin123 (in a production environment, use a strong password!)
INSERT INTO admin_users (
  username,
  password_hash,
  name,
  email,
  role
) VALUES (
  'admin',
  'admin123', -- In production, this should be properly hashed!
  'Administrator',
  'admin@example.com',
  'super_admin'
) ON CONFLICT (username) 
DO UPDATE SET
  updated_at = NOW(),
  is_active = true;

-- Create admin sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admin_users(id),
  session_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true
);
