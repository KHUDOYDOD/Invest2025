
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, LogIn, Shield } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Очищаем сообщения при изменении полей
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log('🔐 Attempting login with:', formData.email)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      })

      const data = await response.json()
      console.log('📥 Login response:', data)

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Ошибка входа')
      }

      // Успешный вход
      setSuccess('Вход выполнен успешно! Перенаправление...')

      // Сохраняем данные пользователя
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.fullName)
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userRole', data.user.role || 'user')
        localStorage.setItem('isAuthenticated', 'true')
        
        if (data.token) {
          localStorage.setItem('auth-token', data.token)
          localStorage.setItem('authToken', data.token)
        }
        
        // Устанавливаем данные для админа если нужно
        if (data.user.isAdmin || data.user.role === 'admin') {
          localStorage.setItem('adminAuth', 'true')
          localStorage.setItem('adminUser', JSON.stringify(data.user))
        }
      }

      // Перенаправляем через 1 секунду
      setTimeout(() => {
        const redirectPath = data.redirect || (data.user?.isAdmin ? '/admin/dashboard' : '/dashboard')
        router.push(redirectPath)
        router.refresh() // Обновляем страницу для применения изменений
      }, 1000)

    } catch (err: any) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Произошла ошибка при входе. Проверьте данные и попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Добро пожаловать
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Войдите в свой аккаунт
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Пароль
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-12 text-base pr-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200" 
              disabled={isLoading || !formData.email.trim() || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="text-sm text-slate-500 font-medium">
              Тестовые аккаунты:
            </div>
            <div className="grid gap-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">Админ:</span>
                <span className="text-slate-500">admin@example.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">Пользователь:</span>
                <span className="text-slate-500">user@example.com / demo123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">Ваш аккаунт:</span>
                <span className="text-slate-500">zabon@mail.ru / zabon123</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="text-center">
            <span className="text-slate-600">Нет аккаунта? </span>
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
            >
              Зарегистрироваться
            </Link>
          </div>
          <div className="text-center">
            <Link 
              href="/" 
              className="text-slate-500 hover:text-slate-700 text-sm transition-colors inline-flex items-center"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
