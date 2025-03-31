import { NextResponse } from "next/server"
import { getGruposContacto, registrarActividad, executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const grupos = await getGruposContacto()
    return NextResponse.json({ grupos })
  } catch (error) {
    console.error("Error al obtener grupos:", error)
    return NextResponse.json({ error: "Error al obtener grupos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion } = await request.json()

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Crear grupo
    const resultado = await executeQuery<any>(`INSERT INTO grupos_contacto (nombre, descripcion) VALUES (?, ?)`, [
      nombre,
      descripcion || "",
    ])

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "create_group",
      `Grupo creado: ${nombre}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Grupo creado exitosamente",
        id: resultado.insertId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear grupo:", error)
    return NextResponse.json({ error: "Error al crear grupo" }, { status: 500 })
  }
}

