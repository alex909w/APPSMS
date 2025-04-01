import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getMensajesEnviados } from "@/lib/db"
import Link from "next/link"
import dynamic from 'next/dynamic'

export default async function MessagesPage() {
  // Obtener datos reales de la base de datos
  const messages = await getMensajesEnviados()

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "enviado":
        return "bg-blue-500"
      case "entregado":
        return "bg-green-500"
      case "fallido":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  const MessagesPage = dynamic(() => import('./MessagesComponent'), {
    ssr: false
  })

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "enviado":
        return "Enviado"
      case "entregado":
        return "Entregado"
      case "fallido":
        return "Fallido"
      default:
        return "Pendiente"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mensajes Enviados</h2>
          <p className="text-muted-foreground">Historial de mensajes SMS enviados</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar mensajes..." className="pl-8 w-[200px] md:w-[300px]" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Enviados</DropdownMenuItem>
              <DropdownMenuItem>Entregados</DropdownMenuItem>
              <DropdownMenuItem>Fallidos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Mensajes</CardTitle>
          <CardDescription>Mensajes SMS enviados a tus contactos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Contenido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Plantilla</TableHead>
                <TableHead className="hidden md:table-cell">Fecha de Envío</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.id}</TableCell>
                    <TableCell>{message.telefono}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.contenido_mensaje}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(message.estado)}>{getStatusText(message.estado)}</Badge>
                    </TableCell>
                    <TableCell>{message.nombre_plantilla || "Personalizado"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(message.fecha_envio).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/messages/${message.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver Detalles
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No hay mensajes enviados
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

export default MessagesPage