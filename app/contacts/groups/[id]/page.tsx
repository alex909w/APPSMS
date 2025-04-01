import { getDetallesGrupo } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserPlus, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

export default async function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Esperar a que los parámetros estén disponibles
  const resolvedParams = await params
  const id = resolvedParams.id

  if (!id) {
    notFound()
  }

  const grupo = await getDetallesGrupo(Number.parseInt(id))

  if (!grupo) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{grupo.nombre}</h2>
          <p className="text-muted-foreground">{grupo.descripcion || "Sin descripción"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/contacts?tab=groups">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Grupos
            </Button>
          </Link>
          <Link href={`/contacts/groups/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información del Grupo</CardTitle>
            <CardDescription>Detalles del grupo de contactos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
              <p>{grupo.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
              <p>{grupo.nombre}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Descripción</h3>
              <p>{grupo.descripcion || "Sin descripción"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fecha de Creación</h3>
              <p>{new Date(grupo.fecha_creacion).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total de Contactos</h3>
              <Badge>{grupo.miembros?.length || 0} contactos</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Contactos en el Grupo</CardTitle>
              <CardDescription>Lista de contactos que pertenecen a este grupo</CardDescription>
            </div>
            <Link href={`/contacts/groups/${id}/add-contacts`}>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Añadir Contactos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grupo.miembros && grupo.miembros.length > 0 ? (
                  grupo.miembros.map((contacto) => (
                    <TableRow key={contacto.id}>
                      <TableCell>{contacto.id}</TableCell>
                      <TableCell>{`${contacto.nombre} ${contacto.apellido || ""}`}</TableCell>
                      <TableCell>{contacto.telefono}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No hay contactos en este grupo
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

