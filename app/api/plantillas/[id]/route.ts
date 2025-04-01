import { NextResponse } from "next/server"
import { eliminarPlantilla, actualizarPlantilla, registrarActividad, executeQuery } from "@/lib/db"

// Get a specific template
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Aseguramos que params.id se use correctamente
    const id = params.id

    // Validamos que sea un número válido antes de usarlo en la consulta
    const numericId = Number.parseInt(id)
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const plantilla = await executeQuery<any[]>(`SELECT * FROM plantillas_mensaje WHERE id = ?`, [numericId])

    if (!plantilla || plantilla.length === 0) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ plantilla: plantilla[0] })
  } catch (error) {
    console.error("Error al obtener plantilla:", error)
    return NextResponse.json({ error: "Error al obtener plantilla" }, { status: 500 })
  }
}

// Update a template
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const numericId = Number.parseInt(id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const { nombre, contenido, descripcion } = await request.json()

    if (!nombre || !contenido) {
      return NextResponse.json({ error: "Nombre y contenido son requeridos" }, { status: 400 })
    }

    await actualizarPlantilla(numericId, nombre, contenido, descripcion || "")

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "update_template",
      `Plantilla actualizada: ${nombre}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json({ message: "Plantilla actualizada exitosamente" })
  } catch (error) {
    console.error("Error al actualizar plantilla:", error)
    return NextResponse.json({ error: "Error al actualizar plantilla" }, { status: 500 })
  }
}

// Delete a template
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const numericId = Number.parseInt(id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await eliminarPlantilla(numericId)

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "delete_template",
      `Plantilla eliminada: ID ${id}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json({ message: "Plantilla eliminada exitosamente" })
  } catch (error) {
    console.error("Error al eliminar plantilla:", error)
    return NextResponse.json({ error: "Error al eliminar plantilla" }, { status: 500 })
  }
}

