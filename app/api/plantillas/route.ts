import { NextResponse } from "next/server"
import { getPlantillasMensaje, registrarActividad, crearPlantilla } from "@/lib/db"

export async function GET() {
  try {
    const plantillas = await getPlantillasMensaje()
    return NextResponse.json({ plantillas })
  } catch (error) {
    console.error("Error al obtener plantillas:", error)
    return NextResponse.json({ error: "Error al obtener plantillas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, contenido, descripcion } = await request.json()

    if (!nombre || !contenido) {
      return NextResponse.json({ error: "Nombre y contenido son requeridos" }, { status: 400 })
    }

    // Crear plantilla
    const resultado = await crearPlantilla(nombre, contenido, descripcion || "")

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "create_template",
      `Plantilla creada: ${nombre}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Plantilla creada exitosamente",
        id: resultado.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear plantilla:", error)
    return NextResponse.json({ error: "Error al crear plantilla" }, { status: 500 })
  }
}

