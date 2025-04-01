import { NextResponse } from "next/server";
import { createUser, getUsers } from "@/lib/db";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users); // Cambiado para devolver directamente el array
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json(); // Cambiado username por name para coincidir con tu DB

    if (!name || !email) { // Password es opcional en tu schema de DB
      return NextResponse.json(
        { error: "Nombre y email son requeridos" }, // Mensaje actualizado
        { status: 400 }
      );
    }

    // Crear usuario con la estructura que espera tu función createUser
    const newUser = await createUser({ 
      name, 
      email, 
      password: password || null // Manejando el password opcional
    });

    return NextResponse.json(
      { 
        message: "Usuario creado exitosamente",
        user: newUser // Devuelve el usuario creado
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}