import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <span className="text-xl font-bold text-white">InvestPro</span>
            </div>
            <p className="text-sm">
              Инвестиционная платформа с прозрачными условиями и стабильным доходом для инвесторов по всему миру.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  Команда
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Карьера
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Блог
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Подписка на новости</h3>
            <p className="text-sm">Подпишитесь на нашу рассылку, чтобы получать новости и специальные предложения</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Ваш email" className="bg-slate-800 border-slate-700 text-white" />
              <Button size="sm" className="shrink-0">
                <Mail className="h-4 w-4 mr-2" />
                Подписаться
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 InvestPro. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
