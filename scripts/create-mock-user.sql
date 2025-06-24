-- Create a mock user for testing purposes
INSERT INTO users (
  id,
  email,
  full_name,
  password_hash,
  phone,
  country,
  is_verified,
  is_active,
  balance,
  total_invested,
  total_earned,
  referral_code,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@example.com',
  'Test User',
  '$2b$10$example.hash.for.testing.purposes.only',
  '+1234567890',
  'United States',
  true,
  true,
  10000.00,
  0.00,
  0.00,
  'TEST001',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();
