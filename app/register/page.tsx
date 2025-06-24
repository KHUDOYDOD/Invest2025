"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle, AlertCircle, X } from "lucide-react"
import { useProjectStatus } from "@/hooks/use-project-status"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { isLaunched, timeLeft, loading: statusLoading } = useProjectStatus()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
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
      console.log("🚀 Sending registration request...")

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

      console.log("📡 Response status:", response.status)

      const data = await response.json()
      console.log("📦 Response data:", data)

      if (!response.ok) {
        let errorMessage = "Ошибка регистрации"

        // Детальная обработка ошибок
        switch (response.status) {
          case 400:
            if (data.error?.includes("email")) {
              errorMessage = "Пользователь с таким email уже существует"
              setErrors({ email: "Email уже зарегистрирован" })
            } else if (data.error?.includes("пароль")) {
              errorMessage = "Слабый пароль"
              setErrors({ password: "Пароль слишком простой" })
            } else {
              errorMessage = data.error || "Некорректные данные"
            }
            break
          case 409:
            errorMessage = "Пользователь уже существует"
            setErrors({ email: "Email уже зарегистрирован" })
            break
          case 500:
            errorMessage = "Ошибка сервера. Попробуйте позже"
            break
          default:
            errorMessage = data.error || `Ошибка: ${response.status}`
        }

        throw new Error(errorMessage)
      }

      console.log("✅ Registration successful:", data)

      // Сохраняем данные пользователя и токен
      localStorage.setItem("userEmail", data.user.email)
      localStorage.setItem("userName", data.user.full_name)
      localStorage.setItem("userId", data.user.id)
      localStorage.setItem("userRole", data.user.role || "user")
      localStorage.setItem("userBalance", data.user.balance || "0.00")
      localStorage.setItem("isAuthenticated", "true")
      
      if (data.token) {
        localStorage.setItem("authToken", data.token)
      }

      if (data.user.isAdmin) {
        localStorage.setItem("adminAuth", "true")
      }

      toast.success("Регистрация успешна!", {
        description: `Добро пожаловать, ${data.user.full_name}!`,
        duration: 3000,
      })

      // Перенаправляем в соответствующую панель
      setTimeout(() => {
        if (data.user.isAdmin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      }, 1000)
    } catch (error) {
      console.error("❌ Registration error:", error)

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

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-white text-lg">Проверка статуса платформы...</p>
        </motion.div>
      </div>
    )
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-2xl"
                >
                  <User className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Создание аккаунта</h2>
                <p className="text-white/70">Присоединяйтесь к нашей инвестиционной платформе</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-white font-medium">
                    Полное имя
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Иван Иванов"
                      className={`pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                        errors.name ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                      }`}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && <X className="absolute right-3 top-3 h-5 w-5 text-red-400" />}
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
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
                      className={`pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                        errors.email ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <X className="absolute right-3 top-3 h-5 w-5 text-red-400" />}
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
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
                      className={`pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                        errors.password ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword" className="text-white font-medium">
                    Подтверждение пароля
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Повторите пароль"
                      className={`pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                        errors.confirmPassword ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start space-x-3"
                >
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
                </motion.div>
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

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Создание аккаунта...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Зарегистрироваться
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-center"
              >
                <p className="text-white/70 text-sm">
                  Уже есть аккаунт?{" "}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 underline font-medium">
                    Войти
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
