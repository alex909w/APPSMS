import { NextResponse } from "next/server"
import { eliminarContacto, actualizarContacto, registrarActividad, executeQuery } from "@/lib/db"

// Get a specific contact
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Validamos que sea un número válido antes de usarlo en la consulta
    const numericId = Number.parseInt(id)
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const contacto = await executeQuery<any[]>(`SELECT * FROM contactos WHERE id = ?`, [numericId])

    if (!contacto || contacto.length === 0) {
      return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ contacto: contacto[0] })
  } catch (error) {
    console.error("Error al obtener contacto:", error)
    return NextResponse.json({ error: "Error al obtener contacto" }, { status: 500 })
  }
}

// Update a contact
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const numericId = Number.parseInt(id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const { telefono, nombre, apellido, correo } = await request.json()

    if (!telefono || !nombre) {
      return NextResponse.json({ error: "Teléfono y nombre son requeridos" }, { status: 400 })
    }

    await actualizarContacto(numericId, telefono, nombre, apellido || "", correo || "")

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "update_contact",
      `Contacto actualizado: ${nombre} ${apellido || ""} (${telefono})`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json({ message: "Contacto actualizado exitosamente" })
  } catch (error) {
    console.error("Error al actualizar contacto:", error)
    return NextResponse.json({ error: "Error al actualizar contacto" }, { status: 500 })
  }
}

// Delete a contact
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const numericId = Number.parseInt(id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await eliminarContacto(numericId)

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "delete_contact",
      `Contacto eliminado: ID ${id}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json({ message: "Contacto eliminado exitosamente" })
  } catch (error) {
    console.error("Error al eliminar contacto:", error)
    return NextResponse.json({ error: "Error al eliminar contacto" }, { status: 500 })
  }
}

