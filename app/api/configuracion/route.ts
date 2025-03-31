import { NextResponse } from "next/server"
import { actualizarConfiguracion } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar los datos recibidos
    if (data.costo_mensaje !== undefined) {
      await actualizarConfiguracion("costo_mensaje", data.costo_mensaje.toString())
    }

    if (data.moneda !== undefined) {
      await actualizarConfiguracion("moneda", data.moneda)
    }

    return NextResponse.json({ success: true, message: "Configuración actualizada correctamente" })
  } catch (error) {
    console.error("Error al actualizar configuración:", error)
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // En una implementación real, aquí se obtendría la configuración de la base de datos
    return NextResponse.json({
      costo_mensaje: "0.032",
      moneda: "€",
    })
  } catch (error) {
    console.error("Error al obtener configuración:", error)
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 })
  }
}