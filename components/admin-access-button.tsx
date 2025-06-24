"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function AdminAccessButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Здесь должна быть проверка роли пользователя
    // Для демонстрации используем localStorage
    const userRole = localStorage.getItem("userRole")
    setIsAdmin(userRole === "admin")
  }, [])

  if (!isAdmin) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/admin/dashboard">
        <Button
          size="lg"
          className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-full">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-medium">Админ панель</span>
          </div>
        </Button>
      </Link>
    </div>
  )
}
