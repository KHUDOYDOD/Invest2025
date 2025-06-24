"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("AuthGuard: Checking authentication...")

        const userEmail = localStorage.getItem("userEmail")
        const isAuth = localStorage.getItem("isAuthenticated")

        console.log("AuthGuard: User email:", userEmail)

        if (!userEmail || !isAuth) {
          console.log("AuthGuard: No authentication found")
          setError("Пользователь не авторизован")
          setIsLoading(false)
          return
        }

        console.log("AuthGuard: User authenticated successfully")
        setIsAuthenticated(true)
        setError(null)
      } catch (error) {
        console.error("AuthGuard: Auth check error:", error)
        setError("Ошибка проверки авторизации")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  if (error || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-xl mb-4">{error || "Требуется авторизация"}</div>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Перейти к авторизации
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
