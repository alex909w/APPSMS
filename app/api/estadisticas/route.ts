import { NextResponse } from "next/server"
import { getEstadisticas } from "@/lib/db"

export async function GET() {
  try {
    const estadisticas = await getEstadisticas()
    return NextResponse.json({ estadisticas })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}

