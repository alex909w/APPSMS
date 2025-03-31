import { getMensajeById } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"

interface Props {
  params: {
    id: string
  }
}

export default async function MessageDetailsPage({ params }: Props) {
  const id = params.id

  // Validar que el ID sea un número
  const numericId = Number.parseInt(id)
  if (isNaN(numericId)) {
    notFound()
  }

  // Obtener los detalles del mensaje
  const mensaje = await getMensajeById(numericId)

  if (!mensaje) {
    notFound()
  }

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "enviado":
        return "bg-blue-500"
      case "entregado":
        return "bg-green-500"
      case "fallido":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "enviado":
        return "Enviado"
      case "entregado":
        return "Entregado"
      case "fallido":
        return "Fallido"
      default:
        return "Pendiente"
    }
  }

  // Parsear las variables usadas (si existen)
  let variablesUsadas = {}
  try {
    if (mensaje.variables_usadas) {
      // Verificar si variables_usadas ya es un objeto o es una cadena JSON
      if (typeof mensaje.variables_usadas === "string") {
        variablesUsadas = JSON.parse(mensaje.variables_usadas)
      } else if (typeof mensaje.variables_usadas === "object") {
        variablesUsadas = mensaje.variables_usadas
      }
    }
  } catch (error) {
    console.error("Error al parsear variables usadas:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Detalles del Mensaje</h2>
          <p className="text-muted-foreground">Información detallada del mensaje enviado</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Mensajes
            </Button>
          </Link>
          <Link href={`/messages/${id}/resend`}>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Reenviar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contenido del Mensaje</CardTitle>
            <CardDescription>Texto enviado al destinatario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted/50 p-4 text-sm break-words">
              <p className="whitespace-pre-wrap">{mensaje.contenido_mensaje}</p>
            </div>

            {Object.keys(variablesUsadas).length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Variables Utilizadas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(variablesUsadas).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm font-medium">{key}:</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Mensaje</CardTitle>
              <CardDescription>Detalles y estado del mensaje</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID del Mensaje</p>
                <p>{mensaje.id}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Destinatario</p>
                <p>{mensaje.telefono}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge className={getStatusColor(mensaje.estado)}>{getStatusText(mensaje.estado)}</Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Fecha de Envío</p>
                <p>{new Date(mensaje.fecha_envio).toLocaleString()}</p>
              </div>

              {mensaje.plantilla_id && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Plantilla Utilizada</p>
                  <p>{mensaje.nombre_plantilla || `ID: ${mensaje.plantilla_id}`}</p>
                </div>
              )}

              {mensaje.enviado_por_id && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Enviado Por ID</p>
                  <p>{mensaje.enviado_por_id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
              <CardDescription>Operaciones disponibles para este mensaje</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href={`/messages/${id}/resend`} className="w-full">
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Reenviar Mensaje
                </Button>
              </Link>

              <Link href={`/admin/mensajes?id=${id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cambiar Estado
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {mensaje.estado === "fallido" && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Información de Error</CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              Este mensaje no pudo ser entregado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-400">
              El mensaje falló durante el envío. Puedes intentar reenviarlo o contactar al soporte técnico si el
              problema persiste.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}