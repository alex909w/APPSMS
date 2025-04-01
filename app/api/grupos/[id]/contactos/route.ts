import { NextResponse } from "next/server"
import { agregarContactoAGrupo, eliminarContactoDeGrupo, registrarActividad } from "@/lib/db"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Esperar a que los parámetros estén disponibles
    const resolvedParams = await params
    const grupoId = Number.parseInt(resolvedParams.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    const { contactIds } = await request.json()

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json({ error: "Se requiere al menos un ID de contacto" }, { status: 400 })
    }

    // Añadir cada contacto al grupo
    for (const contactId of contactIds) {
      await agregarContactoAGrupo(grupoId.toString(), contactId.toString())
    }

    // Registrar actividad
    await registrarActividad({
      accion: "add_contacts_to_group",
      descripcion: `Se añadieron ${contactIds.length} contactos al grupo ${grupoId}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json(
      {
        message: `${contactIds.length} contactos añadidos al grupo exitosamente`,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error al añadir contactos al grupo:", error)
    return NextResponse.json({ error: error.message || "Error al añadir contactos al grupo" }, { status: 500 })
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

    const { contactId } = await request.json()

    if (!contactId) {
      return NextResponse.json({ error: "Se requiere el ID del contacto" }, { status: 400 })
    }

    // Eliminar el contacto del grupo
    await eliminarContactoDeGrupo(grupoId.toString(), contactId.toString())

    // Registrar actividad
    await registrarActividad({
      accion: "remove_contact_from_group",
      descripcion: `Se eliminó el contacto ${contactId} del grupo ${grupoId}`,
      direccion_ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    return NextResponse.json(
      {
        message: "Contacto eliminado del grupo exitosamente",
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error al eliminar contacto del grupo:", error)
    return NextResponse.json({ error: error.message || "Error al eliminar contacto del grupo" }, { status: 500 })
  }
}

