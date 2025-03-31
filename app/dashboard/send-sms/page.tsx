"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SendSmsPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [templates, setTemplates] = useState<any[]>([])
  const [variables, setVariables] = useState<any[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Cargar plantillas y variables
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar plantillas
        const templatesResponse = await fetch("/api/templates")
        if (!templatesResponse.ok) {
          throw new Error("Error al cargar plantillas")
        }
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData.templates || [])

        // Cargar variables
        const variablesResponse = await fetch("/api/variables")
        if (!variablesResponse.ok) {
          throw new Error("Error al cargar variables")
        }
        const variablesData = await variablesResponse.json()
        setVariables(variablesData.variables || [])
      } catch (err: any) {
        console.error("Error al cargar datos:", err)
      }
    }

    fetchData()
  }, [])

  // Actualizar mensaje cuando se selecciona una plantilla
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id.toString() === selectedTemplate)
      if (template) {
        setMessage(template.content)

        // Extraer variables del mensaje
        const regex = /<([^>]+)>/g
        const matches = template.content.match(regex) || []

        // Inicializar valores de variables
        const newVariableValues: Record<string, string> = {}
        matches.forEach((match) => {
          const varName = match.replace(/<|>/g, "")
          newVariableValues[varName] = variableValues[varName] || ""
        })

        setVariableValues(newVariableValues)
      }
    }
  }, [selectedTemplate, templates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Reemplazar variables en el mensaje
      let finalMessage = message
      Object.entries(variableValues).forEach(([key, value]) => {
        const regex = new RegExp(`<${key}>`, "g")
        finalMessage = finalMessage.replace(regex, value)
      })

      // Asumimos que el usuario con ID 1 es el remitente (en una aplicación real, esto vendría del contexto de autenticación)
      const userId = 1

      // Simulamos el envío del SMS (en una aplicación real, aquí se integraría con un proveedor de SMS)
      // await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(`Mensaje enviado exitosamente a ${phoneNumber}`)

      // En una aplicación real, aquí se registraría el mensaje en la base de datos
    } catch (err: any) {
      setError(err.message || "Error al enviar el mensaje")
    } finally {
      setIsLoading(false)
    }
  }

  // Extraer variables del mensaje actual
  const extractVariables = () => {
    const regex = /<([^>]+)>/g
    const matches = message.match(regex) || []
    return matches.map((match) => match.replace(/<|>/g, ""))
  }

  const messageVariables = extractVariables()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enviar SMS</h1>
        <Link href="/">
          <Button variant="outline">Volver al Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Enviar Mensaje SMS</CardTitle>
            <CardDescription>Configura y envía un mensaje SMS</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">
                  Número de Teléfono
                </label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+34612345678"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="template" className="text-sm font-medium">
                  Plantilla (opcional)
                </label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí. Usa <variable> para insertar variables."
                  rows={4}
                  required
                />
              </div>

              {messageVariables.length > 0 && (
                <div className="space-y-2 border p-4 rounded-md">
                  <h3 className="text-sm font-medium">Valores de Variables</h3>
                  {messageVariables.map((varName) => (
                    <div key={varName} className="space-y-1">
                      <label htmlFor={`var-${varName}`} className="text-xs font-medium">
                        {varName}
                      </label>
                      <Input
                        id={`var-${varName}`}
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
              )}

              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar SMS"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>Así se verá tu mensaje con las variables reemplazadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
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
  )
}

