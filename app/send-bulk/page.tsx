"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, Users, Variable, Check, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"

export default function SendBulkSmsPage() {
  const [message, setMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalSent, setTotalSent] = useState(0)
  const [totalFailed, setTotalFailed] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState<{ message: string; details: any } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [templates, setTemplates] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [variables, setVariables] = useState<any[]>([])

  // Añadir estados para la simulación
  const [estadoSimulado, setEstadoSimulado] = useState("enviado")
  const [tasaExito, setTasaExito] = useState(100)

  const { toast } = useToast()

  // Añadir un nuevo estado para controlar la alerta de variable duplicada
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null)

  // Cargar datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar plantillas
        const templatesResponse = await fetch("/api/plantillas")
        if (!templatesResponse.ok) {
          console.warn("No se pudieron cargar las plantillas, usando datos de ejemplo")
          setTemplates([
            { id: 1, nombre: "Bienvenida", contenido: "Hola <nombre>, bienvenido a nuestro servicio." },
            {
              id: 2,
              nombre: "Promoción",
              contenido: "Hola <nombre>, tenemos una promoción especial para ti: <promocion>",
            },
          ])
        } else {
          const templatesData = await templatesResponse.json()
          setTemplates(templatesData.plantillas || [])
        }

        // Cargar variables
        const variablesResponse = await fetch("/api/variables")
        if (!variablesResponse.ok) {
          console.warn("No se pudieron cargar las variables, usando datos de ejemplo")
          setVariables([
            { id: 1, nombre: "nombre" },
            { id: 2, nombre: "apellido" },
            { id: 3, nombre: "promocion" },
          ])
        } else {
          const variablesData = await variablesResponse.json()
          setVariables(variablesData.variables || [])
        }

        // Cargar grupos
        const groupsResponse = await fetch("/api/grupos")
        if (!groupsResponse.ok) {
          console.warn("No se pudieron cargar los grupos, usando datos de ejemplo")
          setGroups([
            { id: 1, nombre: "Clientes VIP", total_contactos: 10 },
            { id: 2, nombre: "Clientes Nuevos", total_contactos: 25 },
          ])
        } else {
          const groupsData = await groupsResponse.json()
          setGroups(groupsData.grupos || [])
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        // Usar datos de ejemplo en caso de error
        setTemplates([
          { id: 1, nombre: "Bienvenida", contenido: "Hola <nombre>, bienvenido a nuestro servicio." },
          {
            id: 2,
            nombre: "Promoción",
            contenido: "Hola <nombre>, tenemos una promoción especial para ti: <promocion>",
          },
        ])
        setVariables([
          { id: 1, nombre: "nombre" },
          { id: 2, nombre: "apellido" },
          { id: 3, nombre: "promocion" },
        ])
        setGroups([
          { id: 1, nombre: "Clientes VIP", total_contactos: 10 },
          { id: 2, nombre: "Clientes Nuevos", total_contactos: 25 },
        ])
        toast({
          title: "Advertencia",
          description: "Se están usando datos de ejemplo porque no se pudieron cargar los datos reales",
          variant: "warning",
        })
      }
    }

    fetchData()
  }, [toast])

  // Modificar el useEffect que actualiza el mensaje cuando se selecciona una plantilla
  useEffect(() => {
    if (selectedTemplate && selectedTemplate !== "none") {
      const template = templates.find((t) => t.id.toString() === selectedTemplate)
      if (template) {
        setMessage(template.contenido)

        // Extraer variables del mensaje
        const regex = /<([^>]+)>/g
        const matches = template.contenido.match(regex) || []

        // Inicializar valores de variables
        const newVariableValues: Record<string, string> = {}
        matches.forEach((match) => {
          const varName = match.replace(/<|>/g, "")
          // Mantener valores existentes si ya están definidos
          newVariableValues[varName] = variableValues[varName] || ""
        })

        // Evitar actualizar el estado si no hay cambios
        if (JSON.stringify(newVariableValues) !== JSON.stringify(variableValues)) {
          setVariableValues(newVariableValues)
        }
      }
    }
  }, [selectedTemplate, templates]) // Eliminar variableValues de las dependencias

  // Modificar la función handleSubmit para manejar mejor los errores
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedGroup) {
      toast({
        title: "Grupo requerido",
        description: "Debes seleccionar un grupo de contactos para enviar mensajes masivos",
        variant: "destructive",
      })
      return
    }

    if (!message) {
      toast({
        title: "Mensaje requerido",
        description: "Debes escribir un mensaje para enviar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setIsSending(true)
    setProgress(0)
    setTotalSent(0)
    setTotalFailed(0)
    setSuccess(null)
    setError(null)

    try {
      // Simular progreso mientras se envía la solicitud
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 300)

      // Enviar mensajes masivos con parámetros de simulación
      const bulkResponse = await fetch("/api/send-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grupoId: selectedGroup,
          mensaje: message,
          plantillaId: selectedTemplate && selectedTemplate !== "none" ? selectedTemplate : null,
          variablesUsadas: variableValues,
          estadoSimulado,
          tasaExito,
        }),
      })

      clearInterval(progressInterval)

      // Intentar obtener la respuesta JSON, pero manejar el caso en que no sea un JSON válido
      let responseData
      try {
        responseData = await bulkResponse.json()
      } catch (jsonError) {
        console.error("Error al parsear la respuesta JSON:", jsonError)
        responseData = {
          error: `Error del servidor: ${bulkResponse.status} ${bulkResponse.statusText}`,
          details: "No se pudo obtener información detallada del error",
        }
      }

      if (!bulkResponse.ok) {
        // Si la respuesta no es exitosa, mostrar el error
        const errorMessage = responseData.error || responseData.details || "Error al enviar mensajes masivos"
        console.error("Error en la respuesta de la API:", errorMessage)
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Si llegamos aquí, la respuesta fue exitosa
      setProgress(100)
      setTotalSent(responseData.resultados.enviados)
      setTotalFailed(responseData.resultados.fallidos)

      setSuccess({
        message: responseData.message,
        details: responseData.resultados,
      })

      toast({
        title: "Envío completado",
        description: responseData.message,
      })
    } catch (err: any) {
      console.error("Error al enviar mensajes masivos:", err)
      setError(err.message || "Error al enviar mensajes masivos")
      toast({
        title: "Error",
        description: err.message || "Error al enviar mensajes masivos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Usar useMemo para extraer variables del mensaje
  const messageVariables = useMemo(() => {
    const regex = /<([^>]+)>/g
    const matches = message.match(regex) || []
    // Usar Set para eliminar duplicados
    const uniqueVars = new Set(matches.map((match) => match.replace(/<|>/g, "")))
    return Array.from(uniqueVars)
  }, [message])

  // Modificar la función handleInsertVariable para mostrar una alerta en lugar de un toast
  const handleInsertVariable = (variableName: string) => {
    // Verificar si la variable ya existe en el mensaje actual
    const regex = new RegExp(`<${variableName}>`, "g")
    const matches = message.match(regex) || []

    // Si la variable ya existe en el mensaje, mostrar una alerta
    if (matches.length > 0) {
      setDuplicateAlert(variableName)
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => setDuplicateAlert(null), 3000)
      return
    }

    // Si no existe, añadirla al mensaje
    setMessage((prev) => `${prev} <${variableName}>`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Envío Masivo de SMS</h2>
          <p className="text-muted-foreground">Envía mensajes SMS a grupos de contactos</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Envío Masivo</CardTitle>
              <CardDescription>Configura el mensaje y el grupo de destinatarios</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grupo de Contactos</label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.nombre} ({group.total_contactos || 0} contactos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Plantilla (opcional)</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una plantilla" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguna</SelectItem>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensaje</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu mensaje aquí. Usa <variable> para insertar variables."
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>

                {messageVariables.length > 0 && (
                  <div className="space-y-2 border p-4 rounded-md">
                    <h3 className="text-sm font-medium">Valores de Variables</h3>
                    <p className="text-xs text-muted-foreground">
                      Estos valores se aplicarán a todos los mensajes enviados
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {messageVariables.map((varName) => (
                        <div key={varName} className="space-y-1">
                          <label className="text-xs font-medium">{varName}</label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={variableValues[varName] || ""}
                            onChange={(e) =>
                              setVariableValues((prev) => ({
                                ...prev,
                                [varName]: e.target.value,
                              }))
                            }
                            placeholder={`Valor para ${varName}`}
                            disabled={isLoading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Añadir sección de simulación */}
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="text-sm font-medium">Simulación de Envío (Solo para pruebas)</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado de los mensajes exitosos</label>
                    <Select value={estadoSimulado} onValueChange={setEstadoSimulado} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enviado">Enviado</SelectItem>
                        <SelectItem value="entregado">Entregado</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Estado que tendrán los mensajes que se envíen correctamente.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Tasa de éxito: {tasaExito}%</label>
                    </div>
                    <Slider
                      value={[tasaExito]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setTasaExito(value[0])}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Porcentaje de mensajes que se enviarán correctamente. El resto se marcarán como fallidos.
                    </p>
                  </div>
                </div>

                {isSending && (
                  <div className="space-y-2 border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Progreso de Envío</h3>
                      <span className="text-sm">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Enviados: {totalSent}</span>
                      <span>Fallidos: {totalFailed}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-600 dark:text-green-400">Envío completado</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      {success.message}
                      <div className="mt-2 text-xs">
                        <p>Total de contactos: {success.details.total}</p>
                        <p>Mensajes enviados: {success.details.enviados}</p>
                        <p>Mensajes fallidos: {success.details.fallidos}</p>
                      </div>
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
                      Enviar Mensajes Masivos
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {duplicateAlert && (
            <Alert
              variant="warning"
              className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900 dark:border-amber-800"
            >
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-600 dark:text-amber-400">Variable ya incluida</AlertTitle>
              <AlertDescription className="text-amber-600 dark:text-amber-400">
                La variable <strong>&lt;{duplicateAlert}&gt;</strong> ya está incluida en el mensaje.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
              <CardDescription>Detalles sobre el envío masivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium">Grupo Seleccionado</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedGroup
                      ? `${groups.find((g) => g.id.toString() === selectedGroup)?.nombre || ""} (${groups.find((g) => g.id.toString() === selectedGroup)?.total_contactos || 0} contactos)`
                      : "Ningún grupo seleccionado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Variable className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium">Variables</h3>
                  <p className="text-xs text-muted-foreground">
                    {messageVariables.length > 0 ? `${messageVariables.length} variables en uso` : "Sin variables"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Variables Disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable) => (
                    <Badge
                      key={variable.id}
                      className="cursor-pointer hover:bg-primary"
                      onClick={() => handleInsertVariable(variable.nombre)}
                    >
                      {variable.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>Así se verá tu mensaje con las variables reemplazadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 bg-muted/50 min-h-[200px]">
                {message ? (
                  <p className="whitespace-pre-wrap">
                    {messageVariables.reduce((msg, varName) => {
                      const regex = new RegExp(`<${varName}>`, "g")
                      return msg.replace(regex, variableValues[varName] || `<${varName}>`)
                    }, message)}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Escribe un mensaje o selecciona una plantilla para ver la vista previa
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

