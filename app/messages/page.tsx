"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import Link from "next/link"

// Definir la interfaz para los mensajes
interface Message {
  id: number
  telefono: string
  contenido_mensaje: string
  estado: string
  nombre_plantilla: string | null
  fecha_envio: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)

  // Cargar mensajes al inicio
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Obtener mensajes reales de la API
        const response = await fetch("/api/mensajes")
        if (!response.ok) {
          throw new Error("Error al cargar mensajes")
        }

        const data = await response.json()
        setMessages(data.mensajes || [])
        setFilteredMessages(data.mensajes || [])
      } catch (error) {
        console.error("Error al cargar mensajes:", error)
        // Si falla, usar datos de ejemplo
        const sampleMessages = generateSampleMessages()
        setMessages(sampleMessages)
        setFilteredMessages(sampleMessages)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [])

  // Función para generar mensajes de ejemplo (solo se usa si falla la API)
  const generateSampleMessages = (): Message[] => {
    // Obtener contactos reales (simulados)
    const telefonos = ["+34612345678", "+34623456789", "+34634567890", "+34645678901", "+34656789012"]

    const estados = ["enviado", "entregado", "fallido", "pendiente"]
    const plantillas = ["Bienvenida", "Promoción", "Recordatorio", "Verificación", null]

    return Array.from({ length: 20 }, (_, i) => ({
      id: 1000 + i,
      telefono: telefonos[Math.floor(Math.random() * telefonos.length)],
      contenido_mensaje: `Este es un mensaje de ejemplo ${i + 1}. Contiene información importante para el destinatario.`,
      estado: estados[Math.floor(Math.random() * estados.length)],
      nombre_plantilla: plantillas[Math.floor(Math.random() * plantillas.length)],
      fecha_envio: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  // Función para filtrar mensajes
  const filterMessages = () => {
    let result = [...messages]

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (message) =>
          message.id.toString().includes(term) ||
          message.telefono.toLowerCase().includes(term) ||
          message.contenido_mensaje.toLowerCase().includes(term) ||
          (message.nombre_plantilla && message.nombre_plantilla.toLowerCase().includes(term)),
      )
    }

    // Aplicar filtro de estado
    if (statusFilter !== "todos") {
      result = result.filter((message) => message.estado === statusFilter)
    }

    setFilteredMessages(result)
  }

  // Actualizar los mensajes filtrados cuando cambian los filtros
  useEffect(() => {
    filterMessages()
  }, [searchTerm, statusFilter, messages])

  // Manejar cambios en la búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Manejar cambios en el filtro de estado
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
  }

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "enviado":
        return "bg-blue-500"
      case "entregado":
        return "bg-green-500"
      case "fallido":
        return "bg-red-500"
      case "pendiente":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "enviado":
        return "Enviado"
      case "entregado":
        return "Entregado"
      case "fallido":
        return "Fallido"
      case "pendiente":
        return "Pendiente"
      default:
        return "Desconocido"
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
            <Input
              type="search"
              placeholder="Buscar mensajes..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter === "todos" ? "Filtrar" : `Filtro: ${getStatusText(statusFilter)}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusFilter("todos")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("enviado")}>Enviados</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("entregado")}>Entregados</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("fallido")}>Fallidos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("pendiente")}>Pendientes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Mensajes</CardTitle>
          <CardDescription>
            {filteredMessages.length === messages.length
              ? "Mensajes SMS enviados a tus contactos"
              : `Mostrando ${filteredMessages.length} de ${messages.length} mensajes`}
          </CardDescription>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="py-6">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Cargando mensajes...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
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
                    <div className="py-6">
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== "todos"
                          ? "No se encontraron mensajes que coincidan con los criterios de búsqueda"
                          : "No hay mensajes enviados"}
                      </p>
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

