import { NextResponse } from "next/server";
import {
  getPlantillasMensaje,
  registrarActividad,
  crearPlantilla,
} from "@/lib/db";

export async function GET() {
  try {
    const plantillas = await getPlantillasMensaje();
    return NextResponse.json({ plantillas });
  } catch (error) {
    console.error("Error al obtener plantillas:", error);
    return NextResponse.json(
      { error: "Error al obtener plantillas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, contenido, descripcion } = await request.json();

    if (!nombre || !contenido) {
      return NextResponse.json(
        { error: "Nombre y contenido son requeridos" },
        { status: 400 }
      );
    }

    // Crear plantilla
    const resultado = await crearPlantilla(
      nombre,
      contenido,
      descripcion || ""
    );

    // Registrar actividad
    await registrarActividad({
      tipo: "create_template",
      descripcion: `Plantilla creada: ${nombre} (IP: ${
        request.headers.get("x-forwarded-for") || "127.0.0.1"
      })`,
      usuario_id: null, // o "ID_USUARIO" si tienes autenticación
      entidad_id: resultado[0]?.id, // ID de la plantilla recién creada
      entidad_tipo: "plantilla",
    });

    return NextResponse.json(
      {
        message: "Plantilla creada exitosamente",
        id: resultado.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear plantilla:", error);
    return NextResponse.json(
      { error: "Error al crear plantilla" },
      { status: 500 }
    );
  }
}
