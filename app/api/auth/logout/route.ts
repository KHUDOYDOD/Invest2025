
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Выход выполнен успешно'
    })

    // Удаляем токен из куков
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Удаляем куку
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Ошибка при выходе' 
    }, { status: 500 })
  }
}
