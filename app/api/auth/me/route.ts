import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    // Parse the session cookie
    const session = JSON.parse(sessionCookie.value)

    return NextResponse.json({
      user: session,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Error al verificar autenticación" }, { status: 500 })
  }
}

