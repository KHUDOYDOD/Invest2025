"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, Trash2, Edit, TrendingUp, Clock, DollarSign, Calendar, Percent, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProfitSetting {
  id: string
  plan_name: string
  min_amount: number
  max_amount: number
  daily_percent: number
  duration_days: number
  payout_interval_hours: number
  is_active: boolean
  description?: string
  created_at: string
  updated_at: string
}

export default function ProfitPlansPage() {
  const [profitSettings, setProfitSettings] = useState<ProfitSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSetting, setEditingSetting] = useState<ProfitSetting | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchProfitSettings()
  }, [])

  const fetchProfitSettings = async () => {
    try {
      const response = await fetch("/api/admin/profit-settings")
      if (response.ok) {
        const data = await response.json()
        setProfitSettings(data)
      }
    } catch (error) {
      console.error("Error fetching profit settings:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки прибыли",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (setting: Partial<ProfitSetting>) => {
    setSaving(true)
    try {
      const method = setting.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/profit-settings", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      })

      if (response.ok) {
        const savedSetting = await response.json()
        if (setting.id) {
          setProfitSettings((prev) => prev.map((s) => (s.id === setting.id ? savedSetting : s)))
        } else {
          setProfitSettings((prev) => [...prev, savedSetting])
        }
        setEditingSetting(null)
        setShowCreateForm(false)
        toast({
          title: "Успешно",
          description: setting.id ? "План обновлен" : "План создан",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить план",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteSetting = async (id: string) => {
    if (!confirm("Удалить этот план прибыли?")) return

    try {
      const response = await fetch(`/api/admin/profit-settings/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProfitSettings((prev) => prev.filter((s) => s.id !== id))
        toast({
          title: "Успешно",
          description: "План удален",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить план",
        variant: "destructive",
      })
    }
  }

  const createNewSetting = () => {
    const newSetting: Partial<ProfitSetting> = {
      plan_name: "",
      min_amount: 100,
      max_amount: 10000,
      daily_percent: 1.5,
      duration_days: 30,
      payout_interval_hours: 24,
      is_active: true,
      description: "",
    }
    setEditingSetting(newSetting as ProfitSetting)
    setShowCreateForm(true)
  }

  const calculateTotalReturn = (dailyPercent: number, durationDays: number) => {
    return (dailyPercent * durationDays).toFixed(2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Планы прибыли</h1>
          <p className="text-muted-foreground">Управление инвестиционными планами и начислениями</p>
        </div>
        <Button onClick={createNewSetting}>
          <Plus className="h-4 w-4 mr-2" />
          Создать план
        </Button>
      </div>

      <div className="grid gap-4">
        {profitSettings.map((setting) => {
          const totalReturn = calculateTotalReturn(setting.daily_percent, setting.duration_days)
          return (
            <Card key={setting.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>{setting.plan_name}</span>
                      <Badge variant={setting.is_active ? "default" : "secondary"}>
                        {setting.is_active ? "Активен" : "Отключен"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{setting.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingSetting(setting)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteSetting(setting.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                    <div className="text-sm text-muted-foreground">Сумма</div>
                    <div className="font-semibold">
                      ${setting.min_amount} - ${setting.max_amount}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Percent className="h-5 w-5 mx-auto text-green-600 mb-1" />
                    <div className="text-sm text-muted-foreground">В день</div>
                    <div className="font-semibold text-green-600">{setting.daily_percent}%</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Calendar className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                    <div className="text-sm text-muted-foreground">Срок</div>
                    <div className="font-semibold">{setting.duration_days} дней</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Clock className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                    <div className="text-sm text-muted-foreground">Выплаты</div>
                    <div className="font-semibold">каждые {setting.payout_interval_hours}ч</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                    <div className="text-sm text-muted-foreground">Итого</div>
                    <div className="font-semibold text-yellow-600">{totalReturn}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {profitSettings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет планов прибыли</h3>
              <p className="text-muted-foreground mb-4">Создайте первый инвестиционный план</p>
              <Button onClick={createNewSetting}>
                <Plus className="h-4 w-4 mr-2" />
                Создать план
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Форма редактирования/создания */}
      {(editingSetting || showCreateForm) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingSetting?.id ? "Редактировать план" : "Создать план"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Название плана *</Label>
                <Input
                  value={editingSetting?.plan_name || ""}
                  onChange={(e) => setEditingSetting((prev) => (prev ? { ...prev, plan_name: e.target.value } : null))}
                  placeholder="Стартовый, VIP, Премиум..."
                />
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={editingSetting?.description || ""}
                  onChange={(e) =>
                    setEditingSetting((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                  placeholder="Описание плана для пользователей..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Мин. сумма ($)</Label>
                  <Input
                    type="number"
                    value={editingSetting?.min_amount || 0}
                    onChange={(e) =>
                      setEditingSetting((prev) => (prev ? { ...prev, min_amount: Number(e.target.value) } : null))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Макс. сумма ($)</Label>
                  <Input
                    type="number"
                    value={editingSetting?.max_amount || 0}
                    onChange={(e) =>
                      setEditingSetting((prev) => (prev ? { ...prev, max_amount: Number(e.target.value) } : null))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Процент в день (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingSetting?.daily_percent || 0}
                    onChange={(e) =>
                      setEditingSetting((prev) => (prev ? { ...prev, daily_percent: Number(e.target.value) } : null))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Срок (дни)</Label>
                  <Input
                    type="number"
                    value={editingSetting?.duration_days || 0}
                    onChange={(e) =>
                      setEditingSetting((prev) => (prev ? { ...prev, duration_days: Number(e.target.value) } : null))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Интервал выплат (часы)</Label>
                  <Input
                    type="number"
                    value={editingSetting?.payout_interval_hours || 24}
                    onChange={(e) =>
                      setEditingSetting((prev) =>
                        prev ? { ...prev, payout_interval_hours: Number(e.target.value) } : null,
                      )
                    }
                  />
                </div>
              </div>

              {editingSetting && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Предварительный расчет:</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      Общая доходность:{" "}
                      {calculateTotalReturn(editingSetting.daily_percent, editingSetting.duration_days)}%
                    </div>
                    <div>
                      Пример: $1000 → ${" "}
                      {(1000 + (1000 * editingSetting.daily_percent * editingSetting.duration_days) / 100).toFixed(2)}{" "}
                      за {editingSetting.duration_days} дней
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingSetting?.is_active}
                  onCheckedChange={(checked) =>
                    setEditingSetting((prev) => (prev ? { ...prev, is_active: checked } : null))
                  }
                />
                <Label>Активен</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => editingSetting && saveSetting(editingSetting)}
                  disabled={saving || !editingSetting?.plan_name}
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
                    setEditingSetting(null)
                    setShowCreateForm(false)
                  }}
                  className="flex-1"
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
