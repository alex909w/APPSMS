"use client"

import { useState, useEffect } from "react"
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

// Mapeo de acciones a nombres amigables (ampliado con las acciones faltantes)
const ACTION_NAMES = {
  // Acciones de autenticación
  login: "Inicio de sesión",
  logout: "Cierre de sesión",
  password_reset: "Restablecimiento de contraseña",
  password_change: "Cambio de contraseña",
  two_factor_auth: "Autenticación de dos factores",

  // Acciones de plantillas
  create_template: "Creación de plantilla",
  creacion_plantilla: "Creación de plantilla", // Variante en español
  update_template: "Actualización de plantilla",
  delete_template: "Eliminación de plantilla",
  duplicate_template: "Duplicación de plantilla",
  import_template: "Importación de plantilla",
  export_template: "Exportación de plantilla",

  // Acciones de variables
  create_variable: "Creación de variable",
  update_variable: "Actualización de variable",
  delete_variable: "Eliminación de variable",

  // Acciones de contactos
  create_contact: "Creación de contacto",
  update_contact: "Actualización de contacto",
  delete_contact: "Eliminación de contacto",
  import_contacts: "Importación de contactos",
  export_contacts: "Exportación de contactos",
  create_group: "Creación de grupo",
  update_group: "Actualización de grupo",
  delete_group: "Eliminación de grupo",
  add_to_group: "Adición a grupo",
  add_contacts_to_group: "Adición de contactos a grupo", // Nueva acción
  remove_from_group: "Eliminación de grupo",

  // Acciones de mensajes
  send_sms: "Envío de mensaje",
  send_bulk_sms: "Envío masivo de mensajes", // Nueva acción
  schedule_sms: "Programación de mensaje",
  cancel_sms: "Cancelación de mensaje",
  bulk_send: "Envío masivo",

  // Acciones de campañas
  create_campaign: "Creación de campaña",
  update_campaign: "Actualización de campaña",
  delete_campaign: "Eliminación de campaña",
  start_campaign: "Inicio de campaña",
  pause_campaign: "Pausa de campaña",
  resume_campaign: "Reanudación de campaña",
  stop_campaign: "Detención de campaña",

  // Acciones de configuración
  update_settings: "Actualización de configuración",
  api_key_generated: "Generación de clave API",
  api_key_revoked: "Revocación de clave API",
  webhook_created: "Creación de webhook",
  webhook_updated: "Actualización de webhook",
  webhook_deleted: "Eliminación de webhook",

  // Acciones de facturación
  payment_processed: "Procesamiento de pago",
  subscription_created: "Creación de suscripción",
  subscription_updated: "Actualización de suscripción",
  subscription_cancelled: "Cancelación de suscripción",
  invoice_generated: "Generación de factura",

  // Acciones de sistema
  system_update: "Actualización del sistema",
  backup_created: "Creación de copia de seguridad",
  backup_restored: "Restauración de copia de seguridad",

  // Errores
  error: "Error",
  api_error: "Error de API",
  validation_error: "Error de validación",
  rate_limit_exceeded: "Límite de tasa excedido",
}

// Categorías de acciones para filtrado (ampliadas con las nuevas acciones)
const ACTION_CATEGORIES = {
  all: "Todos",
  authentication: ["login", "logout", "password_reset", "password_change", "two_factor_auth"],
  templates: [
    "create_template",
    "creacion_plantilla",
    "update_template",
    "delete_template",
    "duplicate_template",
    "import_template",
    "export_template",
  ],
  variables: ["create_variable", "update_variable", "delete_variable"], // Nueva categoría
  contacts: [
    "create_contact",
    "update_contact",
    "delete_contact",
    "import_contacts",
    "export_contacts",
    "create_group",
    "update_group",
    "delete_group",
    "add_to_group",
    "add_contacts_to_group",
    "remove_from_group",
  ],
  messages: ["send_sms", "send_bulk_sms", "schedule_sms", "cancel_sms", "bulk_send"],
  campaigns: [
    "create_campaign",
    "update_campaign",
    "delete_campaign",
    "start_campaign",
    "pause_campaign",
    "resume_campaign",
    "stop_campaign",
  ],
  settings: [
    "update_settings",
    "api_key_generated",
    "api_key_revoked",
    "webhook_created",
    "webhook_updated",
    "webhook_deleted",
  ],
  billing: [
    "payment_processed",
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
    "invoice_generated",
  ],
  system: ["system_update", "backup_created", "backup_restored"],
  errors: ["error", "api_error", "validation_error", "rate_limit_exceeded"],
}

export default function LogsPage({ initialLogs = [] }) {
  const [logs, setLogs] = useState(initialLogs)
  const [filteredLogs, setFilteredLogs] = useState(initialLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Cargar logs al inicio
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/logs")
        if (response.ok) {
          const data = await response.json()
          setLogs(data)
          setFilteredLogs(data)
        }
      } catch (error) {
        console.error("Error al cargar logs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [])

  // Función para obtener el nombre amigable de una acción
  const getActionName = (action) => {
    return ACTION_NAMES[action] || action
  }

  // Función para obtener el color del texto según la acción
  const getActionColor = (action) => {
    // Acciones de autenticación
    if (["login", "logout", "password_reset", "password_change", "two_factor_auth"].includes(action)) {
      return "text-blue-500"
    }

    // Acciones de creación
    if (
      action.startsWith("create_") ||
      action.includes("creacion") ||
      action.includes("import") ||
      action.includes("add_to") ||
      action.includes("add_contacts")
    ) {
      return "text-green-500"
    }

    // Acciones de actualización
    if (action.startsWith("update_") || action.includes("duplicate") || action.includes("resume")) {
      return "text-amber-500"
    }

    // Acciones de eliminación
    if (
      action.startsWith("delete_") ||
      action.includes("cancel") ||
      action.includes("remove") ||
      action.includes("revoked") ||
      action.includes("stop")
    ) {
      return "text-orange-500"
    }

    // Acciones de mensajes
    if (action.includes("sms") || action.includes("bulk_send") || action.includes("send_bulk")) {
      return "text-purple-500"
    }

    // Acciones de facturación
    if (action.includes("payment") || action.includes("subscription") || action.includes("invoice")) {
      return "text-indigo-500"
    }

    // Acciones de sistema
    if (action.includes("system") || action.includes("backup")) {
      return "text-cyan-500"
    }

    // Errores
    if (action.includes("error") || action.includes("exceeded")) {
      return "text-red-500"
    }

    // Por defecto
    return "text-gray-500"
  }

  // Manejar cambios en la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    applyFilters(term, activeFilter)
  }

  // Manejar cambios en el filtro
  const handleFilter = (filter) => {
    setActiveFilter(filter)
    applyFilters(searchTerm, filter)
  }

  // Aplicar filtros y búsqueda
  const applyFilters = (term, filter) => {
    let result = [...logs]

    // Aplicar búsqueda
    if (term) {
      result = result.filter(
        (log) =>
          log.id.toString().includes(term) ||
          (log.usuario_id && log.usuario_id.toString().includes(term)) ||
          getActionName(log.accion).toLowerCase().includes(term) ||
          (log.descripcion && log.descripcion.toLowerCase().includes(term)) ||
          (log.direccion_ip && log.direccion_ip.toLowerCase().includes(term)),
      )
    }

    // Aplicar filtro de categoría
    if (filter !== "all") {
      const filterActions = Array.isArray(ACTION_CATEGORIES[filter]) ? ACTION_CATEGORIES[filter] : [filter]
      result = result.filter((log) => filterActions.includes(log.accion))
    }

    setFilteredLogs(result)
  }

  // Exportar logs a CSV
  const exportToCSV = () => {
    // Crear encabezados CSV
    const headers = ["ID", "Usuario", "Acción", "Descripción", "Dirección IP", "Fecha"]

    // Convertir datos a formato CSV
    const csvData = filteredLogs.map((log) => [
      log.id,
      log.usuario_id ? `Usuario ${log.usuario_id}` : "Sistema",
      getActionName(log.accion),
      log.descripcion || "",
      log.direccion_ip || "",
      new Date(log.fecha_creacion).toLocaleString(),
    ])

    // Combinar encabezados y datos
    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `logs_actividad_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            <Input
              type="search"
              placeholder="Buscar logs..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {activeFilter === "all"
                  ? "Todos"
                  : typeof ACTION_CATEGORIES[activeFilter] === "string"
                    ? ACTION_CATEGORIES[activeFilter]
                    : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por Categoría</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilter("all")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("authentication")}>Autenticación</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("templates")}>Plantillas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("variables")}>Variables</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("contacts")}>Contactos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("messages")}>Mensajes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("campaigns")}>Campañas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("settings")}>Configuración</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("billing")}>Facturación</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("system")}>Sistema</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("errors")}>Errores</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={exportToCSV}>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="py-6">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Cargando registros...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.usuario_id ? `Usuario ${log.usuario_id}` : "Sistema"}</TableCell>
                    <TableCell className={getActionColor(log.accion)}>{getActionName(log.accion)}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.descripcion}</TableCell>
                    <TableCell className="hidden md:table-cell">{log.direccion_ip}</TableCell>
                    <TableCell>{new Date(log.fecha_creacion).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="py-6">
                      <p className="text-muted-foreground">
                        {searchTerm || activeFilter !== "all"
                          ? "No se encontraron registros que coincidan con los criterios de búsqueda"
                          : "No hay registros de actividad disponibles"}
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

