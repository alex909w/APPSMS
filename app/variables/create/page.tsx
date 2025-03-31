"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateVariablePage() {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [ejemplo, setEjemplo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Enviar datos a la API
      const response = await fetch("/api/variables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          ejemplo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Mostrar un mensaje de error más seguro
        setErrorMessage(
          typeof data === "object" && data !== null && "error" in data
            ? String(data.error)
            : "Error al crear la variable. Por favor, inténtalo de nuevo.",
        )

        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo crear la variable. Por favor, inténtalo de nuevo.",
        })
        return
      }

      toast({
        title: "Variable creada",
        description: "La variable ha sido creada exitosamente",
      })

      // Redireccionar a la lista de variables
      router.push("/variables")
      router.refresh()
    } catch (error: any) {
      console.error("Error al crear la variable:", error)

      // Guardar el mensaje de error para mostrarlo en la interfaz
      setErrorMessage("Error de conexión. Por favor, verifica tu conexión e inténtalo de nuevo.")

      toast({
        variant: "destructive",
        title: "Error",
        description: "Error de conexión. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nueva Variable</h2>
          <p className="text-muted-foreground">Crea una nueva variable para tus mensajes SMS</p>
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
          <CardDescription>Configura los detalles de tu nueva variable</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

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
                  Guardar Variable
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}