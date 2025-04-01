import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validaciones básicas
    if (!username || !email || !password) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUsers = await executeQuery<any[]>(
      "SELECT * FROM usuarios WHERE nombre_usuario = ? OR correo_electronico = ? LIMIT 1",
      [username, email],
    )

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0]
      if (existingUser.nombre_usuario === username) {
        return NextResponse.json({ message: "El nombre de usuario ya está en uso" }, { status: 400 })
      }
      if (existingUser.correo_electronico === email) {
        return NextResponse.json({ message: "El correo electrónico ya está registrado" }, { status: 400 })
      }
    }

    // En un caso real, deberías hashear la contraseña antes de guardarla
    // Por ejemplo, con bcrypt: const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar el nuevo usuario
    await executeQuery(
      "INSERT INTO usuarios (nombre_usuario, correo_electronico, contrasena, rol) VALUES (?, ?, ?, ?)",
      [username, email, password, "usuario"],
    )

    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      user: { username, email },
    })
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json({ message: "Error al registrar usuario" }, { status: 500 })
  }
}

