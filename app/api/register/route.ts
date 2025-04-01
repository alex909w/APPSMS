import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validaciones básicas
    if (!username || !email || !password) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Formato de correo electrónico inválido" }, { status: 400 })
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUsers = await executeQuery<any[]>("SELECT * FROM users WHERE name = $1 OR email = $2 LIMIT 1", [
      username,
      email,
    ])

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0]
      if (existingUser.name === username) {
        return NextResponse.json({ message: "El nombre de usuario ya está en uso" }, { status: 400 })
      }
      if (existingUser.email === email) {
        return NextResponse.json({ message: "El correo electrónico ya está registrado" }, { status: 400 })
      }
    }

    // Insertar el nuevo usuario con contraseña en texto plano (SOLO PARA DESARROLLO)
    const newUser = await executeQuery<any>(
      `INSERT INTO users (name, email, password, role, created_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       RETURNING id, name, email, role`, // No retornar password
      [username, email, password, "user"], // Se almacena la contraseña directamente
    )

    return NextResponse.json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: newUser[0], // Devuelve el usuario creado (sin password)
    })
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json({ success: false, message: "Error al registrar usuario" }, { status: 500 })
  }
}