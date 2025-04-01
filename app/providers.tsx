'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

export function Providers({ 
  children,
  session
}: { 
  children: ReactNode
  session?: any
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SessionProvider session={session}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider session={session}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light" // Cambiado de 'system' a 'light' para consistencia inicial
        enableSystem={false} // Deshabilitado para evitar detección automática
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </SessionProvider>
  )
}