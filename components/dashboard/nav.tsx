"use client"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  ArrowDownToLine,
  Settings,
  CreditCard,
  User,
  Bell,
  Shield,
  Menu,
  X,
  LogOut,
  Home,
  ArrowUpRight,
  Users,
  HelpCircle,
} from "lucide-react"
import { toast } from "sonner"

const navigationItems = [
  {
    id: "dashboard",
    title: "Главная",
    href: "/dashboard",
    icon: Home,
    description: "Обзор аккаунта",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/10",
  },
  {
    id: "investments",
    title: "Инвестиции",
    href: "/dashboard/investments",
    icon: TrendingUp,
    description: "Управление портфелем",
    badge: "Активно",
    gradient: "from-emerald-500 to-green-600",
    bgGradient: "from-emerald-500/10 to-green-600/10",
  },
  {
    id: "deposit",
    title: "Пополнение",
    href: "/dashboard/deposit",
    icon: ArrowDownToLine,
    description: "Пополнить баланс",
    gradient: "from-cyan-500 to-teal-600",
    bgGradient: "from-cyan-500/10 to-teal-600/10",
  },
  {
    id: "withdraw",
    title: "Вывод средств",
    href: "/dashboard/withdraw",
    icon: ArrowUpRight,
    description: "Вывести прибыль",
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-500/10 to-red-600/10",
  },
  {
    id: "transactions",
    title: "Транзакции",
    href: "/dashboard/transactions",
    icon: CreditCard,
    description: "История операций",
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-500/10 to-violet-600/10",
  },
  {
    id: "referrals",
    title: "Рефералы",
    href: "/dashboard/referrals",
    icon: Users,
    description: "Партнерская программа",
    badge: "7",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/10 to-orange-600/10",
  },
  {
    id: "profile",
    title: "Профиль",
    href: "/dashboard/profile",
    icon: User,
    description: "Личные данные",
    gradient: "from-indigo-500 to-purple-600",
    bgGradient: "from-indigo-500/10 to-purple-600/10",
  },
  {
    id: "settings",
    title: "Настройки",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Конфигурация",
    gradient: "from-gray-500 to-slate-600",
    bgGradient: "from-gray-500/10 to-slate-600/10",
  },
  {
    id: "support",
    title: "Поддержка",
    href: "/dashboard/support",
    icon: HelpCircle,
    description: "Помощь 24/7",
    badge: "Онлайн",
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "from-pink-500/10 to-rose-600/10",
  },
]

interface DashboardNavProps {
  activeItem?: string
}

export function DashboardNav({ activeItem }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    setIsAdmin(userRole === "admin")
  }, [])

  const handleNavigation = (href: string) => {
    try {
      router.push(href)
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Navigation error:", error)
      toast.error("Ошибка навигации")
    }
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      console.log("🚪 Starting logout process...")

      // Вызываем API для выхода
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при выходе")
      }

      console.log("✅ Logout API successful")

      // Очищаем localStorage
      const keysToRemove = [
        "userEmail",
        "userName",
        "userId",
        "userRole",
        "isAuthenticated",
        "adminAuth",
        "userBalance",
        "userInvestments",
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })

      console.log("✅ LocalStorage cleared")

      // Очищаем sessionStorage
      sessionStorage.clear()

      console.log("✅ SessionStorage cleared")

      toast.success("Вы успешно вышли из системы", {
        description: "Перенаправляем на главную страницу...",
      })

      // Перенаправляем на главную страницу
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } catch (error) {
      console.error("❌ Logout error:", error)
      toast.error("Ошибка при выходе из системы")

      // Даже если API не сработал, очищаем локальные данные
      localStorage.clear()
      sessionStorage.clear()

      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const getActiveItem = () => {
    return navigationItems.find(
      (item) =>
        pathname === item.href || (activeItem && activeItem === item.id) || pathname.startsWith(item.href + "/"),
    )
  }

  const activeNavItem = getActiveItem()

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("dashboard-sidebar")
      const menuButton = document.getElementById("menu-button")

      if (
        sidebar &&
        menuButton &&
        !sidebar.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node) &&
        isMenuOpen
      ) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        closeMenu()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isMenuOpen])

  return (
    <>
      {/* Menu Button - Moved down for better accessibility */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/80 backdrop-blur-xl border border-white/20 text-white hover:bg-black/90 shadow-xl rounded-2xl h-12 w-12"
          onClick={toggleMenu}
          id="menu-button"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={closeMenu} />}

      {/* Sidebar */}
      {isMenuOpen && (
        <aside
          className="fixed left-0 top-0 z-50 h-full w-80 bg-gradient-to-b from-black/95 via-gray-900/95 to-black/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl transform transition-transform duration-300"
          id="dashboard-sidebar"
        >
          <div className="flex h-full flex-col relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent" />

            {/* Header */}
            <div className="flex h-24 items-center justify-center px-6 border-b border-white/10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-2xl p-4 rounded-2xl shadow-2xl">
                    IP
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-2xl">InvestPro</h1>
                  <p className="text-white/60 text-sm">Личный кабинет</p>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-white/10 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {localStorage.getItem("userName")?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-white font-semibold">{localStorage.getItem("userName") || "Пользователь"}</p>
                  <p className="text-white/60 text-sm">Статус: Активный</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 relative z-10 overflow-y-auto">
              {navigationItems.map((item, index) => {
                const isActive = activeNavItem?.id === item.id
                const Icon = item.icon

                return (
                  <div key={item.id}>
                    <Button
                      variant="ghost"
                      onClick={() => handleNavigation(item.href)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "w-full justify-start text-left h-16 px-4 transition-all duration-300 rounded-2xl relative overflow-hidden group border",
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl border-white/20`
                          : "text-white/70 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10",
                      )}
                    >
                      {/* Background Animation */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient} opacity-0 transition-opacity duration-300 ${
                          hoveredItem === item.id && !isActive ? "opacity-100" : ""
                        }`}
                      />

                      <div className="relative z-10 flex items-center w-full">
                        <div className="flex-shrink-0 mr-4">
                          <div
                            className={cn(
                              "p-2 rounded-xl transition-all duration-300",
                              isActive ? "bg-white/20 shadow-lg" : "bg-white/10 group-hover:bg-white/20",
                            )}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base truncate">{item.title}</div>
                          <div className="text-sm opacity-80 truncate">{item.description}</div>
                        </div>

                        {item.badge && (
                          <div className="ml-2">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs font-semibold px-2 py-1 rounded-lg",
                                item.badge === "Активно" && "bg-green-500/20 text-green-300 border-green-500/30",
                                item.badge === "Онлайн" && "bg-blue-500/20 text-blue-300 border-blue-500/30",
                                typeof item.badge === "string" &&
                                  !isNaN(Number(item.badge)) &&
                                  "bg-orange-500/20 text-orange-300 border-orange-500/30",
                              )}
                            >
                              {item.badge}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
                      )}
                    </Button>
                  </div>
                )
              })}

              {/* Admin Panel Link */}
              {isAdmin && (
                <div className="pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/admin/dashboard")}
                    className="w-full justify-start text-left h-16 px-4 transition-all duration-300 rounded-2xl relative overflow-hidden group border border-red-500/20 hover:border-red-500/40 bg-gradient-to-r from-red-500/5 to-pink-500/5 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                  >
                    <div className="relative z-10 flex items-center w-full">
                      <div className="flex-shrink-0 mr-4">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                          <Shield className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-base">Админ панель</div>
                        <div className="text-sm opacity-80">Управление системой</div>
                      </div>
                    </div>
                  </Button>
                </div>
              )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 relative z-10 space-y-3">
              {/* Notification Card */}
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <Bell className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-white text-sm font-semibold">Уведомления</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed mb-3">
                  Получайте уведомления о новых возможностях заработка
                </p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl h-9"
                >
                  Включить
                </Button>
              </div>

              {/* Logout Button */}
              <div>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="ghost"
                  className="w-full justify-start h-12 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  {isLoggingOut ? "Выход..." : "Выйти"}
                </Button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
