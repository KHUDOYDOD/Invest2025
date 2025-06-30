import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { query } from './database'

export interface User {
  id: string
  email: string
  full_name: string
  balance: number
  total_invested: number
  total_earned: number
  role: string
  isAdmin: boolean
}

export async function getServerSession(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    
    if (!decoded.userId) {
      return null
    }

    // Получаем актуальные данные пользователя из БД
    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.balance, u.total_invested, 
              u.total_earned, u.is_active, ur.name as role_name
       FROM users u
       LEFT JOIN user_roles ur ON u.role_id = ur.id
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      balance: user.balance,
      total_invested: user.total_invested,
      total_earned: user.total_earned,
      role: user.role_name,
      isAdmin: user.role_name === 'admin' || user.role_name === 'super_admin'
    }
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getServerSession(request)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return handler(request, user)
  }
}

export function requireAdmin(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getServerSession(request)
    
    if (!user || !user.isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return handler(request, user)
  }
}