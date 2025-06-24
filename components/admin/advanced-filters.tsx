"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Filter, X, Search, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface FilterState {
  search: string
  status: string
  role: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
  amountMin: string
  amountMax: string
  transactionType: string
  sortBy: string
  sortOrder: string
}

interface AdvancedFiltersProps {
  filterType: 'users' | 'transactions' | 'investments'
  onFiltersChange: (filters: FilterState) => void
  onExport?: () => void
  totalCount?: number
  isLoading?: boolean
}

export function AdvancedFilters({ 
  filterType, 
  onFiltersChange, 
  onExport, 
  totalCount = 0,
  isLoading = false 
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    role: "all",
    dateFrom: undefined,
    dateTo: undefined,
    amountMin: "",
    amountMax: "",
    transactionType: "all",
    sortBy: "created_at",
    sortOrder: "desc"
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      status: "all",
      role: "all",
      dateFrom: undefined,
      dateTo: undefined,
      amountMin: "",
      amountMax: "",
      transactionType: "all",
      sortBy: "created_at",
      sortOrder: "desc"
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.status !== "all") count++
    if (filters.role !== "all") count++
    if (filters.dateFrom || filters.dateTo) count++
    if (filters.amountMin || filters.amountMax) count++
    if (filters.transactionType !== "all") count++
    return count
  }

  const renderUserFilters = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Роль</Label>
          <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все роли</SelectItem>
              <SelectItem value="user">Пользователи</SelectItem>
              <SelectItem value="admin">Администраторы</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Статус</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Сортировка</Label>
          <Select value={`${filters.sortBy}_${filters.sortOrder}`} onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('_')
            updateFilter('sortBy', sortBy)
            updateFilter('sortOrder', sortOrder)
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at_desc">Дата регистрации (новые)</SelectItem>
              <SelectItem value="created_at_asc">Дата регистрации (старые)</SelectItem>
              <SelectItem value="balance_desc">Баланс (убывание)</SelectItem>
              <SelectItem value="balance_asc">Баланс (возрастание)</SelectItem>
              <SelectItem value="total_invested_desc">Инвестировано (убывание)</SelectItem>
              <SelectItem value="total_invested_asc">Инвестировано (возрастание)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderTransactionFilters = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Тип транзакции</Label>
          <Select value={filters.transactionType} onValueChange={(value) => updateFilter('transactionType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="deposit">Пополнения</SelectItem>
              <SelectItem value="withdrawal">Выводы</SelectItem>
              <SelectItem value="investment">Инвестиции</SelectItem>
              <SelectItem value="profit">Прибыль</SelectItem>
              <SelectItem value="referral">Рефералы</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Статус</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="completed">Завершенные</SelectItem>
              <SelectItem value="pending">В ожидании</SelectItem>
              <SelectItem value="failed">Ошибка</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Мин. сумма</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.amountMin}
            onChange={(e) => updateFilter('amountMin', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Макс. сумма</Label>
          <Input
            type="number"
            placeholder="Без ограничений"
            value={filters.amountMax}
            onChange={(e) => updateFilter('amountMax', e.target.value)}
          />
        </div>
      </div>
    </>
  )

  const renderDateFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Дата от</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? format(filters.dateFrom, "PPP", { locale: ru }) : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) => updateFilter('dateFrom', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Дата до</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? format(filters.dateTo, "PPP", { locale: ru }) : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => updateFilter('dateTo', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Фильтры и поиск</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Найдено: {totalCount}
            </span>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Скрыть" : "Показать"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Основной поиск */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по email, имени, ID..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
          {isLoading && (
            <Button variant="outline" size="icon" disabled>
              <RefreshCw className="h-4 w-4 animate-spin" />
            </Button>
          )}
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Очистить
            </Button>
          )}
        </div>

        {/* Расширенные фильтры */}
        {isExpanded && (
          <>
            <Separator />
            <div className="space-y-4">
              {filterType === 'users' && renderUserFilters()}
              {filterType === 'transactions' && renderTransactionFilters()}
              {renderDateFilters()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}