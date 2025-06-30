
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
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Sun, 
  Moon,
  Zap, 
  Activity, 
  TrendingUp, 
  Shield,
  Sparkles,
  ChevronDown,
  Command,
  Calendar,
  Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminHeader() {
  const router = useRouter()
  const [notifications] = useState([
    { id: 1, message: "Новый пользователь зарегистрирован", time: "2 мин назад", type: "info", unread: true },
    { id: 2, message: "Высокая нагрузка на сервер", time: "5 мин назад", type: "warning", unread: true },
    { id: 3, message: "Резервное копирование завершено", time: "1 час назад", type: "success", unread: false },
    { id: 4, message: "Новая инвестиция создана", time: "2 часа назад", type: "info", unread: false },
  ])
  const [adminUser, setAdminUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [theme, setTheme] = useState("dark")
  const [searchFocused, setSearchFocused] = useState(false)

  const unreadCount = notifications.filter(n => n.unread).length

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

    // Обновляем время каждую секунду
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning": return <Activity className="h-4 w-4 text-orange-400" />
      case "success": return <Shield className="h-4 w-4 text-green-400" />
      default: return <TrendingUp className="h-4 w-4 text-blue-400" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 via-purple-950/30 to-slate-950/50" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
      
      <div className="relative flex h-16 items-center justify-between px-6">
        {/* Левая часть */}
        <div className="flex items-center space-x-6">
          {/* Логотип и заголовок */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Админ Панель
              </h1>
            </div>
          </div>

          {/* Поиск */}
          <div className="hidden lg:flex relative group">
            <div className={cn(
              "flex items-center space-x-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2 transition-all duration-300",
              searchFocused ? "bg-white/15 border-blue-400/50 shadow-lg scale-105" : "hover:bg-white/15"
            )}>
              <Search className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Быстрый поиск..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-0 text-white placeholder-gray-400 focus:outline-none w-64"
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-xs text-white/70">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Правая часть */}
        <div className="flex items-center space-x-4">
          {/* Время и дата */}
          <div className="hidden xl:flex items-center space-x-4 text-right">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 text-white font-mono text-lg">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>{formatTime(currentTime)}</span>
              </div>
              <div className="text-xs text-gray-400">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="flex items-center space-x-2">
            {/* Системная активность */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <Activity className="h-5 w-5 text-green-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </Button>

            {/* Переключатель темы */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
            >
              {theme === "dark" ? 
                <Sun className="h-5 w-5 text-yellow-400" /> : 
                <Moon className="h-5 w-5 text-blue-400" />
              }
            </Button>
          </div>

          {/* Уведомления */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs animate-bounce">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl"
            >
              <DropdownMenuLabel className="flex items-center justify-between text-white">
                <span>Уведомления</span>
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {unreadCount} новых
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={cn(
                      "flex items-start space-x-3 p-3 cursor-pointer transition-all duration-200",
                      notification.unread ? "bg-blue-500/10 border-l-2 border-blue-400" : "hover:bg-white/5"
                    )}
                  >
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm",
                        notification.unread ? "text-white font-medium" : "text-gray-300"
                      )}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Профиль пользователя */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {adminUser?.name || "Администратор"}
                  </span>
                  <span className="text-xs text-gray-400">Главный админ</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl"
            >
              <DropdownMenuLabel className="text-white">
                Мой аккаунт
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                <Zap className="mr-2 h-4 w-4" />
                <span>Производительность</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-white/20" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
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
