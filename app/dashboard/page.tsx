import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Send, Users, Variable } from "lucide-react"
import { getEstadisticas, getPlantillasMensaje, getVariables, getContactos, getMensajesEnviados } from "@/lib/db"

export default async function Dashboard() {
  // Obtener datos reales de la base de datos
  const estadisticas = await getEstadisticas()
  const plantillas = await getPlantillasMensaje()
  const variables = await getVariables()
  const contactos = await getContactos()
  const mensajesRecientes = await getMensajesEnviados()

  // Calcular estadísticas
  const mensajesHoy = mensajesRecientes.filter(
    (m) => new Date(m.fecha_envio).toDateString() === new Date().toDateString(),
  ).length

  const plantillasActivas = plantillas.filter((p) => p.activo).length
  const variablesDisponibles = variables.length
  const contactosTotales = contactos.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Bienvenido a la aplicación de gestión de SMS</p>
        </div>
        <Link href="/send-sms">
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Enviar SMS
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Enviados Hoy</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mensajesHoy}</div>
            <p className="text-xs text-muted-foreground">
              {mensajesHoy > 0 ? "+15% respecto a ayer" : "Sin mensajes enviados hoy"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plantillas Activas</CardTitle>
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plantillasActivas}</div>
            <p className="text-xs text-muted-foreground">
              {plantillasActivas > 0 ? `${plantillasActivas} plantillas disponibles` : "Sin plantillas activas"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variables Disponibles</CardTitle>
            <Variable className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{variablesDisponibles}</div>
            <p className="text-xs text-muted-foreground">
              {variablesDisponibles > 0 ? "Variables configuradas" : "Sin variables configuradas"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contactos Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactosTotales}</div>
            <p className="text-xs text-muted-foreground">
              {contactosTotales > 0 ? `${contactosTotales} contactos registrados` : "Sin contactos registrados"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad de Envío</CardTitle>
            <CardDescription>Mensajes SMS enviados en los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ActivityChart mensajesPorDia={estadisticas.mensajesPorDia || []} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Mensajes Recientes</CardTitle>
            <CardDescription>Últimos mensajes SMS enviados</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentMessages mensajes={mensajesRecientes.slice(0, 4)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ActivityChart({ mensajesPorDia }) {
  // Preparar datos para el gráfico
  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  const datos = Array(7).fill(0)

  // Si hay datos, llenar el array
  if (mensajesPorDia && mensajesPorDia.length > 0) {
    mensajesPorDia.forEach((item) => {
      const fecha = new Date(item.fecha)
      const diaSemana = fecha.getDay() // 0 = Domingo, 1 = Lunes, etc.
      const indice = diaSemana === 0 ? 6 : diaSemana - 1 // Convertir a 0 = Lunes, 6 = Domingo
      datos[indice] = item.total
    })
  }

  // Encontrar el valor máximo para calcular porcentajes
  const maximo = Math.max(...datos, 1) // Mínimo 1 para evitar división por cero

  return (
    <div className="h-[200px] w-full">
      <div className="flex h-full items-end gap-2">
        {datos.map((valor, i) => (
          <div key={i} className="relative flex h-full w-full flex-col justify-end">
            <div
              className="bg-primary rounded-md w-full animate-in fade-in-50"
              style={{ height: `${Math.max((valor / maximo) * 100, 5)}%` }}
            />
            <span className="mt-1 text-center text-xs text-muted-foreground">{diasSemana[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentMessages({ mensajes }) {
  return (
    <div className="space-y-4">
      {mensajes.length > 0 ? (
        mensajes.map((mensaje) => (
          <div key={mensaje.id} className="flex items-start gap-4">
            <div className="rounded-full p-2 bg-primary/10">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{mensaje.telefono}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{mensaje.contenido_mensaje}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${
                    mensaje.estado === "enviado"
                      ? "bg-blue-500"
                      : mensaje.estado === "entregado"
                        ? "bg-green-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground">{new Date(mensaje.fecha_envio).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No hay mensajes recientes</p>
      )}
    </div>
  )
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

