"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "InvestPro",
    siteDescription: "Инвестиционная платформа",
    contactEmail: "X453925x@gmail.com",
    registrationEnabled: true,
    maintenanceMode: false,
    minDeposit: 50,
    maxDeposit: 50000,
    minWithdraw: 10,
    withdrawFee: 2,
    referralBonus: 5,
    welcomeBonus: 25,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b",
    darkMode: false,
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    depositNotifications: true,
    withdrawNotifications: true,
    investmentNotifications: true,
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [initialLoad, setInitialLoad] = useState(true)

  // Загрузка настроек при инициализации
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setInitialLoad(true)
      setError("")

      // Загружаем общие настройки
      const siteResponse = await fetch("/api/settings/site")
      if (siteResponse.ok) {
        const siteData = await siteResponse.json()
        setGeneralSettings({
          siteName: siteData.site_name || "InvestPro",
          siteDescription: siteData.site_description || "Инвестиционная платформа",
          contactEmail: siteData.contact_email || "X453925x@gmail.com",
          registrationEnabled: siteData.registration_enabled ?? true,
          maintenanceMode: siteData.maintenance_mode ?? false,
          minDeposit: Number(siteData.min_deposit) || 50,
          maxDeposit: Number(siteData.max_deposit) || 50000,
          minWithdraw: Number(siteData.min_withdraw) || 10,
          withdrawFee: Number(siteData.withdraw_fee) || 2,
          referralBonus: Number(siteData.referral_bonus) || 5,
          welcomeBonus: Number(siteData.welcome_bonus) || 25,
        })

        // Применяем название сайта к заголовку
        document.title = siteData.site_name || "InvestPro"
      }

      // Загружаем настройки внешнего вида
      const appearanceResponse = await fetch("/api/settings/appearance")
      if (appearanceResponse.ok) {
        const appearanceData = await appearanceResponse.json()
        const newAppearanceSettings = {
          primaryColor: appearanceData.primary_color || "#3b82f6",
          secondaryColor: appearanceData.secondary_color || "#10b981",
          accentColor: appearanceData.accent_color || "#f59e0b",
          darkMode: appearanceData.dark_mode ?? false,
          logoUrl: appearanceData.logo_url || "/logo.png",
          faviconUrl: appearanceData.favicon_url || "/favicon.ico",
        }
        setAppearanceSettings(newAppearanceSettings)

        // Применяем цвета к CSS переменным
        applyColorsToDOM(newAppearanceSettings)
      }

      // Загружаем настройки уведомлений
      const notificationsResponse = await fetch("/api/settings/notifications")
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json()
        setNotificationSettings({
          emailNotifications: notificationsData.email_notifications ?? true,
          smsNotifications: notificationsData.sms_notifications ?? false,
          pushNotifications: notificationsData.push_notifications ?? true,
          depositNotifications: notificationsData.deposit_notifications ?? true,
          withdrawNotifications: notificationsData.withdraw_notifications ?? true,
          investmentNotifications: notificationsData.investment_notifications ?? true,
        })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      setError("Ошибка при загрузке настроек")
    } finally {
      setInitialLoad(false)
    }
  }

  const applyColorsToDOM = (settings: typeof appearanceSettings) => {
    const root = document.documentElement
    root.style.setProperty("--primary-color", settings.primaryColor)
    root.style.setProperty("--secondary-color", settings.secondaryColor)
    root.style.setProperty("--accent-color", settings.accentColor)

    // Применяем к Tailwind CSS переменным
    root.style.setProperty("--color-primary", settings.primaryColor)
    root.style.setProperty("--color-secondary", settings.secondaryColor)
    root.style.setProperty("--color-accent", settings.accentColor)
  }

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setGeneralSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAppearanceChange = (name: string, value: any) => {
    setAppearanceSettings((prev) => {
      const newSettings = { ...prev, [name]: value }
      // Мгновенно применяем изменения цветов
      if (name.includes("Color")) {
        applyColorsToDOM(newSettings)
      }
      return newSettings
    })
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveSettings = async (section: string) => {
    setLoading(true)
    setError("")

    try {
      let response
      let dataToSave

      switch (section) {
        case "general":
          dataToSave = generalSettings
          response = await fetch("/api/settings/site", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(generalSettings),
          })
          break
        case "appearance":
          dataToSave = appearanceSettings
          response = await fetch("/api/settings/appearance", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(appearanceSettings),
          })
          break
        case "notifications":
          dataToSave = notificationSettings
          response = await fetch("/api/settings/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notificationSettings),
          })
          break
        default:
          throw new Error("Неизвестная секция")
      }

      if (response && response.ok) {
        // Применяем изменения немедленно
        if (section === "general") {
          document.title = generalSettings.siteName
          // Сохраняем в localStorage для мгновенного применения
          localStorage.setItem("siteSettings", JSON.stringify(generalSettings))
        } else if (section === "appearance") {
          applyColorsToDOM(appearanceSettings)
          localStorage.setItem("appearanceSettings", JSON.stringify(appearanceSettings))
        } else if (section === "notifications") {
          localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
        }

        setSaved(true)
        setTimeout(() => setSaved(false), 3000)

        // Перезагружаем настройки для синхронизации
        await loadSettings()
      } else {
        const errorData = await response?.json()
        setError(errorData?.error || "Ошибка при сохранении настроек")
      }
    } catch (error) {
      console.error("Save error:", error)
      setError("Ошибка при сохранении настроек")
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshSettings = async () => {
    await loadSettings()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Загрузка настроек системы...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Настройки системы</h1>
        <Button onClick={handleRefreshSettings} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Обновить настройки
        </Button>
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
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Основные настройки платформы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Название сайта</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Контактный email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Описание сайта</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDeposit">Минимальный депозит ($)</Label>
                  <Input
                    id="minDeposit"
                    name="minDeposit"
                    type="number"
                    value={generalSettings.minDeposit}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDeposit">Максимальный депозит ($)</Label>
                  <Input
                    id="maxDeposit"
                    name="maxDeposit"
                    type="number"
                    value={generalSettings.maxDeposit}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minWithdraw">Минимальный вывод ($)</Label>
                  <Input
                    id="minWithdraw"
                    name="minWithdraw"
                    type="number"
                    value={generalSettings.minWithdraw}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawFee">Комиссия за вывод (%)</Label>
                  <Input
                    id="withdrawFee"
                    name="withdrawFee"
                    type="number"
                    step="0.1"
                    value={generalSettings.withdrawFee}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referralBonus">Реферальный бонус (%)</Label>
                  <Input
                    id="referralBonus"
                    name="referralBonus"
                    type="number"
                    step="0.1"
                    value={generalSettings.referralBonus}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcomeBonus">Приветственный бонус ($)</Label>
                  <Input
                    id="welcomeBonus"
                    name="welcomeBonus"
                    type="number"
                    value={generalSettings.welcomeBonus}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="registrationEnabled">Регистрация пользователей</Label>
                  <p className="text-sm text-gray-500">Разрешить новые регистрации</p>
                </div>
                <Switch
                  id="registrationEnabled"
                  checked={generalSettings.registrationEnabled}
                  onCheckedChange={(checked) => handleSwitchChange("registrationEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="maintenanceMode">Режим обслуживания</Label>
                  <p className="text-sm text-gray-500">Закрыть сайт для технических работ</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Предварительный просмотр</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Название:</strong> {generalSettings.siteName}
                  </p>
                  <p>
                    <strong>Описание:</strong> {generalSettings.siteDescription}
                  </p>
                  <p>
                    <strong>Мин. депозит:</strong> ${generalSettings.minDeposit}
                  </p>
                  <p>
                    <strong>Макс. депозит:</strong> ${generalSettings.maxDeposit}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("general")} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить и применить
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки внешнего вида</CardTitle>
              <CardDescription>Цветовая схема и брендинг сайта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Основной цвет</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
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
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => handleAppearanceChange("secondaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.secondaryColor}
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
                      value={appearanceSettings.accentColor}
                      onChange={(e) => handleAppearanceChange("accentColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.accentColor}
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
                    value={appearanceSettings.logoUrl}
                    onChange={(e) => handleAppearanceChange("logoUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">URL favicon</Label>
                  <Input
                    id="faviconUrl"
                    value={appearanceSettings.faviconUrl}
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
                  checked={appearanceSettings.darkMode}
                  onCheckedChange={(checked) => handleAppearanceChange("darkMode", checked)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Предварительный просмотр цветов</h4>
                <div className="flex space-x-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: appearanceSettings.primaryColor }}
                    title="Основной цвет"
                  />
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: appearanceSettings.secondaryColor }}
                    title="Вторичный цвет"
                  />
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: appearanceSettings.accentColor }}
                    title="Акцентный цвет"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("appearance")} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить и применить
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
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
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>SMS уведомления</Label>
                    <p className="text-sm text-gray-500">Отправка SMS сообщений</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Push уведомления</Label>
                    <p className="text-sm text-gray-500">Браузерные уведомления</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Уведомления о депозитах</Label>
                    <p className="text-sm text-gray-500">При пополнении баланса</p>
                  </div>
                  <Switch
                    checked={notificationSettings.depositNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("depositNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Уведомления о выводах</Label>
                    <p className="text-sm text-gray-500">При выводе средств</p>
                  </div>
                  <Switch
                    checked={notificationSettings.withdrawNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("withdrawNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Уведомления об инвестициях</Label>
                    <p className="text-sm text-gray-500">При создании инвестиций</p>
                  </div>
                  <Switch
                    checked={notificationSettings.investmentNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("investmentNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("notifications")} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Сохранение и применение...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить и применить
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки безопасности</CardTitle>
              <CardDescription>Управление параметрами безопасности системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
                <Switch id="two-factor" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ip-protection">Защита от смены IP</Label>
                <Switch id="ip-protection" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="captcha">CAPTCHA при входе</Label>
                <Switch id="captcha" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Тайм-аут сессии (минуты)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-policy">Политика паролей</Label>
                <Select defaultValue="strong">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите политику паролей" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Базовая (мин. 6 символов)</SelectItem>
                    <SelectItem value="medium">Средняя (мин. 8 символов, цифры)</SelectItem>
                    <SelectItem value="strong">Строгая (мин. 10 символов, цифры, спецсимволы)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-attempts">Макс. количество попыток входа</Label>
                <Input id="login-attempts" type="number" defaultValue="5" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Сохранить изменения
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
