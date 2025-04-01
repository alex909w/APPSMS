"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CreateGroupPage() {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Enviar datos a la API
      const response = await fetch("/api/grupos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear el grupo")
      }

      const data = await response.json()

      toast({
        title: "Grupo creado",
        description: "El grupo ha sido creado exitosamente",
      })

      // Redireccionar a los detalles del grupo
      router.push(`/contacts/groups/${data.id}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error al crear el grupo:", error)
      toast({
        title: "Error",
        description: error.message || "Error al crear el grupo",
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
          <h2 className="text-2xl font-bold tracking-tight">Crear Nuevo Grupo</h2>
          <p className="text-muted-foreground">Crea un nuevo grupo para organizar tus contactos</p>
        </div>
        <Link href="/contacts?tab=groups">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Grupos
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles del Grupo</CardTitle>
          <CardDescription>Ingresa la información del nuevo grupo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del Grupo</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Clientes VIP"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Grupo para clientes con membresía VIP"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>Creando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear Grupo
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

