"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  HardDrive,
  Activity,
  Archive,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function DatabasePage() {
  const [dbStatus, setDbStatus] = useState("healthy")

  const tables = [
    { name: "users", rows: 15420, size: "2.3 MB", status: "healthy" },
    { name: "investments", rows: 8930, size: "1.8 MB", status: "healthy" },
    { name: "transactions", rows: 45670, size: "8.9 MB", status: "healthy" },
    { name: "news", rows: 156, size: "0.5 MB", status: "healthy" },
    { name: "settings", rows: 89, size: "0.1 MB", status: "warning" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление базой данных</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Database className="w-4 h-4 mr-1" />
          Подключено
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="tables">Таблицы</TabsTrigger>
          <TabsTrigger value="backups">Резервные копии</TabsTrigger>
          <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Размер БД</p>
                    <p className="text-2xl font-bold">13.6 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Таблиц</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Активных соединений</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Archive className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Последний бэкап</p>
                    <p className="text-sm font-medium">2 часа назад</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Использование дискового пространства</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Данные</span>
                    <span>13.6 MB / 100 GB</span>
                  </div>
                  <Progress value={0.0136} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Индексы</span>
                    <span>2.1 MB / 100 GB</span>
                  </div>
                  <Progress value={0.0021} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Логи</span>
                    <span>0.8 MB / 100 GB</span>
                  </div>
                  <Progress value={0.0008} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Таблицы базы данных</span>
              </CardTitle>
              <CardDescription>Информация о таблицах и их состоянии</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tables.map((table) => (
                  <div key={table.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{table.name}</h3>
                        <p className="text-sm text-gray-500">
                          {table.rows.toLocaleString()} записей • {table.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={table.status === "healthy" ? "default" : "destructive"}>
                        {table.status === "healthy" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {table.status === "healthy" ? "Здорова" : "Требует внимания"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Анализ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Archive className="w-5 h-5" />
                  <span>Резервные копии</span>
                </div>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Создать бэкап
                </Button>
              </CardTitle>
              <CardDescription>Управление резервными копиями базы данных</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">backup_2024_01_15_14_30.sql</h3>
                    <p className="text-sm text-gray-500">15 января 2024, 14:30 • 12.8 MB</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">backup_2024_01_14_14_30.sql</h3>
                    <p className="text-sm text-gray-500">14 января 2024, 14:30 • 12.5 MB</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Обслуживание базы данных</span>
              </CardTitle>
              <CardDescription>Инструменты для оптимизации и обслуживания</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col">
                  <RefreshCw className="w-6 h-6 mb-2" />
                  Оптимизировать таблицы
                </Button>
                <Button className="h-20 flex-col" variant="outline">
                  <Database className="w-6 h-6 mb-2" />
                  Перестроить индексы
                </Button>
                <Button className="h-20 flex-col" variant="outline">
                  <Activity className="w-6 h-6 mb-2" />
                  Анализ производительности
                </Button>
                <Button className="h-20 flex-col" variant="outline">
                  <Archive className="w-6 h-6 mb-2" />
                  Очистка логов
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
