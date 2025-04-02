"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar el error cuando el usuario comienza a escribir
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido actualizada correctamente",
        })

        // Limpiar el formulario
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setError(data.error || "Error al cambiar la contraseña")
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cambiar Contraseña</h2>
          <p className="text-muted-foreground">Actualiza tu contraseña de acceso</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Introduce tu contraseña actual y la nueva contraseña para actualizarla</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña Actual</label>
              <Input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Introduce tu contraseña actual"
              />
              <p className="text-xs text-muted-foreground">Para usuarios nuevos o de Google, puede dejarse en blanco</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nueva Contraseña</label>
              <Input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Introduce tu nueva contraseña"
              />
              <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 6 caracteres</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar Nueva Contraseña</label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirma tu nueva contraseña"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>Actualizando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Actualizar Contraseña
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

