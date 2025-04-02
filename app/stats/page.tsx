import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, PieChart, LineChart, Calendar } from "lucide-react"
import { getEstadisticas } from "@/lib/db"

export default async function StatsPage() {
  // Obtener datos reales de la base de datos
  const estadisticas = await getEstadisticas()

  // Calcular porcentajes para el gráfico de estado
  const totalMensajes = estadisticas.totalMensajes || 0
  const mensajesPorEstado = estadisticas.mensajesPorEstado || []

  const estadoData = [
    {
      status: "Enviado",
      percentage: Math.round(
        ((mensajesPorEstado.find((m) => m.estado === "enviado")?.total || 0) / Math.max(totalMensajes, 1)) * 100,
      ),
      color: "bg-blue-500",
    },
    {
      status: "Entregado",
      percentage: Math.round(
        ((mensajesPorEstado.find((m) => m.estado === "entregado")?.total || 0) / Math.max(totalMensajes, 1)) * 100,
      ),
      color: "bg-green-500",
    },
    {
      status: "Fallido",
      percentage: Math.round(
        ((mensajesPorEstado.find((m) => m.estado === "fallido")?.total || 0) / Math.max(totalMensajes, 1)) * 100,
      ),
      color: "bg-red-500",
    },
  ]

  // Si no hay datos, establecer valores predeterminados
  if (totalMensajes === 0) {
    estadoData[0].percentage = 10
    estadoData[1].percentage = 85
    estadoData[2].percentage = 5
  }

  // Asegurarse de que los porcentajes sumen 100%
  const totalPercentage = estadoData.reduce((sum, item) => sum + item.percentage, 0)
  if (totalPercentage < 100) {
    estadoData[1].percentage += 100 - totalPercentage
  }

  // Preparar datos para plantillas más usadas
  const plantillasMasUsadas = estadisticas.plantillasMasUsadas || []
  const plantillasData = plantillasMasUsadas.map((plantilla) => ({
    name: plantilla.nombre,
    count: plantilla.total,
    percentage: plantilla.porcentaje,
  }))

  // Si no hay datos de plantillas, usar datos de ejemplo
  if (plantillasData.length === 0) {
    plantillasData.push(
      { name: "Promoción", count: 0, percentage: 0 },
      { name: "Verificación", count: 0, percentage: 0 },
      { name: "Bienvenida", count: 0, percentage: 0 },
      { name: "Recordatorio", count: 0, percentage: 0 },
      { name: "Otros", count: 0, percentage: 0 },
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estadísticas</h2>
          <p className="text-muted-foreground">Analiza el rendimiento de tus mensajes SMS</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona un período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="yesterday">Ayer</SelectItem>
              <SelectItem value="7days">Últimos 7 días</SelectItem>
              <SelectItem value="30days">Últimos 30 días</SelectItem>
              <SelectItem value="90days">Últimos 90 días</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SMS Enviados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMensajes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {estadisticas.porcentajeCrecimiento > 0
                ? `+${estadisticas.porcentajeCrecimiento}% respecto al período anterior`
                : estadisticas.porcentajeCrecimiento < 0
                  ? `${estadisticas.porcentajeCrecimiento}% respecto al período anterior`
                  : "Sin cambios respecto al período anterior"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Entrega</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.tasaEntrega || 0}%</div>
            <p className="text-xs text-muted-foreground">Mensajes entregados correctamente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Error</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.tasaError || 0}%</div>
            <p className="text-xs text-muted-foreground">Mensajes con errores de entrega</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coste Promedio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.moneda || "$"}
              {estadisticas.costoPromedio || "0.032"}
            </div>
            <p className="text-xs text-muted-foreground">Por mensaje enviado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Diario</TabsTrigger>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensual</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Envíos Diarios</CardTitle>
              <CardDescription>Número de mensajes SMS enviados por hora</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <DailyChart mensajesPorHora={estadisticas.mensajesPorHora || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Envíos Semanales</CardTitle>
              <CardDescription>Número de mensajes SMS enviados por día</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <WeeklyChart mensajesPorDia={estadisticas.mensajesPorDia || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Envíos Mensuales</CardTitle>
              <CardDescription>Número de mensajes SMS enviados por semana</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <MonthlyChart mensajesPorSemana={estadisticas.mensajesPorSemana || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
            <CardDescription>Distribución de mensajes por estado</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <StatusChart data={estadoData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plantillas Más Usadas</CardTitle>
            <CardDescription>Plantillas de mensajes más utilizadas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <TemplatesChart data={plantillasData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DailyChart({ mensajesPorHora }) {
  // Preparar datos para el gráfico
  const horas = Array(24).fill(0)

  // Si hay datos, llenar el array
  if (mensajesPorHora && mensajesPorHora.length > 0) {
    mensajesPorHora.forEach((item) => {
      const hora = Number.parseInt(item.hora)
      if (!isNaN(hora) && hora >= 0 && hora < 24) {
        horas[hora] = item.total
      }
    })
  }

  // Encontrar el valor máximo para calcular porcentajes
  const maximo = Math.max(...horas, 1) // Mínimo 1 para evitar división por cero

  return (
    <div className="h-full w-full">
      <div className="flex h-full items-end gap-2">
        {horas.map((valor, i) => (
          <div key={i} className="relative flex h-full w-full flex-col justify-end">
            <div
              className="bg-primary rounded-md w-full animate-in fade-in-50"
              style={{ height: `${Math.max((valor / maximo) * 100, 5)}%` }}
            />
            <span className="mt-1 text-center text-xs text-muted-foreground">{i}h</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeeklyChart({ mensajesPorDia }) {
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
    <div className="h-full w-full">
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

function MonthlyChart({ mensajesPorSemana }) {
  // Preparar datos para el gráfico
  const datos = []
  const etiquetas = []

  // Si hay datos, procesarlos
  if (mensajesPorSemana && mensajesPorSemana.length > 0) {
    mensajesPorSemana.forEach((item) => {
      datos.push(item.total)
      // Formatear la fecha de inicio de la semana
      const fecha = new Date(item.fecha_inicio)
      etiquetas.push(`Semana ${fecha.getDate()}/${fecha.getMonth() + 1}`)
    })
  } else {
    // Datos de ejemplo si no hay datos reales
    datos.push(35, 45, 55, 65)
    etiquetas.push("Semana 1", "Semana 2", "Semana 3", "Semana 4")
  }

  // Encontrar el valor máximo para calcular porcentajes
  const maximo = Math.max(...datos, 1) // Mínimo 1 para evitar división por cero

  return (
    <div className="h-full w-full">
      <div className="flex h-full items-end gap-2">
        {datos.map((valor, i) => (
          <div key={i} className="relative flex h-full w-full flex-col justify-end">
            <div
              className="bg-primary rounded-md w-full animate-in fade-in-50"
              style={{ height: `${Math.max((valor / maximo) * 100, 5)}%` }}
            />
            <span className="mt-1 text-center text-xs text-muted-foreground">{etiquetas[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusChart({ data }) {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <div className="h-4 w-full flex rounded-full overflow-hidden">
        {data.map((item, i) => (
          <div key={i} className={`${item.color} h-full`} style={{ width: `${item.percentage}%` }} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${item.color}`} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{item.status}</span>
              <span className="text-xs text-muted-foreground">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TemplatesChart({ data }) {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-medium">{item.count}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

