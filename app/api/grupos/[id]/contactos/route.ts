import { NextResponse } from "next/server"
import { agregarContactoAGrupo, eliminarContactoDeGrupo, registrarActividad } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const grupoId = Number.parseInt(params.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    const { contactIds } = await request.json()

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json({ error: "Se requiere al menos un ID de contacto" }, { status: 400 })
    }

    // Añadir cada contacto al grupo
    for (const contactId of contactIds) {
      await agregarContactoAGrupo(contactId, grupoId)
    }

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "add_contacts_to_group",
      `Se añadieron ${contactIds.length} contactos al grupo ${grupoId}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: `${contactIds.length} contactos añadidos al grupo exitosamente`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al añadir contactos al grupo:", error)
    return NextResponse.json({ error: "Error al añadir contactos al grupo" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const grupoId = Number.parseInt(params.id)

    if (isNaN(grupoId)) {
      return NextResponse.json({ error: "ID de grupo inválido" }, { status: 400 })
    }

    const { contactId } = await request.json()

    if (!contactId) {
      return NextResponse.json({ error: "Se requiere el ID del contacto" }, { status: 400 })
    }

    // Eliminar el contacto del grupo
    await eliminarContactoDeGrupo(contactId, grupoId)

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "remove_contact_from_group",
      `Se eliminó el contacto ${contactId} del grupo ${grupoId}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json(
      {
        message: "Contacto eliminado del grupo exitosamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al eliminar contacto del grupo:", error)
    return NextResponse.json({ error: "Error al eliminar contacto del grupo" }, { status: 500 })
  }
}

