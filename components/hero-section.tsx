"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/settings-provider"

import { TrendingUp, Shield, Users, DollarSign, ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  const { siteSettings, loading } = useSettings()
  const [mounted, setMounted] = useState(false)
  const [heroSettings, setHeroSettings] = useState({
    enabled: true,
    title: "Инвестируйте с умом, получайте стабильный доход",
    subtitle: "Профессиональная инвестиционная платформа с ежедневными выплатами, высокой доходностью и гарантированной безопасностью",
    badge_text: "Платформа работает с 2025 года",
    button1_text: "Начать инвестировать",
    button1_link: "/register",
    button2_text: "Войти в систему",
    button2_link: "/login",
    show_buttons: true,
    background_animation: true,
    show_stats: true,
    stats_users: "15K+",
    stats_users_label: "Активных инвесторов",
    stats_invested: "$2.8M",
    stats_invested_label: "Общие инвестиции",
    stats_return: "24.8%",
    stats_return_label: "Средняя доходность",
    stats_reliability: "99.9%",
    stats_reliability_label: "Надежность",
  })

  useEffect(() => {
    setMounted(true)
    
    // Load hero settings from admin panel
    const loadHeroSettings = async () => {
      try {
        const response = await fetch("/api/admin/hero-settings")
        if (response.ok) {
          const data = await response.json()
          setHeroSettings(data)
        }
      } catch (error) {
        console.error("Error loading hero settings:", error)
      }
    }

    loadHeroSettings()
  }, [])

  if (!mounted || loading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-slate-700 rounded-lg mb-6 mx-auto max-w-4xl"></div>
            <div className="h-6 bg-slate-700 rounded-lg mb-8 mx-auto max-w-3xl"></div>
            <div className="h-12 bg-slate-700 rounded-lg mx-auto max-w-xs"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!heroSettings.enabled) {
    return null
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Investment Background */}
      <div className="absolute inset-0 z-0">
        {/* Main background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9)), url('/placeholder.svg?height=1080&width=1920&text=Investment+Trading+Charts')`,
          }}
        />

        {/* Animated overlay elements */}
        <div className="absolute inset-0">
          {/* Floating charts and graphs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg backdrop-blur-sm border border-green-500/30 animate-pulse">
            <div className="p-4 h-full flex flex-col justify-between">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <div className="text-right">
                <div className="text-green-400 text-sm font-bold">+24.8%</div>
                <div className="text-green-300 text-xs">ROI</div>
              </div>
            </div>
          </div>

          <div className="absolute top-40 right-20 w-28 h-28 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-lg backdrop-blur-sm border border-blue-500/30 animate-pulse">
            <div className="p-3 h-full flex flex-col justify-between">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <div className="text-right">
                <div className="text-blue-400 text-sm font-bold">$2.8M</div>
                <div className="text-blue-300 text-xs">Invested</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 left-20 w-36 h-24 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg backdrop-blur-sm border border-purple-500/30 animate-pulse">
            <div className="p-3 h-full flex items-center justify-between">
              <Users className="h-6 w-6 text-purple-400" />
              <div className="text-right">
                <div className="text-purple-400 text-sm font-bold">15,420</div>
                <div className="text-purple-300 text-xs">Investors</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg backdrop-blur-sm border border-yellow-500/30 animate-pulse">
            <div className="p-4 h-full flex flex-col justify-between">
              <Shield className="h-6 w-6 text-yellow-400" />
              <div className="text-right">
                <div className="text-yellow-400 text-sm font-bold">99.9%</div>
                <div className="text-yellow-300 text-xs">Security</div>
              </div>
            </div>
          </div>

          {/* Particle effect */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl text-center relative z-10 px-4">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            {heroSettings.badge_text}
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            <span dangerouslySetInnerHTML={{ __html: heroSettings.title.replace(/умом/g, '<span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">умом</span>').replace(/стабильный/g, '<span class="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">стабильный</span>') }} />
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: heroSettings.subtitle.replace(/ежедневными выплатами/g, '<span class="text-blue-400 font-semibold">ежедневными выплатами</span>').replace(/высокой доходностью/g, '<span class="text-green-400 font-semibold">высокой доходностью</span>').replace(/гарантированной безопасностью/g, '<span class="text-purple-400 font-semibold">гарантированной безопасностью</span>') }} />
          </p>

          {/* CTA Buttons */}
          {heroSettings.show_buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={heroSettings.button1_link}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group"
                >
                  {heroSettings.button1_text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={heroSettings.button2_link}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-600 bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700 px-8 py-4 text-lg font-medium rounded-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {heroSettings.button2_text}
                </Button>
              </Link>
            </div>
          )}

          {/* Stats Preview */}
          {heroSettings.show_stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{heroSettings.stats_users}</div>
                <div className="text-slate-400 text-sm">{heroSettings.stats_users_label}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">{heroSettings.stats_invested}</div>
                <div className="text-slate-400 text-sm">{heroSettings.stats_invested_label}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">{heroSettings.stats_return}</div>
                <div className="text-slate-400 text-sm">{heroSettings.stats_return_label}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">{heroSettings.stats_reliability}</div>
                <div className="text-slate-400 text-sm">{heroSettings.stats_reliability_label}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
