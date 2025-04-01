export async function registrarActividad(
  usuarioId: number | null,
  accion: string,
  descripcion: string,
  direccionIp: string,
) {
  // Implementación de la función registrarActividad
  // Esta es una función placeholder. La implementación real dependerá
  // de cómo se interactúa con la base de datos.
  console.log("Actividad registrada:", {
    usuarioId,
    accion,
    descripcion,
    direccionIp,
  })
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

