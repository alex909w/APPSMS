import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const users = await executeQuery(
      "SELECT id, name, email, role, provider, provider_id, email_verified, profile_icon, profile_image FROM users WHERE email = $1",
      [session.user.email],
    )

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Error al obtener el perfil:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Validar datos
    if (!data.name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Obtener el ID del usuario
    const users = await executeQuery("SELECT id FROM users WHERE email = $1", [session.user.email])

    if (!users || users.length === 0) {
      // Si el usuario no existe (posiblemente un usuario de Google nuevo), crearlo
      await executeQuery(
        `INSERT INTO users (name, email, provider, email_verified, profile_icon, profile_image, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [data.name, session.user.email, "google", true, data.profileIcon || null, data.profileImage || null],
      )

      // Obtener el ID del usuario recién creado
      const newUsers = await executeQuery("SELECT id FROM users WHERE email = $1", [session.user.email])

      if (!newUsers || newUsers.length === 0) {
        return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    const userId = users[0].id

    // Actualizar el perfil
    await executeQuery(
      `UPDATE users 
       SET name = $1, profile_icon = $2, profile_image = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [data.name, data.profileIcon || null, data.profileImage || null, userId],
    )

    // Registrar la actividad (si tienes una tabla para esto)
    try {
      await executeQuery(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, created_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [userId, "update", "users", userId, "Profile update"],
      )
    } catch (error) {
      // Si no existe la tabla de logs, simplemente continuamos
      console.log("No se pudo registrar la actividad:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar el perfil:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

