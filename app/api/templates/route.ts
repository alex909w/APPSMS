import { NextResponse } from "next/server"
import { createMessageTemplate, getMessageTemplates } from "@/lib/db"

export async function GET() {
  try {
    const templates = await getMessageTemplates()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error al obtener plantillas:", error)
    return NextResponse.json({ error: "Error al obtener plantillas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, content, userId } = await request.json()

    if (!name || !content || !userId) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    await createMessageTemplate(name, content, userId)

    return NextResponse.json({ message: "Plantilla creada exitosamente" }, { status: 201 })
  } catch (error) {
    console.error("Error al crear plantilla:", error)
    return NextResponse.json({ error: "Error al crear plantilla" }, { status: 500 })
  }
}

