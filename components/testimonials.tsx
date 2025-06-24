"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Алексей Петров",
    role: "Инвестор с 2021 года",
    content:
      "Я начал с небольшой суммы и был приятно удивлен стабильностью выплат. Сейчас инвестирую по премиум-плану и полностью доволен результатами.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    id: 2,
    name: "Елена Смирнова",
    role: "Инвестор с 2022 года",
    content:
      "Очень удобный личный кабинет и быстрые выплаты. Техподдержка всегда оперативно отвечает на вопросы. Рекомендую эту платформу всем своим знакомым.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    id: 3,
    name: "Дмитрий Иванов",
    role: "Инвестор с 2020 года",
    content:
      "За три года сотрудничества не было ни одной задержки выплат. Прозрачные условия и понятная система. Планирую увеличить сумму инвестиций в ближайшее время.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    id: 4,
    name: "Ольга Козлова",
    role: "Инвестор с 2022 года",
    content:
      "Долго выбирала платформу для инвестиций и не пожалела, что остановилась на этой. Стабильные выплаты и отличная поддержка клиентов.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
  },
  {
    id: 5,
    name: "Сергей Николаев",
    role: "Инвестор с 2021 года",
    content:
      "Начал с базового тарифа, сейчас перешел на стандарт. Все работает как часы, выплаты приходят вовремя. Очень доволен сотрудничеством.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage,
  )

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Отзывы наших инвесторов</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Узнайте, что говорят о нас люди, которые уже инвестируют на нашей платформе
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-slate-600">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={i === currentIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentIndex(i)}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
