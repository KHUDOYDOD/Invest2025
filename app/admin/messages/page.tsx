"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Send, Reply, Archive, Trash2, Star } from "lucide-react"

export default function MessagesPage() {
  const [messages] = useState([
    {
      id: 1,
      from: "user@example.com",
      subject: "Вопрос по выводу средств",
      content: "Здравствуйте, у меня возникла проблема с выводом средств...",
      date: "2025-01-15 14:30",
      status: "new",
      priority: "high",
    },
    {
      id: 2,
      from: "investor@gmail.com",
      subject: "Информация о новых планах",
      content: "Когда планируется запуск новых инвестиционных планов?",
      date: "2025-01-15 12:15",
      status: "replied",
      priority: "medium",
    },
    {
      id: 3,
      from: "support@test.com",
      subject: "Техническая поддержка",
      content: "Не могу войти в личный кабинет, помогите пожалуйста...",
      date: "2025-01-14 16:45",
      status: "pending",
      priority: "low",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800"
      case "replied":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Сообщения и поддержка</h1>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Новое сообщение
        </Button>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="inbox">Входящие</TabsTrigger>
          <TabsTrigger value="sent">Отправленные</TabsTrigger>
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Входящие сообщения</CardTitle>
              <CardDescription>Сообщения от пользователей и партнеров</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input placeholder="Поиск сообщений..." className="pl-10" />
                </div>
                <Button variant="outline">Фильтр</Button>
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{message.subject}</h3>
                            <Badge className={getStatusColor(message.status)}>
                              {message.status === "new"
                                ? "Новое"
                                : message.status === "replied"
                                  ? "Отвечено"
                                  : "В ожидании"}
                            </Badge>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority === "high"
                                ? "Высокий"
                                : message.priority === "medium"
                                  ? "Средний"
                                  : "Низкий"}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">От: {message.from}</p>
                          <p className="text-sm text-slate-700 mb-2">{message.content}</p>
                          <p className="text-xs text-slate-400">{message.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Отправленные сообщения</CardTitle>
              <CardDescription>История отправленных сообщений</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">Отправленных сообщений пока нет</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Шаблоны сообщений</CardTitle>
              <CardDescription>Готовые шаблоны для быстрых ответов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Приветствие новых пользователей</label>
                <Textarea placeholder="Добро пожаловать на нашу платформу..." rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Подтверждение депозита</label>
                <Textarea placeholder="Ваш депозит успешно зачислен..." rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Уведомление о выводе</label>
                <Textarea placeholder="Ваш запрос на вывод средств обрабатывается..." rows={3} />
              </div>
              <Button>Сохранить шаблоны</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Управление автоматическими уведомлениями</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Уведомления о новых сообщениях</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Email уведомления</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">SMS уведомления</label>
                <input type="checkbox" />
              </div>
              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
