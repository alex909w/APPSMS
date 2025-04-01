"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    // Registrar el error para depuración
    if (error) {
      console.error("Error de autenticación:", error)
    }
  }, [error])

  // Mapeo de códigos de error a mensajes amigables
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return "Hay un problema con la configuración del servidor de autenticación."
      case "AccessDenied":
        return "No tienes permiso para acceder a este recurso."
      case "Verification":
        return "El enlace de verificación ha expirado o ya ha sido utilizado."
      case "OAuthSignin":
        return "Error al iniciar el proceso de autenticación con el proveedor."
      case "OAuthCallback":
        return "Error al procesar la respuesta del proveedor de autenticación."
      case "OAuthCreateAccount":
        return "No se pudo crear una cuenta de usuario con el proveedor de autenticación."
      case "EmailCreateAccount":
        return "No se pudo crear una cuenta de usuario con el correo electrónico proporcionado."
      case "Callback":
        return "Error en el proceso de autenticación."
      case "OAuthAccountNotLinked":
        return "Este correo ya está asociado a otra cuenta. Inicia sesión con tu método habitual."
      case "EmailSignin":
        return "Error al enviar el correo de verificación."
      case "CredentialsSignin":
        return "Las credenciales proporcionadas no son válidas."
      case "SessionRequired":
        return "Debes iniciar sesión para acceder a este recurso."
      default:
        return "Se produjo un error durante el proceso de autenticación. Por favor, intenta de nuevo."
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Error de Autenticación</CardTitle>
          <CardDescription className="text-center">{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <p>Código de error: {error || "Desconocido"}</p>
            <p className="mt-2">Si el problema persiste, por favor contacta al soporte técnico.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button>Volver al inicio de sesión</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

