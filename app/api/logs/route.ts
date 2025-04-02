import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener logs de la base de datos
    const logs = await executeQuery(`
      SELECT * FROM registros_actividad
      ORDER BY fecha_creacion DESC
      LIMIT 100
    `)

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error al obtener logs:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

