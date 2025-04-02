import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ninguna imagen" }, { status: 400 })
    }

    // Validar el tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Validar el tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no debe superar los 5MB" }, { status: 400 })
    }

    // Crear un nombre único para el archivo
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, "_")}`

    // Crear la carpeta de uploads si no existe
    const uploadsDir = join(process.cwd(), "public", "uploads")

    try {
      // Leer el archivo como un ArrayBuffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Guardar el archivo en el sistema de archivos
      await writeFile(join(uploadsDir, fileName), buffer)

      // Construir la URL de la imagen
      const imageUrl = `/uploads/${fileName}`

      return NextResponse.json({ imageUrl })
    } catch (error) {
      console.error("Error al guardar la imagen:", error)
      return NextResponse.json({ error: "Error al guardar la imagen" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}