"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, RotateCcw, TrendingUp, Settings } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProjectCounterData {
  id: string
  current_count: number
  increment_speed: number
  is_active: boolean
}

export default function ProjectCounterPage() {
  const [data, setData] = useState<ProjectCounterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/project-counter")
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error("Error fetching project counter:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные счетчика",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!data) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/project-counter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Настройки счетчика обновлены",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const resetCounter = async () => {
    if (!data) return

    const newData = { ...data, current_count: 0 }
    setData(newData)

    try {
      await fetch("/api/admin/project-counter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      })

      toast({
        title: "Счетчик сброшен",
        description: "Счетчик проектов сброшен до 0",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сбросить счетчик",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Данные не найдены</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление счетчиком проектов</h1>
          <p className="text-muted-foreground">Настройка отображения количества завершенных проектов</p>
        </div>
        <Badge variant={data.is_active ? "default" : "secondary"}>{data.is_active ? "Активен" : "Неактивен"}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Текущие настройки
            </CardTitle>
            <CardDescription>Основные параметры счетчика проектов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_count">Текущее значение</Label>
              <Input
                id="current_count"
                type="number"
                value={data.current_count}
                onChange={(e) => setData({ ...data, current_count: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="increment_speed">Скорость инкремента (мс)</Label>
              <Input
                id="increment_speed"
                type="number"
                value={data.increment_speed}
                onChange={(e) => setData({ ...data, increment_speed: Number.parseInt(e.target.value) || 1000 })}
              />
              <p className="text-sm text-muted-foreground">Интервал между увеличениями счетчика в миллисекундах</p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={data.is_active}
                onCheckedChange={(checked) => setData({ ...data, is_active: checked })}
              />
              <Label htmlFor="is_active">Активировать счетчик</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Действия
            </CardTitle>
            <CardDescription>Управление состоянием счетчика</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Предварительный просмотр</h4>
                <div className="text-2xl font-bold text-primary">{data.current_count.toLocaleString()} проектов</div>
                <p className="text-sm text-muted-foreground">Обновляется каждые {data.increment_speed}мс</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Сохранить
                </Button>

                <Button variant="outline" onClick={resetCounter}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Сбросить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.current_count}</div>
              <div className="text-sm text-muted-foreground">Текущее значение</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.increment_speed}мс</div>
              <div className="text-sm text-muted-foreground">Скорость обновления</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{data.is_active ? "ВКЛ" : "ВЫКЛ"}</div>
              <div className="text-sm text-muted-foreground">Статус</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
