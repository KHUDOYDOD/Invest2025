
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

    // Реальная валидация при вводе
    if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Некорректный формат email" }))
      }
    }

    if (name === 'password' && value) {
      if (value.length < 6) {
        setErrors((prev) => ({ ...prev, password: "Минимум 6 символов" }))
      }
    }

    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Пароли не совпадают" }))
      }
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Минимум 6 символов"
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

      if (response.ok && data.success) {
        toast.success('Регистрация успешна! Добро пожаловать!')
        router.push('/dashboard')
      } else {
        // Устанавливаем ошибку для конкретного поля если указано
        if (data.field) {
          setErrors(prev => ({ ...prev, [data.field]: data.error }))
        }
        
        // Показываем общее уведомление
        toast.error(data.error || 'Ошибка при регистрации')
        
        // Прокручиваем к первому полю с ошибкой
        if (data.field) {
          const element = document.getElementById(data.field)
          if (element) {
            element.focus()
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
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
                    placeholder="Минимум 6 символов"
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
                    <SelectContent className="bg-slate-800 border-slate-600 max-h-[300px] overflow-y-auto">
                      <div className="sticky top-0 bg-slate-800 p-2 border-b border-slate-600">
                        <Input
                          placeholder="Поиск страны..."
                          className="h-8 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          onChange={(e) => {
                            const searchValue = e.target.value.toLowerCase()
                            const items = document.querySelectorAll('[data-country-item]')
                            items.forEach((item) => {
                              const text = item.textContent?.toLowerCase() || ''
                              if (text.includes(searchValue)) {
                                (item as HTMLElement).style.display = 'block'
                              } else {
                                (item as HTMLElement).style.display = 'none'
                              }
                            })
                          }}
                        />
                      </div>
                      <SelectItem value="AF" className="text-white hover:bg-slate-700" data-country-item>🇦🇫 Афганистан</SelectItem>
                      <SelectItem value="AL" className="text-white hover:bg-slate-700" data-country-item>🇦🇱 Албания</SelectItem>
                      <SelectItem value="DZ" className="text-white hover:bg-slate-700" data-country-item>🇩🇿 Алжир</SelectItem>
                      <SelectItem value="AD" className="text-white hover:bg-slate-700" data-country-item>🇦🇩 Андорра</SelectItem>
                      <SelectItem value="AO" className="text-white hover:bg-slate-700" data-country-item>🇦🇴 Ангола</SelectItem>
                      <SelectItem value="AG" className="text-white hover:bg-slate-700" data-country-item>🇦🇬 Антигуа и Барбуда</SelectItem>
                      <SelectItem value="AR" className="text-white hover:bg-slate-700" data-country-item>🇦🇷 Аргентина</SelectItem>
                      <SelectItem value="AM" className="text-white hover:bg-slate-700" data-country-item>🇦🇲 Армения</SelectItem>
                      <SelectItem value="AU" className="text-white hover:bg-slate-700" data-country-item>🇦🇺 Австралия</SelectItem>
                      <SelectItem value="AT" className="text-white hover:bg-slate-700" data-country-item>🇦🇹 Австрия</SelectItem>
                      <SelectItem value="AZ" className="text-white hover:bg-slate-700" data-country-item>🇦🇿 Азербайджан</SelectItem>
                      <SelectItem value="BS" className="text-white hover:bg-slate-700" data-country-item>🇧🇸 Багамы</SelectItem>
                      <SelectItem value="BH" className="text-white hover:bg-slate-700" data-country-item>🇧🇭 Бахрейн</SelectItem>
                      <SelectItem value="BD" className="text-white hover:bg-slate-700" data-country-item>🇧🇩 Бангладеш</SelectItem>
                      <SelectItem value="BB" className="text-white hover:bg-slate-700" data-country-item>🇧🇧 Барбадос</SelectItem>
                      <SelectItem value="BY" className="text-white hover:bg-slate-700" data-country-item>🇧🇾 Беларусь</SelectItem>
                      <SelectItem value="BE" className="text-white hover:bg-slate-700" data-country-item>🇧🇪 Бельгия</SelectItem>
                      <SelectItem value="BZ" className="text-white hover:bg-slate-700" data-country-item>🇧🇿 Белиз</SelectItem>
                      <SelectItem value="BJ" className="text-white hover:bg-slate-700" data-country-item>🇧🇯 Бенин</SelectItem>
                      <SelectItem value="BT" className="text-white hover:bg-slate-700" data-country-item>🇧🇹 Бутан</SelectItem>
                      <SelectItem value="BO" className="text-white hover:bg-slate-700" data-country-item>🇧🇴 Боливия</SelectItem>
                      <SelectItem value="BA" className="text-white hover:bg-slate-700" data-country-item>🇧🇦 Босния и Герцеговина</SelectItem>
                      <SelectItem value="BW" className="text-white hover:bg-slate-700" data-country-item>🇧🇼 Ботсвана</SelectItem>
                      <SelectItem value="BR" className="text-white hover:bg-slate-700" data-country-item>🇧🇷 Бразилия</SelectItem>
                      <SelectItem value="BN" className="text-white hover:bg-slate-700" data-country-item>🇧🇳 Бруней</SelectItem>
                      <SelectItem value="BG" className="text-white hover:bg-slate-700" data-country-item>🇧🇬 Болгария</SelectItem>
                      <SelectItem value="BF" className="text-white hover:bg-slate-700" data-country-item>🇧🇫 Буркина-Фасо</SelectItem>
                      <SelectItem value="BI" className="text-white hover:bg-slate-700" data-country-item>🇧🇮 Бурунди</SelectItem>
                      <SelectItem value="KH" className="text-white hover:bg-slate-700" data-country-item>🇰🇭 Камбоджа</SelectItem>
                      <SelectItem value="CM" className="text-white hover:bg-slate-700" data-country-item>🇨🇲 Камерун</SelectItem>
                      <SelectItem value="CA" className="text-white hover:bg-slate-700" data-country-item>🇨🇦 Канада</SelectItem>
                      <SelectItem value="CV" className="text-white hover:bg-slate-700" data-country-item>🇨🇻 Кабо-Верде</SelectItem>
                      <SelectItem value="CF" className="text-white hover:bg-slate-700" data-country-item>🇨🇫 ЦАР</SelectItem>
                      <SelectItem value="TD" className="text-white hover:bg-slate-700" data-country-item>🇹🇩 Чад</SelectItem>
                      <SelectItem value="CL" className="text-white hover:bg-slate-700" data-country-item>🇨🇱 Чили</SelectItem>
                      <SelectItem value="CN" className="text-white hover:bg-slate-700" data-country-item>🇨🇳 Китай</SelectItem>
                      <SelectItem value="CO" className="text-white hover:bg-slate-700" data-country-item>🇨🇴 Колумбия</SelectItem>
                      <SelectItem value="KM" className="text-white hover:bg-slate-700" data-country-item>🇰🇲 Коморы</SelectItem>
                      <SelectItem value="CG" className="text-white hover:bg-slate-700" data-country-item>🇨🇬 Конго</SelectItem>
                      <SelectItem value="CD" className="text-white hover:bg-slate-700" data-country-item>🇨🇩 ДР Конго</SelectItem>
                      <SelectItem value="CR" className="text-white hover:bg-slate-700" data-country-item>🇨🇷 Коста-Рика</SelectItem>
                      <SelectItem value="CI" className="text-white hover:bg-slate-700" data-country-item>🇨🇮 Кот-д'Ивуар</SelectItem>
                      <SelectItem value="HR" className="text-white hover:bg-slate-700" data-country-item>🇭🇷 Хорватия</SelectItem>
                      <SelectItem value="CU" className="text-white hover:bg-slate-700" data-country-item>🇨🇺 Куба</SelectItem>
                      <SelectItem value="CY" className="text-white hover:bg-slate-700" data-country-item>🇨🇾 Кипр</SelectItem>
                      <SelectItem value="CZ" className="text-white hover:bg-slate-700" data-country-item>🇨🇿 Чехия</SelectItem>
                      <SelectItem value="DK" className="text-white hover:bg-slate-700" data-country-item>🇩🇰 Дания</SelectItem>
                      <SelectItem value="DJ" className="text-white hover:bg-slate-700" data-country-item>🇩🇯 Джибути</SelectItem>
                      <SelectItem value="DM" className="text-white hover:bg-slate-700" data-country-item>🇩🇲 Доминика</SelectItem>
                      <SelectItem value="DO" className="text-white hover:bg-slate-700" data-country-item>🇩🇴 Доминиканская Республика</SelectItem>
                      <SelectItem value="EC" className="text-white hover:bg-slate-700" data-country-item>🇪🇨 Эквадор</SelectItem>
                      <SelectItem value="EG" className="text-white hover:bg-slate-700" data-country-item>🇪🇬 Египет</SelectItem>
                      <SelectItem value="SV" className="text-white hover:bg-slate-700" data-country-item>🇸🇻 Сальвадор</SelectItem>
                      <SelectItem value="GQ" className="text-white hover:bg-slate-700" data-country-item>🇬🇶 Экваториальная Гвинея</SelectItem>
                      <SelectItem value="ER" className="text-white hover:bg-slate-700" data-country-item>🇪🇷 Эритрея</SelectItem>
                      <SelectItem value="EE" className="text-white hover:bg-slate-700" data-country-item>🇪🇪 Эстония</SelectItem>
                      <SelectItem value="SZ" className="text-white hover:bg-slate-700" data-country-item>🇸🇿 Эсватини</SelectItem>
                      <SelectItem value="ET" className="text-white hover:bg-slate-700" data-country-item>🇪🇹 Эфиопия</SelectItem>
                      <SelectItem value="FJ" className="text-white hover:bg-slate-700" data-country-item>🇫🇯 Фиджи</SelectItem>
                      <SelectItem value="FI" className="text-white hover:bg-slate-700" data-country-item>🇫🇮 Финляндия</SelectItem>
                      <SelectItem value="FR" className="text-white hover:bg-slate-700" data-country-item>🇫🇷 Франция</SelectItem>
                      <SelectItem value="GA" className="text-white hover:bg-slate-700" data-country-item>🇬🇦 Габон</SelectItem>
                      <SelectItem value="GM" className="text-white hover:bg-slate-700" data-country-item>🇬🇲 Гамбия</SelectItem>
                      <SelectItem value="GE" className="text-white hover:bg-slate-700" data-country-item>🇬🇪 Грузия</SelectItem>
                      <SelectItem value="DE" className="text-white hover:bg-slate-700" data-country-item>🇩🇪 Германия</SelectItem>
                      <SelectItem value="GH" className="text-white hover:bg-slate-700" data-country-item>🇬🇭 Гана</SelectItem>
                      <SelectItem value="GR" className="text-white hover:bg-slate-700" data-country-item>🇬🇷 Греция</SelectItem>
                      <SelectItem value="GD" className="text-white hover:bg-slate-700" data-country-item>🇬🇩 Гренада</SelectItem>
                      <SelectItem value="GT" className="text-white hover:bg-slate-700" data-country-item>🇬🇹 Гватемала</SelectItem>
                      <SelectItem value="GN" className="text-white hover:bg-slate-700" data-country-item>🇬🇳 Гвинея</SelectItem>
                      <SelectItem value="GW" className="text-white hover:bg-slate-700" data-country-item>🇬🇼 Гвинея-Бисау</SelectItem>
                      <SelectItem value="GY" className="text-white hover:bg-slate-700" data-country-item>🇬🇾 Гайана</SelectItem>
                      <SelectItem value="HT" className="text-white hover:bg-slate-700" data-country-item>🇭🇹 Гаити</SelectItem>
                      <SelectItem value="HN" className="text-white hover:bg-slate-700" data-country-item>🇭🇳 Гондурас</SelectItem>
                      <SelectItem value="HU" className="text-white hover:bg-slate-700" data-country-item>🇭🇺 Венгрия</SelectItem>
                      <SelectItem value="IS" className="text-white hover:bg-slate-700" data-country-item>🇮🇸 Исландия</SelectItem>
                      <SelectItem value="IN" className="text-white hover:bg-slate-700" data-country-item>🇮🇳 Индия</SelectItem>
                      <SelectItem value="ID" className="text-white hover:bg-slate-700" data-country-item>🇮🇩 Индонезия</SelectItem>
                      <SelectItem value="IR" className="text-white hover:bg-slate-700" data-country-item>🇮🇷 Иран</SelectItem>
                      <SelectItem value="IQ" className="text-white hover:bg-slate-700" data-country-item>🇮🇶 Ирак</SelectItem>
                      <SelectItem value="IE" className="text-white hover:bg-slate-700" data-country-item>🇮🇪 Ирландия</SelectItem>
                      <SelectItem value="IL" className="text-white hover:bg-slate-700" data-country-item>🇮🇱 Израиль</SelectItem>
                      <SelectItem value="IT" className="text-white hover:bg-slate-700" data-country-item>🇮🇹 Италия</SelectItem>
                      <SelectItem value="JM" className="text-white hover:bg-slate-700" data-country-item>🇯🇲 Ямайка</SelectItem>
                      <SelectItem value="JP" className="text-white hover:bg-slate-700" data-country-item>🇯🇵 Япония</SelectItem>
                      <SelectItem value="JO" className="text-white hover:bg-slate-700" data-country-item>🇯🇴 Иордания</SelectItem>
                      <SelectItem value="KZ" className="text-white hover:bg-slate-700" data-country-item>🇰🇿 Казахстан</SelectItem>
                      <SelectItem value="KE" className="text-white hover:bg-slate-700" data-country-item>🇰🇪 Кения</SelectItem>
                      <SelectItem value="KI" className="text-white hover:bg-slate-700" data-country-item>🇰🇮 Кирибати</SelectItem>
                      <SelectItem value="KP" className="text-white hover:bg-slate-700" data-country-item>🇰🇵 КНДР</SelectItem>
                      <SelectItem value="KR" className="text-white hover:bg-slate-700" data-country-item>🇰🇷 Южная Корея</SelectItem>
                      <SelectItem value="KW" className="text-white hover:bg-slate-700" data-country-item>🇰🇼 Кувейт</SelectItem>
                      <SelectItem value="KG" className="text-white hover:bg-slate-700" data-country-item>🇰🇬 Кыргызстан</SelectItem>
                      <SelectItem value="LA" className="text-white hover:bg-slate-700" data-country-item>🇱🇦 Лаос</SelectItem>
                      <SelectItem value="LV" className="text-white hover:bg-slate-700" data-country-item>🇱🇻 Латвия</SelectItem>
                      <SelectItem value="LB" className="text-white hover:bg-slate-700" data-country-item>🇱🇧 Ливан</SelectItem>
                      <SelectItem value="LS" className="text-white hover:bg-slate-700" data-country-item>🇱🇸 Лесото</SelectItem>
                      <SelectItem value="LR" className="text-white hover:bg-slate-700" data-country-item>🇱🇷 Либерия</SelectItem>
                      <SelectItem value="LY" className="text-white hover:bg-slate-700" data-country-item>🇱🇾 Ливия</SelectItem>
                      <SelectItem value="LI" className="text-white hover:bg-slate-700" data-country-item>🇱🇮 Лихтенштейн</SelectItem>
                      <SelectItem value="LT" className="text-white hover:bg-slate-700" data-country-item>🇱🇹 Литва</SelectItem>
                      <SelectItem value="LU" className="text-white hover:bg-slate-700" data-country-item>🇱🇺 Люксембург</SelectItem>
                      <SelectItem value="MG" className="text-white hover:bg-slate-700" data-country-item>🇲🇬 Мадагаскар</SelectItem>
                      <SelectItem value="MW" className="text-white hover:bg-slate-700" data-country-item>🇲🇼 Малави</SelectItem>
                      <SelectItem value="MY" className="text-white hover:bg-slate-700" data-country-item>🇲🇾 Малайзия</SelectItem>
                      <SelectItem value="MV" className="text-white hover:bg-slate-700" data-country-item>🇲🇻 Мальдивы</SelectItem>
                      <SelectItem value="ML" className="text-white hover:bg-slate-700" data-country-item>🇲🇱 Мали</SelectItem>
                      <SelectItem value="MT" className="text-white hover:bg-slate-700" data-country-item>🇲🇹 Мальта</SelectItem>
                      <SelectItem value="MH" className="text-white hover:bg-slate-700" data-country-item>🇲🇭 Маршалловы Острова</SelectItem>
                      <SelectItem value="MR" className="text-white hover:bg-slate-700" data-country-item>🇲🇷 Мавритания</SelectItem>
                      <SelectItem value="MU" className="text-white hover:bg-slate-700" data-country-item>🇲🇺 Маврикий</SelectItem>
                      <SelectItem value="MX" className="text-white hover:bg-slate-700" data-country-item>🇲🇽 Мексика</SelectItem>
                      <SelectItem value="FM" className="text-white hover:bg-slate-700" data-country-item>🇫🇲 Микронезия</SelectItem>
                      <SelectItem value="MD" className="text-white hover:bg-slate-700" data-country-item>🇲🇩 Молдова</SelectItem>
                      <SelectItem value="MC" className="text-white hover:bg-slate-700" data-country-item>🇲🇨 Монако</SelectItem>
                      <SelectItem value="MN" className="text-white hover:bg-slate-700" data-country-item>🇲🇳 Монголия</SelectItem>
                      <SelectItem value="ME" className="text-white hover:bg-slate-700" data-country-item>🇲🇪 Черногория</SelectItem>
                      <SelectItem value="MA" className="text-white hover:bg-slate-700" data-country-item>🇲🇦 Марокко</SelectItem>
                      <SelectItem value="MZ" className="text-white hover:bg-slate-700" data-country-item>🇲🇿 Мозамбик</SelectItem>
                      <SelectItem value="MM" className="text-white hover:bg-slate-700" data-country-item>🇲🇲 Мьянма</SelectItem>
                      <SelectItem value="NA" className="text-white hover:bg-slate-700" data-country-item>🇳🇦 Намибия</SelectItem>
                      <SelectItem value="NR" className="text-white hover:bg-slate-700" data-country-item>🇳🇷 Науру</SelectItem>
                      <SelectItem value="NP" className="text-white hover:bg-slate-700" data-country-item>🇳🇵 Непал</SelectItem>
                      <SelectItem value="NL" className="text-white hover:bg-slate-700" data-country-item>🇳🇱 Нидерланды</SelectItem>
                      <SelectItem value="NZ" className="text-white hover:bg-slate-700" data-country-item>🇳🇿 Новая Зеландия</SelectItem>
                      <SelectItem value="NI" className="text-white hover:bg-slate-700" data-country-item>🇳🇮 Никарагуа</SelectItem>
                      <SelectItem value="NE" className="text-white hover:bg-slate-700" data-country-item>🇳🇪 Нигер</SelectItem>
                      <SelectItem value="NG" className="text-white hover:bg-slate-700" data-country-item>🇳🇬 Нигерия</SelectItem>
                      <SelectItem value="MK" className="text-white hover:bg-slate-700" data-country-item>🇲🇰 Северная Македония</SelectItem>
                      <SelectItem value="NO" className="text-white hover:bg-slate-700" data-country-item>🇳🇴 Норвегия</SelectItem>
                      <SelectItem value="OM" className="text-white hover:bg-slate-700" data-country-item>🇴🇲 Оман</SelectItem>
                      <SelectItem value="PK" className="text-white hover:bg-slate-700" data-country-item>🇵🇰 Пакистан</SelectItem>
                      <SelectItem value="PW" className="text-white hover:bg-slate-700" data-country-item>🇵🇼 Палау</SelectItem>
                      <SelectItem value="PA" className="text-white hover:bg-slate-700" data-country-item>🇵🇦 Панама</SelectItem>
                      <SelectItem value="PG" className="text-white hover:bg-slate-700" data-country-item>🇵🇬 Папуа-Новая Гвинея</SelectItem>
                      <SelectItem value="PY" className="text-white hover:bg-slate-700" data-country-item>🇵🇾 Парагвай</SelectItem>
                      <SelectItem value="PE" className="text-white hover:bg-slate-700" data-country-item>🇵🇪 Перу</SelectItem>
                      <SelectItem value="PH" className="text-white hover:bg-slate-700" data-country-item>🇵🇭 Филиппины</SelectItem>
                      <SelectItem value="PL" className="text-white hover:bg-slate-700" data-country-item>🇵🇱 Польша</SelectItem>
                      <SelectItem value="PT" className="text-white hover:bg-slate-700" data-country-item>🇵🇹 Португалия</SelectItem>
                      <SelectItem value="QA" className="text-white hover:bg-slate-700" data-country-item>🇶🇦 Катар</SelectItem>
                      <SelectItem value="RO" className="text-white hover:bg-slate-700" data-country-item>🇷🇴 Румыния</SelectItem>
                      <SelectItem value="RU" className="text-white hover:bg-slate-700" data-country-item>🇷🇺 Россия</SelectItem>
                      <SelectItem value="RW" className="text-white hover:bg-slate-700" data-country-item>🇷🇼 Руанда</SelectItem>
                      <SelectItem value="KN" className="text-white hover:bg-slate-700" data-country-item>🇰🇳 Сент-Китс и Невис</SelectItem>
                      <SelectItem value="LC" className="text-white hover:bg-slate-700" data-country-item>🇱🇨 Сент-Люсия</SelectItem>
                      <SelectItem value="VC" className="text-white hover:bg-slate-700" data-country-item>🇻🇨 Сент-Винсент и Гренадины</SelectItem>
                      <SelectItem value="WS" className="text-white hover:bg-slate-700" data-country-item>🇼🇸 Самоа</SelectItem>
                      <SelectItem value="SM" className="text-white hover:bg-slate-700" data-country-item>🇸🇲 Сан-Марино</SelectItem>
                      <SelectItem value="ST" className="text-white hover:bg-slate-700" data-country-item>🇸🇹 Сан-Томе и Принсипи</SelectItem>
                      <SelectItem value="SA" className="text-white hover:bg-slate-700" data-country-item>🇸🇦 Саудовская Аравия</SelectItem>
                      <SelectItem value="SN" className="text-white hover:bg-slate-700" data-country-item>🇸🇳 Сенегал</SelectItem>
                      <SelectItem value="RS" className="text-white hover:bg-slate-700" data-country-item>🇷🇸 Сербия</SelectItem>
                      <SelectItem value="SC" className="text-white hover:bg-slate-700" data-country-item>🇸🇨 Сейшелы</SelectItem>
                      <SelectItem value="SL" className="text-white hover:bg-slate-700" data-country-item>🇸🇱 Сьерра-Леоне</SelectItem>
                      <SelectItem value="SG" className="text-white hover:bg-slate-700" data-country-item>🇸🇬 Сингапур</SelectItem>
                      <SelectItem value="SK" className="text-white hover:bg-slate-700" data-country-item>🇸🇰 Словакия</SelectItem>
                      <SelectItem value="SI" className="text-white hover:bg-slate-700" data-country-item>🇸🇮 Словения</SelectItem>
                      <SelectItem value="SB" className="text-white hover:bg-slate-700" data-country-item>🇸🇧 Соломоновы Острова</SelectItem>
                      <SelectItem value="SO" className="text-white hover:bg-slate-700" data-country-item>🇸🇴 Сомали</SelectItem>
                      <SelectItem value="ZA" className="text-white hover:bg-slate-700" data-country-item>🇿🇦 ЮАР</SelectItem>
                      <SelectItem value="SS" className="text-white hover:bg-slate-700" data-country-item>🇸🇸 Южный Судан</SelectItem>
                      <SelectItem value="ES" className="text-white hover:bg-slate-700" data-country-item>🇪🇸 Испания</SelectItem>
                      <SelectItem value="LK" className="text-white hover:bg-slate-700" data-country-item>🇱🇰 Шри-Ланка</SelectItem>
                      <SelectItem value="SD" className="text-white hover:bg-slate-700" data-country-item>🇸🇩 Судан</SelectItem>
                      <SelectItem value="SR" className="text-white hover:bg-slate-700" data-country-item>🇸🇷 Суринам</SelectItem>
                      <SelectItem value="SE" className="text-white hover:bg-slate-700" data-country-item>🇸🇪 Швеция</SelectItem>
                      <SelectItem value="CH" className="text-white hover:bg-slate-700" data-country-item>🇨🇭 Швейцария</SelectItem>
                      <SelectItem value="SY" className="text-white hover:bg-slate-700" data-country-item>🇸🇾 Сирия</SelectItem>
                      <SelectItem value="TJ" className="text-white hover:bg-slate-700" data-country-item>🇹🇯 Таджикистан</SelectItem>
                      <SelectItem value="TZ" className="text-white hover:bg-slate-700" data-country-item>🇹🇿 Танзания</SelectItem>
                      <SelectItem value="TH" className="text-white hover:bg-slate-700" data-country-item>🇹🇭 Таиланд</SelectItem>
                      <SelectItem value="TL" className="text-white hover:bg-slate-700" data-country-item>🇹🇱 Восточный Тимор</SelectItem>
                      <SelectItem value="TG" className="text-white hover:bg-slate-700" data-country-item>🇹🇬 Того</SelectItem>
                      <SelectItem value="TO" className="text-white hover:bg-slate-700" data-country-item>🇹🇴 Тонга</SelectItem>
                      <SelectItem value="TT" className="text-white hover:bg-slate-700" data-country-item>🇹🇹 Тринидад и Тобаго</SelectItem>
                      <SelectItem value="TN" className="text-white hover:bg-slate-700" data-country-item>🇹🇳 Тунис</SelectItem>
                      <SelectItem value="TR" className="text-white hover:bg-slate-700" data-country-item>🇹🇷 Турция</SelectItem>
                      <SelectItem value="TM" className="text-white hover:bg-slate-700" data-country-item>🇹🇲 Туркменистан</SelectItem>
                      <SelectItem value="TV" className="text-white hover:bg-slate-700" data-country-item>🇹🇻 Тувалу</SelectItem>
                      <SelectItem value="UG" className="text-white hover:bg-slate-700" data-country-item>🇺🇬 Уганда</SelectItem>
                      <SelectItem value="UA" className="text-white hover:bg-slate-700" data-country-item>🇺🇦 Украина</SelectItem>
                      <SelectItem value="AE" className="text-white hover:bg-slate-700" data-country-item>🇦🇪 ОАЭ</SelectItem>
                      <SelectItem value="GB" className="text-white hover:bg-slate-700" data-country-item>🇬🇧 Великобритания</SelectItem>
                      <SelectItem value="US" className="text-white hover:bg-slate-700" data-country-item>🇺🇸 США</SelectItem>
                      <SelectItem value="UY" className="text-white hover:bg-slate-700" data-country-item>🇺🇾 Уругвай</SelectItem>
                      <SelectItem value="UZ" className="text-white hover:bg-slate-700" data-country-item>🇺🇿 Узбекистан</SelectItem>
                      <SelectItem value="VU" className="text-white hover:bg-slate-700" data-country-item>🇻🇺 Вануату</SelectItem>
                      <SelectItem value="VA" className="text-white hover:bg-slate-700" data-country-item>🇻🇦 Ватикан</SelectItem>
                      <SelectItem value="VE" className="text-white hover:bg-slate-700" data-country-item>🇻🇪 Венесуэла</SelectItem>
                      <SelectItem value="VN" className="text-white hover:bg-slate-700" data-country-item>🇻🇳 Вьетнам</SelectItem>
                      <SelectItem value="YE" className="text-white hover:bg-slate-700" data-country-item>🇾🇪 Йемен</SelectItem>
                      <SelectItem value="ZM" className="text-white hover:bg-slate-700" data-country-item>🇿🇲 Замбия</SelectItem>
                      <SelectItem value="ZW" className="text-white hover:bg-slate-700" data-country-item>🇿🇼 Зимбабве</SelectItem>
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
