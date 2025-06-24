"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Ban, Mail, Users } from "lucide-react"

// Пустой массив вместо mock данных
const mockUsers: any[] = []

interface UsersListProps {
  searchQuery?: string
  filter?: string
}

export function UsersList({ searchQuery = "", filter = "all" }: UsersListProps) {
  const [users, setUsers] = useState(mockUsers)

  // Filter users based on search query and filter
  const filteredUsers = users.filter((user) => {
    // Filter by search query
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && user.status === "active") ||
      (filter === "blocked" && user.status === "blocked") ||
      (filter === "new" && user.status === "new")

    return matchesSearch && matchesFilter
  })

  const handleBlockUser = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "blocked" ? "active" : "blocked" } : user,
      ),
    )
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="h-12 px-4 text-left font-medium">ID</th>
            <th className="h-12 px-4 text-left font-medium">Имя</th>
            <th className="h-12 px-4 text-left font-medium">Email</th>
            <th className="h-12 px-4 text-left font-medium">Регистрация</th>
            <th className="h-12 px-4 text-left font-medium">Последний вход</th>
            <th className="h-12 px-4 text-left font-medium">Статус</th>
            <th className="h-12 px-4 text-left font-medium">Баланс</th>
            <th className="h-12 px-4 text-left font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-4 align-middle">{user.id}</td>
                <td className="p-4 align-middle">{user.name}</td>
                <td className="p-4 align-middle">{user.email}</td>
                <td className="p-4 align-middle">{new Date(user.registrationDate).toLocaleDateString("ru-RU")}</td>
                <td className="p-4 align-middle">{new Date(user.lastLogin).toLocaleDateString("ru-RU")}</td>
                <td className="p-4 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "blocked"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.status === "active" ? "Активен" : user.status === "blocked" ? "Заблокирован" : "Новый"}
                  </span>
                </td>
                <td className="p-4 align-middle">${user.balance.toFixed(2)}</td>
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Редактировать</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Отправить сообщение</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                        <Ban className="mr-2 h-4 w-4" />
                        <span>{user.status === "blocked" ? "Разблокировать" : "Заблокировать"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Удалить</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-8 text-center">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Нет пользователей</h3>
                <p className="text-slate-500">Пользователи будут отображаться здесь после регистрации</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
