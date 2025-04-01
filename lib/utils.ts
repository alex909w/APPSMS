export async function registrarActividad(
  usuarioId: number | null,
  accion: string,
  descripcion: string,
  direccionIp: string,
) {
  // Implementación de la función registrarActividad
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

