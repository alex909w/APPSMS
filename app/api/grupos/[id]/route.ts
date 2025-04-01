import { NextResponse } from "next/server"
import { getDetallesGrupo, executeQuery, registrarActividad } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Esperar a que los parámetros estén disponibles
    const resolvedParams = await params
    const grupoId = Number.parseInt(resolvedParams.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    const grupo = await getDetallesGrupo(grupoId)

    if (!grupo) {
      return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ grupo })
  } catch (error: any) {
    console.error("Error al obtener detalles del grupo:", error)
    return NextResponse.json({ error: error.message || "Error al obtener detalles del grupo" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Esperar a que los parámetros estén disponibles
    const resolvedParams = await params
    const grupoId = Number.parseInt(resolvedParams.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    // Eliminar el grupo
    await executeQuery<any>(`DELETE FROM grupos_contacto WHERE id = $1`, [grupoId])

    // Registrar actividad
    await registrarActividad({
      accion: "delete_group",
      descripcion: `Se eliminó el grupo ${grupoId}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json(
      {
        message: "Grupo eliminado exitosamente",
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error al eliminar grupo:", error)
    return NextResponse.json({ error: error.message || "Error al eliminar grupo" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Esperar a que los parámetros estén disponibles
    const resolvedParams = await params
    const grupoId = Number.parseInt(resolvedParams.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    const { nombre, descripcion } = await request.json()

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Actualizar el grupo
    await executeQuery<any>(`UPDATE grupos_contacto SET nombre = $1, descripcion = $2 WHERE id = $3`, [
      nombre,
      descripcion || "",
      grupoId,
    ])

    // Registrar actividad
    await registrarActividad({
      accion: "update_group",
      descripcion: `Se actualizó el grupo ${grupoId}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json(
      {
        message: "Grupo actualizado exitosamente",
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error al actualizar grupo:", error)
    return NextResponse.json({ error: error.message || "Error al actualizar grupo" }, { status: 500 })
  }
}

