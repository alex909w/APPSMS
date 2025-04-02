"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Upload, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { IconPicker } from "@/components/icon-picker"
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

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  provider?: string
  provider_id?: string
  email_verified: boolean
  profile_icon?: string
  profile_image?: string
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    provider: "",
    profileIcon: "",
    profileImage: "",
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.email) return

      try {
        // Usar la API para obtener el perfil
        const response = await fetch("/api/profile")

        if (response.ok) {
          const user = await response.json()
          setFormData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "user",
            provider: user.provider || "",
            profileIcon: user.profile_icon || "",
            profileImage: user.profile_image || "",
          })
        } else if (response.status === 404 && session.user.name) {
          // Si es un usuario de Google y no existe en la base de datos
          setFormData({
            name: session.user.name || "",
            email: session.user.email || "",
            role: "user",
            provider: "google",
            profileIcon: "",
            profileImage: "",
          })
        } else {
          throw new Error("Error al cargar el perfil")
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del perfil",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [session, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIconChange = (value: string) => {
    setFormData((prev) => ({ ...prev, profileIcon: value, profileImage: "" }))
  }

  const handleUseGoogleImage = () => {
    setFormData((prev) => ({ ...prev, profileIcon: "", profileImage: "" }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar el tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo de imagen válido",
        variant: "destructive",
      })
      return
    }

    // Validar el tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)

      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir la imagen")
      }

      const data = await response.json()

      setFormData((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
        profileIcon: "", // Limpiar el icono cuando se sube una imagen
      }))

      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente",
      })
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!session?.user?.email) throw new Error("No hay sesión activa")

      // Usar la API para actualizar el perfil
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil")
      }

      // Notificar a otros componentes sobre la actualización del perfil
      localStorage.setItem("profileUpdated", Date.now().toString())

      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada correctamente",
      })
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la información del perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generar iniciales para el avatar fallback
  const getInitials = () => {
    if (!formData.name) return "U"
    return formData.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Convertir el valor del icono a un formato compatible con el componente dinámico
  const getIconName = () => {
    if (!formData.profileIcon) {
      return "User"
    }

    try {
      // Convertir kebab-case a PascalCase
      const iconName = formData.profileIcon
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")

      return iconName
    } catch (error) {
      console.error("Error processing icon name:", error)
      return "User"
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  // Determinar qué mostrar en el avatar
  const renderAvatar = () => {
    if (formData.profileImage) {
      // Si el usuario ha subido una imagen personalizada
      return (
        <img
          src={formData.profileImage || "/placeholder.svg"}
          alt="Avatar"
          className="h-full w-full object-cover rounded-full"
        />
      )
    } else if (formData.profileIcon) {
      // Si el usuario ha seleccionado un icono
      return (
        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground rounded-full">
          <DynamicIcon name={getIconName()} className="h-20 w-20" />
        </div>
      )
    } else if (session?.user?.image && formData.provider === "google") {
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
          <DynamicIcon name="User" className="h-20 w-20" />
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mi Perfil</h2>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Imagen de perfil</CardTitle>
            <CardDescription>Selecciona cómo quieres que te vean los demás</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">{renderAvatar()}</Avatar>

            <div className="w-full space-y-4">
              {/* Opciones para usuarios de Google */}
              {formData.provider === "google" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleUseGoogleImage}
                  disabled={!formData.profileIcon && !formData.profileImage}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Usar imagen de Google
                </Button>
              )}

              {/* Opción para subir imagen (todos los usuarios) */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadingImage ? "Subiendo..." : "Subir imagen"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">Formatos: JPG, PNG, GIF. Máximo 5MB.</p>
              </div>

              {/* Selector de iconos (todos los usuarios) */}
              <div className="space-y-2">
                <p className="text-sm font-medium">O selecciona un icono:</p>
                <IconPicker value={formData.profileIcon} onChange={handleIconChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Actualiza tus datos personales</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <Input name="role" value={formData.role} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de cuenta</label>
                <Input
                  name="provider"
                  value={formData.provider ? `Cuenta de ${formData.provider}` : "Cuenta local"}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

