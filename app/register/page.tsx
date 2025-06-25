
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle, AlertCircle, UserPlus, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Очищаем ошибки при изменении
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Полное имя обязательно"
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "Имя должно содержать минимум 2 символа"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Некорректный email"
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен"
    } else if (formData.password.length < 3) {
      newErrors.password = "Минимум 3 символа"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Необходимо согласие с условиями"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме")
      return
    }

    setIsLoading(true)

    try {
      console.log("🚀 Отправка данных регистрации...")

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          full_name: formData.full_name.trim(),
        }),
      })

      const data = await response.json()
      console.log("📦 Ответ сервера:", data)

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации')
      }

      console.log("✅ Регистрация успешна:", data)

      // Сохраняем данные пользователя
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userName", data.user.fullName)
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userRole", data.user.role || "user")
        localStorage.setItem("userBalance", data.user.balance?.toString() || "0.00")
        localStorage.setItem("isAuthenticated", "true")
      }
      
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("auth-token", data.token)
      }

      toast.success("🎉 Регистрация успешна!", {
        description: `Добро пожаловать, ${data.user.fullName}!`,
        duration: 3000,
      })

      // Перенаправляем в дашборд
      setTimeout(() => {
        const redirectPath = data.redirect || "/dashboard"
        router.push(redirectPath)
      }, 1500)

    } catch (error) {
      console.error("❌ Ошибка регистрации:", error)
      
      let errorMessage = "Ошибка регистрации"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error("❌ " + errorMessage, {
        description: "Проверьте данные и попробуйте снова",
        duration: 5000,
      })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <Card className="w-full max-w-lg relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
          <CardHeader className="space-y-6 text-center pb-8 pt-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold text-white">
                Создание аккаунта
              </CardTitle>
              <CardDescription className="text-white/70 text-lg font-medium">
                Присоединяйтесь к нашей инвестиционной платформе
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-8">
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="border-red-400/50 bg-red-500/20 backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <AlertDescription className="text-red-300 font-medium">
                  Пожалуйста, исправьте ошибки в форме
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <div className="space-y-3">
                <Label htmlFor="full_name" className="text-white font-medium">
                  Полное имя
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Иван Иванов"
                    className={`pl-12 h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                      errors.full_name ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                    }`}
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <AnimatePresence>
                  {errors.full_name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.full_name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium">
                  Email адрес
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`pl-12 h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                      errors.email ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-medium">
                  Пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Минимум 3 символа"
                    className={`pl-12 pr-12 h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                      errors.password ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
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
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-white font-medium">
                  Подтверждение пароля
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    className={`pl-12 pr-12 h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                      errors.confirmPassword ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                    if (errors.agreeTerms) {
                      setErrors((prev) => ({ ...prev, agreeTerms: "" }))
                    }
                  }}
                  className="border-white/50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="agreeTerms" className="text-sm text-white/80 leading-relaxed">
                  Я согласен с{" "}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                    условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                    политикой конфиденциальности
                  </Link>
                </label>
              </div>
              <AnimatePresence>
                {errors.agreeTerms && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.agreeTerms}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white border-none rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                disabled={isLoading || !formData.email.trim() || !formData.password || !formData.full_name.trim() || !formData.confirmPassword || !formData.agreeTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Создание аккаунта...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-3 h-5 w-5" />
                    Зарегистрироваться
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pt-6 pb-8 px-8">
            <div className="text-center">
              <span className="text-white/70 text-sm">Уже есть аккаунт? </span>
              <Link 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors duration-200 text-sm"
              >
                Войти в систему
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
