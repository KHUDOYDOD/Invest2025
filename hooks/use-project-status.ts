"use client"

import { useState, useEffect } from "react"
import { isProjectLaunched, getTimeUntilLaunch, getActiveLaunches } from "@/lib/project-status"

export function useProjectStatus() {
  const [isLaunched, setIsLaunched] = useState(false)
  const [timeLeft, setTimeLeft] = useState<any>(null)
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [launched, timeUntilLaunch, activeLaunches] = await Promise.all([
          isProjectLaunched(),
          getTimeUntilLaunch(),
          getActiveLaunches(),
        ])

        setIsLaunched(launched)
        setTimeLeft(timeUntilLaunch)
        setLaunches(activeLaunches)
      } catch (error) {
        console.error("Error checking project status:", error)
        // В случае ошибки считаем проект запущенным
        setIsLaunched(true)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()

    // Обновляем каждую секунду
    const interval = setInterval(checkStatus, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    isLaunched,
    timeLeft,
    launches,
    loading,
  }
}
