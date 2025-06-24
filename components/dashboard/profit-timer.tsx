"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, Zap, DollarSign, Sparkles, Target, ArrowUp, Timer, Coins } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export function ProfitTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [nextAccrual, setNextAccrual] = useState<Date | null>(null)
  const [isActive, setIsActive] = useState(true)
  const [totalDailyProfit, setTotalDailyProfit] = useState(67.45)
  const [isAnimating, setIsAnimating] = useState(false)
  const [totalEarned, setTotalEarned] = useState(1247.85)

  useEffect(() => {
    // Получаем время последнего начисления
    const lastAccrualStr = localStorage.getItem("lastProfitAccrual")
    const lastAccrual = lastAccrualStr ? new Date(lastAccrualStr) : new Date(Date.now() - 22 * 60 * 60 * 1000) // 22 часа назад для демо

    // Следующее начисление через 24 часа
    const nextAccrualTime = new Date(lastAccrual.getTime() + 24 * 60 * 60 * 1000)
    setNextAccrual(nextAccrualTime)

    const timer = setInterval(() => {
      const now = new Date()
      const diff = nextAccrualTime.getTime() - now.getTime()

      if (diff <= 0) {
        // Время начислить прибыль!
        accrueProfit()

        // Устанавливаем следующее время начисления
        const newNextAccrual = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        setNextAccrual(newNextAccrual)
        localStorage.setItem("lastProfitAccrual", now.toISOString())
      } else {
        // Обновляем таймер
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [nextAccrual])

  const accrueProfit = async () => {
    setIsAnimating(true)

    try {
      // Локальное начисление
      const currentBalance = Number(localStorage.getItem("userBalance") || "25000")
      const newBalance = currentBalance + totalDailyProfit
      localStorage.setItem("userBalance", newBalance.toString())

      setTotalEarned((prev) => prev + totalDailyProfit)

      toast.success(`🎉 Прибыль начислена: $${totalDailyProfit.toFixed(2)}`, {
        description: "Следующее начисление через 24 часа",
        duration: 5000,
      })

      setTimeout(() => setIsAnimating(false), 2000)
    } catch (error) {
      console.error("Error accruing profit:", error)
      toast.error("Ошибка при начислении прибыли")
      setTimeout(() => setIsAnimating(false), 2000)
    }
  }

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0")
  }

  const manualAccrue = () => {
    if (timeLeft.hours <= 1 && timeLeft.minutes <= 30) {
      accrueProfit()
    } else {
      toast.error("Ручное начисление доступно за 1.5 часа до автоматического")
    }
  }

  return (
    <div className="space-y-6">
      {/* Основная карточка таймера */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-0 shadow-2xl">
        {/* Анимированный фон */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.1%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        {/* Плавающие частицы */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-8 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-40"></div>

        <CardContent className="relative p-8">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative"
                animate={isAnimating ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Timer className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-2xl mb-1">Умное начисление</h3>
                <p className="text-cyan-200 text-lg">Автоматическая прибыль каждые 24 часа</p>
              </div>
            </div>
            <Badge className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              АКТИВНО
            </Badge>
          </div>

          {/* Таймер */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { value: timeLeft.hours, label: "Часов", color: "from-cyan-500 to-blue-600" },
              { value: timeLeft.minutes, label: "Минут", color: "from-purple-500 to-pink-600" },
              { value: timeLeft.seconds, label: "Секунд", color: "from-pink-500 to-rose-600" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div
                  className={`bg-gradient-to-br ${item.color} p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm group-hover:scale-105 transition-all duration-300`}
                >
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.2, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-black text-white font-mono mb-2 drop-shadow-lg">
                      {formatTime(item.value)}
                    </div>
                    <div className="text-sm font-semibold text-white/90 uppercase tracking-wider">{item.label}</div>
                  </motion.div>
                  <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Статистика прибыли */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl p-6 border border-emerald-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500/30 rounded-xl">
                    <Target className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-emerald-200 font-semibold text-lg">Следующая прибыль</h4>
                    <p className="text-emerald-100 text-sm">
                      Через {timeLeft.hours}ч {timeLeft.minutes}м
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400">${totalDailyProfit.toFixed(2)}</div>
                  <div className="text-emerald-300 text-sm">ожидается</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500/30 rounded-xl">
                    <Coins className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-purple-200 font-semibold text-lg">Всего заработано</h4>
                    <p className="text-purple-100 text-sm">За все время</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-400">${totalEarned.toFixed(2)}</div>
                  <div className="text-purple-300 text-sm">прибыль</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-cyan-200">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Автоматическое начисление</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-200">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Без комиссий</span>
              </div>
            </div>

            {timeLeft.hours <= 1 && timeLeft.minutes <= 30 && (
              <Button
                onClick={manualAccrue}
                disabled={isAnimating}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg border-0 transition-all duration-300"
              >
                {isAnimating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Начисление...
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Получить сейчас
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Информация о следующем начислении */}
          {nextAccrual && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span className="text-white/70">Следующее автоначисление:</span>
                <span className="text-cyan-300 font-semibold">
                  {nextAccrual.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Анимация при начислении */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-white/10 rounded-full p-8"
              >
                <DollarSign className="h-16 w-16 text-green-400" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
