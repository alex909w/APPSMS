import { NextResponse } from "next/server"
import { getContactos, crearContacto, registrarActividad } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const contactos = await getContactos()
    return NextResponse.json({
      success: true,
      contactos,
    })
  } catch (error: any) {
    console.error("Error al obtener contactos:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al obtener contactos",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Obtener y validar los datos del cuerpo de la solicitud
    let requestData
    try {
      requestData = await request.json()
    } catch (error) {
      return NextResponse.json({ success: false, error: "Formato de datos inválido" }, { status: 400 })
    }

    const { telefono, nombre, apellido, correo } = requestData

    // Validaciones básicas
    if (!telefono?.trim()) {
      return NextResponse.json({ success: false, error: "El teléfono es requerido" }, { status: 400 })
    }

    if (!nombre?.trim()) {
      return NextResponse.json({ success: false, error: "El nombre es requerido" }, { status: 400 })
    }

    // Validar formato de teléfono (opcional, pero recomendado)
    const isValidPhone = (phone: string): boolean => {
      return /^\+(?:[0-9]●?){6,14}[0-9]$/.test(phone)
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

    // Validar formato de correo si está presente
    if (correo) {
      const isValidEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      }

      if (!isValidEmail(correo)) {
        return NextResponse.json({ success: false, error: "Formato de correo inválido" }, { status: 400 })
      }
    }

    // Preparar los datos para crear el contacto
    const contactData = {
      telefono: telefono.trim(),
      nombre: nombre.trim(),
      apellido: apellido?.trim() || null,
      correo: correo?.trim() || null,
    }

    // Crear contacto
    const nuevoContacto = await crearContacto(contactData)

    if (!nuevoContacto) {
      return NextResponse.json({ success: false, error: "No se pudo crear el contacto" }, { status: 500 })
    }

    // Registrar actividad
    await registrarActividad({
      accion: "create_contact",
      descripcion: `Contacto creado: ${nombre} ${apellido || ""} (${telefono})`,
      ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json(
      {
        success: true,
        message: "Contacto creado exitosamente",
        data: nuevoContacto,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error al crear contacto:", error)

    // Manejar error de duplicado (si el teléfono ya existe)
    if (error.code === "23505") {
      return NextResponse.json({ success: false, error: "El teléfono ya está registrado" }, { status: 409 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al crear contacto",
      },
      { status: 500 },
    )
  }
}

