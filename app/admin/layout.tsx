
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-500" />
        </div>
        
        {/* Загрузочный спиннер */}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium animate-pulse">Загружаем админ панель...</div>
        </div>
      </div>
    )
  }

  // Если на странице логина или не аутентифицирован, просто рендерим содержимое
  if (pathname === "/admin/login" || !isAuthenticated) {
    return <>{children}</>
  }

  // Админ-лейаут для аутентифицированных пользователей
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Анимированные элементы фона */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500" />
        
        {/* Плавающие частицы */}
        <div className="absolute top-40 left-1/4 w-2 h-2 bg-blue-400/50 rounded-full animate-float" />
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-purple-400/50 rounded-full animate-float delay-300" />
        <div className="absolute bottom-40 left-2/3 w-3 h-3 bg-pink-400/50 rounded-full animate-float delay-700" />
      </div>

      <AdminHeader />
      <div className="flex relative z-10">
        <AdminSidebar />
        <main className="flex-1 p-6 backdrop-blur-sm overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[calc(100vh-8rem)] transition-all duration-300 hover:bg-slate-900/60">
              {children}
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }

        /* Кастомный скроллбар */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
