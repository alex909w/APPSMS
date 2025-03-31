import { getMessageTemplates } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function TemplatesPage() {
  const templates = await getMessageTemplates()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plantillas de Mensajes</h1>
        <div className="space-x-2">
          <Link href="/dashboard/templates/create">
            <Button>Crear Plantilla</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Contenido</TableHead>
              <TableHead>Creado Por</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length > 0 ? (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.id}</TableCell>
                  <TableCell>{template.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{template.content}</TableCell>
                  <TableCell>{template.creator_name}</TableCell>
                  <TableCell>{new Date(template.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay plantillas registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

