"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CreateTemplatePage() {
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [variables, setVariables] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Cargar variables disponibles
  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await fetch("/api/variables")
        if (!response.ok) {
          throw new Error("Error al cargar variables")
        }
        const data = await response.json()
        setVariables(data.variables || [])
      } catch (err: any) {
        console.error("Error al cargar variables:", err)
      }
    }

    fetchVariables()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Asumimos que el usuario con ID 1 es el creador (en una aplicación real, esto vendría del contexto de autenticación)
      const userId = 1

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, content, userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al crear la plantilla")
      }

      router.push("/dashboard/templates")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const insertVariable = (variableName: string) => {
    setContent((prev) => `${prev} <${variableName}>`)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crear Nueva Plantilla</h1>
        <Link href="/dashboard/templates">
          <Button variant="outline">Volver a Plantillas</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Nueva Plantilla</CardTitle>
            <CardDescription>Crea una nueva plantilla para tus mensajes SMS</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre de la Plantilla
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Plantilla de bienvenida"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Contenido del Mensaje
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe tu mensaje aquí. Usa <variable> para insertar variables."
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ejemplo: Hola &lt;nombre&gt;, bienvenido a nuestro servicio.
                </p>
              </div>

              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Plantilla"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variables Disponibles</CardTitle>
            <CardDescription>Haz clic en una variable para insertarla en tu mensaje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variables.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable) => (
                    <Badge
                      key={variable.id}
                      className="cursor-pointer hover:bg-primary"
                      onClick={() => insertVariable(variable.name)}
                    >
                      {variable.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay variables disponibles. Crea algunas primero.</p>
              )}

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Información</h4>
                <p className="text-xs text-muted-foreground">
                  Las variables se insertan en el formato &lt;nombre_variable&gt; y serán reemplazadas con valores
                  reales al enviar el mensaje.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

