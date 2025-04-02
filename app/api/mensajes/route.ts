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

export async function POST(request: Request) {
  try {
    const { telefono, contenido, plantillaId, variablesUsadas, estadoSimulado } = await request.json()

    // Validación de campos requeridos
    if (!telefono || !contenido) {
      return NextResponse.json({ error: "Teléfono y contenido son requeridos" }, { status: 400 })
    }

    // Verificar que el teléfono existe en la base de datos de contactos
    const contactoExistente = await executeQuery<any>(`SELECT * FROM contactos WHERE telefono = $1 LIMIT 1`, [telefono])

    if (contactoExistente.length === 0) {
      return NextResponse.json(
        {
          error: "El número de teléfono no está registrado en la base de datos de contactos",
          success: false,
        },
        { status: 400 },
      )
    }

    // Validar y establecer el estado
    const estado = ["enviado", "entregado", "fallido", "pendiente"].includes(estadoSimulado)
      ? estadoSimulado
      : "enviado"

    // Simular retraso de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Enviar mensaje (usando parámetros $1, $2, etc. para PostgreSQL)
    const resultado = await executeQuery<any>(
      `INSERT INTO mensajes_enviados 
       (telefono, contenido_mensaje, plantilla_id, variables_usadas, estado, fecha_envio) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [telefono, contenido, plantillaId || null, variablesUsadas ? JSON.stringify(variablesUsadas) : null, estado],
    )

    // Registrar actividad actualizada
    await registrarActividad({
      usuario_id: null,
      accion: "send_sms",
      tipo_entidad: "mensaje",
      entidad_id: resultado[0].id,
      descripcion: `Mensaje enviado a ${telefono}${plantillaId ? ` usando plantilla ID ${plantillaId}` : ""}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido",
    })

    return NextResponse.json(
      {
        message: "Mensaje enviado exitosamente",
        mensaje: resultado[0],
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
    return NextResponse.json(
      {
        error: "Error al enviar mensaje",
        details: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    )
  }
}

