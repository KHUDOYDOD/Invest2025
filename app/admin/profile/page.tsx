"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "Администратор",
    email: "X453925x@gmail.com",
    phone: "+7 (999) 123-45-67",
    position: "Главный администратор",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("/placeholder.svg?height=128&width=128")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile")
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          name: data.name || "Администратор",
          email: data.email || "X453925x@gmail.com",
          phone: data.phone || "+7 (999) 123-45-67",
          position: data.position || "Главный администратор",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url)
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return

    setUploading(true)
    try {
      // Симуляция загрузки - в реальном приложении здесь будет загрузка в облако
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Обновляем профиль с новым URL аватара
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          avatarUrl: avatarPreview,
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError("Ошибка при загрузке фото")
      }
    } catch (error) {
      setError("Ошибка при загрузке фото")
    } finally {
      setUploading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError("Ошибка при сохранении профиля")
      }
    } catch (error) {
      setError("Ошибка при сохранении профиля")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (profileData.newPassword !== profileData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setLoading(true)
    setError("")

    try {
      // В реальном приложении здесь будет API для смены пароля
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaved(true)
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      setError("Ошибка при смене пароля")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Профиль администратора</h1>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Данные успешно сохранены в базе данных!</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64">
          <CardContent className="p-6 flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Admin" />
              <AvatarFallback className="text-4xl">A</AvatarFallback>
            </Avatar>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatar-upload" />
            <label htmlFor="avatar-upload">
              <Button variant="outline" className="w-full mb-2" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Выбрать фото
                </span>
              </Button>
            </label>
            {avatarFile && (
              <Button onClick={handleAvatarUpload} disabled={uploading} className="w-full">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  "Сохранить фото в БД"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="general">Общая информация</TabsTrigger>
              <TabsTrigger value="security">Безопасность</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Личные данные</CardTitle>
                  <CardDescription>Обновите вашу личную информацию</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input id="name" name="name" value={profileData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={profileData.email} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Должность</Label>
                      <Input id="position" name="position" value={profileData.position} onChange={handleChange} />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Сохранение в БД...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Сохранить в базу данных
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Изменение пароля</CardTitle>
                  <CardDescription>Обновите ваш пароль для входа в систему</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Изменить пароль
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-sm text-slate-500">Последнее изменение пароля: 01.06.2023</p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
