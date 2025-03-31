import { NextResponse } from "next/server"
import { getVariables, crearVariable, registrarActividad } from "@/lib/db"

export async function GET() {
  try {
    const variables = await getVariables()
    return NextResponse.json({ variables })
  } catch (error) {
    console.error("Error al obtener variables:", error)
    return NextResponse.json({ error: "Error al obtener variables" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion, ejemplo } = await request.json()

    if (!nombre || !descripcion) {
      return NextResponse.json({ error: "Nombre y descripción son requeridos" }, { status: 400 })
    }

    // Crear variable
    const resultado = await crearVariable(nombre, descripcion, ejemplo || "")

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "create_variable",
      `Variable creada: ${nombre}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Variable creada exitosamente",
        id: resultado.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear variable:", error)
    return NextResponse.json({ error: "Error al crear variable" }, { status: 500 })
  }
}

