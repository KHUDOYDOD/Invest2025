"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  icon_type: string
  background_type: string
  color_scheme: string
}

export function ProjectLaunches() {
  const [launches, setLaunches] = useState<ProjectLaunch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch("/api/admin/project-launches")
        if (response.ok) {
          const data = await response.json()
          setLaunches(data.filter((launch: ProjectLaunch) => launch.show_on_site && launch.is_active))
        }
      } catch (error) {
        console.error("Error fetching launches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [])

  // Показываем загрузку
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Если нет запусков - показываем базовое сообщение
  if (launches.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium">
              🚀 Платформа InvestPro готова к работе! Присоединяйтесь к нашим инвесторам
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="pt-20 pb-8 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto max-w-4xl">
        <div className="grid gap-4 md:gap-6">
          {launches.map((launch, index) => (
            <motion.div
              key={launch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/30 backdrop-blur-sm border"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-green-500/20 text-green-400"
                      >
                        <CheckCircle className="h-6 w-6" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{launch.title || launch.name}</h3>
                          <Badge
                            variant="default"
                            className="bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            Запущено
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm">{launch.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-slate-400 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(launch.launch_date).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
