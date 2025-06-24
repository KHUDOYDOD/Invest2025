"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Удаляем данные аутентификации из localStorage
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")

    // Перенаправляем на страницу входа
    router.push("/admin/login")
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="text-red-400 hover:bg-red-500/20 cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Выйти</span>
    </Button>
  )
}
