"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UsersList } from "@/components/admin/users-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, Download, Upload } from "lucide-react"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Управление пользователями</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Добавить пользователя
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Пользователи</CardTitle>
          <CardDescription>Управление пользователями платформы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск пользователей..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Импорт
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Все пользователи</TabsTrigger>
              <TabsTrigger value="active">Активные</TabsTrigger>
              <TabsTrigger value="blocked">Заблокированные</TabsTrigger>
              <TabsTrigger value="new">Новые</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <UsersList searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <UsersList searchQuery={searchQuery} filter="active" />
            </TabsContent>
            <TabsContent value="blocked" className="mt-4">
              <UsersList searchQuery={searchQuery} filter="blocked" />
            </TabsContent>
            <TabsContent value="new" className="mt-4">
              <UsersList searchQuery={searchQuery} filter="new" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
