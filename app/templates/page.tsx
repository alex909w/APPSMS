"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/plantillas")
        if (!response.ok) {
          throw new Error("Error al cargar plantillas")
        }
        const data = await response.json()
        setTemplates(data.plantillas || [])
      } catch (error) {
        console.error("Error:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las plantillas",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [toast])

  // Handle template deletion
  const handleDeleteTemplate = async (id) => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar esta plantilla?")
    if (confirmed) {
      try {
        const response = await fetch(`/api/plantillas/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          toast({
            title: "Plantilla eliminada",
            description: "La plantilla se ha eliminado correctamente.",
          })
          // Refresh the templates list
          setTemplates(templates.filter((template) => template.id !== id))
        } else {
          throw new Error("Error al eliminar la plantilla")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Error al eliminar la plantilla",
        })
      }
    }
  }

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    (template) =>
      template.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.contenido.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
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
          <h2 className="text-2xl font-bold tracking-tight">Plantillas de Mensajes</h2>
          <p className="text-muted-foreground">Gestiona las plantillas para tus mensajes SMS</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar plantillas..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/templates/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Plantilla
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle>{template.nombre}</CardTitle>
                  <Badge variant="outline">{template.id}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <span>Creado: {new Date(template.fecha_creacion).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Activo: {template.activo ? "Sí" : "No"}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="rounded-md bg-muted/50 p-3 text-sm break-words">
                  <p className="line-clamp-3">{template.contenido}</p>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 p-4 pt-0">
                <Link href={`/templates/edit/${template.id}`}>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center p-8">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron plantillas que coincidan con la búsqueda."
                : "No hay plantillas disponibles."}
            </p>
            {!searchTerm && (
              <Link href="/templates/create" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera plantilla
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

