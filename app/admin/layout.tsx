"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем аутентификацию из localStorage
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      const isAuth = adminAuth === "true"
      setIsAuthenticated(isAuth)
      setIsLoading(false)

      // Если не аутентифицирован и не на странице логина, перенаправляем на логин
      if (!isAuth && pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    }

    // Выполняем проверку аутентификации
    checkAuth()

    // Добавляем обработчик события хранилища для синхронизации состояния между вкладками
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [pathname, router])

  // Показываем загрузку при проверке аутентификации
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  // Если на странице логина или не аутентифицирован, просто рендерим содержимое
  if (pathname === "/admin/login" || !isAuthenticated) {
    return <>{children}</>
  }

  // Админ-лейаут для аутентифицированных пользователей
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Анимированные элементы фона */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.05%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

      {/* Плавающие частицы */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-twinkle"></div>
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce-subtle opacity-40"></div>

      <AdminHeader />
      <div className="flex relative z-10">
        <AdminSidebar />
        <main className="flex-1 p-6 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
