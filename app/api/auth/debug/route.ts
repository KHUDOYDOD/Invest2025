
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Debug: Trying to authenticate:', email);

    // Ищем пользователя
    const userResult = await query(`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.password_hash,
        u.role_id,
        u.status,
        ur.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      WHERE u.email = $1 AND u.is_active = true
    `, [email]);

    console.log('Debug: User found:', userResult.rows.length > 0);

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Пользователь не найден',
        debug: { emailChecked: email }
      });
    }

    const user = userResult.rows[0];
    console.log('Debug: User data:', {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      status: user.status
    });

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log('Debug: Password valid:', isPasswordValid);

    return NextResponse.json({
      success: isPasswordValid,
      debug: {
        userFound: true,
        passwordValid: isPasswordValid,
        userStatus: user.status,
        roleId: user.role_id
      }
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Ошибка отладки',
      debug: { error: error.message }
    });
  }
}
