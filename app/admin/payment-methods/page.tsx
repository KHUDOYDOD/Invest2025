"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, Trash2, Edit, CreditCard, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PaymentSetting {
  id: string
  method_name: string
  method_type: string
  wallet_address: string
  qr_code_url?: string
  instructions?: string
  min_amount: number
  max_amount: number
  fee_percent: number
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

const methodTypes = [
  { value: "crypto", label: "Криптовалюта", icon: "₿" },
  { value: "bank", label: "Банковская карта", icon: "💳" },
  { value: "wallet", label: "Электронный кошелек", icon: "💰" },
  { value: "other", label: "Другое", icon: "💸" },
]

export default function PaymentMethodsPage() {
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSetting, setEditingSetting] = useState<PaymentSetting | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchPaymentSettings()
  }, [])

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch("/api/admin/payment-settings")
      if (response.ok) {
        const data = await response.json()
        setPaymentSettings(data)
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки платежей",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSetting = async (setting: Partial<PaymentSetting>) => {
    setSaving(true)
    try {
      const method = setting.id ? "PUT" : "POST"
      const response = await fetch("/api/admin/payment-settings", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      })

      if (response.ok) {
        const savedSetting = await response.json()
        if (setting.id) {
          setPaymentSettings((prev) => prev.map((s) => (s.id === setting.id ? savedSetting : s)))
        } else {
          setPaymentSettings((prev) => [...prev, savedSetting])
        }
        setEditingSetting(null)
        setShowCreateForm(false)
        toast({
          title: "Успешно",
          description: setting.id ? "Настройки обновлены" : "Метод платежа создан",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteSetting = async (id: string) => {
    if (!confirm("Удалить этот метод платежа?")) return

    try {
      const response = await fetch(`/api/admin/payment-settings/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPaymentSettings((prev) => prev.filter((s) => s.id !== id))
        toast({
          title: "Успешно",
          description: "Метод платежа удален",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить метод платежа",
        variant: "destructive",
      })
    }
  }

  const createNewSetting = () => {
    const newSetting: Partial<PaymentSetting> = {
      method_name: "",
      method_type: "crypto",
      wallet_address: "",
      qr_code_url: "",
      instructions: "",
      min_amount: 10,
      max_amount: 10000,
      fee_percent: 0,
      is_active: true,
      display_order: paymentSettings.length + 1,
    }
    setEditingSetting(newSetting as PaymentSetting)
    setShowCreateForm(true)
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
          <h1 className="text-3xl font-bold">Методы платежей</h1>
          <p className="text-muted-foreground">Управление способами пополнения и вывода</p>
        </div>
        <Button onClick={createNewSetting}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить метод
        </Button>
      </div>

      <div className="grid gap-4">
        {paymentSettings.map((setting) => {
          const methodType = methodTypes.find((t) => t.value === setting.method_type)
          return (
            <Card key={setting.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{methodType?.icon}</div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{setting.method_name}</span>
                        <Badge variant={setting.is_active ? "default" : "secondary"}>
                          {setting.is_active ? "Активен" : "Отключен"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{methodType?.label}</CardDescription>
                    </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Адрес/Реквизиты:</span>
                    <div className="font-mono bg-muted p-2 rounded mt-1 break-all">{setting.wallet_address}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Лимиты:</span>
                    <div className="font-medium">
                      ${setting.min_amount} - ${setting.max_amount}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Комиссия:</span>
                    <div className="font-medium">{setting.fee_percent}%</div>
                  </div>
                </div>
                {setting.instructions && (
                  <div className="mt-4">
                    <span className="text-muted-foreground text-sm">Инструкции:</span>
                    <div className="text-sm mt-1 p-2 bg-muted rounded">{setting.instructions}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {paymentSettings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет методов платежа</h3>
              <p className="text-muted-foreground mb-4">Добавьте первый способ пополнения</p>
              <Button onClick={createNewSetting}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить метод
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
              <CardTitle>{editingSetting?.id ? "Редактировать метод платежа" : "Создать метод платежа"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Название метода *</Label>
                  <Input
                    value={editingSetting?.method_name || ""}
                    onChange={(e) =>
                      setEditingSetting((prev) => (prev ? { ...prev, method_name: e.target.value } : null))
                    }
                    placeholder="Bitcoin, USDT, Сбербанк..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Тип метода</Label>
                  <Select
                    value={editingSetting?.method_type}
                    onValueChange={(value) =>
                      setEditingSetting((prev) => (prev ? { ...prev, method_type: value } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {methodTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Адрес кошелька / Реквизиты *</Label>
                <Input
                  value={editingSetting?.wallet_address || ""}
                  onChange={(e) =>
                    setEditingSetting((prev) => (prev ? { ...prev, wallet_address: e.target.value } : null))
                  }
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa или номер карты"
                />
              </div>

              <div className="space-y-2">
                <Label>URL QR-кода (опционально)</Label>
                <Input
                  value={editingSetting?.qr_code_url || ""}
                  onChange={(e) =>
                    setEditingSetting((prev) => (prev ? { ...prev, qr_code_url: e.target.value } : null))
                  }
                  placeholder="https://example.com/qr.png"
                />
              </div>

              <div className="space-y-2">
                <Label>Инструкции для пользователей</Label>
                <Textarea
                  value={editingSetting?.instructions || ""}
                  onChange={(e) =>
                    setEditingSetting((prev) => (prev ? { ...prev, instructions: e.target.value } : null))
                  }
                  placeholder="Дополнительные инструкции по оплате..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
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
                <div className="space-y-2">
                  <Label>Комиссия (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingSetting?.fee_percent || 0}
                    onChange={(e) =>
                      setEditingSetting((prev) => (prev ? { ...prev, fee_percent: Number(e.target.value) } : null))
                    }
                  />
                </div>
              </div>

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
                  disabled={saving || !editingSetting?.method_name || !editingSetting?.wallet_address}
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
