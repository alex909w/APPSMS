"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function VariablesPage() {
  const [variables, setVariables] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Fetch variables from API
  useEffect(() => {
    const fetchVariables = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/variables")
        if (!response.ok) {
          throw new Error("Error al cargar variables")
        }
        const data = await response.json()
        setVariables(data.variables || [])
      } catch (error) {
        console.error("Error:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las variables",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVariables()
  }, [toast])

  // Handle variable deletion
  const handleDeleteVariable = async (id) => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar esta variable?")
    if (confirmed) {
      try {
        const response = await fetch(`/api/variables/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          toast({
            title: "Variable eliminada",
            description: "La variable se ha eliminado correctamente.",
          })
          // Refresh the variables list
          setVariables(variables.filter((variable) => variable.id !== id))
        } else {
          throw new Error("Error al eliminar la variable")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Error al eliminar la variable",
        })
      }
    }
  }

  // Filter variables based on search term
  const filteredVariables = variables.filter(
    (variable) =>
      variable.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <h2 className="text-2xl font-bold tracking-tight">Variables</h2>
          <p className="text-muted-foreground">Gestiona las variables para tus mensajes SMS</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar variables..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/variables/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Variable
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Variables</CardTitle>
          <CardDescription>Variables disponibles para usar en tus plantillas y mensajes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead className="hidden md:table-cell">Ejemplo</TableHead>
                <TableHead className="hidden md:table-cell">Fecha de Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.length > 0 ? (
                filteredVariables.map((variable) => (
                  <TableRow key={variable.id}>
                    <TableCell>{variable.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{variable.nombre}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{variable.descripcion}</TableCell>
                    <TableCell className="hidden md:table-cell">{variable.ejemplo}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(variable.fecha_creacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/variables/edit/${variable.id}`}>
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => handleDeleteVariable(variable.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {searchTerm
                      ? "No se encontraron variables que coincidan con la búsqueda."
                      : "No hay variables registradas"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

