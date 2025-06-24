"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Settings, BarChart3, Plus, Edit, Trash2, Eye } from "lucide-react"

export default function EmailsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com")
  const [smtpPort, setSmtpPort] = useState("587")

  const emailTemplates = [
    { id: 1, name: "Добро пожаловать", subject: "Добро пожаловать в InvestPro!", status: "active", sent: 1250 },
    { id: 2, name: "Подтверждение депозита", subject: "Ваш депозит подтвержден", status: "active", sent: 890 },
    { id: 3, name: "Уведомление о прибыли", subject: "Начислена прибыль", status: "active", sent: 2340 },
    { id: 4, name: "Запрос на вывод", subject: "Запрос на вывод средств", status: "draft", sent: 0 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Email рассылки</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Mail className="w-4 h-4 mr-1" />
          Активно
        </Badge>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          <TabsTrigger value="campaigns">Кампании</TabsTrigger>
          <TabsTrigger value="statistics">Статистика</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Email шаблоны</span>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать шаблон
                </Button>
              </CardTitle>
              <CardDescription>Управление шаблонами email сообщений</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant={template.status === "active" ? "default" : "secondary"}>
                          {template.status === "active" ? "Активен" : "Черновик"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{template.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">Отправлено: {template.sent.toLocaleString()} раз</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
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

        <TabsContent value="campaigns" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Email кампании</span>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Новая кампания
                </Button>
              </CardTitle>
              <CardDescription>Создание и управление email кампаниями</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Название кампании</Label>
                  <Input id="campaignName" placeholder="Введите название кампании" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailTemplate">Шаблон email</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите шаблон" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Добро пожаловать</SelectItem>
                      <SelectItem value="deposit">Подтверждение депозита</SelectItem>
                      <SelectItem value="profit">Уведомление о прибыли</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Получатели</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите группу получателей" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все пользователи</SelectItem>
                    <SelectItem value="active">Активные инвесторы</SelectItem>
                    <SelectItem value="new">Новые пользователи</SelectItem>
                    <SelectItem value="vip">VIP клиенты</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Отправить сейчас
                </Button>
                <Button variant="outline">Запланировать отправку</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Статистика email рассылок</span>
              </CardTitle>
              <CardDescription>Аналитика эффективности email кампаний</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Отправлено</p>
                  <p className="text-2xl font-bold text-blue-600">4,480</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Доставлено</p>
                  <p className="text-2xl font-bold text-green-600">4,356</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Открыто</p>
                  <p className="text-2xl font-bold text-purple-600">2,890</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">Переходы</p>
                  <p className="text-2xl font-bold text-orange-600">1,245</p>
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
                <span>Настройки email</span>
              </CardTitle>
              <CardDescription>Конфигурация SMTP и общие настройки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Включить email рассылки</Label>
                  <p className="text-sm text-gray-500">Глобальное включение/отключение email</p>
                </div>
                <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP хост</Label>
                  <Input id="smtpHost" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP порт</Label>
                  <Input id="smtpPort" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Сохранить настройки email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
