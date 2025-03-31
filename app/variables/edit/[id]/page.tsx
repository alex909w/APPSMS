"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function EditVariablePage({ params }: { params: Promise<{ id: string }> }) {
  // Usamos React.use() para desenvolver params
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [ejemplo, setEjemplo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingVariable, setIsLoadingVariable] = useState(true)

  const { toast } = useToast()
  const router = useRouter()

  // Cargar datos de la variable
  useEffect(() => {
    const fetchVariable = async () => {
      try {
        setIsLoadingVariable(true)
        const response = await fetch(`/api/variables/${id}`)

        if (!response.ok) {
          throw new Error("Error al cargar la variable")
        }

        const data = await response.json()
        if (data.variable) {
          setNombre(data.variable.nombre)
          setDescripcion(data.variable.descripcion)
          setEjemplo(data.variable.ejemplo || "")
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la variable",
        })
      } finally {
        setIsLoadingVariable(false)
      }
    }

    if (id) {
      fetchVariable()
    }
  }, [id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Enviar datos a la API
      const response = await fetch(`/api/variables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          ejemplo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar la variable")
      }

      toast({
        title: "Variable actualizada",
        description: "La variable ha sido actualizada exitosamente",
      })

      // Redireccionar a la lista de variables
      router.push("/variables")
    } catch (error: any) {
      console.error("Error al actualizar la variable:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al actualizar la variable",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingVariable) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Variable</h2>
          <p className="text-muted-foreground">Actualiza los detalles de la variable</p>
        </div>
        <Link href="/variables">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Variables
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles de la Variable</CardTitle>
          <CardDescription>Actualiza los detalles de tu variable</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de la Variable</label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: nombre" required />
              <p className="text-xs text-muted-foreground">
                El nombre debe ser único y sin espacios. Se usará como &lt;nombre&gt; en los mensajes.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Nombre del destinatario"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ejemplo</label>
              <Input value={ejemplo} onChange={(e) => setEjemplo(e.target.value)} placeholder="Ej: Juan" required />
              <p className="text-xs text-muted-foreground">Un valor de ejemplo para mostrar en las vistas previas.</p>
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