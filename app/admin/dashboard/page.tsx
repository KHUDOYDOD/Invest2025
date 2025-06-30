
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentTransactions } from "@/components/admin/recent-transactions"
import { NewUsersShowcase } from "@/components/new-users-showcase"
import { UserActivityRows } from "@/components/user-activity-rows"
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
  Eye,
  UserPlus,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
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
    { id: 1, action: "Новый пользователь зарегистрирован", user: "user@example.com", time: "2 мин назад", type: "user" },
    { id: 2, action: "Депозит обработан", amount: "$500", time: "5 мин назад", type: "deposit" },
    { id: 3, action: "Вывод средств одобрен", amount: "$1,200", time: "10 мин назад", type: "withdrawal" },
    { id: 4, action: "Новая инвестиция создана", plan: "Premium Plan", time: "15 мин назад", type: "investment" },
    { id: 5, action: "Система обновлена", details: "Безопасность", time: "1 час назад", type: "system" },
  ])

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: "warning", message: "Высокая нагрузка на сервер", time: "5 мин назад" },
    { id: 2, type: "info", message: "Резервное копирование завершено", time: "1 час назад" },
    { id: 3, type: "success", message: "Все системы работают нормально", time: "2 часа назад" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        systemLoad: Math.max(20, Math.min(80, prev.systemLoad + (Math.random() - 0.5) * 10)),
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return <UserPlus className="h-4 w-4 text-blue-500" />
      case "deposit": return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "withdrawal": return <CreditCard className="h-4 w-4 text-orange-500" />
      case "investment": return <TrendingUp className="h-4 w-4 text-purple-500" />
      case "system": return <Shield className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info": return <Bell className="h-4 w-4 text-blue-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Панель управления
          </h1>
          <p className="text-slate-400">
            Добро пожаловать в административную панель InvestPro
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Sparkles className="mr-2 h-4 w-4" />
            Обновить данные
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <AdminStats />

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Нагрузка системы</p>
                <p className="text-2xl font-bold text-white">{stats.systemLoad}%</p>
              </div>
              <div className="bg-orange-500/20 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <Progress value={stats.systemLoad} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Время работы</p>
                <p className="text-2xl font-bold text-white">{stats.uptime}%</p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-full">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-400">
              ✓ Все системы в норме
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Активные пользователи</p>
                <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-400">
              Онлайн сейчас
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Последние операции
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-400">
                      {activity.user || activity.amount || activity.plan || activity.details} • {activity.time}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {activity.type === "deposit" && "💰"}
                    {activity.type === "withdrawal" && "💸"}
                    {activity.type === "investment" && "📈"}
                    {activity.type === "user" && "👤"}
                    {activity.type === "system" && "⚙️"}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full text-slate-300 border-slate-600 hover:bg-slate-700/50"
                onClick={() => window.location.href = '/admin/transactions'}
              >
                <Eye className="mr-2 h-4 w-4" />
                Показать все операции
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New Users */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Новые участники
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <NewUsersShowcase limit={5} showButton={false} />
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full text-slate-300 border-slate-600 hover:bg-slate-700/50"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Eye className="mr-2 h-4 w-4" />
                Показать всех участников
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Системные уведомления
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm text-white">{alert.message}</p>
                  <p className="text-xs text-slate-400">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Последние транзакции
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTransactions />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          className="h-20 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 flex-col"
          onClick={() => window.location.href = '/admin/users'}
        >
          <Users className="h-6 w-6 mb-2" />
          Управление пользователями
        </Button>
        
        <Button 
          className="h-20 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex-col"
          onClick={() => window.location.href = '/admin/transactions'}
        >
          <CreditCard className="h-6 w-6 mb-2" />
          Транзакции
        </Button>
        
        <Button 
          className="h-20 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 flex-col"
          onClick={() => window.location.href = '/admin/investments'}
        >
          <TrendingUp className="h-6 w-6 mb-2" />
          Инвестиции
        </Button>
        
        <Button 
          className="h-20 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 flex-col"
          onClick={() => window.location.href = '/admin/settings'}
        >
          <Shield className="h-6 w-6 mb-2" />
          Настройки системы
        </Button>
      </div>
    </div>
  )
}
