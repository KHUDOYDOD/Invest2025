"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Globe,
  Users,
  DollarSign,
  Bell,
  Palette,
  Settings,
  FileText,
  LineChart,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Briefcase,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "@/components/settings-provider"

export default function SiteManagementPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [initialLoad, setInitialLoad] = useState(true)

  const {
    siteSettings,
    appearanceSettings,
    notificationSettings,
    refreshSettings,
    updateSiteSettings,
    updateAppearanceSettings,
    updateNotificationSettings,
  } = useSettings()

  const [localSiteSettings, setLocalSiteSettings] = useState(siteSettings)
  const [localAppearanceSettings, setLocalAppearanceSettings] = useState(appearanceSettings)
  const [localNotificationSettings, setLocalNotificationSettings] = useState(notificationSettings)

  const [investmentPlans, setInvestmentPlans] = useState([])
  const [statistics, setStatistics] = useState({
    usersCount: 0,
    usersChange: 0,
    investmentsAmount: 0,
    investmentsChange: 0,
    payoutsAmount: 0,
    payoutsChange: 0,
    profitabilityRate: 0,
    profitabilityChange: 0,
  })

  const [newPlan, setNewPlan] = useState({
    name: "",
    minAmount: 0,
    maxAmount: 0,
    dailyPercent: 0,
    duration: 30,
    features: "",
  })

  // Синхронизация с глобальными настройками
  useEffect(() => {
    setLocalSiteSettings(siteSettings)
  }, [siteSettings])

  useEffect(() => {
    setLocalAppearanceSettings(appearanceSettings)
  }, [appearanceSettings])

  useEffect(() => {
    setLocalNotificationSettings(notificationSettings)
  }, [notificationSettings])

  // Загрузка данных при инициализации
  useEffect(() => {
    loadAdditionalData()
  }, [])

  const loadAdditionalData = async () => {
    try {
      setInitialLoad(true)

      // Загружаем инвестиционные планы
      const plansResponse = await fetch("/api/investment-plans")
      if (plansResponse.ok) {
        const plansData = await plansResponse.json()
        const formattedPlans = plansData.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          minAmount: plan.min_amount,
          maxAmount: plan.max_amount,
          dailyPercent: plan.daily_percent,
          duration: plan.duration,
          totalReturn: plan.total_return,
          isActive: plan.is_active,
          features: plan.features || [],
        }))
        setInvestmentPlans(formattedPlans)
      }

      // Загружаем статистику
      const statsResponse = await fetch("/api/statistics")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStatistics({
          usersCount: statsData.users_count || 0,
          usersChange: statsData.users_change || 0,
          investmentsAmount: statsData.investments_amount || 0,
          investmentsChange: statsData.investments_change || 0,
          payoutsAmount: statsData.payouts_amount || 0,
          payoutsChange: statsData.payouts_change || 0,
          profitabilityRate: statsData.profitability_rate || 0,
          profitabilityChange: statsData.profitability_change || 0,
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Ошибка при загрузке данных")
    } finally {
      setInitialLoad(false)
    }
  }

  const handleSiteSettingChange = (key: string, value: any) => {
    setLocalSiteSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setLocalNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleAppearanceChange = (key: string, value: any) => {
    setLocalAppearanceSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleStatisticsChange = (key: string, value: number) => {
    setStatistics((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddPlan = async () => {
    if (newPlan.name && newPlan.minAmount && newPlan.maxAmount && newPlan.dailyPercent) {
      try {
        const totalReturn = newPlan.dailyPercent * newPlan.duration
        const planData = {
          name: newPlan.name,
          minAmount: newPlan.minAmount,
          maxAmount: newPlan.maxAmount,
          dailyPercent: newPlan.dailyPercent,
          duration: newPlan.duration,
          totalReturn,
          isActive: true,
          features: newPlan.features.split(",").map((f) => f.trim()),
        }

        const response = await fetch("/api/investment-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planData),
        })

        if (response.ok) {
          const newPlanFromDB = await response.json()
          const formattedPlan = {
            id: newPlanFromDB.id,
            name: newPlanFromDB.name,
            minAmount: newPlanFromDB.min_amount,
            maxAmount: newPlanFromDB.max_amount,
            dailyPercent: newPlanFromDB.daily_percent,
            duration: newPlanFromDB.duration,
            totalReturn: newPlanFromDB.total_return,
            isActive: newPlanFromDB.is_active,
            features: newPlanFromDB.features || [],
          }

          setInvestmentPlans([...investmentPlans, formattedPlan])
          setNewPlan({
            name: "",
            minAmount: 0,
            maxAmount: 0,
            dailyPercent: 0,
            duration: 30,
            features: "",
          })
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        } else {
          setError("Ошибка при создании тарифа")
        }
      } catch (error) {
        setError("Ошибка при создании тарифа")
      }
    }
  }

  const handleDeletePlan = async (id: string) => {
    try {
      const response = await fetch(`/api/investment-plans/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInvestmentPlans(investmentPlans.filter((plan) => plan.id !== id))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError("Ошибка при удалении тарифа")
      }
    } catch (error) {
      setError("Ошибка при удалении тарифа")
    }
  }

  const handleTogglePlan = async (id: string) => {
    try {
      const plan = investmentPlans.find((p) => p.id === id)
      if (!plan) return

      const updatedPlan = { ...plan, isActive: !plan.isActive }

      const response = await fetch(`/api/investment-plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlan),
      })

      if (response.ok) {
        setInvestmentPlans(
          investmentPlans.map((plan) => (plan.id === id ? { ...plan, isActive: !plan.isActive } : plan)),
        )
      } else {
        setError("Ошибка при обновлении тарифа")
      }
    } catch (error) {
      setError("Ошибка при обновлении тарифа")
    }
  }

  const handleSave = async (section: string) => {
    try {
      setLoading(true)
      setError("")

      let response
      let dataToSave

      switch (section) {
        case "general":
        case "financial":
          dataToSave = localSiteSettings
          response = await fetch("/api/settings/site", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localSiteSettings),
          })
          break
        case "notifications":
          dataToSave = localNotificationSettings
          response = await fetch("/api/settings/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localNotificationSettings),
          })
          break
        case "appearance":
          dataToSave = localAppearanceSettings
          response = await fetch("/api/settings/appearance", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localAppearanceSettings),
          })
          break
        case "statistics":
          dataToSave = statistics
          response = await fetch("/api/statistics", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(statistics),
          })
          break
        default:
          throw new Error("Неизвестная секция")
      }

      if (response && response.ok) {
        // Обновляем глобальные настройки
        if (section === "general" || section === "financial") {
          updateSiteSettings(localSiteSettings)
        } else if (section === "notifications") {
          updateNotificationSettings(localNotificationSettings)
        } else if (section === "appearance") {
          updateAppearanceSettings(localAppearanceSettings)
        }

        // Обновляем настройки из базы данных
        await refreshSettings()

        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError("Ошибка при сохранении настроек")
      }
    } catch (error) {
      console.error("Save error:", error)
      setError("Ошибка при сохранении настроек")
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshSettings = async () => {
    try {
      setLoading(true)
      await refreshSettings()
      await loadAdditionalData()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      setError("Ошибка при обновлении настроек")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Загрузка настроек...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление сайтом</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleRefreshSettings} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Обновить настройки
          </Button>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Globe className="w-4 h-4 mr-1" />
            Сайт активен
          </Badge>
        </div>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200 mb-6">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Настройки успешно сохранены и применены к сайту!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200 mb-6">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-8 w-full">
          <TabsTrigger value="general" className="flex items-center space-x-1">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Общие</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Финансы</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Пользователи</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-1">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-1">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Внешний вид</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Контент</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center space-x-1">
            <LineChart className="w-4 h-4" />
            <span className="hidden sm:inline">Статистика</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center space-x-1">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Тарифы</span>
          </TabsTrigger>
        </TabsList>

        {/* Общие настройки */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Основные настройки сайта</span>
              </CardTitle>
              <CardDescription>Управление основными параметрами платформы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Название сайта</Label>
                  <Input
                    id="siteName"
                    value={localSiteSettings.siteName}
                    onChange={(e) => handleSiteSettingChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Описание сайта</Label>
                  <Textarea
                    id="siteDescription"
                    value={localSiteSettings.siteDescription}
                    onChange={(e) => handleSiteSettingChange("siteDescription", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="maintenance">Режим обслуживания</Label>
                    <p className="text-sm text-gray-500">Закрыть сайт для пользователей</p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={localSiteSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSiteSettingChange("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="registration">Регистрация</Label>
                    <p className="text-sm text-gray-500">Разрешить новые регистрации</p>
                  </div>
                  <Switch
                    id="registration"
                    checked={localSiteSettings.registrationEnabled}
                    onCheckedChange={(checked) => handleSiteSettingChange("registrationEnabled", checked)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Предварительный просмотр изменений</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Название сайта:</strong> {localSiteSettings.siteName}
                  </p>
                  <p>
                    <strong>Описание:</strong> {localSiteSettings.siteDescription}
                  </p>
                  <p>
                    <strong>Регистрация:</strong> {localSiteSettings.registrationEnabled ? "Включена" : "Отключена"}
                  </p>
                </div>
              </div>

              <Button onClick={() => handleSave("general")} disabled={loading} className="w-full md:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить и применить к сайту
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Финансовые настройки */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Финансовые настройки</span>
              </CardTitle>
              <CardDescription>Управление лимитами, комиссиями и бонусами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minDeposit">Минимальный депозит ($)</Label>
                  <Input
                    id="minDeposit"
                    type="number"
                    value={localSiteSettings.minDeposit}
                    onChange={(e) => handleSiteSettingChange("minDeposit", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDeposit">Максимальный депозит ($)</Label>
                  <Input
                    id="maxDeposit"
                    type="number"
                    value={localSiteSettings.maxDeposit}
                    onChange={(e) => handleSiteSettingChange("maxDeposit", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minWithdraw">Минимальный вывод ($)</Label>
                  <Input
                    id="minWithdraw"
                    type="number"
                    value={localSiteSettings.minWithdraw}
                    onChange={(e) => handleSiteSettingChange("minWithdraw", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdrawFee">Комиссия за вывод (%)</Label>
                  <Input
                    id="withdrawFee"
                    type="number"
                    value={localSiteSettings.withdrawFee}
                    onChange={(e) => handleSiteSettingChange("withdrawFee", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referralBonus">Реферальный бонус (%)</Label>
                  <Input
                    id="referralBonus"
                    type="number"
                    value={localSiteSettings.referralBonus}
                    onChange={(e) => handleSiteSettingChange("referralBonus", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcomeBonus">Приветственный бонус ($)</Label>
                  <Input
                    id="welcomeBonus"
                    type="number"
                    value={localSiteSettings.welcomeBonus}
                    onChange={(e) => handleSiteSettingChange("welcomeBonus", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Предварительный просмотр изменений</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Минимальный депозит:</strong> {localSiteSettings.minDeposit}
                  </p>
                  <p>
                    <strong>Максимальный депозит:</strong> {localSiteSettings.maxDeposit}
                  </p>
                  <p>
                    <strong>Минимальный вывод:</strong> {localSiteSettings.minWithdraw}
                  </p>
                </div>
              </div>

              <Button onClick={() => handleSave("financial")} disabled={loading} className="w-full md:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить и применить к сайту
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Настройки уведомлений */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Настройки уведомлений</span>
              </CardTitle>
              <CardDescription>Управление системой уведомлений пользователей</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Email уведомления</Label>
                    <p className="text-sm text-gray-500">Отправка email сообщений</p>
                  </div>
                  <Switch
                    checked={localNotificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>SMS уведомления</Label>
                    <p className="text-sm text-gray-500">Отправка SMS сообщений</p>
                  </div>
                  <Switch
                    checked={localNotificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Push уведомления</Label>
                    <p className="text-sm text-gray-500">Браузерные уведомления</p>
                  </div>
                  <Switch
                    checked={localNotificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Уведомления о депозитах</Label>
                    <p className="text-sm text-gray-500">При пополнении баланса</p>
                  </div>
                  <Switch
                    checked={localNotificationSettings.depositNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("depositNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Уведомления о выводах</Label>
                    <p className="text-sm text-gray-500">При выводе средств</p>
                  </div>
                  <Switch
                    checked={localNotificationSettings.withdrawNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("withdrawNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Уведомления об инвестициях</Label>
                    <p className="text-sm text-gray-500">При создании инвестиций</p>
                  </div>
                  <Switch
                    checked={localNotificationSettings.investmentNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("investmentNotifications", checked)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Предварительный просмотр изменений</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Email уведомления:</strong>{" "}
                    {localNotificationSettings.emailNotifications ? "Включены" : "Отключены"}
                  </p>
                  <p>
                    <strong>SMS уведомления:</strong>{" "}
                    {localNotificationSettings.smsNotifications ? "Включены" : "Отключены"}
                  </p>
                  <p>
                    <strong>Push уведомления:</strong>{" "}
                    {localNotificationSettings.pushNotifications ? "Включены" : "Отключены"}
                  </p>
                </div>
              </div>

              <Button onClick={() => handleSave("notifications")} disabled={loading} className="w-full md:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить и применить к сайту
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Настройки внешнего вида */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Внешний вид сайта</span>
              </CardTitle>
              <CardDescription>Настройка цветовой схемы и брендинга</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Основной цвет</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={localAppearanceSettings.primaryColor}
                      onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localAppearanceSettings.primaryColor}
                      onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Вторичный цвет</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={localAppearanceSettings.secondaryColor}
                      onChange={(e) => handleAppearanceChange("secondaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localAppearanceSettings.secondaryColor}
                      onChange={(e) => handleAppearanceChange("secondaryColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Акцентный цвет</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={localAppearanceSettings.accentColor}
                      onChange={(e) => handleAppearanceChange("accentColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localAppearanceSettings.accentColor}
                      onChange={(e) => handleAppearanceChange("accentColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">URL логотипа</Label>
                  <Input
                    id="logoUrl"
                    value={localAppearanceSettings.logoUrl}
                    onChange={(e) => handleAppearanceChange("logoUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">URL favicon</Label>
                  <Input
                    id="faviconUrl"
                    value={localAppearanceSettings.faviconUrl}
                    onChange={(e) => handleAppearanceChange("faviconUrl", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Темная тема по умолчанию</Label>
                  <p className="text-sm text-gray-500">Использовать темную тему для новых пользователей</p>
                </div>
                <Switch
                  checked={localAppearanceSettings.darkMode}
                  onCheckedChange={(checked) => handleAppearanceChange("darkMode", checked)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Предварительный просмотр изменений</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Основной цвет:</strong> {localAppearanceSettings.primaryColor}
                  </p>
                  <p>
                    <strong>Вторичный цвет:</strong> {localAppearanceSettings.secondaryColor}
                  </p>
                  <p>
                    <strong>Акцентный цвет:</strong> {localAppearanceSettings.accentColor}
                  </p>
                </div>
              </div>

              <Button onClick={() => handleSave("appearance")} disabled={loading} className="w-full md:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить и применить к сайту
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Управление статистикой */}
        <TabsContent value="statistics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="w-5 h-5" />
                <span>Управление статистикой главной страницы</span>
              </CardTitle>
              <CardDescription>Редактирование счетчиков и показателей для публичного отображения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Активные инвесторы
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="users-count">Количество</Label>
                      <Input
                        id="users-count"
                        type="number"
                        value={statistics.usersCount}
                        onChange={(e) => handleStatisticsChange("usersCount", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="users-change">Изменение (%)</Label>
                      <Input
                        id="users-change"
                        type="number"
                        value={statistics.usersChange}
                        onChange={(e) => handleStatisticsChange("usersChange", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <LineChart className="w-4 h-4 mr-2" />
                    Инвестиции за месяц
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="investments-amount">Сумма ($)</Label>
                      <Input
                        id="investments-amount"
                        type="number"
                        value={statistics.investmentsAmount}
                        onChange={(e) => handleStatisticsChange("investmentsAmount", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="investments-change">Изменение (%)</Label>
                      <Input
                        id="investments-change"
                        type="number"
                        value={statistics.investmentsChange}
                        onChange={(e) => handleStatisticsChange("investmentsChange", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Выплачено прибыли
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="payouts-amount">Сумма ($)</Label>
                      <Input
                        id="payouts-amount"
                        type="number"
                        value={statistics.payoutsAmount}
                        onChange={(e) => handleStatisticsChange("payoutsAmount", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="payouts-change">Изменение (%)</Label>
                      <Input
                        id="payouts-change"
                        type="number"
                        value={statistics.payoutsChange}
                        onChange={(e) => handleStatisticsChange("payoutsChange", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Средняя доходность
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="profitability-rate">Процент (%)</Label>
                      <Input
                        id="profitability-rate"
                        type="number"
                        value={statistics.profitabilityRate}
                        onChange={(e) => handleStatisticsChange("profitabilityRate", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="profitability-change">Изменение (%)</Label>
                      <Input
                        id="profitability-change"
                        type="number"
                        value={statistics.profitabilityChange}
                        onChange={(e) => handleStatisticsChange("profitabilityChange", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Рекомендации по статистике</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Обновляйте данные регулярно для поддержания доверия</li>
                  <li>• Используйте реалистичные показатели роста</li>
                  <li>• Показывайте как положительную, так и отрицательную динамику для достоверности</li>
                  <li>• Округляйте большие числа для лучшего восприятия</li>
                </ul>
              </div>

              <Button onClick={() => handleSave("statistics")} disabled={loading} className="w-full md:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить и применить к сайту
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Управление тарифами */}
        <TabsContent value="plans" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Управление инвестиционными тарифами</span>
              </CardTitle>
              <CardDescription>Создание, редактирование и управление тарифными планами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Добавление нового тарифа */}
              <Card className="p-4 bg-green-50 border-green-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-green-800">
                  <Plus className="w-5 h-5 mr-2" />
                  Создать новый тариф
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPlanName">Название тарифа</Label>
                    <Input
                      id="newPlanName"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      placeholder="Например: VIP"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPlanMinAmount">Мин. сумма ($)</Label>
                    <Input
                      id="newPlanMinAmount"
                      type="number"
                      value={newPlan.minAmount}
                      onChange={(e) => setNewPlan({ ...newPlan, minAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPlanMaxAmount">Макс. сумма ($)</Label>
                    <Input
                      id="newPlanMaxAmount"
                      type="number"
                      value={newPlan.maxAmount}
                      onChange={(e) => setNewPlan({ ...newPlan, maxAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPlanPercent">Доходность в день (%)</Label>
                    <Input
                      id="newPlanPercent"
                      type="number"
                      step="0.1"
                      value={newPlan.dailyPercent}
                      onChange={(e) => setNewPlan({ ...newPlan, dailyPercent: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPlanDuration">Срок (дни)</Label>
                    <Input
                      id="newPlanDuration"
                      type="number"
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan({ ...newPlan, duration: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPlanFeatures">Особенности (через запятую)</Label>
                    <Input
                      id="newPlanFeatures"
                      value={newPlan.features}
                      onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                      placeholder="Поддержка 24/7, Анализ рисков"
                    />
                  </div>
                </div>
                <Button onClick={handleAddPlan} className="mt-4 bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить тариф в БД
                </Button>
              </Card>

              {/* Список существующих тарифов */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Текущие тарифы из базы данных
                </h3>
                <div className="space-y-4">
                  {investmentPlans.map((plan) => (
                    <Card key={plan.id} className={`p-4 ${plan.isActive ? "border-green-200" : "border-gray-200"}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-lg">{plan.name}</h4>
                            <Badge variant={plan.isActive ? "default" : "secondary"}>
                              {plan.isActive ? "Активен" : "Отключен"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Сумма:</span>
                              <div className="font-medium">
                                ${plan.minAmount} - ${plan.maxAmount}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Доходность:</span>
                              <div className="font-medium text-green-600">{plan.dailyPercent}% в день</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Срок:</span>
                              <div className="font-medium">{plan.duration} дней</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Итого:</span>
                              <div className="font-medium text-blue-600">{plan.totalReturn}%</div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Особенности:</span>
                            <div className="text-sm text-gray-700">{plan.features.join(", ")}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Switch
                            checked={plan.isActive}
                            onCheckedChange={() => handleTogglePlan(plan.id)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Рекомендации по тарифам</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Устанавливайте реалистичные проценты доходности</li>
                  <li>• Создавайте градацию по суммам для разных категорий инвесторов</li>
                  <li>• Указывайте четкие условия и ограничения</li>
                  <li>• Регулярно анализируйте популярность тарифов</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
