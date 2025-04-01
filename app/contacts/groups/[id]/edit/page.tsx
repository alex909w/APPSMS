"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const { toast } = useToast()
  const router = useRouter()

  // Cargar el ID del grupo
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params
        setId(resolvedParams.id)
      } catch (error) {
        console.error("Error al cargar parámetros:", error)
      }
    }

    loadParams()
  }, [params])

  // Cargar datos del grupo
  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) return

      try {
        setIsLoadingData(true)
        const response = await fetch(`/api/grupos/${id}`)

        if (!response.ok) {
          throw new Error("Error al cargar el grupo")
        }

        const data = await response.json()

        if (data.grupo) {
          setNombre(data.grupo.nombre)
          setDescripcion(data.grupo.descripcion || "")
        }
      } catch (error) {
        console.error("Error al cargar el grupo:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del grupo",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    if (id) {
      fetchGroup()
    }
  }, [id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id) {
      toast({
        title: "Error",
        description: "ID de grupo no disponible",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Enviar datos a la API
      const response = await fetch(`/api/grupos/${id}`, {
        method: "PUT",
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
        throw new Error(errorData.error || "Error al actualizar el grupo")
      }

      toast({
        title: "Grupo actualizado",
        description: "El grupo ha sido actualizado exitosamente",
      })

      // Redireccionar a los detalles del grupo
      router.push(`/contacts/groups/${id}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error al actualizar el grupo:", error)
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el grupo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando datos del grupo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Grupo</h2>
          <p className="text-muted-foreground">Actualiza la información del grupo</p>
        </div>
        {id && (
          <Link href={`/contacts/groups/${id}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Grupo
            </Button>
          </Link>
        )}
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles del Grupo</CardTitle>
          <CardDescription>Actualiza los detalles del grupo</CardDescription>
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
  )
}

