import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const {
      grupoId,
      mensaje,
      plantillaId,
      variablesUsadas,
      estadoSimulado = "enviado",
      tasaExito = 100,
    } = await request.json()

    // Validar campos requeridos
    if (!grupoId || !mensaje) {
      return NextResponse.json({ error: "Grupo y mensaje son requeridos" }, { status: 400 })
    }

    // Obtener contactos del grupo
    const contactos = await executeQuery<any>(
      `SELECT c.* FROM contactos c
       INNER JOIN grupo_contacto gc ON c.id = gc.contacto_id
       WHERE gc.grupo_id = $1`,
      [grupoId],
    )

    if (contactos.length === 0) {
      return NextResponse.json({ error: "El grupo seleccionado no tiene contactos" }, { status: 400 })
    }

    // Validar y establecer el estado
    const estado = ["enviado", "entregado", "fallido", "pendiente"].includes(estadoSimulado)
      ? estadoSimulado
      : "enviado"

    // Simular envío de mensajes
    const resultados = {
      total: contactos.length,
      enviados: 0,
      fallidos: 0,
      detalles: [],
    }

    // Procesar cada contacto
    for (const contacto of contactos) {
      // Reemplazar variables en el mensaje para cada contacto
      let mensajePersonalizado = mensaje

      // Reemplazar variables específicas del contacto si están disponibles
      if (contacto.nombre) {
        mensajePersonalizado = mensajePersonalizado.replace(/<nombre>/g, contacto.nombre)
      }
      if (contacto.apellido) {
        mensajePersonalizado = mensajePersonalizado.replace(/<apellido>/g, contacto.apellido)
      }

      // Reemplazar otras variables genéricas
      if (variablesUsadas) {
        Object.entries(variablesUsadas).forEach(([key, value]) => {
          const regex = new RegExp(`<${key}>`, "g")
          mensajePersonalizado = mensajePersonalizado.replace(regex, value as string)
        })
      }

      // Determinar si el mensaje es exitoso basado en la tasa de éxito
      const esExitoso = Math.random() * 100 <= tasaExito

      // Estado final del mensaje
      const estadoFinal = esExitoso ? estado : "fallido"

      // Registrar el mensaje en la base de datos
      const resultado = await executeQuery<any>(
        `INSERT INTO mensajes_enviados 
         (telefono, contenido_mensaje, plantilla_id, variables_usadas, estado, fecha_envio) 
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          contacto.telefono,
          mensajePersonalizado,
          plantillaId || null,
          variablesUsadas ? JSON.stringify(variablesUsadas) : null,
          estadoFinal,
        ],
      )

      // Actualizar contadores
      if (estadoFinal === "fallido") {
        resultados.fallidos++
      } else {
        resultados.enviados++
      }

      // Añadir detalles del envío
      resultados.detalles.push({
        id: resultado[0].id,
        telefono: contacto.telefono,
        nombre: contacto.nombre,
        apellido: contacto.apellido,
        estado: estadoFinal,
      })
    }

    return NextResponse.json(
      {
        message: `Mensajes enviados: ${resultados.enviados}, fallidos: ${resultados.fallidos}`,
        resultados,
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al enviar mensajes masivos:", error)
    return NextResponse.json(
      {
        error: "Error al enviar mensajes masivos",
        details: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    )
  }
}

