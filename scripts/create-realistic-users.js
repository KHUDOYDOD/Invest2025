const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Используем локальную PostgreSQL базу данных
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // для локальной базы данных
});

const realisticUsers = [
  {
    full_name: 'Мария Смирнова',
    email: 'maria.smirnova@gmail.com',
    password: 'maria2024',
    phone: '+7 926 123 4567',
    balance: 500.00,
    created_at: '2024-12-15 10:30:00'
  },
  {
    full_name: 'Алексей Петров',
    email: 'alexei.petrov@yandex.ru',
    password: 'alexei2024',
    phone: '+7 915 987 6543',
    balance: 500.00,
    created_at: '2024-12-20 14:45:00'
  },
  {
    full_name: 'Елена Козлова', 
    email: 'elena.kozlova@mail.ru',
    password: 'elena2024',
    phone: '+7 903 456 7890',
    balance: 500.00,
    created_at: '2025-01-05 09:15:00'
  },
  {
    full_name: 'Дмитрий Волков',
    email: 'dmitri.volkov@outlook.com', 
    password: 'dmitri2024',
    phone: '+7 962 321 0987',
    balance: 500.00,
    created_at: '2025-01-10 16:20:00'
  },
  {
    full_name: 'Анна Соколова',
    email: 'anna.sokolova@rambler.ru',
    password: 'anna2024', 
    phone: '+7 945 654 3210',
    balance: 500.00,
    created_at: '2025-01-15 11:30:00'
  }
];

async function createRealisticUsers() {
  try {
    console.log('Подключение к локальной PostgreSQL базе данных...');
    
    for (const user of realisticUsers) {
      try {
        // Создаем хеш пароля
        const passwordHash = await bcrypt.hash(user.password, 10);
        const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Вставляем пользователя
        const userResult = await pool.query(
          `INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, 'user', $6, $7, NOW())
           ON CONFLICT (email) DO UPDATE SET 
             full_name = EXCLUDED.full_name,
             password_hash = EXCLUDED.password_hash,
             balance = EXCLUDED.balance,
             updated_at = NOW()
           RETURNING id`,
          [userId, user.full_name, user.email, passwordHash, user.balance, user.phone, user.created_at]
        );

        console.log(`✅ Создан пользователь: ${user.full_name} (${user.email})`);
        console.log(`   Пароль: ${user.password}`);
        
        // Создаем стартовый депозит
        await pool.query(
          `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
           VALUES ($1, 'deposit', $2, 'completed', 'Стартовый депозит', 'bank_transfer', $3, NOW())`,
          [userId, user.balance, user.created_at]
        );
        
        console.log(`   💰 Добавлен депозит: $${user.balance}`);
        
        // Создаем инвестиции для некоторых пользователей (реалистично)
        if (user.email.includes('maria') || user.email.includes('elena') || user.email.includes('anna')) {
          const investmentAmount = user.email.includes('elena') ? 300 : user.email.includes('maria') ? 200 : 150;
          const planId = user.email.includes('elena') ? 2 : 1;
          
          await pool.query(
            `INSERT INTO investments (user_id, plan_id, amount, status, total_profit, created_at, updated_at)
             VALUES ($1, $2, $3, 'active', $4, $5, NOW())`,
            [userId, planId, investmentAmount, investmentAmount * 0.08, user.created_at]
          );
          
          await pool.query(
            `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
             VALUES ($1, 'investment', $2, 'completed', 'Инвестирование в план', 'balance', $3, NOW())`,
            [userId, investmentAmount, user.created_at]
          );
          
          // Обновляем баланс после инвестиции
          await pool.query(
            `UPDATE users SET balance = balance - $1 WHERE id = $2`,
            [investmentAmount, userId]
          );
          
          console.log(`   📈 Создана инвестиция: $${investmentAmount}`);
        }
        
        // Добавляем дополнительные транзакции для реализма
        if (user.email.includes('alexei')) {
          await pool.query(
            `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
             VALUES ($1, 'withdrawal', 100.00, 'pending', 'Вывод на банковскую карту', 'bank_transfer', '2024-12-25 15:30:00', NOW())`,
            [userId]
          );
          console.log(`   🏦 Добавлена заявка на вывод: $100`);
        }
        
        if (user.email.includes('dmitri')) {
          await pool.query(
            `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
             VALUES ($1, 'deposit', 200.00, 'pending', 'Дополнительное пополнение', 'crypto', '2025-01-12 09:45:00', NOW())`,
            [userId]
          );
          console.log(`   💳 Добавлена заявка на пополнение: $200`);
        }
        
        console.log('');
        
      } catch (userError) {
        console.error(`❌ Ошибка создания пользователя ${user.email}:`, userError.message);
      }
    }

    console.log('🎉 Все реалистичные пользователи успешно созданы в базе данных!');
    console.log('\n📋 Учетные данные:');
    realisticUsers.forEach(user => {
      console.log(`${user.full_name}: ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await pool.end();
  }
}

createRealisticUsers();