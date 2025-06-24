"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  Database,
} from "lucide-react"

export default function MonitoringPage() {
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 78,
    uptime: "15 дней 8 часов",
    status: "healthy",
  })

  const [services, setServices] = useState([
    { name: "Web Server", status: "running", uptime: "99.9%", responseTime: "120ms" },
    { name: "Database", status: "running", uptime: "99.8%", responseTime: "45ms" },
    { name: "API Gateway", status: "running", uptime: "99.7%", responseTime: "89ms" },
    { name: "Cache Server", status: "warning", uptime: "98.5%", responseTime: "200ms" },
    { name: "Email Service", status: "running", uptime: "99.9%", responseTime: "156ms" },
    { name: "File Storage", status: "running", uptime: "99.6%", responseTime: "78ms" },
  ])

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      message: "Высокое использование памяти на сервере DB-01",
      time: "5 минут назад",
      severity: "medium",
    },
    {
      id: 2,
      type: "info",
      message: "Плановое обновление системы завершено",
      time: "2 часа назад",
      severity: "low",
    },
    {
      id: 3,
      type: "error",
      message: "Временная недоступность Cache Server",
      time: "3 часа назад",
      severity: "high",
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        ...prev,
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "error":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Мониторинг системы</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Monitor className="w-4 h-4 mr-1" />
          Система стабильна
        </Badge>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-6 h-6 text-blue-500" />
                <span className="font-medium">CPU</span>
              </div>
              <span className="text-2xl font-bold">{systemStats.cpu}%</span>
            </div>
            <Progress value={systemStats.cpu} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">
              {systemStats.cpu < 70 ? "Нормальная нагрузка" : "Высокая нагрузка"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-6 h-6 text-green-500" />
                <span className="font-medium">Память</span>
              </div>
              <span className="text-2xl font-bold">{systemStats.memory}%</span>
            </div>
            <Progress value={systemStats.memory} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">8.2 GB / 12 GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database className="w-6 h-6 text-purple-500" />
                <span className="font-medium">Диск</span>
              </div>
              <span className="text-2xl font-bold">{systemStats.disk}%</span>
            </div>
            <Progress value={systemStats.disk} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">320 GB / 1 TB</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wifi className="w-6 h-6 text-orange-500" />
                <span className="font-medium">Сеть</span>
              </div>
              <span className="text-2xl font-bold">{systemStats.network}%</span>
            </div>
            <Progress value={systemStats.network} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">780 Mbps / 1 Gbps</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="services">Сервисы</TabsTrigger>
          <TabsTrigger value="performance">Производительность</TabsTrigger>
          <TabsTrigger value="alerts">Уведомления</TabsTrigger>
          <TabsTrigger value="logs">Логи</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>Статус сервисов</span>
              </CardTitle>
              <CardDescription>Мониторинг всех системных сервисов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{service.name}</h3>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status === "running" ? "Работает" : "Предупреждение"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Время работы:</span>
                        <span className="font-medium">{service.uptime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Время отклика:</span>
                        <span className="font-medium">{service.responseTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Метрики производительности</span>
              </CardTitle>
              <CardDescription>Графики и статистика производительности системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Загрузка CPU за 24 часа</h3>
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-end justify-center">
                    <span className="text-blue-600 font-medium">График CPU</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Использование памяти</h3>
                  <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-end justify-center">
                    <span className="text-green-600 font-medium">График памяти</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Сетевой трафик</h3>
                  <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-end justify-center">
                    <span className="text-purple-600 font-medium">График сети</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Дисковые операции</h3>
                  <div className="h-32 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg flex items-end justify-center">
                    <span className="text-orange-600 font-medium">График диска</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Системные уведомления</span>
              </CardTitle>
              <CardDescription>Последние предупреждения и уведомления системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.severity === "high" ? "Высокий" : alert.severity === "medium" ? "Средний" : "Низкий"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Системные логи</span>
              </CardTitle>
              <CardDescription>Журнал событий и активности системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">2024-01-15 14:30:25</span>
                  <span className="text-green-600">[INFO]</span>
                  <span>Система успешно запущена</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">2024-01-15 14:28:12</span>
                  <span className="text-yellow-600">[WARN]</span>
                  <span>Высокое использование памяти: 85%</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">2024-01-15 14:25:45</span>
                  <span className="text-blue-600">[DEBUG]</span>
                  <span>Подключение к базе данных установлено</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">2024-01-15 14:20:33</span>
                  <span className="text-red-600">[ERROR]</span>
                  <span>Ошибка подключения к внешнему API</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
