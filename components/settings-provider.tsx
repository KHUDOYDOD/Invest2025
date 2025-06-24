"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  registrationEnabled: boolean
  maintenanceMode: boolean
  minDeposit: number
  maxDeposit: number
  minWithdraw: number
  withdrawFee: number
  referralBonus: number
  welcomeBonus: number
}

interface AppearanceSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  darkMode: boolean
  logoUrl: string
  faviconUrl: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  depositNotifications: boolean
  withdrawNotifications: boolean
  investmentNotifications: boolean
}

interface SettingsContextType {
  siteSettings: SiteSettings
  appearanceSettings: AppearanceSettings
  notificationSettings: NotificationSettings
  loading: boolean
  refreshSettings: () => Promise<void>
  updateSiteSettings: (settings: SiteSettings) => void
  updateAppearanceSettings: (settings: AppearanceSettings) => void
  updateNotificationSettings: (settings: NotificationSettings) => void
}

const defaultSiteSettings: SiteSettings = {
  siteName: "InvestPro",
  siteDescription: "Профессиональная инвестиционная платформа",
  contactEmail: "X453925x@gmail.com",
  registrationEnabled: true,
  maintenanceMode: false,
  minDeposit: 50,
  maxDeposit: 50000,
  minWithdraw: 10,
  withdrawFee: 2,
  referralBonus: 5,
  welcomeBonus: 25,
}

const defaultAppearanceSettings: AppearanceSettings = {
  primaryColor: "#3b82f6",
  secondaryColor: "#10b981",
  accentColor: "#f59e0b",
  darkMode: false,
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  depositNotifications: true,
  withdrawNotifications: true,
  investmentNotifications: true,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings)
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const [loading, setLoading] = useState(false)

  const loadSettings = async () => {
    try {
      setLoading(true)

      // Используем только локальные настройки
      setSiteSettings(defaultSiteSettings)
      setAppearanceSettings(defaultAppearanceSettings)
      setNotificationSettings(defaultNotificationSettings)

      // Применяем настройки к DOM
      if (typeof document !== "undefined") {
        document.title = defaultSiteSettings.siteName
        document.documentElement.style.setProperty("--primary-color", defaultAppearanceSettings.primaryColor)
        document.documentElement.style.setProperty("--secondary-color", defaultAppearanceSettings.secondaryColor)
        document.documentElement.style.setProperty("--accent-color", defaultAppearanceSettings.accentColor)
      }

      console.log("✅ Settings loaded (local defaults)")
    } catch (error) {
      console.error("Error loading settings:", error)
      // Устанавливаем значения по умолчанию при любых ошибках
      setSiteSettings(defaultSiteSettings)
      setAppearanceSettings(defaultAppearanceSettings)
      setNotificationSettings(defaultNotificationSettings)
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings)
    document.title = settings.siteName
  }

  const updateAppearanceSettings = (settings: AppearanceSettings) => {
    setAppearanceSettings(settings)
    document.documentElement.style.setProperty("--primary-color", settings.primaryColor)
    document.documentElement.style.setProperty("--secondary-color", settings.secondaryColor)
    document.documentElement.style.setProperty("--accent-color", settings.accentColor)
  }

  const updateNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        siteSettings,
        appearanceSettings,
        notificationSettings,
        loading,
        refreshSettings,
        updateSiteSettings,
        updateAppearanceSettings,
        updateNotificationSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
