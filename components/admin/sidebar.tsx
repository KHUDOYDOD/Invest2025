"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  LineChart,
  CreditCard,
  Settings,
  MessageSquare,
  FileText,
  BarChart3,
  Bell,
  Globe,
  Layout,
  Shield,
  Database,
  Cloud,
  Mail,
  Puzzle,
  Palette,
  Zap,
  ChevronRight,
  ChevronDown,
  WorkflowIcon as Widgets,
  FileSearch,
  HardDrive,
  Monitor,
  Calendar,
  UserCheck,
  Search,
  Layers,
  TrendingUp,
  Menu,
  X,
  Sparkles,
  Cpu,
  Network,
  Rocket,
  Wallet,
  Percent,
  Activity,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
  color?: string
  children?: NavItem[]
}

type NavCategory = {
  title: string
  icon: React.ReactNode
  color: string
  items: NavItem[]
}

const navCategories: NavCategory[] = [
  {
    title: "Главная",
    icon: <LayoutDashboard className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-500",
    items: [
      {
        label: "Панель управления",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        color: "blue",
      },
      {
        label: "Запуски проектов",
        href: "/admin/project-launches",
        icon: <Rocket className="h-4 w-4" />,
        badge: "Новое",
        color: "purple",
      },
      {
        label: "Аналитика",
        href: "/admin/analytics",
        icon: <TrendingUp className="h-4 w-4" />,
        badge: "Live",
        color: "green",
      },
      {
        label: "Мониторинг",
        href: "/admin/monitoring",
        icon: <Activity className="h-4 w-4" />,
        badge: "Pro",
        color: "orange",
      },
    ],
  },
  {
    title: "Пользователи",
    icon: <Users className="h-5 w-5" />,
    color: "from-purple-500 to-pink-500",
    items: [
      {
        label: "Все пользователи",
        href: "/admin/users",
        icon: <Users className="h-4 w-4" />,
        color: "purple",
      },
      {
        label: "Роли и права",
        href: "/admin/roles",
        icon: <UserCheck className="h-4 w-4" />,
        color: "indigo",
      },
      {
        label: "Активность",
        href: "/admin/user-activity",
        icon: <Activity className="h-4 w-4" />,
        badge: "Новое",
        color: "blue",
      },
    ],
  },
  {
    title: "Финансы",
    icon: <CreditCard className="h-5 w-5" />,
    color: "from-green-500 to-emerald-500",
    items: [
      {
        label: "Запросы пополнения",
        href: "/admin/requests",
        icon: <CreditCard className="h-4 w-4" />,
        color: "green",
      },
      {
        label: "Инвестиции",
        href: "/admin/investments",
        icon: <LineChart className="h-4 w-4" />,
        color: "emerald",
      },
      {
        label: "Транзакции",
        href: "/admin/transactions",
        icon: <BarChart3 className="h-4 w-4" />,
        color: "teal",
      },
      {
        label: "Методы платежей",
        href: "/admin/payment-methods",
        icon: <Wallet className="h-4 w-4" />,
        badge: "Новое",
        color: "blue",
      },
      {
        label: "Планы прибыли",
        href: "/admin/profit-plans",
        icon: <Percent className="h-4 w-4" />,
        color: "green",
      },
    ],
  },
  {
    title: "Контент",
    icon: <Palette className="h-5 w-5" />,
    color: "from-pink-500 to-rose-500",
    items: [
      {
        label: "Управление сайтом",
        href: "/admin/site-management",
        icon: <Globe className="h-4 w-4" />,
        color: "pink",
      },
      {
        label: "Компоненты",
        href: "/admin/components-management",
        icon: <Layout className="h-4 w-4" />,
        badge: "10",
        color: "rose",
      },
      {
        label: "Контент",
        href: "/admin/content",
        icon: <FileText className="h-4 w-4" />,
        color: "purple",
      },
      {
        label: "Отзывы",
        href: "/admin/testimonials",
        icon: <MessageSquare className="h-4 w-4" />,
        color: "pink",
      },
    ],
  },
  {
    title: "Система",
    icon: <Cpu className="h-5 w-5" />,
    color: "from-orange-500 to-red-500",
    items: [
      {
        label: "Безопасность",
        href: "/admin/security",
        icon: <Shield className="h-4 w-4" />,
        color: "orange",
      },
      {
        label: "База данных",
        href: "/admin/database",
        icon: <Database className="h-4 w-4" />,
        color: "red",
      },
      {
        label: "Настройки",
        href: "/admin/settings",
        icon: <Settings className="h-4 w-4" />,
        color: "gray",
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Главная"])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => (prev.includes(title) ? prev.filter((cat) => cat !== title) : [...prev, title]))
  }

  const isActive = (href: string) => pathname === href

  const filteredCategories = navCategories.map((category) => ({
    ...category,
    items: category.items.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase())),
  }))

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen transition-all duration-500 ease-in-out z-50",
          "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950",
          "border-r border-white/10 shadow-2xl",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-80"
        )}
      >
        {/* Анимированный фон */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-pulse" />
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500/10 rounded-full blur-lg animate-pulse" />
        </div>

        <div className="relative h-full flex flex-col backdrop-blur-sm">
          {/* Хедер */}
          <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-7 w-7 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950 animate-bounce" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Admin Panel
                    </h2>
                    <p className="text-blue-300 text-sm font-medium">Современная панель</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white hover:bg-white/10 lg:hidden p-2 rounded-xl"
              >
                {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
            </div>

            {/* Поиск */}
            {!isCollapsed && (
              <div className="mt-4 relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Поиск функций..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md transition-all duration-300 hover:bg-white/15"
                />
              </div>
            )}
          </div>

          {/* Навигация */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {filteredCategories.map((category) => (
              <div key={category.title} className="mb-4">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group backdrop-blur-md hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-3 rounded-xl bg-gradient-to-r shadow-lg transition-all duration-300",
                        category.color,
                        "group-hover:scale-110"
                      )}>
                        {category.icon}
                      </div>
                      <span className="font-semibold text-white group-hover:text-blue-200 transition-colors text-lg">
                        {category.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-gray-400 transition-all duration-300",
                        expandedCategories.includes(category.title) ? "rotate-180 text-blue-400" : ""
                      )}
                    />
                  </button>
                )}

                {/* Элементы категории */}
                <div
                  className={cn(
                    "mt-3 space-y-2 transition-all duration-500 ease-in-out",
                    expandedCategories.includes(category.title) || isCollapsed
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  )}
                >
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300 border",
                        isCollapsed ? "mx-0" : "ml-6",
                        isActive(item.href)
                          ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 shadow-lg scale-105"
                          : "hover:bg-white/10 border-white/5 hover:border-white/20 hover:scale-[1.02]",
                        hoveredItem === item.href && !isActive(item.href) ? "shadow-md" : ""
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "p-2.5 rounded-xl transition-all duration-300",
                            isActive(item.href)
                              ? "bg-white/20 shadow-lg scale-110"
                              : "bg-white/5 group-hover:bg-white/15 group-hover:scale-110"
                          )}
                        >
                          <div
                            className={cn(
                              "transition-colors duration-300",
                              isActive(item.href) ? "text-white" : "text-gray-300 group-hover:text-white"
                            )}
                          >
                            {item.icon}
                          </div>
                        </div>
                        {!isCollapsed && (
                          <span
                            className={cn(
                              "font-medium transition-colors duration-300 text-base",
                              isActive(item.href) ? "text-white" : "text-gray-300 group-hover:text-white"
                            )}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <Badge
                          className={cn(
                            "text-xs px-2 py-1 font-medium transition-all duration-300",
                            item.badge === "Live" ? "bg-green-500 text-white animate-pulse" :
                            item.badge === "Новое" ? "bg-blue-500 text-white" :
                            item.badge === "Pro" ? "bg-purple-500 text-white" :
                            "bg-gray-500 text-white"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {/* Активный индикатор */}
                      {isActive(item.href) && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full shadow-lg animate-pulse" />
                      )}

                      {/* Эффект свечения при наведении */}
                      {hoveredItem === item.href && !isActive(item.href) && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Футер */}
          {!isCollapsed && (
            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-500/30 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Система активна</p>
                    <p className="text-xs text-green-200">Все сервисы работают отлично</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка сворачивания для десктопа */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-4 top-24 w-8 h-8 bg-slate-900 hover:bg-slate-800 border border-white/20 rounded-full text-white shadow-2xl z-10 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform duration-300",
            isCollapsed ? "" : "rotate-180"
          )} />
        </Button>
      </aside>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
      `}</style>
    </>
  )
}