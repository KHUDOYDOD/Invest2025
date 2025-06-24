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
  Calendar,
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
} from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Резервное копирование БД",
      type: "backup",
      schedule: "Ежедневно в 02:00",
      status: "running",
      lastRun: "2024-01-15 02:00",
      nextRun: "2024-01-16 02:00",
      duration: "15 мин",
    },
    {
      id: 2,
      name: "Очистка логов",
      type: "cleanup",
      schedule: "Еженедельно",
      status: "completed",
      lastRun: "2024-01-14 03:00",
      nextRun: "2024-01-21 03:00",
      duration: "5 мин",
    },
    {
      id: 3,
      name: "Отправка email отчетов",
      type: "email",
      schedule: "Ежемесячно",
      status: "pending",
      lastRun: "2024-01-01 09:00",
      nextRun: "2024-02-01 09:00",
      duration: "2 мин",
    },
    {
      id: 4,
      name: "Обновление статистики",
      type: "analytics",
      schedule: "Каждый час",
      status: "failed",
      lastRun: "2024-01-15 14:00",
      nextRun: "2024-01-15 15:00",
      duration: "1 мин",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "failed":
        return "bg-red-100 text-red-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление задачами</h1>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Calendar className="w-4 h-4 mr-1" />
          {tasks.filter((t) => t.status === "running").length} активных
        </Badge>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="create">Создать</TabsTrigger>
          <TabsTrigger value="queue">Очередь</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Запланированные задачи</span>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Новая задача
                </Button>
              </CardTitle>
              <CardDescription>Управление автоматическими задачами системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">{task.name}</h3>
                          <p className="text-sm text-gray-500">{task.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {task.type}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === "running"
                            ? "Выполняется"
                            : task.status === "completed"
                              ? "Завершено"
                              : task.status === "failed"
                                ? "Ошибка"
                                : "Ожидание"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Последний запуск:</span>
                        <div className="font-medium">{task.lastRun}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Следующий запуск:</span>
                        <div className="font-medium">{task.nextRun}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Длительность:</span>
                        <div className="font-medium">{task.duration}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="w-4 h-4" />
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

        <TabsContent value="create" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Создать новую задачу</span>
              </CardTitle>
              <CardDescription>Настройка параметров новой автоматической задачи</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taskName">Название задачи</Label>
                  <Input id="taskName" placeholder="Введите название задачи" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskType">Тип задачи</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип задачи" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backup">Резервное копирование</SelectItem>
                      <SelectItem value="cleanup">Очистка данных</SelectItem>
                      <SelectItem value="email">Email рассылка</SelectItem>
                      <SelectItem value="analytics">Обновление аналитики</SelectItem>
                      <SelectItem value="maintenance">Обслуживание</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schedule">Расписание</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите расписание" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Каждый час</SelectItem>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                      <SelectItem value="monthly">Ежемесячно</SelectItem>
                      <SelectItem value="custom">Настраиваемое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Время запуска</Label>
                  <Input id="time" type="time" defaultValue="02:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Приоритет</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите приоритет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="normal">Обычный</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                      <SelectItem value="critical">Критический</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать задачу
                </Button>
                <Button variant="outline">Тестовый запуск</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Очередь выполнения</span>
              </CardTitle>
              <CardDescription>Текущие и ожидающие задачи в очереди</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                      <div>
                        <h3 className="font-medium">Резервное копирование БД</h3>
                        <p className="text-sm text-gray-500">Выполняется • Прогресс: 65%</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h3 className="font-medium">Отправка email отчетов</h3>
                        <p className="text-sm text-gray-500">В очереди • Запуск через 2 часа</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium">Очистка временных файлов</h3>
                        <p className="text-sm text-gray-500">Запланировано • Завтра в 03:00</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
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
                <Settings className="w-5 h-5" />
                <span>Настройки планировщика</span>
              </CardTitle>
              <CardDescription>Глобальные настройки системы задач</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Автоматическое выполнение</Label>
                  <p className="text-sm text-gray-500">Включить автоматический запуск задач</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Уведомления об ошибках</Label>
                  <p className="text-sm text-gray-500">Отправлять email при сбоях задач</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxConcurrent">Максимум одновременных задач</Label>
                <Input id="maxConcurrent" type="number" defaultValue="5" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Количество повторных попыток</Label>
                <Input id="retryAttempts" type="number" defaultValue="3" />
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
