import { NextResponse } from "next/server"
import { getPlantillasMensaje, crearPlantilla, registrarActividad } from "@/lib/db"

export async function GET() {
  try {
    const plantillas = await getPlantillasMensaje()
    return NextResponse.json({ plantillas })
  } catch (error: unknown) {
    console.error("Error al obtener plantillas:", error)
    const errorMessage = error instanceof Error ? error.message : "Error al obtener plantillas"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, contenido, descripcion } = await request.json()

    // Validación de campos requeridos
    if (!nombre?.trim() || !contenido?.trim()) {
      return NextResponse.json(
        { error: "Nombre y contenido son requeridos y no pueden estar vacíos" }, 
        { status: 400 }
      )
    }

    // Crear la nueva plantilla
    const nuevaPlantilla = await crearPlantilla({
      nombre: nombre.trim(),
      contenido: contenido.trim(),
      descripcion: descripcion?.trim() || null,
    })

    if (!nuevaPlantilla || !nuevaPlantilla[0]?.id) {
      throw new Error("No se pudo crear la plantilla o no se recibió respuesta válida")
    }

    // Registrar actividad
    await registrarActividad({
      usuario_id: null, // usuarioId (null para sistema)
      accion: "creacion_plantilla", // Campo 'tipo' requerido
      tipo_entidad: "plantilla_mensaje",
      entidad_id: nuevaPlantilla[0].id,
      descripcion: `Plantilla creada: ${nombre.trim()}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido"
    })

    return NextResponse.json(
      {
        message: "Plantilla creada exitosamente",
        plantilla: nuevaPlantilla[0],
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error("Error al crear plantilla:", error)
    const errorMessage = error instanceof Error ? error.message : "Error al crear plantilla"
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error : undefined
      }, 
      { status: 500 }
    )
  }
}