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

    // Crear grupo - CORREGIDO: Cambiado de ? a $1, $2 para PostgreSQL
    const resultado = await executeQuery<any>(
      `INSERT INTO grupos_contacto (nombre, descripcion) VALUES ($1, $2) RETURNING id`,
      [nombre, descripcion || ""],
    )

    // Registrar actividad - CORREGIDO: Ajustado para coincidir con la firma de la función
    await registrarActividad({
      accion: "create_group",
      descripcion: `Grupo creado: ${nombre}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json(
      {
        message: "Grupo creado exitosamente",
        id: resultado[0]?.id, // CORREGIDO: Acceder al ID del resultado correctamente
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error al crear grupo:", error)
    return NextResponse.json({ error: error.message || "Error al crear grupo" }, { status: 500 })
  }
}

