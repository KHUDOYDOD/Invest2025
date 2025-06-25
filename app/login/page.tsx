
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-400/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>

      <Card className="w-full max-w-lg relative z-10 bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10">
        <CardHeader className="space-y-6 text-center pb-8 pt-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Добро пожаловать
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg font-medium">
              Войдите в свой личный кабинет
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          {error && (
            <Alert variant="destructive" className="border-red-200/60 bg-red-50/80 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200/60 bg-green-50/80 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-700 font-medium">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-700 font-semibold text-sm tracking-wide">
                Email адрес
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-14 text-base border-slate-200/80 focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 rounded-xl bg-white/80 backdrop-blur-sm"
                autoComplete="email"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-slate-700 font-semibold text-sm tracking-wide">
                Пароль
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите ваш пароль"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-14 text-base pr-14 border-slate-200/80 focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 rounded-xl bg-white/80 backdrop-blur-sm"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-14 px-4 hover:bg-transparent text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-[1.02] transition-all duration-300 rounded-xl" 
              disabled={isLoading || !formData.email.trim() || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Выполняется вход...
                </>
              ) : (
                <>
                  <LogIn className="mr-3 h-5 w-5" />
                  Войти в аккаунт
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4">
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200 text-sm"
            >
              Забыли пароль? Восстановить доступ
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-6 pb-8 px-8">
          <div className="text-center">
            <span className="text-slate-600 text-sm">Нет аккаунта? </span>
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 text-sm"
            >
              Создать бесплатный аккаунт
            </Link>
          </div>
          
          <div className="text-center border-t border-slate-100 pt-6">
            <Link 
              href="/" 
              className="text-slate-500 hover:text-slate-700 text-sm transition-colors duration-200 inline-flex items-center font-medium"
            >
              ← Вернуться на главную страницу
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
