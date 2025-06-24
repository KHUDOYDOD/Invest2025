"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Award,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface UserProfile {
  id: string
  email: string
  full_name: string
  balance: number
  total_invested: number
  total_earned: number
  role: string
  created_at: string
  phone?: string
  country?: string
  city?: string
  bio?: string
  avatar_url?: string
  last_login?: string
  profile?: {
    avatar_url?: string
    phone?: string
    country?: string
    city?: string
    bio?: string
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    country: "",
    city: "",
    bio: "",
    occupation: "",
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)

      // Получаем ID пользователя из localStorage
      const userId = localStorage.getItem("userId")
      if (!userId) {
        toast.error("Пользователь не авторизован")
        return
      }

      const response = await fetch(`/api/user/profile?id=${userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки профиля")
      }

      // Исправляем структуру данных пользователя  
      const userData = {
        ...data.user,
        balance: parseFloat(data.user.balance || 0),
        total_invested: parseFloat(data.user.total_invested || 0),
        total_earned: parseFloat(data.user.total_earned || 0),
        profile: {
          phone: data.user.phone || "",
          country: data.user.country || "",
          city: data.user.city || "",
          bio: data.user.bio || "",
          avatar_url: data.user.avatar_url || "",
        }
      }
      
      setUser(userData)
      setFormData({
        full_name: data.user.full_name || "",
        phone: data.user.phone || "",
        country: data.user.country || "",
        city: data.user.city || "",
        bio: data.user.bio || "",
        occupation: "",
      })
    } catch (error) {
      console.error("Profile loading error:", error)
      toast.error("Ошибка загрузки профиля")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const userId = localStorage.getItem("userId")
      if (!userId) {
        toast.error("Пользователь не авторизован")
        return
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number.parseInt(userId),
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сохранения")
      }

      setUser(data.user)
      setEditing(false)
      toast.success("Профиль успешно обновлен!")
    } catch (error) {
      console.error("Profile save error:", error)
      toast.error("Ошибка сохранения профиля")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.profile?.phone || "",
        country: user.profile?.country || "",
        city: user.profile?.city || "",
        bio: user.profile?.bio || "",
        occupation: user.profile?.occupation || "",
      })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Загрузка профиля...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Ошибка загрузки</h2>
          <p className="text-white/70 mb-4">Не удалось загрузить данные профиля</p>
          <Button onClick={loadUserProfile} className="bg-blue-600 hover:bg-blue-700">
            Попробовать снова
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Мой профиль</h1>
          <p className="text-white/70">Управляйте своими личными данными и настройками</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24 border-4 border-white/20">
                    <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl">
                      {user.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                <CardDescription className="text-white/70">{user.profile?.occupation || "Инвестор"}</CardDescription>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant={user.email_verified ? "default" : "secondary"} className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Email подтвержден
                  </Badge>
                  {user.kyc_verified && (
                    <Badge variant="default" className="bg-blue-600">
                      <Shield className="w-3 h-3 mr-1" />
                      KYC
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white/50" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.profile?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-white/50" />
                      <span className="text-sm">{user.profile.phone}</span>
                    </div>
                  )}
                  {(user.profile?.city || user.profile?.country) && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-white/50" />
                      <span className="text-sm">
                        {[user.profile?.city, user.profile?.country].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="text-sm">
                      Регистрация: {new Date(user.created_at).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl border-green-400/30 text-white">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-2xl font-bold">${(user.balance || 0).toFixed(2)}</p>
                    <p className="text-sm text-white/70">Баланс</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-blue-400/30 text-white">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold">${(user.total_earned || 0).toFixed(2)}</p>
                    <p className="text-sm text-white/70">Прибыль</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-xl border-orange-400/30 text-white">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                    <p className="text-2xl font-bold">{user.referral_count}</p>
                    <p className="text-sm text-white/70">Рефералы</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-purple-400/30 text-white">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <p className="text-lg font-bold">{user.referral_code}</p>
                    <p className="text-sm text-white/70">Реф. код</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Личная информация</CardTitle>
                    <CardDescription className="text-white/70">
                      Обновите свои личные данные и контактную информацию
                    </CardDescription>
                  </div>
                  <AnimatePresence mode="wait">
                    {!editing ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Редактировать
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="actions"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex gap-2"
                      >
                        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? "Сохранение..." : "Сохранить"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Отмена
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Полное имя</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!editing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Страна</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!editing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      placeholder="Россия"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!editing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      placeholder="Москва"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Профессия</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      disabled={!editing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                      placeholder="Инвестор"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="bio">О себе</Label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!editing}
                      className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 disabled:opacity-50 resize-none"
                      placeholder="Расскажите о себе..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
