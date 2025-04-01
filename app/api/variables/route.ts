import { NextResponse } from "next/server"
import { getVariables, crearVariable, registrarActividad } from "@/lib/db"

export async function GET() {
  try {
    const variables = await getVariables()
    return NextResponse.json({ variables })
  } catch (error) {
    console.error("Error al obtener variables:", error)
    return NextResponse.json(
      { error: "Error al obtener variables" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion, ejemplo } = await request.json()

    if (!nombre || !descripcion) {
      return NextResponse.json(
        { error: "Nombre y descripción son requeridos" }, 
        { status: 400 }
      )
    }

    // Crear variable con el formato correcto
    const resultado = await crearVariable({
      nombre,
      descripcion,
      ejemplo: ejemplo || null
    })

    if (!resultado || resultado.length === 0) {
      throw new Error("No se pudo crear la variable")
    }

    // Registrar actividad actualizada
    await registrarActividad({
      usuario_id: null,
      accion: "create_variable",
      tipo_entidad: "variable",
      entidad_id: resultado[0].id,
      descripcion: `Variable creada: ${nombre}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      agente_usuario: request.headers.get("user-agent") || "desconocido"
    })

    return NextResponse.json(
      {
        message: "Variable creada exitosamente",
        variable: resultado[0]
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear variable:", error)
    return NextResponse.json(
      { 
        error: "Error al crear variable",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}