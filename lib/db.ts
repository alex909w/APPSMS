import { Pool } from "pg"

// Configuración de la conexión a la base de datos PostgreSQL en Render
const dbConfig = {
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://dbappsms_user:pBxvsC6Y86v0kRcAkHnbidMVpFs2sDlA@dpg-cvlvihadbo4c7385cib0-a.oregon-postgres.render.com/dbappsms",
  ssl: {
    rejectUnauthorized: false,
  },
}

// Crear un pool de conexiones
const pool = new Pool(dbConfig)

// Función para ejecutar consultas SQL
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const { rows } = await pool.query(query, params)
    return rows as T
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error)
    throw error
  }
}

// Funciones específicas para cada tabla

// Plantillas de mensajes
export async function getPlantillasMensaje() {
  return executeQuery<any[]>("SELECT * FROM plantillas_mensaje")
}

export async function getMessageTemplates() {
  return executeQuery<any[]>(
    "SELECT id, name, content, creator_id, created_at FROM message_templates"
  )
}

// Variables
export async function getVariables() {
  return executeQuery<any[]>("SELECT * FROM variables")
}

// Contactos
export async function getContactos() {
  return executeQuery<any[]>("SELECT * FROM contactos")
}

// Grupos de contactos
export async function getGruposContacto() {
  return executeQuery<any[]>(
    `SELECT gc.*, COUNT(mg.contacto_id) as total_contactos
     FROM grupos_contacto gc
     LEFT JOIN miembros_grupo mg ON gc.id = mg.grupo_id
     GROUP BY gc.id`
  )
}

// Mensajes enviados
export async function getMensajesEnviados() {
  return executeQuery<any[]>(
    `SELECT me.*, pm.nombre as nombre_plantilla
     FROM mensajes_enviados me
     LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
     ORDER BY me.fecha_envio DESC`
  )
}

// Obtener mensaje por ID
export async function getMensajeById(id: number) {
  const mensaje = await executeQuery<any[]>(
    `SELECT me.*, pm.nombre as nombre_plantilla
     FROM mensajes_enviados me
     LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
     WHERE me.id = $1`,
    [id]
  )

  return mensaje.length > 0 ? mensaje[0] : null
}

// Obtener estadísticas
export async function getEstadisticas() {
  const totalMensajes = await executeQuery<any[]>(
    "SELECT COUNT(*) as total FROM mensajes_enviados"
  )
  return {
    totalMensajes: totalMensajes[0]?.total || 0,
  }
}

// Enviar un nuevo mensaje
export async function enviarMensaje(
  telefono: string,
  contenido: string,
  plantillaId?: number,
  variablesUsadas?: any,
  estado = "enviado"
) {
  return executeQuery<any>(
    `INSERT INTO mensajes_enviados (telefono, contenido_mensaje, plantilla_id, variables_usadas, estado) 
     VALUES ($1, $2, $3, $4, $5)`,
    [telefono, contenido, plantillaId || null, JSON.stringify(variablesUsadas || {}), estado]
  )
}

// Crear un nuevo contacto
export async function crearContacto(
  telefono: string,
  nombre: string,
  apellido: string,
  correo: string
) {
  return executeQuery<any>(
    `INSERT INTO contactos (telefono, nombre, apellido, correo) 
     VALUES ($1, $2, $3, $4)`,
    [telefono, nombre, apellido, correo]
  )
}
