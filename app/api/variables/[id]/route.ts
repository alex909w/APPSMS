import { NextResponse } from "next/server"
import { eliminarVariable, actualizarVariable, registrarActividad, executeQuery } from "@/lib/db"

// Get a specific variable
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Validamos que sea un número válido antes de usarlo en la consulta
    const numericId = Number.parseInt(id)
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const variable = await executeQuery<any[]>(`SELECT * FROM variables WHERE id = ?`, [numericId])

    if (!variable || variable.length === 0) {
      return NextResponse.json({ error: "Variable no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ variable: variable[0] })
  } catch (error) {
    console.error("Error al obtener variable:", error)
    return NextResponse.json({ error: "Error al obtener variable" }, { status: 500 })
  }
}

// Update a variable
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const numericId = Number.parseInt(id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const { nombre, descripcion, ejemplo } = await request.json()

    if (!nombre || !descripcion) {
      return NextResponse.json({ error: "Nombre y descripción son requeridos" }, { status: 400 })
    }

    await actualizarVariable(numericId, nombre, descripcion, ejemplo || "")

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "update_variable",
      `Variable actualizada: ${nombre}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json({ message: "Variable actualizada exitosamente" })
  } catch (error) {
    console.error("Error al actualizar variable:", error)
    return NextResponse.json({ error: "Error al actualizar variable" }, { status: 500 })
  }
}

// Delete a variable
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const numericId = Number.parseInt(id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await eliminarVariable(numericId)

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "delete_variable",
      `Variable eliminada: ID ${id}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json({ message: "Variable eliminada exitosamente" })
  } catch (error) {
    console.error("Error al eliminar variable:", error)
    return NextResponse.json({ error: "Error al eliminar variable" }, { status: 500 })
  }
}

