import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const demoUsers = [
      {
        id: 'user-maria-demo',
        full_name: 'Мария Смирнова',
        email: 'maria.smirnova@gmail.com',
        password: 'password123',
        phone: '+7 926 123 4567',
        balance: 500.00,
        created_at: '2024-12-15 10:30:00'
      },
      {
        id: 'user-alexei-demo', 
        full_name: 'Алексей Петров',
        email: 'alexei.petrov@yandex.ru',
        password: 'password123',
        phone: '+7 915 987 6543',
        balance: 500.00,
        created_at: '2024-12-20 14:45:00'
      },
      {
        id: 'user-elena-demo',
        full_name: 'Елена Козлова', 
        email: 'elena.kozlova@mail.ru',
        password: 'password123',
        phone: '+7 903 456 7890',
        balance: 500.00,
        created_at: '2025-01-05 09:15:00'
      },
      {
        id: 'user-dmitri-demo',
        full_name: 'Дмитрий Волков',
        email: 'dmitri.volkov@outlook.com', 
        password: 'password123',
        phone: '+7 962 321 0987',
        balance: 500.00,
        created_at: '2025-01-10 16:20:00'
      },
      {
        id: 'user-anna-demo',
        full_name: 'Анна Соколова',
        email: 'anna.sokolova@rambler.ru',
        password: 'password123', 
        phone: '+7 945 654 3210',
        balance: 500.00,
        created_at: '2025-01-15 11:30:00'
      }
    ];

    console.log('Creating 5 demo users with realistic activity...');
    const results = [];

    for (const user of demoUsers) {
      try {
        // Создаем хеш пароля
        const passwordHash = await bcrypt.hash(user.password, 10);
        
        // Вставляем пользователя
        const userResult = await query(
          `INSERT INTO users (id, full_name, email, password_hash, balance, role, phone, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, 'user', $6, $7, NOW())
           ON CONFLICT (email) DO UPDATE SET 
             full_name = EXCLUDED.full_name,
             password_hash = EXCLUDED.password_hash,
             balance = EXCLUDED.balance
           RETURNING id`,
          [user.id, user.full_name, user.email, passwordHash, user.balance, user.phone, user.created_at]
        );

        console.log(`✅ Created user: ${user.full_name} (${user.email})`);
        
        // Создаем депозитную транзакцию
        await query(
          `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
           VALUES ($1, 'deposit', $2, 'completed', 'Стартовый депозит', 'bank_transfer', $3, NOW())
           ON CONFLICT DO NOTHING`,
          [user.id, user.balance, user.created_at]
        );
        
        console.log(`   💰 Added deposit: $${user.balance}`);
        
        // Создаем инвестиции для некоторых пользователей
        if (['user-maria-demo', 'user-elena-demo', 'user-anna-demo'].includes(user.id)) {
          const investmentAmount = user.id === 'user-elena-demo' ? 300 : user.id === 'user-maria-demo' ? 200 : 150;
          const planId = user.id === 'user-elena-demo' ? 2 : 1;
          
          await query(
            `INSERT INTO investments (user_id, plan_id, amount, status, total_profit, created_at, updated_at)
             VALUES ($1, $2, $3, 'active', $4, $5, NOW())
             ON CONFLICT DO NOTHING`,
            [user.id, planId, investmentAmount, investmentAmount * 0.1, user.created_at]
          );
          
          await query(
            `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at)
             VALUES ($1, 'investment', $2, 'completed', 'Инвестирование в план', 'balance', $3, NOW())
             ON CONFLICT DO NOTHING`,
            [user.id, investmentAmount, user.created_at]
          );
          
          // Обновляем баланс после инвестиции
          await query(
            `UPDATE users SET balance = balance - $1 WHERE id = $2`,
            [investmentAmount, user.id]
          );
          
          console.log(`   📈 Created investment: $${investmentAmount}`);
        }
        
        results.push({
          name: user.full_name,
          email: user.email,
          password: user.password,
          created: true
        });
        
      } catch (userError) {
        console.error(`Error creating user ${user.email}:`, userError);
        results.push({
          name: user.full_name,
          email: user.email,
          password: user.password,
          created: false,
          error: userError.message
        });
      }
    }

    // Добавляем дополнительные транзакции для активности
    try {
      await query(
        `INSERT INTO transactions (user_id, type, amount, status, description, payment_method, created_at, updated_at) VALUES
         ('user-alexei-demo', 'withdrawal', 100.00, 'pending', 'Вывод на банковскую карту', 'bank_transfer', '2024-12-25 15:30:00', NOW()),
         ('user-dmitri-demo', 'deposit', 200.00, 'pending', 'Дополнительное пополнение', 'crypto', '2025-01-12 09:45:00', NOW()),
         ('user-maria-demo', 'withdrawal', 50.00, 'completed', 'Частичный вывод', 'card', '2024-12-20 18:20:00', NOW())
         ON CONFLICT DO NOTHING`
      );
      console.log('✅ Added additional transactions for activity');
    } catch (transactionError) {
      console.error('Error adding additional transactions:', transactionError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Demo users created successfully',
      users: results,
      credentials: {
        note: "Все пользователи имеют пароль: password123",
        users: results.map(u => ({ name: u.name, email: u.email, password: "password123" }))
      }
    });

  } catch (error) {
    console.error('Error creating demo users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create demo users',
      details: error.message 
    }, { status: 500 });
  }
}