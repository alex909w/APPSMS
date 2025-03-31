import { NextResponse } from "next/server"
import { getMensajesEnviados, registrarActividad, executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const mensajes = await getMensajesEnviados()
    return NextResponse.json({ mensajes })
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

// Modifica la función POST para aceptar un estado simulado
export async function POST(request: Request) {
  try {
    const { telefono, contenido, plantillaId, variablesUsadas, estadoSimulado } = await request.json()

    if (!telefono || !contenido) {
      return NextResponse.json({ error: "Teléfono y contenido son requeridos" }, { status: 400 })
    }

    // Validar el estado simulado si se proporciona
    const estado =
      estadoSimulado && ["enviado", "entregado", "fallido", "pendiente"].includes(estadoSimulado)
        ? estadoSimulado
        : "enviado" // Estado predeterminado

    // Simular un pequeño retraso para dar sensación de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Enviar mensaje (guardar en la base de datos)
    const resultado = await executeQuery(
      `INSERT INTO mensajes_enviados 
       (telefono, contenido_mensaje, plantilla_id, variables_usadas, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [telefono, contenido, plantillaId || null, JSON.stringify(variablesUsadas || {}), estado],
    )

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "send_sms",
      `Mensaje enviado a ${telefono}${plantillaId ? ` usando plantilla ID ${plantillaId}` : ""}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Mensaje enviado exitosamente",
        id: resultado.insertId,
        success: true,
        details: {
          telefono,
          estado,
          fecha: new Date().toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    return NextResponse.json({ error: "Error al enviar mensaje", success: false }, { status: 500 })
  }
}

