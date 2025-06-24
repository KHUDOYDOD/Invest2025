"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">InvestPro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/90 hover:text-white transition-colors text-sm">
              Главная
            </Link>
            <Link href="/#plans" className="text-white/90 hover:text-white transition-colors text-sm">
              Тарифы
            </Link>
            <Link href="/#about" className="text-white/90 hover:text-white transition-colors text-sm">
              О нас
            </Link>
            <Link href="/#contact" className="text-white/90 hover:text-white transition-colors text-sm">
              Контакты
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 text-sm"
              >
                Войти
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 text-sm">
                Регистрация
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Главная
              </Link>
              <Link href="/#plans" className="text-white/80 hover:text-white transition-colors">
                Тарифы
              </Link>
              <Link href="/#about" className="text-white/80 hover:text-white transition-colors">
                О нас
              </Link>
              <Link href="/#contact" className="text-white/80 hover:text-white transition-colors">
                Контакты
              </Link>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Войти
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Регистрация
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
