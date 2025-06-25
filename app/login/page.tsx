"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react"

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
    // Очищаем ошибки при изменении полей
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log('Attempting login with:', formData.email)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка входа')
      }

      if (data.success) {
        setSuccess('Вход выполнен успешно! Перенаправление...')

        // Сохраняем данные пользователя в localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('auth-token', data.token)
        }

        // Перенаправляем в зависимости от роли
        setTimeout(() => {
          if (data.redirect) {
            router.push(data.redirect)
          } else if (data.user?.isAdmin) {
            router.push('/admin/dashboard')
          } else {
            router.push('/dashboard')
          }
        }, 1000)
      } else {
        throw new Error(data.error || 'Неизвестная ошибка')
      }

    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Произошла ошибка при входе. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Вход в систему
          </CardTitle>
          <CardDescription className="text-center">
            Введите свои данные для входа в аккаунт
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
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
                  className="pr-10 transition-colors"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <div className="text-sm text-gray-500">
              Демо аккаунты для тестирования:
            </div>
            <div className="text-xs space-y-1 text-gray-400">
              <div>Админ: admin@example.com / admin123</div>
              <div>Пользователь: user@example.com / demo123</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Зарегистрироваться
            </Link>
          </div>
          <div className="text-xs text-gray-500 text-center">
            <Link href="/" className="hover:underline">
              ← Вернуться на главную
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}