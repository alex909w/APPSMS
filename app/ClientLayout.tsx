"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname()

  // No mostrar sidebar y navbar en la página de inicio (login)
  const isLoginPage = pathname === "/"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {isLoginPage ? (
        // Layout para la página de login
        <div className="min-h-screen">{children}</div>
      ) : (
        // Layout para el resto de páginas
        <div className="flex min-h-screen">
          <div className="hidden md:block md:w-64">
            <Sidebar />
          </div>
          <div className="flex flex-col flex-1">
            <Navbar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      )}
      <Toaster />
    </ThemeProvider>
  )
}

