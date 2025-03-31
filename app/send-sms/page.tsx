"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, Check, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SendSmsPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<{ message: string; details: any } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [templates, setTemplates] = useState([])
  const [variables, setVariables] = useState([])
  const [contacts, setContacts] = useState([])

  const { toast } = useToast()

  // Añade un nuevo estado para el estado simulado
  const [estadoSimulado, setEstadoSimulado] = useState("enviado")

  // Añadir un nuevo estado para controlar la alerta de variable duplicada
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null)

  // Cargar datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar plantillas
        const templatesResponse = await fetch("/api/plantillas")
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData.plantillas || [])

        // Cargar variables
        const variablesResponse = await fetch("/api/variables")
        const variablesData = await variablesResponse.json()
        setVariables(variablesData.variables || [])

        // Cargar contactos
        const contactsResponse = await fetch("/api/contactos")
        const contactsData = await contactsResponse.json()
        setContacts(contactsData.contactos || [])
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  // Actualizar mensaje cuando se selecciona una plantilla
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

        setVariableValues(newVariableValues)
      }
    }
  }, [selectedTemplate, templates]) // Eliminamos variableValues de las dependencias

  // Modifica la función handleSubmit para incluir el estado simulado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      // Reemplazar variables en el mensaje
      let finalMessage = message
      Object.entries(variableValues).forEach(([key, value]) => {
        const regex = new RegExp(`<${key}>`, "g")
        finalMessage = finalMessage.replace(regex, value)
      })

      // Enviar mensaje a través de la API
      const response = await fetch("/api/mensajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telefono: phoneNumber,
          contenido: finalMessage,
          plantillaId: selectedTemplate && selectedTemplate !== "none" ? Number.parseInt(selectedTemplate) : null,
          variablesUsadas: variableValues,
          estadoSimulado, // Añadir el estado simulado
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess({
          message: `Mensaje enviado exitosamente a ${phoneNumber}`,
          details: data.details,
        })
        toast({
          title: "Mensaje enviado",
          description: `El mensaje ha sido enviado exitosamente a ${phoneNumber}`,
        })
      } else {
        throw new Error(data.error || "Error al enviar el mensaje")
      }
    } catch (err: any) {
      console.error("Error al enviar el mensaje:", err)
      setError(err.message || "Error al enviar el mensaje")
      toast({
        title: "Error",
        description: err.message || "Error al enviar el mensaje",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Extraer variables del mensaje actual
  const extractVariables = () => {
    const regex = /<([^>]+)>/g
    const matches = message.match(regex) || []
    // Usar Set para eliminar duplicados
    const uniqueVars = new Set(matches.map((match) => match.replace(/<|>/g, "")))
    return Array.from(uniqueVars)
  }

  const messageVariables = extractVariables()

  const handleContactSelect = (contactId: string) => {
    const contact = contacts.find((c) => c.id.toString() === contactId)
    if (contact) {
      setPhoneNumber(contact.telefono)
    }
  }

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
          <h2 className="text-2xl font-bold tracking-tight">Enviar SMS</h2>
          <p className="text-muted-foreground">Configura y envía mensajes SMS a tus contactos</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Mensaje</CardTitle>
              <CardDescription>Configura el mensaje SMS que deseas enviar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destinatario</label>
                  <Select onValueChange={handleContactSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar contacto" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id.toString()}>
                          {`${contact.nombre} ${contact.apellido || ""} - ${contact.telefono}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Plantilla (opcional)</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
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
                  />
                  <p className="text-xs text-muted-foreground">
                    Ejemplo: Hola &lt;nombre&gt;, bienvenido a nuestro servicio.
                  </p>
                </div>

                {messageVariables.length > 0 && (
                  <div className="space-y-2 border p-4 rounded-md">
                    <h3 className="text-sm font-medium">Valores de Variables</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {messageVariables.map((varName) => (
                        <div key={varName} className="space-y-1">
                          <label className="text-xs font-medium">{varName}</label>
                          <Input
                            value={variableValues[varName] || ""}
                            onChange={(e) =>
                              setVariableValues((prev) => ({
                                ...prev,
                                [varName]: e.target.value,
                              }))
                            }
                            placeholder={`Valor para ${varName}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Añade el selector de estado simulado en el formulario, justo antes del botón de envío */}
                <div className="space-y-2 border p-4 rounded-md">
                  <h3 className="text-sm font-medium">Simulación de Estado (Solo para pruebas)</h3>
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
                    <AlertTitle className="text-green-600 dark:text-green-400">Mensaje enviado</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      {success.message}
                      <div className="mt-2 text-xs">
                        <p>Estado: {success.details.estado}</p>
                        <p>Fecha: {new Date(success.details.fecha).toLocaleString()}</p>
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
                      Enviar SMS
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

          <Card>
            <CardHeader>
              <CardTitle>Variables Disponibles</CardTitle>
              <CardDescription>Haz clic en una variable para insertarla en tu mensaje</CardDescription>
            </CardHeader>
            <CardContent>
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

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Información</h4>
                <p className="text-xs text-muted-foreground">
                  Las variables se insertan en el formato &lt;nombre_variable&gt; y serán reemplazadas con valores
                  reales al enviar el mensaje.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}