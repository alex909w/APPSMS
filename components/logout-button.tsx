"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <Button onClick={handleLogout} variant="destructive" className="w-full">
      Cerrar Sesión
    </Button>
  )
}

