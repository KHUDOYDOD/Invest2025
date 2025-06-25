
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle, AlertCircle, UserPlus, Shield, Globe } from "lucide-react"
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
    country: "",
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

    if (!formData.country) {
      newErrors.country = "Выберите страну"
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          fullName: formData.full_name.trim(),
          country: formData.country,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Регистрация успешна! Добро пожаловать!')
        router.push('/dashboard')
      } else {
        toast.error(data.error || 'Ошибка при регистрации')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Ошибка соединения с сервером')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <Card className="w-full max-w-lg relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
          <CardHeader className="space-y-6 text-center pb-8 pt-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
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

              <div className="space-y-3">
                <Label htmlFor="country" className="text-white font-medium">
                  Страна
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-white/50 z-10" />
                  <Select
                    value={formData.country}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, country: value }))
                      if (errors.country) {
                        setErrors((prev) => ({ ...prev, country: "" }))
                      }
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={`pl-12 h-12 text-base bg-white/10 border-white/20 text-white rounded-xl transition-all duration-300 ${
                      errors.country ? "border-red-400 focus:border-red-400" : "focus:border-blue-400"
                    }`}>
                      <SelectValue placeholder="Выберите страну" className="text-white/50" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="RU" className="text-white hover:bg-slate-700">🇷🇺 Россия</SelectItem>
                      <SelectItem value="US" className="text-white hover:bg-slate-700">🇺🇸 США</SelectItem>
                      <SelectItem value="GB" className="text-white hover:bg-slate-700">🇬🇧 Великобритания</SelectItem>
                      <SelectItem value="DE" className="text-white hover:bg-slate-700">🇩🇪 Германия</SelectItem>
                      <SelectItem value="FR" className="text-white hover:bg-slate-700">🇫🇷 Франция</SelectItem>
                      <SelectItem value="IT" className="text-white hover:bg-slate-700">🇮🇹 Италия</SelectItem>
                      <SelectItem value="ES" className="text-white hover:bg-slate-700">🇪🇸 Испания</SelectItem>
                      <SelectItem value="CA" className="text-white hover:bg-slate-700">🇨🇦 Канада</SelectItem>
                      <SelectItem value="AU" className="text-white hover:bg-slate-700">🇦🇺 Австралия</SelectItem>
                      <SelectItem value="JP" className="text-white hover:bg-slate-700">🇯🇵 Япония</SelectItem>
                      <SelectItem value="KR" className="text-white hover:bg-slate-700">🇰🇷 Южная Корея</SelectItem>
                      <SelectItem value="CN" className="text-white hover:bg-slate-700">🇨🇳 Китай</SelectItem>
                      <SelectItem value="IN" className="text-white hover:bg-slate-700">🇮🇳 Индия</SelectItem>
                      <SelectItem value="BR" className="text-white hover:bg-slate-700">🇧🇷 Бразилия</SelectItem>
                      <SelectItem value="MX" className="text-white hover:bg-slate-700">🇲🇽 Мексика</SelectItem>
                      <SelectItem value="UA" className="text-white hover:bg-slate-700">🇺🇦 Украина</SelectItem>
                      <SelectItem value="PL" className="text-white hover:bg-slate-700">🇵🇱 Польша</SelectItem>
                      <SelectItem value="NL" className="text-white hover:bg-slate-700">🇳🇱 Нидерланды</SelectItem>
                      <SelectItem value="SE" className="text-white hover:bg-slate-700">🇸🇪 Швеция</SelectItem>
                      <SelectItem value="NO" className="text-white hover:bg-slate-700">🇳🇴 Норвегия</SelectItem>
                      <SelectItem value="TR" className="text-white hover:bg-slate-700">🇹🇷 Турция</SelectItem>
                      <SelectItem value="AR" className="text-white hover:bg-slate-700">🇦🇷 Аргентина</SelectItem>
                      <SelectItem value="CL" className="text-white hover:bg-slate-700">🇨🇱 Чили</SelectItem>
                      <SelectItem value="CO" className="text-white hover:bg-slate-700">🇨🇴 Колумбия</SelectItem>
                      <SelectItem value="VE" className="text-white hover:bg-slate-700">🇻🇪 Венесуэла</SelectItem>
                      <SelectItem value="PT" className="text-white hover:bg-slate-700">🇵🇹 Португалия</SelectItem>
                      <SelectItem value="GR" className="text-white hover:bg-slate-700">🇬🇷 Греция</SelectItem>
                      <SelectItem value="FI" className="text-white hover:bg-slate-700">🇫🇮 Финляндия</SelectItem>
                      <SelectItem value="DK" className="text-white hover:bg-slate-700">🇩🇰 Дания</SelectItem>
                      <SelectItem value="AT" className="text-white hover:bg-slate-700">🇦🇹 Австрия</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <AnimatePresence>
                  {errors.country && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.country}
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
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                disabled={isLoading || !formData.email.trim() || !formData.password || !formData.full_name.trim() || !formData.confirmPassword || !formData.country || !formData.agreeTerms}
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
