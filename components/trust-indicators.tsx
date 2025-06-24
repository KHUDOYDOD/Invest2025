"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Award, Users, Globe, CheckCircle, Star } from "lucide-react"

const trustMetrics = [
  {
    icon: Shield,
    title: "SSL Защита",
    description: "256-битное шифрование",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Award,
    title: "Лицензия",
    description: "Официальная регистрация",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Users,
    title: "15K+ Клиентов",
    description: "Доверяют нам",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Globe,
    title: "127 Стран",
    description: "Мировое присутствие",
    color: "from-orange-500 to-red-600",
  },
]

const certifications = ["ISO 27001 Certified", "PCI DSS Compliant", "GDPR Compliant", "SOC 2 Type II"]

export function TrustIndicators() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-slate-900/90 to-blue-900/90 backdrop-blur-sm border-y border-white/10">
      <div className="container mx-auto max-w-6xl">
        {/* Trust Metrics */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
          {trustMetrics.map((metric, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${metric.color} text-white shadow-lg mb-3`}
                >
                  <metric.icon className="h-6 w-6" />
                </div>
                <h3 className="text-white font-semibold mb-1">{metric.title}</h3>
                <p className="text-slate-400 text-sm">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className={`text-center ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h3 className="text-white font-semibold mb-6 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            Сертификации и соответствие стандартам
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm animate-bounce-subtle"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
