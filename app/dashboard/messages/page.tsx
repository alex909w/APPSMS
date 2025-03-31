import { getSentMessages } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function MessagesPage() {
  const messages = await getSentMessages()

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mensajes Enviados</h1>
        <Link href="/">
          <Button variant="outline">Volver al Dashboard</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Número de Teléfono</TableHead>
              <TableHead>Contenido</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Enviado Por</TableHead>
              <TableHead>Fecha de Envío</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.id}</TableCell>
                  <TableCell>{message.phone_number}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.message_content}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(message.status)}>
                      {message.status === "sent" ? "Enviado" : message.status === "failed" ? "Fallido" : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{message.sent_by_name}</TableCell>
                  <TableCell>{new Date(message.sent_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
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
      </div>
    </div>
  )
}

