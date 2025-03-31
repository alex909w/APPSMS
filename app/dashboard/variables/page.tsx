import { getVariables } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function VariablesPage() {
  const variables = await getVariables()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Variables</h1>
        <div className="space-x-2">
          <Link href="/dashboard/variables/create">
            <Button>Crear Variable</Button>
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
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.length > 0 ? (
              variables.map((variable) => (
                <TableRow key={variable.id}>
                  <TableCell>{variable.id}</TableCell>
                  <TableCell>{variable.name}</TableCell>
                  <TableCell>{variable.description}</TableCell>
                  <TableCell>{new Date(variable.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay variables registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

