import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InvestmentPlans } from "@/components/investment-plans"
import { Features } from "@/components/features"
import { Statistics } from "@/components/statistics"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ProfitCalculator } from "@/components/profit-calculator"
import { LiveChat } from "@/components/live-chat"
import { NewsSection } from "@/components/news-section"

import { MobileApp } from "@/components/mobile-app"
import { TrustIndicators } from "@/components/trust-indicators"
import { LiveActivityFeed } from "@/components/live-activity-feed"
import { UserActivityRows } from "@/components/user-activity-rows"
import { ProjectLaunches } from "@/components/project-launches"
import { AdminAccessButton } from "@/components/admin-access-button"
import { EducationCenter } from "@/components/education-center"
import { NewUsersShowcase } from "@/components/new-users-showcase"


export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />

      {/* Project Launches - positioned below header */}
      <ProjectLaunches />

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Indicators */}
      <div className="relative z-10">
        <TrustIndicators />
      </div>

      {/* Platform Statistics */}
      <div className="relative z-10">
        <PlatformStatistics />
      </div>

      {/* User Activity Rows */}
      <div className="relative z-10">
        <UserActivityRows />
      </div>

      {/* New Users Showcase */}
      <div className="relative z-10">
        <NewUsersShowcase />
      </div>

      {/* Live Activity Feed */}
      <div className="relative z-10">
        <LiveActivityFeed />
      </div>

      {/* Platform Statistics */}
      <div className="relative z-10">
        <PlatformStatistics />
      </div>

      {/* Statistics */}
      <div className="relative z-10">
        <Statistics />
      </div>

      {/* Profit Calculator */}
      <section className="py-20 px-4 relative z-10 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Калькулятор доходности
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Рассчитайте потенциальную прибыль от ваших инвестиций
            </p>
          </div>
          <ProfitCalculator />
        </div>
      </section>



      {/* Investment Plans */}
      <section id="plans" className="py-20 px-4 bg-slate-100 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <InvestmentPlans />
        </div>
      </section>

      {/* Features */}
      <div className="relative z-10">
        <Features />
      </div>

      {/* News Section */}
      <div className="relative z-10">
        <NewsSection />
      </div>

      {/* Education Center */}
      <div className="relative z-10">
        <EducationCenter />
      </div>

      {/* Mobile App */}
      <div className="relative z-10">
        <MobileApp />
      </div>

      {/* Testimonials */}
      <div className="relative z-10">
        <Testimonials />
      </div>

      {/* FAQ */}
      <div className="relative z-10">
        <FAQ />
      </div>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Готовы начать инвестировать?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Присоединяйтесь к тысячам инвесторов, которые уже зарабатывают с нашей платформой
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Создать аккаунт
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                Войти в систему
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Live Chat */}
      <LiveChat />

      {/* Admin Access Button - only visible for admin users */}
      <AdminAccessButton />
    </div>
  )
}