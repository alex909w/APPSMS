import { NextResponse } from "next/server"
import { getDetallesGrupo, enviarMensaje, registrarActividad } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { grupoId, mensaje, plantillaId, variablesUsadas, estadoSimulado, tasaExito } = await request.json()

    if (!grupoId || !mensaje) {
      return NextResponse.json({ error: "Grupo y mensaje son requeridos" }, { status: 400 })
    }

    // Obtener contactos del grupo
    const grupo = await getDetallesGrupo(Number.parseInt(grupoId))

    if (!grupo || !grupo.miembros || grupo.miembros.length === 0) {
      return NextResponse.json({ error: "El grupo no existe o no tiene contactos" }, { status: 400 })
    }

    const resultados = {
      total: grupo.miembros.length,
      enviados: 0,
      fallidos: 0,
      detalles: [],
    }

    // Validar el estado simulado si se proporciona
    const estado =
      estadoSimulado && ["enviado", "entregado", "fallido", "pendiente"].includes(estadoSimulado)
        ? estadoSimulado
        : "enviado" // Estado predeterminado

    // Validar la tasa de éxito (entre 0 y 100)
    const tasa = tasaExito !== undefined ? Math.min(Math.max(Number(tasaExito), 0), 100) : 100

    // Procesar cada contacto
    for (const contacto of grupo.miembros) {
      try {
        // Simular un pequeño retraso para cada mensaje
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Determinar si este mensaje será exitoso o fallido basado en la tasa de éxito
        const esExitoso = Math.random() * 100 <= tasa

        if (esExitoso) {
          // Enviar mensaje con el estado simulado
          const resultado = await enviarMensaje(
            contacto.telefono,
            mensaje,
            plantillaId ? Number.parseInt(plantillaId) : undefined,
            variablesUsadas,
            estado, // Usar el estado simulado
          )

          resultados.enviados++
          resultados.detalles.push({
            contactoId: contacto.id,
            telefono: contacto.telefono,
            estado: estado,
            mensajeId: resultado.id, // Acceder directamente al ID del resultado
          })
        } else {
          // Simular un mensaje fallido
          resultados.fallidos++
          resultados.detalles.push({
            contactoId: contacto.id,
            telefono: contacto.telefono,
            estado: "fallido",
            error: "Error simulado en el envío",
          })
        }
      } catch (error: any) {
        resultados.fallidos++
        resultados.detalles.push({
          contactoId: contacto.id,
          telefono: contacto.telefono,
          estado: "fallido",
          error: error.message || "Error desconocido",
        })
      }
    }

    // Registrar actividad
    await registrarActividad({
      accion: "send_bulk_sms",
      descripcion: `Envío masivo a grupo ${grupoId}: ${resultados.enviados} enviados, ${resultados.fallidos} fallidos`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json({
      resultados,
      success: true,
      message: `Se han enviado ${resultados.enviados} mensajes exitosamente y fallaron ${resultados.fallidos} mensajes`,
    })
  } catch (error: any) {
    console.error("Error en envío masivo:", error)
    return NextResponse.json(
      {
        error: error.message || "Error en envío masivo",
        success: false,
      },
      { status: 500 },
    )
  }
}

