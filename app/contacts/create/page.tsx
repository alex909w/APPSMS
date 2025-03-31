"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CreateContactPage() {
  const [telefono, setTelefono] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [correo, setCorreo] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Enviar datos a la API
      const response = await fetch("/api/contactos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telefono,
          nombre,
          apellido,
          correo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear el contacto")
      }

      toast({
        title: "Contacto creado",
        description: "El contacto ha sido creado exitosamente",
      })

      // Redireccionar a la lista de contactos
      router.push("/contacts")
      router.refresh()
    } catch (error: any) {
      console.error("Error al crear el contacto:", error)
      toast({
        title: "Error",
        description: error.message || "Error al crear el contacto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nuevo Contacto</h2>
          <p className="text-muted-foreground">Añade un nuevo contacto para envío de SMS</p>
        </div>
        <Link href="/contacts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Contactos
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles del Contacto</CardTitle>
          <CardDescription>Ingresa la información del nuevo contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: +34612345678"
                required
              />
              <p className="text-xs text-muted-foreground">
                Ingresa el número de teléfono completo con el código de país.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Juan" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Apellido</label>
              <Input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ej: Pérez" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Correo Electrónico</label>
              <Input
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ej: juan@example.com"
                type="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Contacto
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

