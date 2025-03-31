"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "Ha ocurrido un error durante la autenticación."

  // Personalizar mensajes de error
  switch (error) {
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
      errorMessage = "Hubo un problema con el proveedor de autenticación."
      break
    case "Callback":
      errorMessage = "Hubo un problema durante el proceso de autenticación."
      break
    case "OAuthAccountNotLinked":
      errorMessage = "Esta cuenta ya está vinculada a otro método de inicio de sesión."
      break
    case "EmailSignin":
      errorMessage = "El enlace de inicio de sesión por correo electrónico no es válido o ha expirado."
      break
    case "CredentialsSignin":
      errorMessage = "Las credenciales proporcionadas no son válidas."
      break
    case "SessionRequired":
      errorMessage = "Debes iniciar sesión para acceder a esta página."
      break
    default:
      errorMessage = "Ha ocurrido un error durante la autenticación."
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error de autenticación</CardTitle>
            </div>
            <CardDescription>Se ha producido un error durante el proceso de autenticación.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

