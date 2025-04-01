"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, Plus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function AddContactsToGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [contactos, setContactos] = useState<any[]>([])
  const [selectedContactos, setSelectedContactos] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [groupName, setGroupName] = useState("")

  const { toast } = useToast()
  const router = useRouter()

  // Cargar el ID del grupo
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params
        setId(resolvedParams.id)
      } catch (error) {
        console.error("Error al cargar parámetros:", error)
      }
    }

    loadParams()
  }, [params])

  // Cargar contactos y detalles del grupo
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        // Cargar contactos
        const contactosResponse = await fetch("/api/contactos")
        const contactosData = await contactosResponse.json()
        setContactos(contactosData.contactos || [])

        // Cargar detalles del grupo
        const grupoResponse = await fetch(`/api/grupos/${id}`)
        const grupoData = await grupoResponse.json()
        setGroupName(grupoData.grupo?.nombre || `Grupo ${id}`)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleToggleContact = (contactId: number) => {
    setSelectedContactos((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleAddContacts = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "ID de grupo no disponible",
        variant: "destructive",
      })
      return
    }

    if (selectedContactos.length === 0) {
      toast({
        title: "Selecciona contactos",
        description: "Debes seleccionar al menos un contacto para añadir al grupo",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/grupos/${id}/contactos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactIds: selectedContactos,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al añadir contactos al grupo")
      }

      toast({
        title: "Contactos añadidos",
        description: `Se han añadido ${selectedContactos.length} contactos al grupo`,
      })

      router.push(`/contacts/groups/${id}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error al añadir contactos:", error)
      toast({
        title: "Error",
        description: error.message || "Error al añadir contactos al grupo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar contactos por término de búsqueda
  const filteredContactos = contactos.filter(
    (contacto) =>
      contacto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.telefono?.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Añadir Contactos a {groupName}</h2>
          <p className="text-muted-foreground">Selecciona los contactos que deseas añadir al grupo</p>
        </div>
        <div className="flex items-center gap-2">
          {id && (
            <Link href={`/contacts/groups/${id}`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Grupo
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Contactos</CardTitle>
          <CardDescription>Marca los contactos que deseas añadir al grupo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar contactos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddContacts} disabled={isLoading || selectedContactos.length === 0}>
              {isLoading ? (
                "Añadiendo..."
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Seleccionados ({selectedContactos.length})
                </>
              )}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedContactos.length === filteredContactos.length && filteredContactos.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedContactos(filteredContactos.map((c) => c.id))
                      } else {
                        setSelectedContactos([])
                      }
                    }}
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContactos.length > 0 ? (
                filteredContactos.map((contacto) => (
                  <TableRow key={contacto.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedContactos.includes(contacto.id)}
                        onCheckedChange={() => handleToggleContact(contacto.id)}
                        aria-label={`Seleccionar ${contacto.nombre}`}
                      />
                    </TableCell>
                    <TableCell>{`${contacto.nombre} ${contacto.apellido || ""}`}</TableCell>
                    <TableCell>{contacto.telefono}</TableCell>
                    <TableCell>{contacto.correo || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    {searchTerm ? "No se encontraron contactos con ese término" : "No hay contactos disponibles"}
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

