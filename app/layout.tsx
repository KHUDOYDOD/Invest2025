import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/components/settings-provider"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InvestPro - Профессиональная инвестиционная платформа",
  description: "Инвестируйте с умом, получайте стабильный доход",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SettingsProvider>{children}</SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
