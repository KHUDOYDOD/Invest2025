"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Shield, Bell } from "lucide-react"

function SettingsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeItem="settings" />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">Настройки</h1>
              <p className="text-white/70 text-lg">Управление вашим аккаунтом</p>
            </div>

            <div className="grid gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Профиль
                  </CardTitle>
                  <CardDescription className="text-white/90">Основная информация о вашем аккаунте</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Имя
                      </Label>
                      <Input id="name" placeholder="Ваше имя" className="bg-white/10 border-white/20 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Сохранить изменения</Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Безопасность
                  </CardTitle>
                  <CardDescription className="text-white/90">Настройки безопасности аккаунта</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="current-password" className="text-white">
                      Текущий пароль
                    </Label>
                    <Input id="current-password" type="password" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="new-password" className="text-white">
                      Новый пароль
                    </Label>
                    <Input id="new-password" type="password" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600">Изменить пароль</Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Уведомления
                  </CardTitle>
                  <CardDescription className="text-white/90">Настройки уведомлений</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email уведомления</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white">
                      Включено
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">SMS уведомления</span>
                    <Button variant="outline" size="sm" className="border-white/20 text-white">
                      Выключено
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}
