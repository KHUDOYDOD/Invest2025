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
import {
  WorkflowIcon as Widgets,
  Plus,
  Edit,
  Trash2,
  Move,
  Copy,
  Settings,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react"

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState([
    {
      id: 1,
      name: "Статистика пользователей",
      type: "chart",
      position: "top-left",
      size: "medium",
      enabled: true,
      data: { users: 1250, growth: "+12%" },
    },
    {
      id: 2,
      name: "Доходы за месяц",
      type: "metric",
      position: "top-right",
      size: "large",
      enabled: true,
      data: { revenue: "$45,230", growth: "+8%" },
    },
    {
      id: 3,
      name: "Активность сегодня",
      type: "activity",
      position: "bottom-left",
      size: "small",
      enabled: false,
      data: { activities: 89 },
    },
    {
      id: 4,
      name: "Последние сообщения",
      type: "messages",
      position: "bottom-right",
      size: "medium",
      enabled: true,
      data: { messages: 23 },
    },
  ])

  const widgetTypes = [
    { value: "chart", label: "График", icon: <BarChart3 className="w-4 h-4" /> },
    { value: "metric", label: "Метрика", icon: <TrendingUp className="w-4 h-4" /> },
    { value: "activity", label: "Активность", icon: <Activity className="w-4 h-4" /> },
    { value: "users", label: "Пользователи", icon: <Users className="w-4 h-4" /> },
    { value: "revenue", label: "Доходы", icon: <DollarSign className="w-4 h-4" /> },
    { value: "messages", label: "Сообщения", icon: <MessageSquare className="w-4 h-4" /> },
    { value: "calendar", label: "Календарь", icon: <Calendar className="w-4 h-4" /> },
    { value: "clock", label: "Часы", icon: <Clock className="w-4 h-4" /> },
  ]

  const getWidgetIcon = (type: string) => {
    const widget = widgetTypes.find((w) => w.value === type)
    return widget?.icon || <Widgets className="w-4 h-4" />
  }

  const toggleWidget = (id: number) => {
    setWidgets(widgets.map((widget) => (widget.id === id ? { ...widget, enabled: !widget.enabled } : widget)))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление виджетами</h1>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Widgets className="w-4 h-4 mr-1" />
          {widgets.filter((w) => w.enabled).length} активных
        </Badge>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
          <TabsTrigger value="create">Создать виджет</TabsTrigger>
          <TabsTrigger value="library">Библиотека</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Widgets className="w-5 h-5" />
                  <span>Активные виджеты</span>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить виджет
                </Button>
              </CardTitle>
              <CardDescription>Управление виджетами на главной странице админ панели</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                      widget.enabled
                        ? "border-green-200 bg-green-50 shadow-lg"
                        : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            widget.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {getWidgetIcon(widget.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{widget.name}</h3>
                          <p className="text-sm text-gray-500">
                            {widget.position} • {widget.size}
                          </p>
                        </div>
                      </div>
                      <Switch checked={widget.enabled} onCheckedChange={() => toggleWidget(widget.id)} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {widget.type}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {widget.size}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost">
                          <Move className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Widget Preview */}
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {widget.type === "chart" && widget.data.users}
                          {widget.type === "metric" && widget.data.revenue}
                          {widget.type === "activity" && widget.data.activities}
                          {widget.type === "messages" && widget.data.messages}
                        </div>
                        <div className="text-sm text-gray-500">Предварительный просмотр</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Создать новый виджет</span>
              </CardTitle>
              <CardDescription>Настройте параметры нового виджета</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="widgetName">Название виджета</Label>
                  <Input id="widgetName" placeholder="Введите название виджета" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="widgetType">Тип виджета</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип виджета" />
                    </SelectTrigger>
                    <SelectContent>
                      {widgetTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            {type.icon}
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="widgetSize">Размер</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите размер" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Маленький</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="large">Большой</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="widgetPosition">Позиция</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите позицию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Верх слева</SelectItem>
                      <SelectItem value="top-right">Верх справа</SelectItem>
                      <SelectItem value="bottom-left">Низ слева</SelectItem>
                      <SelectItem value="bottom-right">Низ справа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="widgetColor">Цветовая схема</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите цвет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Синий</SelectItem>
                      <SelectItem value="green">Зеленый</SelectItem>
                      <SelectItem value="purple">Фиолетовый</SelectItem>
                      <SelectItem value="orange">Оранжевый</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать виджет
                </Button>
                <Button variant="outline">Предварительный просмотр</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Widgets className="w-5 h-5" />
                <span>Библиотека виджетов</span>
              </CardTitle>
              <CardDescription>Готовые шаблоны виджетов для быстрого добавления</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {widgetTypes.map((type) => (
                  <div key={type.value} className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">{type.icon}</div>
                      <div>
                        <h3 className="font-medium">{type.label}</h3>
                        <p className="text-sm text-gray-500">Готовый шаблон</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Настройки виджетов</span>
              </CardTitle>
              <CardDescription>Глобальные настройки системы виджетов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Автоматическое обновление</Label>
                  <p className="text-sm text-gray-500">Обновлять данные виджетов в реальном времени</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Анимации</Label>
                  <p className="text-sm text-gray-500">Включить анимации для виджетов</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="updateInterval">Интервал обновления (секунды)</Label>
                <Input id="updateInterval" type="number" defaultValue="30" />
              </div>

              <Button className="w-full md:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
