"use client"

import { Bell, Moon, Sun, User, Settings, HelpCircle, LogOut, Lock } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/avatar"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Importar dinámicamente todos los iconos de Lucide React
const DynamicIcon = dynamic(
  () =>
    import("lucide-react").then((mod) => {
      const IconComponent = (props: any) => {
        const { name, ...rest } = props
        const LucideIcon = (mod as any)[name] || mod.User
        return <LucideIcon {...rest} />
      }
      return IconComponent
    }),
  { ssr: false },
)

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState<string | null>(null)

  // Función para cargar el perfil del usuario
  const fetchUserProfile = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        setLoading(true)
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    } else if (status !== "loading") {
      setLoading(false)
    }
  }

  // Cargar el perfil cuando cambia la sesión
  useEffect(() => {
    fetchUserProfile()
  }, [session, status])

  // Escuchar eventos de actualización de perfil
  useEffect(() => {
    // Función para manejar cambios en localStorage
    const handleStorageChange = () => {
      const profileUpdated = localStorage.getItem("profileUpdated")
      if (profileUpdated && profileUpdated !== profileUpdateTrigger) {
        setProfileUpdateTrigger(profileUpdated)
        fetchUserProfile()
      }
    }

    // Configurar un intervalo para verificar cambios en localStorage
    const intervalId = setInterval(handleStorageChange, 1000)

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId)
  }, [profileUpdateTrigger])

  // Convertir el valor del icono a un formato compatible con el componente dinámico
  const getIconName = () => {
    if (!userProfile?.profile_icon) {
      return "User"
    }

    try {
      // Convertir kebab-case a PascalCase
      const iconName = userProfile.profile_icon
        .split("-")
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")

      return iconName
    } catch (error) {
      console.error("Error processing icon name:", error)
      return "User"
    }
  }

  // Generar iniciales para el avatar fallback
  const getInitials = () => {
    if (!session?.user?.name) return "U"
    return session.user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  // Determinar qué mostrar en el avatar
  const renderAvatar = () => {
    if (userProfile?.profile_image) {
      // Si el usuario ha subido una imagen personalizada
      return (
        <img
          src={userProfile.profile_image || "/placeholder.svg"}
          alt="Avatar"
          className="h-full w-full object-cover rounded-full"
        />
      )
    } else if (userProfile?.profile_icon) {
      // Si el usuario ha seleccionado un icono
      return (
        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground rounded-full">
          <DynamicIcon name={getIconName()} className="h-5 w-5" />
        </div>
      )
    } else if (session?.user?.image && userProfile?.provider === "google") {
      // Si es un usuario de Google y no ha seleccionado un icono ni subido una imagen
      return (
        <img
          src={session.user.image || "/placeholder.svg"}
          alt="Avatar"
          className="h-full w-full object-cover rounded-full"
        />
      )
    } else {
      // Fallback para otros casos
      return (
        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground rounded-full">
          <DynamicIcon name="User" className="h-5 w-5" />
        </div>
      )
    }
  }

  return (
    <div className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center gap-4">
          {/* Botón de Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notificaciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>No hay notificaciones nuevas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botón de Cambio de Tema */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>

          {/* Menú de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">{renderAvatar()}</Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {loading ? "Cargando..." : session?.user?.name || "Usuario"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {loading ? "Cargando..." : session?.user?.email || "usuario@ejemplo.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/change-password" className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Cambiar Contraseña</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Ayuda</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

