
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail, ArrowUp, Zap, Shield, Users, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const socialIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  const features = [
    { icon: Shield, text: "Безопасность гарантирована", color: "from-blue-400 to-cyan-400" },
    { icon: Zap, text: "Быстрые выплаты 24/7", color: "from-yellow-400 to-orange-400" },
    { icon: Users, text: "100,000+ инвесторов", color: "from-purple-400 to-pink-400" },
    { icon: TrendingUp, text: "Стабильный рост", color: "from-green-400 to-emerald-400" }
  ]

  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-600/20 to-blue-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* Features Banner */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="relative z-10 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-white">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="relative z-10 container mx-auto px-4 py-16"
      >
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <div className="w-6 h-6 bg-white rounded-lg"></div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-sm"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                InvestPro
              </span>
            </motion.div>
            
            <p className="text-slate-400 leading-relaxed">
              Инвестиционная платформа с прозрачными условиями и стабильным доходом для инвесторов по всему миру.
            </p>
            
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-300 group"
                >
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-bold text-xl text-white relative">
              Компания
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", text: "О нас" },
                { href: "/team", text: "Команда" },
                { href: "/careers", text: "Карьера" },
                { href: "/contacts", text: "Контакты" }
              ].map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                    <span>{link.text}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Information Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-bold text-xl text-white relative">
              Информация
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.7 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/terms", text: "Условия использования" },
                { href: "/privacy", text: "Политика конфиденциальности" },
                { href: "/faq", text: "FAQ" },
                { href: "/blog", text: "Блог" }
              ].map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                    <span>{link.text}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-bold text-xl text-white relative">
              Подписка на новости
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.9 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500"
              />
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Подпишитесь на нашу рассылку, чтобы получать новости и специальные предложения
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="space-y-3"
            >
              <Input 
                type="email" 
                placeholder="Ваш email" 
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-300" 
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Mail className="h-4 w-4 mr-2" />
                  Подписаться
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 border-t border-slate-800/50 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-slate-400 text-center md:text-left"
            >
              © 2024 InvestPro. Все права защищены.
            </motion.p>
            
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ArrowUp className="h-5 w-5 group-hover:animate-bounce" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
