import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Авторизация",
  description: "Авторизация в панель администратора.",
}

export default function AdminLoginPage() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")

  if (token) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <LoginForm />
    </div>
  )
}
