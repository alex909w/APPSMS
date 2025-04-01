import { NextResponse } from "next/server"
import { eliminarContacto, actualizarContacto, registrarActividad, executeQuery } from "@/lib/db"

// Helper para validar ID
const validateContactId = (id: string): number | null => {
  const numericId = Number(id)
  return isNaN(numericId) || numericId <= 0 ? null : numericId
}

// Helper para validar formato de teléfono
const isValidPhone = (phone: string): boolean => {
  // Corregido: eliminado el carácter ● que podría estar causando problemas
  return /^\+(?:[0-9]){6,14}[0-9]$/.test(phone)
}

// Helper para validar email
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Tipo para los datos del contacto
type ContactData = {
  id?: number
  telefono: string
  nombre: string
  apellido: string | null
  correo: string | null
}

// Obtener un contacto específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Usamos el método recomendado por Next.js para acceder a params
    const { id } = params
    const numericId = validateContactId(id)

    if (!numericId) {
      return NextResponse.json({ success: false, error: "ID de contacto inválido" }, { status: 400 })
    }

    const result = await executeQuery(
      `SELECT id, telefono, nombre, apellido, correo 
       FROM contactos 
       WHERE id = $1`,
      [numericId],
    )

    if (!result?.length) {
      return NextResponse.json({ success: false, error: "Contacto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error: any) {
    console.error("Error al obtener contacto:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener contacto",
      },
      { status: 500 },
    )
  }
}

// Actualizar un contacto
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = validateContactId(params.id)
    if (!numericId) {
      return NextResponse.json({ success: false, error: "ID de contacto inválido" }, { status: 400 })
    }

    const { telefono, nombre, apellido, correo } = await request.json()

    // Validaciones
    if (!telefono?.trim()) {
      return NextResponse.json({ success: false, error: "El teléfono es requerido" }, { status: 400 })
    }

    if (!nombre?.trim()) {
      return NextResponse.json({ success: false, error: "El nombre es requerido" }, { status: 400 })
    }

    if (!isValidPhone(telefono)) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato de teléfono inválido. Use formato internacional: +50312345678",
        },
        { status: 400 },
      )
    }

    if (correo && !isValidEmail(correo)) {
      return NextResponse.json({ success: false, error: "Formato de correo inválido" }, { status: 400 })
    }

    // Actualizar contacto - CORREGIDO: Pasar id y data como parámetros separados
    const updatedContact = await actualizarContacto(numericId.toString(), {
      telefono: telefono.trim(),
      nombre: nombre.trim(),
      apellido: apellido?.trim() || null,
      correo: correo?.trim() || null,
    })

    // Registrar actividad
    await registrarActividad({
      accion: "update_contact",
      descripcion: `Contacto actualizado: ${nombre} ${apellido || ""} (${telefono})`,
      ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json({
      success: true,
      message: "Contacto actualizado exitosamente",
      data: updatedContact,
    })
  } catch (error: any) {
    console.error("Error al actualizar contacto:", error)

    if (error.code === "23505") {
      return NextResponse.json({ success: false, error: "El teléfono ya está registrado" }, { status: 409 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al actualizar contacto",
      },
      { status: 500 },
    )
  }
}

// Eliminar un contacto
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const numericId = validateContactId(params.id)
    if (!numericId) {
      return NextResponse.json({ success: false, error: "ID de contacto inválido" }, { status: 400 })
    }

    // Obtener datos del contacto antes de eliminar
    const contact = await executeQuery<{
      nombre: string
      apellido: string | null
      telefono: string
    }>("SELECT nombre, apellido, telefono FROM contactos WHERE id = $1", [numericId])

    if (!contact?.length) {
      return NextResponse.json({ success: false, error: "Contacto no encontrado" }, { status: 404 })
    }

    await eliminarContacto(numericId.toString())

    await registrarActividad({
      accion: "delete_contact",
      descripcion: `Contacto eliminado: ${contact[0].nombre} ${contact[0].apellido || ""} (${contact[0].telefono})`,
      ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json({
      success: true,
      message: "Contacto eliminado exitosamente",
    })
  } catch (error: any) {
    console.error("Error al eliminar contacto:", error)

    if (error.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          error: "No se puede eliminar el contacto porque tiene registros asociados",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al eliminar contacto",
      },
      { status: 500 },
    )
  }
}

