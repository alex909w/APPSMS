"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Evita errores de hidratación en SSR
  }

  const isLoginPage = pathname === "/login" // Solo ocultar navbar y sidebar en login

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {isLoginPage ? (
        <div className="min-h-screen flex items-center justify-center">{children}</div>
      ) : (
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
