"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Eliminar el estado de autenticación
    localStorage.removeItem("isAuthenticated")

    // Redireccionar a la página principal
    router.push("/")
  }

  return (
    <Button
      variant="ghost"
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Cerrar Sesión
    </Button>
  )
}

