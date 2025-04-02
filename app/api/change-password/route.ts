import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validar que se proporcionó la nueva contraseña
    if (!newPassword) {
      return NextResponse.json({ error: "La nueva contraseña es requerida" }, { status: 400 })
    }

    // Obtener el usuario de la base de datos
    const users = await executeQuery("SELECT id, provider FROM users WHERE email = $1", [session.user.email])

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const user = users[0]

    // Actualizar la contraseña
    await executeQuery("UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
      newPassword,
      user.id,
    ])

    // No intentamos registrar la actividad para evitar errores con tablas inexistentes

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

