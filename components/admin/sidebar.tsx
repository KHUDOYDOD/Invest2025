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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    title: "Основное",
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
        label: "Управление запусками",
        href: "/admin/project-launches",
        icon: <Rocket className="h-4 w-4" />,
        badge: "New",
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
        label: "Мониторинг системы",
        href: "/admin/monitoring",
        icon: <Monitor className="h-4 w-4" />,
        badge: "New",
        color: "purple",
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
        label: "Аудит действий",
        href: "/admin/audit",
        icon: <Search className="h-4 w-4" />,
        badge: "Pro",
        color: "orange",
      },
    ],
  },
  {
    title: "Финансы",
    icon: <CreditCard className="h-5 w-5" />,
    color: "from-green-500 to-emerald-500",
    items: [
      {
        label: "Запросы пополнения/вывода",
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
        badge: "New",
        color: "blue",
      },
      {
        label: "Планы прибыли",
        href: "/admin/profit-plans",
        icon: <Percent className="h-4 w-4" />,
        badge: "New",
        color: "green",
      },
      {
        label: "Настройки платежей",
        href: "/admin/payment-settings",
        icon: <Settings className="h-4 w-4" />,
        badge: "Hot",
        color: "red",
      },
      {
        label: "Партнерская программа",
        href: "/admin/referrals",
        icon: <Users className="h-4 w-4" />,
        badge: "New",
        color: "purple",
      },
    ],
  },
  {
    title: "Контент и дизайн",
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
        label: "Виджеты",
        href: "/admin/widgets",
        icon: <Widgets className="h-4 w-4" />,
        badge: "New",
        color: "fuchsia",
      },
      {
        label: "Темы и дизайн",
        href: "/admin/themes",
        icon: <Palette className="h-4 w-4" />,
        color: "violet",
      },
      {
        label: "Контент",
        href: "/admin/content",
        icon: <FileText className="h-4 w-4" />,
        color: "purple",
      },
      {
        label: "Отзывы клиентов",
        href: "/admin/testimonials",
        icon: <MessageSquare className="h-4 w-4" />,
        color: "pink",
      },
      {
        label: "Новости",
        href: "/admin/news",
        icon: <FileText className="h-4 w-4" />,
        badge: "Hot",
        color: "rose",
      },
      {
        label: "Валютные курсы",
        href: "/admin/currency-rates",
        icon: <TrendingUp className="h-4 w-4" />,
        badge: "Live",
        color: "green",
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
        label: "Кэш системы",
        href: "/admin/cache",
        icon: <HardDrive className="h-4 w-4" />,
        badge: "Fast",
        color: "amber",
      },
      {
        label: "Логи системы",
        href: "/admin/logs",
        icon: <FileSearch className="h-4 w-4" />,
        color: "yellow",
      },
      {
        label: "Задачи и очереди",
        href: "/admin/tasks",
        icon: <Calendar className="h-4 w-4" />,
        badge: "Auto",
        color: "lime",
      },
    ],
  },
  {
    title: "Интеграции",
    icon: <Network className="h-5 w-5" />,
    color: "from-cyan-500 to-blue-500",
    items: [
      {
        label: "API управление",
        href: "/admin/api",
        icon: <Puzzle className="h-4 w-4" />,
        color: "cyan",
      },
      {
        label: "Плагины",
        href: "/admin/plugins",
        icon: <Layers className="h-4 w-4" />,
        badge: "Ext",
        color: "sky",
      },
      {
        label: "Интеграции",
        href: "/admin/integrations",
        icon: <Network className="h-4 w-4" />,
        color: "blue",
      },
      {
        label: "Файлы и медиа",
        href: "/admin/media",
        icon: <Cloud className="h-4 w-4" />,
        color: "indigo",
      },
    ],
  },
  {
    title: "Коммуникации",
    icon: <Mail className="h-5 w-5" />,
    color: "from-teal-500 to-green-500",
    items: [
      {
        label: "Email рассылки",
        href: "/admin/emails",
        icon: <Mail className="h-4 w-4" />,
        color: "teal",
      },
      {
        label: "Сообщения",
        href: "/admin/messages",
        icon: <MessageSquare className="h-4 w-4" />,
        color: "emerald",
      },
      {
        label: "Уведомления",
        href: "/admin/notifications",
        icon: <Bell className="h-4 w-4" />,
        color: "green",
      },
      {
        label: "Система уведомлений",
        href: "/admin/notification-system",
        icon: <Bell className="h-4 w-4" />,
        badge: "Smart",
        color: "lime",
      },
    ],
  },
  {
    title: "Отчеты и настройки",
    icon: <Settings className="h-5 w-5" />,
    color: "from-slate-500 to-gray-500",
    items: [
      {
        label: "Статистика",
        href: "/admin/statistics",
        icon: <BarChart3 className="h-4 w-4" />,
        color: "slate",
      },
      {
        label: "Система отчетов",
        href: "/admin/reports",
        icon: <FileText className="h-4 w-4" />,
        badge: "PDF",
        color: "gray",
      },
      {
        label: "Производительность",
        href: "/admin/performance",
        icon: <Zap className="h-4 w-4" />,
        color: "zinc",
      },
      {
        label: "SEO",
        href: "/admin/seo",
        icon: <Globe className="h-4 w-4" />,
        color: "neutral",
      },
      {
        label: "Настройки",
        href: "/admin/settings",
        icon: <Settings className="h-4 w-4" />,
        color: "stone",
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Основное"])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

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
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-r border-white/10 transition-all duration-500 ease-in-out z-50 ${
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-80"
        }`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.05%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white">Admin Pro</h2>
                    <p className="text-blue-200 text-sm">Панель управления</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white hover:bg-white/10 lg:hidden"
              >
                {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
            </div>

            {/* Search */}
            {!isCollapsed && (
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск функций..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {filteredCategories.map((category) => (
              <div key={category.title} className="mb-4">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                        {category.icon}
                      </div>
                      <span className="font-medium text-white group-hover:text-blue-200 transition-colors">
                        {category.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                        expandedCategories.includes(category.title) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {/* Category Items */}
                <div
                  className={`mt-2 space-y-1 transition-all duration-500 ease-in-out ${
                    expandedCategories.includes(category.title) || isCollapsed
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                        isCollapsed ? "mx-0" : "ml-4"
                      } ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg"
                          : "hover:bg-white/10 border border-transparent hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            isActive(item.href)
                              ? "bg-white/20 shadow-lg"
                              : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-md"
                          }`}
                        >
                          <div
                            className={`transition-colors duration-300 ${
                              isActive(item.href) ? "text-white" : "text-gray-300 group-hover:text-white"
                            }`}
                          >
                            {item.icon}
                          </div>
                        </div>
                        {!isCollapsed && (
                          <span
                            className={`font-medium transition-colors duration-300 ${
                              isActive(item.href) ? "text-white" : "text-gray-300 group-hover:text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <Badge
                          variant={
                            item.badge === "Hot" || item.badge === "Live"
                              ? "destructive"
                              : item.badge === "New" || item.badge === "Pro"
                                ? "default"
                                : "secondary"
                          }
                          className={`text-xs px-2 py-0.5 animate-pulse ${
                            isActive(item.href) ? "bg-white/20 text-white border-white/30" : ""
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {/* Active indicator */}
                      {isActive(item.href) && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full shadow-lg" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-white/10">
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Система активна</p>
                    <p className="text-xs text-green-200">Все сервисы работают</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle for desktop */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-800 hover:bg-slate-700 border border-white/20 rounded-full text-white shadow-lg z-10"
        >
          <ChevronRight className={`h-3 w-3 transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"}`} />
        </Button>
      </aside>
    </>
  )
}
