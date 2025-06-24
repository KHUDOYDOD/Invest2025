"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Clock, Users, Award, ArrowRight } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Основы инвестирования",
    description: "Изучите базовые принципы инвестирования и управления рисками",
    level: "Начинающий",
    duration: "2 часа",
    students: 1250,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Криптовалютные инвестиции",
    description: "Погрузитесь в мир цифровых активов и блокчейн технологий",
    level: "Средний",
    duration: "3 часа",
    students: 890,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Портфельное управление",
    description: "Научитесь создавать и управлять диверсифицированным портфелем",
    level: "Продвинутый",
    duration: "4 часа",
    students: 650,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function EducationCenter() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-12 ${isVisible ? "animate-slide-down" : "opacity-0"}`}>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Образовательный центр
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Повышайте свою финансовую грамотность с нашими бесплатными курсами
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
          {courses.map((course, index) => (
            <Card
              key={course.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`${
                      course.level === "Начинающий"
                        ? "bg-green-600"
                        : course.level === "Средний"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    } text-white`}
                  >
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-white group-hover:text-yellow-400 transition-colors duration-300">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-slate-300">{course.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-400">
                      <Award className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 group"
                    >
                      Начать курс
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Все курсы
          </Button>
        </div>
      </div>
    </section>
  )
}
