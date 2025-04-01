import { NextResponse } from "next/server"
import { eliminarVariable, actualizarVariable, registrarActividad, executeQuery } from "@/lib/db"

export const dynamic = 'force-dynamic' // Para evitar problemas con params

// Get a specific variable
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = Number(params.id)
    
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Cambiado de ? a $1 para PostgreSQL
    const variable = await executeQuery<any[]>(
      "SELECT * FROM variables WHERE id = $1", 
      [numericId]
    )

    if (!variable || variable.length === 0) {
      return NextResponse.json({ error: "Variable no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ variable: variable[0] })
  } catch (error) {
    console.error("Error al obtener variable:", error)
    return NextResponse.json(
      { 
        error: "Error al obtener variable",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}

// Update a variable
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = Number(params.id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const { nombre, descripcion, ejemplo } = await request.json()

    if (!nombre || !descripcion) {
      return NextResponse.json(
        { error: "Nombre y descripción son requeridos" }, 
        { status: 400 }
      )
    }

    // Actualizado para usar objeto como parámetro
    await actualizarVariable({
      id: numericId,
      nombre,
      descripcion,
      ejemplo: ejemplo || null
    })

    // Registrar actividad actualizada
    await registrarActividad({
      usuario_id: null,
      accion: "update_variable",
      tipo_entidad: "variable",
      entidad_id: numericId,
      descripcion: `Variable actualizada: ${nombre}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido"
    })

    return NextResponse.json({ 
      message: "Variable actualizada exitosamente",
      id: numericId
    })
  } catch (error) {
    console.error("Error al actualizar variable:", error)
    return NextResponse.json(
      { 
        error: "Error al actualizar variable",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}

// Delete a variable
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = Number(params.id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Obtener variable antes de eliminar para registrar su nombre
    const variable = await executeQuery<any[]>(
      "SELECT nombre FROM variables WHERE id = $1",
      [numericId]
    )

    await eliminarVariable(numericId)

    // Registrar actividad actualizada
    await registrarActividad({
      usuario_id: null,
      accion: "delete_variable",
      tipo_entidad: "variable",
      entidad_id: numericId,
      descripcion: `Variable eliminada: ${variable[0]?.nombre || 'ID ' + params.id}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido"
    })

    return NextResponse.json({ 
      message: "Variable eliminada exitosamente",
      id: numericId
    })
  } catch (error) {
    console.error("Error al eliminar variable:", error)
    return NextResponse.json(
      { 
        error: "Error al eliminar variable",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}