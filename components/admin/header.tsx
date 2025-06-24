"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Settings, User, LogOut, Sun, Zap, Activity, TrendingUp, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const router = useRouter()
  const [notifications] = useState([
    { id: 1, message: "Новый пользователь зарегистрирован", time: "2 мин назад", type: "info" },
    { id: 2, message: "Высокая нагрузка на сервер", time: "5 мин назад", type: "warning" },
    { id: 3, message: "Резервное копирование завершено", time: "1 час назад", type: "success" },
  ])
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const userStr = localStorage.getItem("adminUser")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setAdminUser(user)
      } catch (e) {
        console.error("Ошибка при парсинге данных пользователя:", e)
      }
    }
  }, [])

  const handleLogout = () => {
    // Удаляем данные аутентификации из localStorage
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")

    // Перенаправляем на страницу входа
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск в админ панели..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-400 transition-all duration-300"
            />
          </div>
        </div>

        {/* Center - System Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-200 text-sm font-medium">Система активна</span>
          </div>

          <div className="flex items-center space-x-4 text-white/80">
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm">CPU: 45%</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm">1,250 пользователей</span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Sun className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                  {notifications.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-800/95 backdrop-blur-xl border-white/20">
              <DropdownMenuLabel className="text-white">Уведомления</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="text-white hover:bg-white/10 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Zap className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Быстрые действия</span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden md:inline font-medium">
                    {adminUser?.name || adminUser?.username || "Администратор"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800/95 backdrop-blur-xl border-white/20">
              <DropdownMenuLabel className="text-white">Мой аккаунт</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Безопасность</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-500/20 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
