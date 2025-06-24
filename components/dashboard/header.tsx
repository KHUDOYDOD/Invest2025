"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Search,
  Moon,
  Sun,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Zap,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState(2)
  const [messages, setMessages] = useState(3)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userName, setUserName] = useState("Иван")
  const [userEmail, setUserEmail] = useState("ivan@example.com")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    try {
      const savedUserName = localStorage.getItem("userName")
      const savedUserEmail = localStorage.getItem("userEmail")

      if (savedUserName) {
        setUserName(savedUserName)
      }

      if (savedUserEmail) {
        setUserEmail(savedUserEmail)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(timeInterval)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/login"
  }

  const navigateToProfile = () => {
    router.push("/dashboard/profile")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-30 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-xl border-b border-white/20 shadow-2xl"
          : "bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-b border-white/10"
      }`}
    >
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl p-3 rounded-xl shadow-lg">
              IP
            </div>
            <div className="hidden md:block">
              <span className="text-white font-bold text-xl">InvestPro</span>
              <p className="text-white/60 text-xs">Панель управления</p>
            </div>
          </Link>
        </motion.div>

        {/* Center - Time and Status */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-mono text-sm">{formatTime(currentTime)}</span>
          </div>

          <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-xl rounded-full px-4 py-2 border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-sm font-medium">Онлайн</span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "280px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative hidden md:block"
              >
                <Input
                  type="search"
                  placeholder="Поиск по кабинету..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={toggleSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <motion.div animate={{ rotate: theme === "light" ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.div>
          </Button>

          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <MessageSquare className="h-5 w-5" />
                {messages > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1">
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-blue-500 text-white text-xs border-2 border-slate-900">
                      {messages}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white rounded-xl"
            >
              <DropdownMenuLabel className="flex items-center justify-between p-4">
                <span className="font-semibold">Сообщения</span>
                <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto">
                  Все прочитано
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="max-h-80 overflow-y-auto">
                <MessageItem
                  name="Служба поддержки"
                  message="Здравствуйте! Как мы можем вам помочь сегодня?"
                  time="10 мин назад"
                  isUnread
                />
                <MessageItem
                  name="Система"
                  message="Ваша инвестиция успешно активирована"
                  time="2 часа назад"
                  isUnread
                />
                <MessageItem
                  name="Менеджер"
                  message="Добрый день! Хотел бы обсудить с вами новые инвестиционные возможности."
                  time="Вчера"
                />
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                  onClick={() => router.push("/dashboard/messages")}
                >
                  Все сообщения
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1">
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-slate-900 animate-pulse">
                      {notifications}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white rounded-xl"
            >
              <DropdownMenuLabel className="flex items-center justify-between p-4">
                <span className="font-semibold">Уведомления</span>
                <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto">
                  Все прочитано
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="max-h-80 overflow-y-auto">
                <NotificationItem
                  title="Новая инвестиция активирована"
                  description="Ваша инвестиция в план 'Стандарт' успешно активирована"
                  time="2 часа назад"
                  isUnread
                />
                <NotificationItem
                  title="Получен реферальный бонус"
                  description="Вы получили $50 за приглашенного пользователя"
                  time="1 день назад"
                  isUnread
                />
                <NotificationItem
                  title="Начисление прибыли"
                  description="На ваш счет зачислена прибыль в размере $125"
                  time="3 дня назад"
                />
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                  onClick={() => router.push("/dashboard/notifications")}
                >
                  Все уведомления
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white pl-3 pr-2"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left mr-2">
                  <p className="text-sm font-medium truncate max-w-24">{userName}</p>
                  <p className="text-xs text-white/60">Пользователь</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white rounded-xl"
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-white/70 truncate">{userEmail}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      <span className="text-xs text-green-300">Активен</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 rounded-lg mx-2"
                onClick={navigateToProfile}
              >
                <User className="mr-3 h-4 w-4" />
                <span>Мой профиль</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 rounded-lg mx-2"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-3 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer p-3 rounded-lg mx-2"
                onClick={() => router.push("/dashboard/support")}
              >
                <HelpCircle className="mr-3 h-4 w-4" />
                <span>Поддержка</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer p-3 rounded-lg mx-2 text-red-300 hover:text-red-200"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Выйти из аккаунта</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}

function NotificationItem({
  title,
  description,
  time,
  isUnread = false,
}: {
  title: string
  description: string
  time: string
  isUnread?: boolean
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      className={`p-4 cursor-pointer transition-colors ${isUnread ? "border-l-2 border-blue-500 bg-blue-500/5" : ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{title}</h4>
        {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
      </div>
      <p className="text-xs text-white/70 mb-2 line-clamp-2">{description}</p>
      <p className="text-xs text-white/50">{time}</p>
    </motion.div>
  )
}

function MessageItem({
  name,
  message,
  time,
  isUnread = false,
}: {
  name: string
  message: string
  time: string
  isUnread?: boolean
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      className={`p-4 cursor-pointer transition-colors ${isUnread ? "border-l-2 border-blue-500 bg-blue-500/5" : ""}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-sm">{name}</h4>
            {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
          </div>
          <p className="text-xs text-white/70 mb-1 line-clamp-2">{message}</p>
          <p className="text-xs text-white/50">{time}</p>
        </div>
      </div>
    </motion.div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
