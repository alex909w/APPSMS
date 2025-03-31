import { NextResponse } from "next/server"
import { createUser, getUsers } from "@/lib/db"
import * as bcrypt from "bcrypt"

export async function GET() {
  try {
    const users = await getUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, email } = await request.json()

    if (!username || !password || !email) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    await createUser(username, hashedPassword, email)

    return NextResponse.json({ message: "Usuario creado exitosamente" }, { status: 201 })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

