import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ message: "Usuario y contraseña son requeridos" }, { status: 400 })
    }

    // Query the database for the user
    const users = await executeQuery<any[]>("SELECT * FROM usuarios WHERE nombre_usuario = ? LIMIT 1", [username])

    if (users.length === 0) {
      return NextResponse.json({ message: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    const user = users[0]

    // In a real app, you would use a proper password hashing library
    // This is just for demonstration purposes
    if (user.contrasena !== password) {
      return NextResponse.json({ message: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    // Set a session cookie
    const cookieStore = cookies()
    cookieStore.set(
      "session",
      JSON.stringify({
        id: user.id,
        username: user.nombre_usuario,
        role: user.rol,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    // Return user data (excluding password)
    const { contrasena, ...userData } = user

    return NextResponse.json({
      message: "Inicio de sesión exitoso",
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Error al iniciar sesión" }, { status: 500 })
  }
}

