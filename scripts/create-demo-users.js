const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// Подключение к базе данных
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const demoUsers = [
  {
    id: 'u1-maria-2025',
    full_name: 'Мария Смирнова',
    email: 'maria.smirnova@gmail.com',
    password: 'maria123',
    phone: '+7 926 123 4567',
    balance: 500.00,
    created_at: '2024-12-15 10:30:00'
  },
  {
    id: 'u2-alexei-2025', 
    full_name: 'Алексей Петров',
    email: 'alexei.petrov@yandex.ru',
    password: 'alexei123',
    phone: '+7 915 987 6543',
    balance: 500.00,
    created_at: '2024-12-20 14:45:00'
  },
  {
    id: 'u3-elena-2025',
    full_name: 'Елена Козлова', 
    email: 'elena.kozlova@mail.ru',
    password: 'elena123',
    phone: '+7 903 456 7890',
    balance: 500.00,
    created_at: '2025-01-05 09:15:00'
  },
  {
    id: 'u4-dmitri-2025',
    full_name: 'Дмитрий Волков',
    email: 'dmitri.volkov@outlook.com', 
    password: 'dmitri123',
    phone: '+7 962 321 0987',
    balance: 500.00,
    created_at: '2025-01-10 16:20:00'
  },
  {
    id: 'u5-anna-2025',
    full_name: 'Анна Соколова',
    email: 'anna.sokolova@rambler.ru',
    password: 'anna123', 
    phone: '+7 945 654 3210',
    balance: 500.00,
    created_at: '2025-01-15 11:30:00'
  }
];

async function createDemoUsers() {
  try {
    await client.connect();
    console.log('Подключение к базе данных установлено');

    for (const user of demoUsers) {
      // Создаем хеш пароля
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(user.password, saltRounds);
      
      // Вставляем пользователя
      const userQuery = `
        INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, 'user', $6, $7, NOW())
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;
      
      const userResult = await client.query(userQuery, [
        user.id,
        user.full_name, 
        user.email,
        passwordHash,
        user.balance,
        user.phone,
        user.created_at
      ]);

      if (userResult.rows.length > 0) {
        console.log(`✅ Создан пользователь: ${user.full_name} (${user.email})`);
        
        // Создаем депозитную транзакцию
        const depositQuery = `
          INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
          VALUES ($1, 'deposit', $2, 'completed', 'Стартовый депозит', 'bank_transfer', $3, NOW())
        `;
        
        await client.query(depositQuery, [user.id, user.balance, user.created_at]);
        console.log(`   💰 Добавлен депозит: $${user.balance}`);
        
        // Создаем инвестицию (для некоторых пользователей)
        if (['u1-maria-2025', 'u3-elena-2025', 'u5-anna-2025'].includes(user.id)) {
          const investmentAmount = 200;
          
          const investmentQuery = `
            INSERT INTO investments (user_id, plan_id, amount, status, created_at, updated_at)
            VALUES ($1, 1, $2, 'active', $3, NOW())
          `;
          
          await client.query(investmentQuery, [user.id, investmentAmount, user.created_at]);
          
          const investTransactionQuery = `
            INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
            VALUES ($1, 'investment', $2, 'completed', 'Инвестирование в план "Стартовый"', 'balance', $3, NOW())
          `;
          
          await client.query(investTransactionQuery, [user.id, investmentAmount, user.created_at]);
          console.log(`   📈 Создана инвестиция: $${investmentAmount}`);
          
          // Обновляем баланс после инвестиции
          const updateBalanceQuery = `
            UPDATE users SET balance = balance - $1 WHERE id = $2
          `;
          await client.query(updateBalanceQuery, [investmentAmount, user.id]);
        }
        
      } else {
        console.log(`⚠️  Пользователь уже существует: ${user.email}`);
      }
    }

    console.log('\n🎉 Все демо-пользователи успешно созданы!');
    
  } catch (error) {
    console.error('❌ Ошибка создания пользователей:', error);
  } finally {
    await client.end();
  }
}

createDemoUsers();