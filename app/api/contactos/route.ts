import { NextResponse } from "next/server"
import { getContactos, crearContacto, registrarActividad } from "@/lib/db"

export async function GET() {
  try {
    const contactos = await getContactos()
    return NextResponse.json({ contactos })
  } catch (error) {
    console.error("Error al obtener contactos:", error)
    return NextResponse.json({ error: "Error al obtener contactos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { telefono, nombre, apellido, correo } = await request.json()

    if (!telefono || !nombre) {
      return NextResponse.json({ error: "Teléfono y nombre son requeridos" }, { status: 400 })
    }

    // Crear contacto
    const resultado = await crearContacto(telefono, nombre, apellido || "", correo || "")

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "create_contact",
      `Contacto creado: ${nombre} ${apellido || ""} (${telefono})`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Contacto creado exitosamente",
        id: resultado.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear contacto:", error)
    return NextResponse.json({ error: "Error al crear contacto" }, { status: 500 })
  }
}

