"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Plus, Edit, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  const [notifications] = useState([
    {
      id: 1,
      title: "Новый инвестиционный план",
      message: "Запущен новый план с доходностью 15% в месяц",
      type: "announcement",
      status: "sent",
      date: "2025-01-15",
      recipients: 1250,
    },
    {
      id: 2,
      title: "Техническое обслуживание",
      message: "Плановые работы на сервере с 02:00 до 04:00",
      type: "maintenance",
      status: "scheduled",
      date: "2025-01-16",
      recipients: 0,
    },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "promotion":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Уведомления</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Создать уведомление
        </Button>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="send">Отправить</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Создать уведомление</CardTitle>
              <CardDescription>Отправка уведомлений пользователям</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Заголовок</label>
                  <Input placeholder="Введите заголовок уведомления" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Тип уведомления</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Объявление</SelectItem>
                      <SelectItem value="maintenance">Техобслуживание</SelectItem>
                      <SelectItem value="promotion">Акция</SelectItem>
                      <SelectItem value="warning">Предупреждение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Сообщение</label>
                <Textarea placeholder="Введите текст уведомления" rows={4} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Получатели</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите получателей" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все пользователи</SelectItem>
                      <SelectItem value="active">Активные инвесторы</SelectItem>
                      <SelectItem value="new">Новые пользователи</SelectItem>
                      <SelectItem value="vip">VIP клиенты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Способ доставки</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите способ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push уведомления</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="all">Все способы</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Время отправки</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Сейчас</SelectItem>
                      <SelectItem value="schedule">Запланировать</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Отправить
                </Button>
                <Button variant="outline">Сохранить как черновик</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>История уведомлений</CardTitle>
              <CardDescription>Отправленные и запланированные уведомления</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge className={getTypeColor(notification.type)}>
                              {notification.type === "announcement"
                                ? "Объявление"
                                : notification.type === "maintenance"
                                  ? "Техобслуживание"
                                  : notification.type === "promotion"
                                    ? "Акция"
                                    : "Предупреждение"}
                            </Badge>
                            <Badge className={getStatusColor(notification.status)}>
                              {notification.status === "sent"
                                ? "Отправлено"
                                : notification.status === "scheduled"
                                  ? "Запланировано"
                                  : "Черновик"}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <span>Дата: {notification.date}</span>
                            <span>Получателей: {notification.recipients}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Шаблоны уведомлений</CardTitle>
              <CardDescription>Готовые шаблоны для быстрой отправки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Добро пожаловать</label>
                <Textarea
                  placeholder="Добро пожаловать на нашу платформу! Начните инвестировать уже сегодня."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Подтверждение депозита</label>
                <Textarea placeholder="Ваш депозит успешно зачислен на счет. Спасибо за доверие!" rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Начисление прибыли</label>
                <Textarea placeholder="На ваш счет начислена прибыль. Проверьте баланс в личном кабинете." rows={2} />
              </div>
              <Button>Сохранить шаблоны</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Общие настройки системы уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Push уведомления</label>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Максимум уведомлений в день</label>
                <Input type="number" defaultValue="5" />
              </div>
              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
