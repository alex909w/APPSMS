import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Message {
  id: string
  content: string
  status: string
  created_at: string
  sent_at: string | null
  contact?: {
    id: string
    name: string
    phone: string
  } | null
  template?: {
    id: string
    name: string
  } | null
}

interface MessagesTableProps {
  messages: Message[]
}

export function MessagesTable({ messages }: MessagesTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium">
              <th className="px-4 py-3 text-left">Destinatario</th>
              <th className="px-4 py-3 text-left">Mensaje</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay mensajes para mostrar.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className="border-b">
                  <td className="px-4 py-3">
                    {message.contact ? (
                      <div>
                        <div className="font-medium">{message.contact.name}</div>
                        <div className="text-muted-foreground">{message.contact.phone}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Desconocido</span>
                    )}
                  </td>
                  <td className="max-w-[300px] truncate px-4 py-3">{message.content}</td>
                  <td className="px-4 py-3">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        message.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : message.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {message.status === "sent" ? "Enviado" : message.status === "pending" ? "Pendiente" : "Error"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {message.sent_at
                      ? formatDistanceToNow(new Date(message.sent_at), { addSuffix: true, locale: es })
                      : formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: es })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

