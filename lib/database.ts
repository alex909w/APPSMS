// Este archivo es solo para compatibilidad con código existente
// Todas las operaciones de base de datos deben usar Supabase a través de lib/db.ts

import { db } from "./db"

// Exportar una función de conexión falsa para compatibilidad
export function createPool() {
  console.log("Pool de conexiones creado")
  return {
    execute: async (query: string, params: any[] = []) => {
      console.log("Redirigiendo consulta a Supabase:", query)
      try {
        // Redirigir a Supabase
        return await db.executeQuery(query, params)
      } catch (error) {
        console.error("Error al ejecutar la consulta:", error)
        throw error
      }
    },
    query: async (query: string, params: any[] = []) => {
      console.log("Redirigiendo consulta a Supabase:", query)
      try {
        // Redirigir a Supabase
        return await db.executeQuery(query, params)
      } catch (error) {
        console.error("Error al ejecutar la consulta:", error)
        throw error
      }
    },
    end: () => {
      console.log("Cerrando pool de conexiones")
      return Promise.resolve()
    },
  }
}

// Exportar un pool falso para compatibilidad
export const pool = createPool()

// Exportar una función para ejecutar consultas
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await db.executeQuery(query, params)
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error)
    throw error
  }
}

