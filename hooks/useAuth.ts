"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  const login = async (username: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        return { success: false, error: result.error }
      }

      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al iniciar sesión" }
    }
  }

  const loginWithProvider = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  const logout = () => {
    signOut({ callbackUrl: "/" })
  }

  return {
    user: session?.user,
    isLoading,
    isAuthenticated,
    login,
    loginWithProvider,
    logout,
  }
}

