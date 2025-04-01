"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CreateContactPage() {
  const [formData, setFormData] = useState({
    telefono: "",
    nombre: "",
    apellido: "",
    correo: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validación básica
      if (!formData.telefono.trim()) {
        throw new Error("El teléfono es requerido")
      }
      
      if (!formData.nombre.trim()) {
        throw new Error("El nombre es requerido")
      }

      // Validación de formato de teléfono
      const phoneRegex = /^\+?[0-9]{10,15}$/
      if (!phoneRegex.test(formData.telefono)) {
        throw new Error("Formato de teléfono inválido. Use + seguido de código de país y número")
      }

      // Validación de email si se proporciona
      if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        throw new Error("Formato de correo electrónico inválido")
      }

      // Enviar datos a la API
      const response = await fetch("/api/contactos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telefono: formData.telefono.trim(),
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim() || null, // Enviar null si está vacío
          correo: formData.correo.trim() || null       // Enviar null si está vacío
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al crear el contacto")
      }

      toast({
        title: "Éxito",
        description: "Contacto creado correctamente",
      })

      // Redireccionar con un pequeño delay para que se vea el toast
      setTimeout(() => {
        router.push("/contacts")
        router.refresh()
      }, 500)

    } catch (error: any) {
      console.error("Error al crear contacto:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nuevo Contacto</h2>
          <p className="text-muted-foreground">Añade un nuevo contacto para envío de SMS</p>
        </div>
        <Link href="/contacts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Contactos
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles del Contacto</CardTitle>
          <CardDescription>Ingresa la información del nuevo contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono*</label>
              <Input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +50378573605"
                required
              />
              <p className="text-xs text-muted-foreground">
                Formato: +código de país y número (ej: +50378573605)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre*</label>
              <Input 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Apellido</label>
              <Input 
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej: Pérez"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Correo Electrónico</label>
              <Input
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ej: juan@example.com"
                type="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Contacto
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}