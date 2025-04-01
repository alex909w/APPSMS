import { NextResponse } from "next/server"
import { eliminarPlantilla, actualizarPlantilla, registrarActividad, executeQuery } from "@/lib/db"

// Helper function to parse and validate ID
const parseAndValidateId = (id: string) => {
  const numericId = Number.parseInt(id)
  if (isNaN(numericId)) {
    throw new Error("ID inválido")
  }
  return numericId
}

// Get a specific template
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = parseAndValidateId(params.id)

    const plantilla = await executeQuery<any[]>(
      "SELECT * FROM plantillas_mensaje WHERE id = $1", 
      [numericId]
    )

    if (!plantilla || plantilla.length === 0) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ plantilla: plantilla[0] })
  } catch (error) {
    console.error("Error al obtener plantilla:", error)
    const status = error instanceof Error && error.message === "ID inválido" ? 400 : 500
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Error al obtener plantilla"
      }, 
      { status }
    )
  }
}

// Update a template
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = parseAndValidateId(params.id)
    const requestData = await request.json()

    // Validación de campos requeridos
    if (!requestData.nombre || !requestData.contenido) {
      return NextResponse.json(
        { error: "Nombre y contenido son requeridos" }, 
        { status: 400 }
      )
    }

    // Actualizar plantilla
    const updatedTemplate = await actualizarPlantilla({
      id: numericId,
      nombre: requestData.nombre,
      contenido: requestData.contenido,
      descripcion: requestData.descripcion || null
    })

    if (!updatedTemplate || updatedTemplate.length === 0) {
      throw new Error("No se pudo actualizar la plantilla")
    }

    // Registrar actividad
    await registrarActividad({
      usuario_id: null,
      accion: "update_template",
      tipo_entidad: "plantilla_mensaje",
      entidad_id: numericId,
      descripcion: `Plantilla actualizada: ${requestData.nombre}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido"
    })

    return NextResponse.json({ 
      message: "Plantilla actualizada exitosamente",
      plantilla: updatedTemplate[0]
    })
  } catch (error) {
    console.error("Error al actualizar plantilla:", error)
    const status = error instanceof Error && error.message === "ID inválido" ? 400 : 500
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Error al actualizar plantilla"
      }, 
      { status }
    )
  }
}

// Delete a template
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = parseAndValidateId(params.id)

    // Obtener plantilla antes de eliminar para registrar su nombre
    const plantilla = await executeQuery<any[]>(
      "SELECT nombre FROM plantillas_mensaje WHERE id = $1",
      [numericId]
    )

    if (!plantilla || plantilla.length === 0) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    // Eliminar plantilla
    await eliminarPlantilla(numericId)

    // Registrar actividad
    await registrarActividad({
      usuario_id: null,
      accion: "delete_template",
      tipo_entidad: "plantilla_mensaje",
      entidad_id: numericId,
      descripcion: `Plantilla eliminada: ${plantilla[0].nombre}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido"
    })

    return NextResponse.json({ 
      message: "Plantilla eliminada exitosamente",
      id: numericId
    })
  } catch (error) {
    console.error("Error al eliminar plantilla:", error)
    const status = error instanceof Error && error.message === "ID inválido" ? 400 : 500
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Error al eliminar plantilla"
      }, 
      { status }
    )
  }
}