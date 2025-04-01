import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validaciones básicas
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUsers = await executeQuery<any[]>(
      "SELECT * FROM users WHERE name = $1 OR email = $2 LIMIT 1",
      [username, email]
    )

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0]
      if (existingUser.name === username) {
        return NextResponse.json(
          { message: "El nombre de usuario ya está en uso" },
          { status: 400 }
        )
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: "El correo electrónico ya está registrado" },
          { status: 400 }
        )
      }
    }

    // Insertar el nuevo usuario (adaptado a tu estructura de DB)
    const newUser = await executeQuery<any>(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email`, // No retornar password
      [username, email, password] // En producción usar hashed password
    )

    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      user: newUser[0] // Devuelve el usuario creado (sin password)
    })
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json(
      { message: "Error al registrar usuario" },
      { status: 500 }
    )
  }
}