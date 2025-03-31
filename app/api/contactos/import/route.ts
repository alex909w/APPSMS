import { NextResponse } from "next/server"
import { crearContacto, registrarActividad } from "@/lib/db"
import { executeQuery } from "@/lib/db" // Import executeQuery

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n")

    if (lines.length < 2) {
      return NextResponse.json({ error: "El archivo está vacío o no tiene datos" }, { status: 400 })
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    // Verificar que el archivo tenga las columnas requeridas
    const requiredColumns = ["nombre", "telefono"]
    for (const column of requiredColumns) {
      if (!headers.includes(column)) {
        return NextResponse.json(
          {
            error: `El archivo no contiene la columna requerida: ${column}`,
          },
          { status: 400 },
        )
      }
    }

    const results = {
      total: lines.length - 1,
      imported: 0,
      duplicates: 0,
      errors: 0,
      details: [],
    }

    // Procesar cada línea
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",")
      const contactData = {}

      headers.forEach((header, index) => {
        contactData[header] = values[index]?.trim() || ""
      })

      try {
        // Verificar si el contacto ya existe
        const existingContacts = await executeQuery<any[]>(`SELECT id FROM contactos WHERE telefono = ?`, [
          contactData["telefono"],
        ])

        if (existingContacts.length > 0) {
          results.duplicates++
          results.details.push({
            line: i,
            status: "duplicate",
            data: contactData,
          })
          continue
        }

        // Crear el contacto
        await crearContacto(
          contactData["telefono"],
          contactData["nombre"],
          contactData["apellido"] || "",
          contactData["correo"] || "",
        )

        results.imported++
        results.details.push({
          line: i,
          status: "imported",
          data: contactData,
        })
      } catch (error) {
        results.errors++
        results.details.push({
          line: i,
          status: "error",
          data: contactData,
          error: error.message,
        })
      }
    }

    // Registrar actividad
    await registrarActividad(
      null, // usuarioId (null para sistema)
      "import_contacts",
      `Importación de contactos: ${results.imported} importados, ${results.duplicates} duplicados, ${results.errors} errores`,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error al importar contactos:", error)
    return NextResponse.json({ error: "Error al importar contactos" }, { status: 500 })
  }
}

