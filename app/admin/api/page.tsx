"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Puzzle, Key, Activity, Settings, Copy, RefreshCw, Plus, Trash2, Eye, EyeOff } from "lucide-react"

export default function ApiPage() {
  const [apiEnabled, setApiEnabled] = useState(true)
  const [rateLimit, setRateLimit] = useState(1000)
  const [showApiKey, setShowApiKey] = useState(false)

  const apiKeys = [
    { id: 1, name: "Mobile App", key: "sk_live_123...abc", status: "active", requests: 15420 },
    { id: 2, name: "Web Dashboard", key: "sk_live_456...def", status: "active", requests: 8930 },
    { id: 3, name: "Analytics", key: "sk_test_789...ghi", status: "inactive", requests: 0 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">API управление</h1>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Puzzle className="w-4 h-4 mr-1" />
          API v2.0
        </Badge>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="keys">API ключи</TabsTrigger>
          <TabsTrigger value="endpoints">Эндпоинты</TabsTrigger>
          <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API ключи</span>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать ключ
                </Button>
              </CardTitle>
              <CardDescription>Управление API ключами для доступа к системе</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{key.name}</h3>
                        <Badge variant={key.status === "active" ? "default" : "secondary"}>
                          {key.status === "active" ? "Активен" : "Неактивен"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {showApiKey ? key.key : key.key.replace(/./g, "*")}
                        </code>
                        <Button size="sm" variant="ghost" onClick={() => setShowApiKey(!showApiKey)}>
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Запросов: {key.requests.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>API эндпоинты</span>
              </CardTitle>
              <CardDescription>Управление доступными API эндпоинтами</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">GET /api/users</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Активен
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Получение списка пользователей</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">POST /api/investments</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Активен
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Создание новой инвестиции</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">GET /api/statistics</h3>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        Отключен
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Получение статистики платформы</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">PUT /api/settings</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Активен
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Обновление настроек системы</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Мониторинг API</span>
              </CardTitle>
              <CardDescription>Статистика использования API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Запросов сегодня</p>
                  <p className="text-2xl font-bold text-blue-600">24,350</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Успешных</p>
                  <p className="text-2xl font-bold text-green-600">23,891</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Ошибок</p>
                  <p className="text-2xl font-bold text-red-600">459</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Среднее время</p>
                  <p className="text-2xl font-bold text-purple-600">120ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Настройки API</span>
              </CardTitle>
              <CardDescription>Общие настройки API системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Включить API</Label>
                  <p className="text-sm text-gray-500">Глобальное включение/отключение API</p>
                </div>
                <Switch checked={apiEnabled} onCheckedChange={setApiEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimit">Лимит запросов в час</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                />
              </div>

              <Button className="w-full md:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Сохранить настройки API
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
