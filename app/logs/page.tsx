import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { executeQuery } from "@/lib/db"

export default async function LogsPage() {
  // Obtener datos reales de la base de datos
  const logs = await executeQuery<any[]>(`
    SELECT * FROM registros_actividad
    ORDER BY fecha_creacion DESC
    LIMIT 100
  `)

  // Función para obtener el color del texto según la acción
  const getActionColor = (action: string) => {
    switch (action) {
      case "login":
        return "text-blue-500"
      case "create_template":
      case "create_contact":
        return "text-green-500"
      case "send_sms":
        return "text-purple-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Logs de Actividad</h2>
          <p className="text-muted-foreground">Registro de actividades en el sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar logs..." className="pl-8 w-[200px] md:w-[300px]" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por Acción</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Login</DropdownMenuItem>
              <DropdownMenuItem>Creación</DropdownMenuItem>
              <DropdownMenuItem>Envío SMS</DropdownMenuItem>
              <DropdownMenuItem>Errores</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Actividad</CardTitle>
          <CardDescription>Registro de todas las actividades realizadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="hidden md:table-cell">Dirección IP</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.usuario_id ? `Usuario ${log.usuario_id}` : "Sistema"}</TableCell>
                    <TableCell className={getActionColor(log.accion)}>{log.accion}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.descripcion}</TableCell>
                    <TableCell className="hidden md:table-cell">{log.direccion_ip}</TableCell>
                    <TableCell>{new Date(log.fecha_creacion).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="py-6">
                      <p className="text-muted-foreground">No hay registros de actividad disponibles</p>
                    </div>
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

