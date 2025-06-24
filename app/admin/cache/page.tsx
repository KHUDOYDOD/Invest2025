"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HardDrive,
  RefreshCw,
  Trash2,
  Zap,
  Database,
  Globe,
  ImageIcon,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function CachePage() {
  const [cacheStats, setCacheStats] = useState({
    totalSize: "2.4 GB",
    hitRate: 89.5,
    missRate: 10.5,
    requests: 145230,
  })

  const cacheTypes = [
    {
      name: "База данных",
      icon: <Database className="w-5 h-5" />,
      size: "1.2 GB",
      items: 15420,
      hitRate: 92,
      color: "blue",
    },
    {
      name: "Страницы",
      icon: <Globe className="w-5 h-5" />,
      size: "680 MB",
      items: 2340,
      hitRate: 85,
      color: "green",
    },
    {
      name: "Изображения",
      icon: <ImageIcon className="w-5 h-5" />,
      size: "420 MB",
      items: 8920,
      hitRate: 95,
      color: "purple",
    },
    {
      name: "API ответы",
      icon: <FileText className="w-5 h-5" />,
      size: "120 MB",
      items: 5670,
      hitRate: 78,
      color: "orange",
    },
  ]

  const recentActivity = [
    { action: "Очистка кэша изображений", time: "2 минуты назад", status: "success" },
    { action: "Обновление кэша страниц", time: "15 минут назад", status: "success" },
    { action: "Автоочистка устаревших данных", time: "1 час назад", status: "success" },
    { action: "Ошибка кэширования API", time: "2 часа назад", status: "error" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление кэшем</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Zap className="w-4 h-4 mr-1" />
          Оптимизировано
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Общий размер</p>
                <p className="text-2xl font-bold">{cacheStats.totalSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Попадания</p>
                <p className="text-2xl font-bold">{cacheStats.hitRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Запросов</p>
                <p className="text-2xl font-bold">{cacheStats.requests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Ускорение</p>
                <p className="text-2xl font-bold">3.2x</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="management">Управление</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
          <TabsTrigger value="activity">Активность</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5" />
                <span>Статистика кэша по типам</span>
              </CardTitle>
              <CardDescription>Детальная информация о различных типах кэша</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cacheTypes.map((cache) => (
                  <div key={cache.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${cache.color}-100 text-${cache.color}-600`}>
                          {cache.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{cache.name}</h3>
                          <p className="text-sm text-gray-500">
                            {cache.size} • {cache.items.toLocaleString()} элементов
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`bg-${cache.color}-50 text-${cache.color}-700`}>
                        {cache.hitRate}% попаданий
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Эффективность кэша</span>
                        <span>{cache.hitRate}%</span>
                      </div>
                      <Progress value={cache.hitRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Управление кэшем</span>
              </CardTitle>
              <CardDescription>Инструменты для очистки и оптимизации кэша</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Быстрые действия</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start h-12" variant="outline">
                      <RefreshCw className="w-5 h-5 mr-3" />
                      Обновить весь кэш
                    </Button>
                    <Button className="w-full justify-start h-12" variant="outline">
                      <Trash2 className="w-5 h-5 mr-3" />
                      Очистить устаревший кэш
                    </Button>
                    <Button className="w-full justify-start h-12" variant="outline">
                      <Zap className="w-5 h-5 mr-3" />
                      Оптимизировать кэш
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Селективная очистка</h3>
                  <div className="space-y-3">
                    {cacheTypes.map((cache) => (
                      <div key={cache.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-${cache.color}-100 text-${cache.color}-600`}>
                            {cache.icon}
                          </div>
                          <span className="font-medium">{cache.name}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Настройки кэширования</span>
              </CardTitle>
              <CardDescription>Конфигурация параметров кэша</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Время жизни кэша</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Страницы</span>
                      <span className="text-sm font-medium">24 часа</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API ответы</span>
                      <span className="text-sm font-medium">1 час</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Изображения</span>
                      <span className="text-sm font-medium">7 дней</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">База данных</span>
                      <span className="text-sm font-medium">30 минут</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Лимиты размера</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Максимальный размер</span>
                      <span className="text-sm font-medium">5 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Предупреждение при</span>
                      <span className="text-sm font-medium">4 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Автоочистка при</span>
                      <span className="text-sm font-medium">4.5 GB</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Zap className="w-4 h-4 mr-2" />
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Последняя активность</span>
              </CardTitle>
              <CardDescription>История операций с кэшем</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {activity.status === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant={activity.status === "success" ? "default" : "destructive"}>
                      {activity.status === "success" ? "Успешно" : "Ошибка"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
