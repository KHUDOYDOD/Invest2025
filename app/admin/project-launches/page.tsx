"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Save,
  Calendar,
  Rocket,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Timer,
  TrendingUp,
  Smartphone,
  DollarSign,
  AlertCircle,
  Sparkles,
  Palette,
  Layers,
  Zap,
  Globe,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProjectLaunch {
  id: string
  name: string
  title: string
  description: string
  launch_date: string
  is_launched: boolean
  is_active: boolean
  show_on_site: boolean
  position: number
  color_scheme: string
  icon_type: string
  pre_launch_title: string
  post_launch_title: string
  pre_launch_description: string
  post_launch_description: string
  background_type: string
  custom_css?: string
  created_at: string
  updated_at: string
}

const colorSchemes = [
  { value: "blue", label: "Синий", class: "from-blue-500 to-cyan-500" },
  { value: "green", label: "Зеленый", class: "from-green-500 to-emerald-500" },
  { value: "purple", label: "Фиолетовый", class: "from-purple-500 to-pink-500" },
  { value: "orange", label: "Оранжевый", class: "from-orange-500 to-red-500" },
  { value: "teal", label: "Бирюзовый", class: "from-teal-500 to-cyan-500" },
  { value: "indigo", label: "Индиго", class: "from-indigo-500 to-purple-500" },
  { value: "red", label: "Красный", class: "from-red-500 to-pink-500" },
  { value: "yellow", label: "Желтый", class: "from-yellow-500 to-amber-500" },
]

const iconTypes = [
  { value: "rocket", label: "Ракета", icon: Rocket },
  { value: "timer", label: "Таймер", icon: Timer },
  { value: "calendar", label: "Календарь", icon: Calendar },
  { value: "trending-up", label: "Тренд", icon: TrendingUp },
  { value: "smartphone", label: "Смартфон", icon: Smartphone },
  { value: "dollar", label: "Деньги", icon: DollarSign },
  { value: "sparkles", label: "Искры", icon: Sparkles },
  { value: "palette", label: "Палитра", icon: Palette },
  { value: "layers", label: "Слои", icon: Layers },
  { value: "zap", label: "Молния", icon: Zap },
  { value: "globe", label: "Глобус", icon: Globe },
]

const backgroundTypes = [
  { value: "gradient", label: "Градиент" },
  { value: "solid", label: "Сплошной цвет" },
  { value: "image", label: "Изображение" },
  { value: "transparent", label: "Прозрачный" },
]

export default function ProjectLaunchesPage() {
  const [launches, setLaunches] = useState<ProjectLaunch[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingLaunch, setEditingLaunch] = useState<ProjectLaunch | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLaunches()
  }, [])

  const fetchLaunches = async () => {
    try {
      setError(null)
      const response = await fetch("/api/admin/project-launches")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setLaunches(Array.isArray(data) ? data : [])

      toast({
        title: "Успешно",
        description: "Счетчики запуска загружены",
        duration: 2000,
      })
    } catch (error) {
      console.error("Error fetching project launches:", error)
      setError("Не удалось загрузить счетчики запуска")
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить счетчики запуска",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveLaunch = async (launch: Partial<ProjectLaunch>) => {
    setSaving(true)
    setError(null)

    try {
      const method = launch.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/project-launches", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(launch),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const savedLaunch = await response.json()

      if (launch.id) {
        setLaunches((prev) => prev.map((c) => (c.id === launch.id ? savedLaunch : c)))
      } else {
        setLaunches((prev) => [...prev, savedLaunch])
      }

      setEditingLaunch(null)
      setShowCreateForm(false)

      toast({
        title: "Успешно",
        description: launch.id ? "Счетчик запуска обновлен" : "Счетчик запуска создан",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error saving project launch:", error)
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка"
      setError(errorMessage)
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteLaunch = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот счетчик запуска?")) return

    try {
      const response = await fetch(`/api/admin/project-launches/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setLaunches((prev) => prev.filter((c) => c.id !== id))
      toast({
        title: "Успешно",
        description: "Счетчик запуска удален",
      })
    } catch (error) {
      console.error("Error deleting project launch:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить счетчик запуска",
        variant: "destructive",
      })
    }
  }

  const toggleLaunchVisibility = async (id: string, show_on_site: boolean) => {
    try {
      const response = await fetch(`/api/admin/project-launches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show_on_site }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedLaunch = await response.json()
      setLaunches((prev) => prev.map((c) => (c.id === id ? updatedLaunch : c)))

      toast({
        title: "Успешно",
        description: show_on_site ? "Счетчик запуска показан на сайте" : "Счетчик запуска скрыт с сайта",
      })
    } catch (error) {
      console.error("Error toggling visibility:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось изменить видимость",
        variant: "destructive",
      })
    }
  }

  const launchNow = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/project-launches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_launched: true,
          launch_date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedLaunch = await response.json()
      setLaunches((prev) => prev.map((c) => (c.id === id ? updatedLaunch : c)))

      toast({
        title: "Проект запущен!",
        description: "Проект успешно запущен прямо сейчас",
      })
    } catch (error) {
      console.error("Error launching project:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось запустить проект",
        variant: "destructive",
      })
    }
  }

  const createDefaultLaunch = () => {
    const newLaunch: Partial<ProjectLaunch> = {
      name: "Новый запуск",
      title: "До запуска проекта",
      description: "Следите за обратным отсчетом до официального запуска",
      launch_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_launched: false,
      is_active: true,
      show_on_site: true,
      position: launches.length + 1,
      color_scheme: "blue",
      icon_type: "rocket",
      pre_launch_title: "До запуска проекта",
      post_launch_title: "Проект запущен!",
      pre_launch_description: "Следите за обратным отсчетом до официального запуска",
      post_launch_description: "Наша платформа успешно работает",
      background_type: "gradient",
      custom_css: "",
    }
    setEditingLaunch(newLaunch as ProjectLaunch)
    setShowCreateForm(true)
  }

  const getIconComponent = (iconType: string) => {
    const iconData = iconTypes.find((i) => i.value === iconType)
    return iconData ? iconData.icon : Rocket
  }

  const calculateTimeLeft = (launchDate: string) => {
    const now = new Date()
    const projectStartDate = new Date(launchDate)
    const difference = projectStartDate.getTime() - now.getTime()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка счетчиков запуска...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление запусками проектов</h1>
          <p className="text-muted-foreground">Создавайте и управляйте счетчиками обратного отсчета до запуска</p>
        </div>
        <Button onClick={createDefaultLaunch} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Создать счетчик запуска
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchLaunches} className="ml-auto">
                Повторить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Список счетчиков ({launches.length})</TabsTrigger>
          <TabsTrigger value="preview">Предварительный просмотр</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {launches.map((launch) => {
              const IconComponent = getIconComponent(launch.icon_type)
              const colorScheme = colorSchemes.find((c) => c.value === launch.color_scheme)
              const timeLeft = calculateTimeLeft(launch.launch_date)
              const isLaunched = launch.is_launched || new Date() >= new Date(launch.launch_date)

              return (
                <Card key={launch.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${colorScheme?.class} text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{launch.name}</CardTitle>
                          <CardDescription>{launch.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={launch.is_active ? "default" : "secondary"}>
                          {launch.is_active ? "Активен" : "Неактивен"}
                        </Badge>
                        <Badge variant={launch.show_on_site ? "default" : "outline"}>
                          {launch.show_on_site ? "Показан" : "Скрыт"}
                        </Badge>
                        <Badge variant={isLaunched ? "default" : "outline"}>
                          {isLaunched ? "Запущен" : "Ожидание"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Дата запуска:</p>
                        <p className="font-medium">{new Date(launch.launch_date).toLocaleString("ru-RU")}</p>

                        {!isLaunched && (
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-sm text-muted-foreground">Осталось:</p>
                            <div className="flex gap-1">
                              <Badge variant="outline">{timeLeft.days}д</Badge>
                              <Badge variant="outline">{timeLeft.hours}ч</Badge>
                              <Badge variant="outline">{timeLeft.minutes}м</Badge>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLaunchVisibility(launch.id, !launch.show_on_site)}
                        >
                          {launch.show_on_site ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingLaunch(launch)}>
                          Редактировать
                        </Button>
                        {!isLaunched && (
                          <Button variant="outline" size="sm" onClick={() => launchNow(launch.id)}>
                            <Rocket className="h-4 w-4 mr-1" /> Запустить
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => deleteLaunch(launch.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {launches.length === 0 && !error && (
              <Card className="text-center py-12">
                <CardContent>
                  <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Нет счетчиков запуска</h3>
                  <p className="text-muted-foreground mb-4">Создайте первый счетчик запуска для отображения на сайте</p>
                  <Button onClick={createDefaultLaunch}>
                    <Plus className="h-4 w-4 mr-2" />
                    Создать счетчик запуска
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Предварительный просмотр активных счетчиков запуска</CardTitle>
              <CardDescription>Как счетчики запуска выглядят на сайте</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {launches
                  .filter((l) => l.show_on_site && l.is_active)
                  .map((launch) => {
                    const IconComponent = getIconComponent(launch.icon_type)
                    const colorScheme = colorSchemes.find((c) => c.value === launch.color_scheme)
                    const timeLeft = calculateTimeLeft(launch.launch_date)
                    const isLaunched = launch.is_launched || new Date() >= new Date(launch.launch_date)

                    return (
                      <div
                        key={launch.id}
                        className={`p-6 rounded-lg border ${
                          launch.background_type === "gradient"
                            ? `bg-gradient-to-r ${colorScheme?.class.replace("from-", "from-").replace("to-", "to-")}/10`
                            : "bg-card"
                        }`}
                      >
                        <div className="text-center space-y-4">
                          <div
                            className={`inline-flex p-3 rounded-full bg-gradient-to-r ${colorScheme?.class} text-white`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {isLaunched ? launch.post_launch_title : launch.pre_launch_title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {isLaunched ? launch.post_launch_description : launch.pre_launch_description}
                            </p>
                          </div>

                          {!isLaunched && (
                            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                              <div className={`bg-gradient-to-br ${colorScheme?.class} rounded-lg p-3 text-white`}>
                                <div className="text-2xl font-bold">{timeLeft.days}</div>
                                <div className="text-xs">Дней</div>
                              </div>
                              <div className={`bg-gradient-to-br ${colorScheme?.class} rounded-lg p-3 text-white`}>
                                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                                <div className="text-xs">Часов</div>
                              </div>
                              <div className={`bg-gradient-to-br ${colorScheme?.class} rounded-lg p-3 text-white`}>
                                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                                <div className="text-xs">Минут</div>
                              </div>
                              <div className={`bg-gradient-to-br ${colorScheme?.class} rounded-lg p-3 text-white`}>
                                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                                <div className="text-xs">Секунд</div>
                              </div>
                            </div>
                          )}

                          {isLaunched && (
                            <div className="bg-green-100 text-green-800 p-3 rounded-lg inline-flex items-center gap-2">
                              <Rocket className="h-5 w-5 text-green-600" />
                              <span>Запущен {new Date(launch.launch_date).toLocaleDateString("ru-RU")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                {launches.filter((l) => l.show_on_site && l.is_active).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет активных счетчиков запуска для отображения
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Форма редактирования/создания */}
      {(editingLaunch || showCreateForm) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingLaunch?.id ? "Редактировать счетчик запуска" : "Создать счетчик запуска"}
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Название *</Label>
                  <Input
                    value={editingLaunch?.name || ""}
                    onChange={(e) => setEditingLaunch((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    placeholder="Внутреннее название счетчика"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Дата запуска *</Label>
                  <Input
                    type="datetime-local"
                    value={
                      editingLaunch?.launch_date ? new Date(editingLaunch.launch_date).toISOString().slice(0, 16) : ""
                    }
                    onChange={(e) =>
                      setEditingLaunch((prev) =>
                        prev ? { ...prev, launch_date: new Date(e.target.value).toISOString() } : null,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Заголовок *</Label>
                <Input
                  value={editingLaunch?.title || ""}
                  onChange={(e) => setEditingLaunch((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  placeholder="Заголовок для отображения на сайте"
                />
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={editingLaunch?.description || ""}
                  onChange={(e) => setEditingLaunch((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  placeholder="Описание счетчика"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Цветовая схема</Label>
                  <Select
                    value={editingLaunch?.color_scheme}
                    onValueChange={(value) =>
                      setEditingLaunch((prev) => (prev ? { ...prev, color_scheme: value } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map((scheme) => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${scheme.class}`} />
                            {scheme.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Иконка</Label>
                  <Select
                    value={editingLaunch?.icon_type}
                    onValueChange={(value) => setEditingLaunch((prev) => (prev ? { ...prev, icon_type: value } : null))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconTypes.map((icon) => {
                        const IconComponent = icon.icon
                        return (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingLaunch?.is_active}
                    onCheckedChange={(checked) =>
                      setEditingLaunch((prev) => (prev ? { ...prev, is_active: checked } : null))
                    }
                  />
                  <Label>Активен</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingLaunch?.show_on_site}
                    onCheckedChange={(checked) =>
                      setEditingLaunch((prev) => (prev ? { ...prev, show_on_site: checked } : null))
                    }
                  />
                  <Label>Показывать на сайте</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => editingLaunch && saveLaunch(editingLaunch)}
                  disabled={saving || !editingLaunch?.name || !editingLaunch?.title || !editingLaunch?.launch_date}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingLaunch(null)
                    setShowCreateForm(false)
                    setError(null)
                  }}
                  className="flex-1"
                  disabled={saving}
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
