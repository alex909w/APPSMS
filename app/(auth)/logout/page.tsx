"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Error during logout:", error)
      } finally {
        // Redirect to login page regardless of success/failure
        router.push("/")
      }
    }

    logout()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  )
}

