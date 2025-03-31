"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("contacts")
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Set active tab from URL if present
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "groups") {
      setActiveTab("groups")
    }
  }, [searchParams])

  // Fetch contacts and groups from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch contacts
        const contactsResponse = await fetch("/api/contactos")
        if (!contactsResponse.ok) {
          throw new Error("Error al cargar contactos")
        }
        const contactsData = await contactsResponse.json()
        setContacts(contactsData.contactos || [])

        // Fetch groups
        const groupsResponse = await fetch("/api/grupos")
        if (!groupsResponse.ok) {
          throw new Error("Error al cargar grupos")
        }
        const groupsData = await groupsResponse.json()
        setGroups(groupsData.grupos || [])
      } catch (error) {
        console.error("Error:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Handle contact deletion
  const handleDeleteContact = async (id) => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este contacto?")
    if (confirmed) {
      try {
        const response = await fetch(`/api/contactos/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          toast({
            title: "Contacto eliminado",
            description: "El contacto se ha eliminado correctamente.",
          })
          // Refresh the contacts list
          setContacts(contacts.filter((contact) => contact.id !== id))
        } else {
          throw new Error("Error al eliminar el contacto")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Error al eliminar el contacto",
        })
      }
    }
  }

  // Handle group deletion
  const handleDeleteGroup = async (id) => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este grupo?")
    if (confirmed) {
      try {
        const response = await fetch(`/api/grupos/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          toast({
            title: "Grupo eliminado",
            description: "El grupo se ha eliminado correctamente.",
          })
          // Refresh the groups list
          setGroups(groups.filter((group) => group.id !== id))
        } else {
          throw new Error("Error al eliminar el grupo")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Error al eliminar el grupo",
        })
      }
    }
  }

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.apellido && contact.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.telefono.includes(searchTerm),
  )

  // Filter groups based on search term
  const filteredGroups = groups.filter(
    (group) =>
      group.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.descripcion && group.descripcion.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
    router.push(`/contacts?tab=${value}`, { scroll: false })
  }

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
          <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
          <p className="text-muted-foreground">Gestiona tus contactos y grupos para envío de SMS</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/contacts/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Contactos</CardTitle>
              <CardDescription>Contactos disponibles para envío de SMS</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha de Creación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contacto) => (
                      <TableRow key={contacto.id}>
                        <TableCell>{contacto.id}</TableCell>
                        <TableCell>{`${contacto.nombre} ${contacto.apellido || ""}`}</TableCell>
                        <TableCell>{contacto.telefono}</TableCell>
                        <TableCell className="hidden md:table-cell">{contacto.correo || "-"}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(contacto.fecha_creacion).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/contacts/edit/${contacto.id}`}>
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDeleteContact(contacto.id)}
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
                          ? "No se encontraron contactos que coincidan con la búsqueda."
                          : "No hay contactos registrados"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="groups" className="mt-4">
          <div className="flex justify-end mb-4">
            <Link href="/contacts/groups/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Grupo
              </Button>
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Grupos de Contactos</CardTitle>
              <CardDescription>Grupos para organizar tus contactos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Contactos</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha de Creación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((grupo) => (
                      <TableRow key={grupo.id}>
                        <TableCell>{grupo.id}</TableCell>
                        <TableCell>{grupo.nombre}</TableCell>
                        <TableCell>{grupo.descripcion || "-"}</TableCell>
                        <TableCell>{grupo.total_contactos || 0}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(grupo.fecha_creacion).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/contacts/groups/${grupo.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </Link>
                            <Link href={`/contacts/groups/${grupo.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDeleteGroup(grupo.id)}
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
                          ? "No se encontraron grupos que coincidan con la búsqueda."
                          : "No hay grupos registrados"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

