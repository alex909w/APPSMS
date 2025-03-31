import { NextResponse } from "next/server"
import { getDetallesGrupo, executeQuery, registrarActividad } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const grupoId = Number.parseInt(params.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    const grupo = await getDetallesGrupo(grupoId)

    if (!grupo) {
      return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ grupo })
  } catch (error) {
    console.error("Error al obtener detalles del grupo:", error)
    return NextResponse.json({ error: "Error al obtener detalles del grupo" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const grupoId = Number.parseInt(params.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    // Eliminar el grupo
    await executeQuery<any>(`DELETE FROM grupos_contacto WHERE id = ?`, [grupoId])

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "delete_group",
      `Se eliminó el grupo ${grupoId}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Grupo eliminado exitosamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al eliminar grupo:", error)
    return NextResponse.json({ error: "Error al eliminar grupo" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const grupoId = Number.parseInt(params.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    const { nombre, descripcion } = await request.json()

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Actualizar el grupo
    await executeQuery<any>(`UPDATE grupos_contacto SET nombre = ?, descripcion = ? WHERE id = ?`, [
      nombre,
      descripcion || "",
      grupoId,
    ])

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "update_group",
      `Se actualizó el grupo ${grupoId}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Grupo actualizado exitosamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al actualizar grupo:", error)
    return NextResponse.json({ error: "Error al actualizar grupo" }, { status: 500 })
  }
}

