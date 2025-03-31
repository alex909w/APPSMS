"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateTemplatePage() {
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [variables, setVariables] = useState([])
  // Añadir un nuevo estado para controlar la alerta de variable duplicada
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  // Load available variables
  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await fetch("/api/variables")
        if (!response.ok) {
          throw new Error("Error al cargar variables")
        }
        const data = await response.json()
        setVariables(data.variables || [])
      } catch (error) {
        console.error("Error al cargar variables:", error)
      }
    }

    fetchVariables()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Send data to API
      const response = await fetch("/api/plantillas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          contenido: content,
          descripcion: description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear la plantilla")
      }

      toast({
        title: "Plantilla creada",
        description: "La plantilla ha sido creada exitosamente",
      })

      // Redirect to templates list
      router.push("/templates")
    } catch (error: any) {
      console.error("Error al crear la plantilla:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al crear la plantilla",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Extract variables from the current message
  const extractVariables = () => {
    const regex = /<([^>]+)>/g
    const matches = content.match(regex) || []
    // Usar Set para eliminar duplicados
    const uniqueVars = new Set(matches.map((match) => match.replace(/<|>/g, "")))
    return Array.from(uniqueVars)
  }

  const messageVariables = extractVariables()

  // Update example values for preview
  useEffect(() => {
    // Evitar actualizaciones innecesarias verificando si realmente hay cambios
    if (messageVariables.length > 0 || Object.keys(variableValues).length > 0) {
      const newVariableValues: Record<string, string> = { ...variableValues }
      let hasChanges = false

      // Añadir nuevas variables que no existan en variableValues
      messageVariables.forEach((varName) => {
        if (!variableValues.hasOwnProperty(varName)) {
          const variable = variables.find((v) => v.nombre === varName)
          newVariableValues[varName] = variable?.ejemplo || `[${varName}]`
          hasChanges = true
        }
      })

      // Eliminar variables que ya no están en messageVariables
      Object.keys(variableValues).forEach((key) => {
        if (!messageVariables.includes(key)) {
          delete newVariableValues[key]
          hasChanges = true
        }
      })

      // Solo actualizar el estado si realmente hay cambios
      if (hasChanges) {
        setVariableValues(newVariableValues)
      }
    }
  }, [messageVariables, variables])

  // Modificar la función handleInsertVariable para mostrar una alerta en lugar de un toast
  const handleInsertVariable = (variableName: string) => {
    // Verificar si la variable ya existe en el contenido actual
    const regex = new RegExp(`<${variableName}>`, "g")
    const matches = content.match(regex) || []

    // Si la variable ya existe en el contenido, mostrar una alerta
    if (matches.length > 0) {
      setDuplicateAlert(variableName)
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => setDuplicateAlert(null), 3000)
      return
    }

    // Si no existe, añadirla al contenido
    setContent((prev) => `${prev} <${variableName}>`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nueva Plantilla</h2>
          <p className="text-muted-foreground">Crea una nueva plantilla para tus mensajes SMS</p>
        </div>
        <Link href="/templates">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Plantillas
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Plantilla</CardTitle>
              <CardDescription>Configura los detalles de tu nueva plantilla</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre de la Plantilla</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Plantilla de Bienvenida"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción (opcional)</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Plantilla para dar la bienvenida a nuevos usuarios"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contenido del Mensaje</label>
                  <Textarea
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>Guardando...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Plantilla
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
                {content ? (
                  <p className="whitespace-pre-wrap">
                    {messageVariables.reduce((msg, varName) => {
                      const regex = new RegExp(`<${varName}>`, "g")
                      return msg.replace(regex, variableValues[varName] || `<${varName}>`)
                    }, content)}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">Escribe un mensaje para ver la vista previa</p>
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