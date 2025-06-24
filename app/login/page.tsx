"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Lock, Loader2, Eye, EyeOff, Shield, LogIn, AlertCircle, X } from "lucide-react"
import { useProjectStatus } from "@/hooks/use-project-status"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginField, setLoginField] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isLaunched, timeLeft, loading: statusLoading } = useProjectStatus()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!loginField.trim()) {
      newErrors.loginField = "Email обязателен"
    } else if (!loginField.includes("@")) {
      newErrors.loginField = "Введите корректный email"
    }

    if (!password) {
      newErrors.password = "Пароль обязателен"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Пожалуйста, заполните все поля")
      return
    }

    setIsLoading(true)

    try {
      console.log("🚀 Sending login request...")

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginField.trim(),
          password
        }),
      })

      console.log("📡 Response status:", response.status)

      const data = await response.json()
      console.log("📦 Response data:", data)

      if (!response.ok) {
        let errorMessage = "Ошибка авторизации"

        // Детальная обработка ошибок
        switch (response.status) {
          case 401:
            errorMessage = data.error || "Неверный email/пароль"
            break
          case 404:
            errorMessage = "Пользователь не найден"
            break
          case 403:
            errorMessage = data.error || "Аккаунт заблокирован"
            break
          case 500:
            errorMessage = "Ошибка сервера. Попробуйте позже"
            break
          default:
            errorMessage = data.error || `Ошибка: ${response.status}`
        }

        // Показываем ошибку в поле формы
        if (response.status === 401) {
          setErrors({
            loginField: "Проверьте email или имя",
            password: "Неверный пароль",
          })
        }

        throw new Error(errorMessage)
      }

      console.log("✅ Login successful:", data)

      // Сохраняем данные пользователя
      localStorage.setItem("userEmail", data.user.email)
      localStorage.setItem("userName", data.user.full_name)
      localStorage.setItem("userId", data.user.id.toString())
      localStorage.setItem("userRole", data.user.role || "user")
      localStorage.setItem("isAuthenticated", "true")

      if (data.user.isAdmin) {
        localStorage.setItem("adminAuth", "true")
      }

      toast.success("Вход выполнен успешно!", {
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
      console.error("❌ Login error:", error)

      let errorMessage = "Ошибка авторизации"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Проверка статуса платформы...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col relative overflow-hidden">
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
                  className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-2xl"
                >
                  <Lock className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Вход в систему</h2>
                <p className="text-white/70">Введите ваши данные для входа в личный кабинет</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="loginField" className="text-white font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                    <Input
                      id="loginField"
                      type="text"
                      placeholder="demo@example.com"
                      className={`pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 ${
                        errors.loginField ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                      }`}
                      value={loginField}
                      onChange={(e) => {
                        setLoginField(e.target.value)
                        if (errors.loginField) {
                          setErrors((prev) => ({ ...prev, loginField: "" }))
                        }
                      }}
                      required
                    />
                    {errors.loginField && <X className="absolute right-3 top-3 h-5 w-5 text-red-400" />}
                  </div>
                  <AnimatePresence>
                    {errors.loginField && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.loginField}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white font-medium">
                      Пароль
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white rounded-xl transition-all duration-300 ${
                        errors.password ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                      }`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }))
                        }
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-5 w-5 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
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

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Войти в систему
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Security Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 grid grid-cols-3 gap-4"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white/70 text-xs">SSL защита</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white/70 text-xs">2FA защита</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white/70 text-xs">Безопасность</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 text-center"
              >
                <p className="text-white/70 text-sm">
                  Нет аккаунта?{" "}
                  <Link
                    href="/register"
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                  >
                    Зарегистрироваться
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
