"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Edit, Trash2, Star, User, Building } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  avatar_url: string
  rating: number
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    content: "",
    avatar_url: "",
    rating: 5,
    is_featured: false,
    is_active: true,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials")
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить отзывы",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial.id}` : "/api/admin/testimonials"

      const method = editingTestimonial ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Успешно",
          description: editingTestimonial ? "Отзыв обновлен" : "Отзыв создан",
        })
        setDialogOpen(false)
        resetForm()
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить отзыв",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот отзыв?")) return

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Отзыв удален",
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить отзыв",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      company: "",
      content: "",
      avatar_url: "",
      rating: 5,
      is_featured: false,
      is_active: true,
    })
    setEditingTestimonial(null)
  }

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      content: testimonial.content,
      avatar_url: testimonial.avatar_url,
      rating: testimonial.rating,
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active,
    })
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление отзывами</h1>
          <p className="text-muted-foreground">Управление пользовательскими отзывами и рекомендациями</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить отзыв
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? "Редактировать отзыв" : "Новый отзыв"}</DialogTitle>
              <DialogDescription>Заполните информацию об отзыве</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Должность</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Компания</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Рейтинг</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} звезд
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL аватара</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Текст отзыва</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Рекомендуемый</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Активный</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSubmit}>{editingTestimonial ? "Обновить" : "Создать"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    {testimonial.avatar_url ? (
                      <img
                        src={testimonial.avatar_url || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {testimonial.position} в {testimonial.company}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  {testimonial.is_featured && <Badge variant="default">Рекомендуемый</Badge>}
                  <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                    {testimonial.is_active ? "Активен" : "Неактивен"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{testimonial.content}</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(testimonial)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
