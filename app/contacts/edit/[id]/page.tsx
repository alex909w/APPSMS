"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Definir la interfaz para los datos del contacto
interface ContactData {
  telefono: string
  nombre: string
  apellido: string
  correo: string
}

// Validar formato de teléfono (debe coincidir con la validación del backend)
const isValidPhone = (phone: string): boolean => {
  return /^\+(?:[0-9]){6,14}[0-9]$/.test(phone)
}

// Validar formato de correo
const isValidEmail = (email: string): boolean => {
  if (!email) return true // El correo es opcional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Componente principal
export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  // Usar el hook 'use' para desenvolver la promesa de params
  const resolvedParams = use(params)
  const id = resolvedParams?.id

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<ContactData>({
    telefono: "",
    nombre: "",
    apellido: "",
    correo: "",
  })

  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<{
    telefono?: string
    nombre?: string
    correo?: string
  }>({})

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContact, setIsLoadingContact] = useState(true)

  const { toast } = useToast()
  const router = useRouter()

  // Cargar datos del contacto
  useEffect(() => {
    // Verificar que el ID existe
    if (!id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "ID de contacto no válido",
      })
      router.push("/contacts")
      return
    }

    const fetchContact = async () => {
      try {
        setIsLoadingContact(true)

        const response = await fetch(`/api/contactos/${id}`)

        if (!response.ok) {
          throw new Error(`Error al cargar el contacto: ${response.status}`)
        }

        const responseData = await response.json()

        if (responseData && responseData.data) {
          setFormData({
            telefono: responseData.data.telefono || "",
            nombre: responseData.data.nombre || "",
            apellido: responseData.data.apellido || "",
            correo: responseData.data.correo || "",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Formato de datos de contacto no válido",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "No se pudo cargar el contacto",
        })
      } finally {
        setIsLoadingContact(false)
      }
    }

    fetchContact()
  }, [id, toast, router])

  // Validar el formulario antes de enviar
  const validateForm = (): boolean => {
    const errors: {
      telefono?: string
      nombre?: string
      correo?: string
    } = {}

    // Validar teléfono
    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es requerido"
    } else if (!isValidPhone(formData.telefono)) {
      errors.telefono = "Formato de teléfono inválido. Use formato internacional: +50312345678"
    }

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido"
    }

    // Validar correo si está presente
    if (formData.correo && !isValidEmail(formData.correo)) {
      errors.correo = "Formato de correo inválido"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error de validación al editar
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar que el ID existe
    if (!id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "ID de contacto no válido",
      })
      return
    }

    // Validar formulario
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario",
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para enviar (asegurarse de que coincidan con lo que espera el backend)
      const dataToSend = {
        telefono: formData.telefono.trim(),
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim() || null,
        correo: formData.correo.trim() || null,
      }

      const response = await fetch(`/api/contactos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        // Intentar obtener mensaje de error del servidor
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.error || "Error al actualizar el contacto"
        throw new Error(errorMessage)
      }

      toast({
        title: "Contacto actualizado",
        description: "El contacto ha sido actualizado exitosamente",
      })

      router.push("/contacts")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el contacto",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar indicador de carga mientras se obtienen los datos
  if (isLoadingContact) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Renderizar el formulario
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Contacto</h2>
          <p className="text-muted-foreground">Actualiza los detalles del contacto</p>
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
          <CardDescription>Actualiza la información del contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +34612345678"
                required
              />
              {validationErrors.telefono && <p className="text-sm text-red-500">{validationErrors.telefono}</p>}
              <p className="text-xs text-muted-foreground">Formato internacional: +34612345678</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan" required />
              {validationErrors.nombre && <p className="text-sm text-red-500">{validationErrors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Apellido</label>
              <Input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ej: Pérez" />
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
              {validationErrors.correo && <p className="text-sm text-red-500">{validationErrors.correo}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Guardando..."
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

