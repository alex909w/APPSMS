"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResendMessagePage({ params }: { params: { id: string } }) {
  const id = params.id

  const [telefono, setTelefono] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessage, setIsLoadingMessage] = useState(true)
  const [success, setSuccess] = useState<{ message: string; details: any } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Añadir estado para el estado simulado
  const [estadoSimulado, setEstadoSimulado] = useState("enviado")

  const { toast } = useToast()
  const router = useRouter()

  // Cargar datos del mensaje original
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoadingMessage(true)
        const response = await fetch(`/api/mensajes/${id}`)

        if (!response.ok) {
          throw new Error("Error al cargar el mensaje")
        }

        const data = await response.json()
        if (data.mensaje) {
          setTelefono(data.mensaje.telefono)
          setMensaje(data.mensaje.contenido_mensaje)
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el mensaje original",
        })
      } finally {
        setIsLoadingMessage(false)
      }
    }

    if (id) {
      fetchMessage()
    }
  }, [id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      // Enviar mensaje con estado simulado
      const response = await fetch("/api/mensajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telefono,
          contenido: mensaje,
          estadoSimulado, // Incluir el estado simulado
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al enviar el mensaje")
      }

      const data = await response.json()

      setSuccess({
        message: "El mensaje ha sido reenviado exitosamente",
        details: data.details,
      })

      toast({
        title: "Mensaje reenviado",
        description: "El mensaje ha sido reenviado exitosamente",
      })
    } catch (error: any) {
      console.error("Error al enviar el mensaje:", error)
      setError(error.message || "Error al enviar el mensaje")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al enviar el mensaje",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingMessage) {
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
          <h2 className="text-2xl font-bold tracking-tight">Reenviar Mensaje</h2>
          <p className="text-muted-foreground">Reenvía un mensaje existente con posibles modificaciones</p>
        </div>
        <Link href={`/messages/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Detalles
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Reenviar Mensaje</CardTitle>
          <CardDescription>Puedes modificar el destinatario o el contenido antes de reenviar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono del Destinatario</label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: +34612345678"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido del Mensaje</label>
              <Textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe el contenido del mensaje"
                rows={6}
                required
              />
            </div>

            {/* Añadir selector de estado simulado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado Simulado (Solo para pruebas)</label>
              <Select value={estadoSimulado} onValueChange={setEstadoSimulado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                  <SelectItem value="fallido">Fallido</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Esto te permite simular diferentes estados para probar las estadísticas.
              </p>
            </div>

            {success && (
              <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-600 dark:text-green-400">Mensaje reenviado</AlertTitle>
                <AlertDescription className="text-green-600 dark:text-green-400">
                  {success.message}
                  {success.details && (
                    <div className="mt-2 text-xs">
                      <p>Estado: {success.details.estado}</p>
                      <p>Fecha: {new Date(success.details.fecha).toLocaleString()}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Reenviar Mensaje
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}