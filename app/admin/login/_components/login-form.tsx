"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка входа")
      }

      // Сохраняем состояние аутентификации в localStorage
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminUser", JSON.stringify(data.user))

      // Успешный вход - перенаправляем на панель управления
      router.push("/admin/dashboard")
    } catch (err: any) {
      setError(err.message || "Ошибка входа. Пожалуйста, проверьте учетные данные.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Icons.shield className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Вход в админ-панель</CardTitle>
        <CardDescription className="text-center">
          Введите свои учетные данные для доступа к панели администратора
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                placeholder="Admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <Button variant="link" className="p-0 h-auto text-xs" type="button">
                  Забыли пароль?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.refresh className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-muted-foreground text-center">
          Это защищенная область. Только авторизованные администраторы имеют доступ.
        </div>
      </CardFooter>
    </Card>
  )
}
