"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Zap,
  Shield,
  Globe,
  Database,
  Clock,
  Bell,
  BarChart3,
  PieChart,
  LineChart,
  Sparkles,
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    totalRevenue: 45230,
    monthlyGrowth: 12.5,
    systemLoad: 45,
    uptime: 99.9,
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "Новый пользователь зарегистрирован", user: "user@example.com", time: "2 мин назад" },
    { id: 2, action: "Депозит обработан", amount: "$500", time: "5 мин назад" },
    { id: 3, action: "Вывод средств одобрен", amount: "$1,200", time: "10 мин назад" },
    { id: 4, action: "Новая инвестиция создана", plan: "Premium Plan", time: "15 мин назад" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        systemLoad: Math.max(20, Math.min(80, prev.systemLoad + (Math.random() - 0.5) * 10)),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3 - 1),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const quickActions = [
    { name: "Добавить пользователя", icon: <Users className="w-4 h-4" />, color: "blue" },
    { name: "Создать план", icon: <TrendingUp className="w-4 h-4" />, color: "green" },
    { name: "Отправить уведомление", icon: <Bell className="w-4 h-4" />, color: "purple" },
    { name: "Генерировать отчет", icon: <BarChart3 className="w-4 h-4" />, color: "orange" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Добро пожаловать в админ панель! 🚀</h1>
              <p className="text-blue-100 text-lg">Управляйте своей платформой с помощью современных инструментов</p>
            </div>
            <div className="hidden md:block">
              <Sparkles className="w-16 h-16 text-white/50 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Всего пользователей</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Активные пользователи</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeUsers.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Общий доход</p>
                <p className="text-3xl font-bold text-purple-900">${stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+15.3%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Рост за месяц</p>
                <p className="text-3xl font-bold text-orange-900">{stats.monthlyGrowth}%</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Статус системы</span>
              <Badge className="bg-green-100 text-green-700">Стабильно</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Загрузка CPU</span>
                <span className="text-sm text-gray-600">{stats.systemLoad}%</span>
              </div>
              <Progress value={stats.systemLoad} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Время работы</span>
                <span className="text-sm text-gray-600">{stats.uptime}%</span>
              </div>
              <Progress value={stats.uptime} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-sm">БД: Активна</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="text-sm">API: Работает</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              <span>Быстрые действия</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-${action.color}-100 text-${action.color}-600`}>{action.icon}</div>
                  <span className="text-xs text-center">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Последняя активность</span>
            </CardTitle>
            <CardDescription>Недавние действия в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <Badge variant="outline" className="text-green-600">
                      {activity.amount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span>Аналитика</span>
            </CardTitle>
            <CardDescription>Ключевые метрики за сегодня</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Новые регистрации</span>
                </div>
                <span className="text-lg font-bold text-blue-600">+24</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <LineChart className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Активные инвестиции</span>
                </div>
                <span className="text-lg font-bold text-green-600">156</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Конверсия</span>
                </div>
                <span className="text-lg font-bold text-purple-600">8.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
