import { NextResponse } from "next/server"
import { getPlantillasMensaje, registrarActividad, crearPlantilla } from "@/lib/db"

export async function GET() {
  try {
    const plantillas = await getPlantillasMensaje()
    return NextResponse.json({ plantillas })
  } catch (error) {
    console.error("Error al obtener plantillas:", error)
    return NextResponse.json({ error: "Error al obtener plantillas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, contenido, descripcion } = await request.json()

    // Validación más robusta
    if (!nombre || !contenido) {
      return NextResponse.json(
        { error: "Nombre y contenido son requeridos" }, 
        { status: 400 }
      )
    }

    // Crear plantilla con el formato correcto
    const resultado = await crearPlantilla({
      nombre,
      contenido,
      descripcion: descripcion || null
    })

    // Verificar que la plantilla se creó correctamente
    if (!resultado || resultado.length === 0) {
      throw new Error("No se pudo crear la plantilla")
    }

    // Registrar actividad
    await registrarActividad({
      usuario_id: null, // usuarioId (null para sistema)
      accion: "creacion_plantilla", // Este es el campo 'tipo' requerido
      tipo_entidad: "plantilla_mensaje",
      entidad_id: resultado[0].id,
      descripcion: `Plantilla creada: ${nombre}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido"
    })

    return NextResponse.json(
      {
        message: "Plantilla creada exitosamente",
        plantilla: resultado[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear plantilla:", error)
    return NextResponse.json(
      { 
        error: "Error al crear plantilla",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}
