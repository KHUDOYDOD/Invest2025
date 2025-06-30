"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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

  const validateForm = () => {
    return formData.email.trim() && formData.password
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
        // Устанавливаем ошибку для конкретного поля если указано
        if (data.field) {
          const element = document.getElementById(data.field)
          if (element) {
            element.focus()
            element.classList.add('border-red-400')
            setTimeout(() => {
              element.classList.remove('border-red-400')
            }, 3000)
          }
        }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <Card className="w-full max-w-lg relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
        <CardHeader className="space-y-6 text-center pb-8 pt-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-3xl font-bold text-white">
              Добро пожаловать
            </CardTitle>
            <CardDescription className="text-white/70 text-lg font-medium">
              Войдите в свой личный кабинет
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          {error && (
            <Alert variant="destructive" className="border-red-400/50 bg-red-500/20 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-red-300 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <AlertDescription className="text-green-300 font-medium">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white font-medium">
                Email или логин
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="example@domain.com или ваш логин"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 focus:border-blue-400"
                autoComplete="email"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-white font-medium">
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
                  className="h-12 text-base pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 focus:border-blue-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-none rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300" 
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
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-all duration-200 text-sm"
            >
              Забыли пароль? Восстановить доступ
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-6 pb-8 px-8">
          <div className="text-center">
            <span className="text-white/70 text-sm">Нет аккаунта? </span>
            <Link 
              href="/register" 
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors duration-200 text-sm"
            >
              Создать бесплатный аккаунт
            </Link>
          </div>
        </CardFooter>
      </Card>
      </main>

      <Footer />
    </div>
  )
}