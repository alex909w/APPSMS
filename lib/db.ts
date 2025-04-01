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
  return executeQuery<any[]>("SELECT id, name, content, creator_id, created_at FROM message_templates")
}

// Crear plantilla de mensaje
export async function crearPlantilla(data: { nombre: string; contenido: string }) {
  return executeQuery<any>("INSERT INTO plantillas_mensaje (nombre, contenido) VALUES ($1, $2) RETURNING *", [
    data.nombre,
    data.contenido,
  ])
}

// Actualizar plantilla de mensaje
export async function actualizarPlantilla(id: string, data: { nombre?: string; contenido?: string }) {
  const updates = []
  const values = []

  if (data.nombre) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.contenido) {
    updates.push(`contenido = $${updates.length + 1}`)
    values.push(data.contenido)
  }

  if (updates.length === 0) return null

  values.push(id)
  return executeQuery<any>(
    `UPDATE plantillas_mensaje SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

// Eliminar plantilla de mensaje
export async function eliminarPlantilla(id: string) {
  return executeQuery<any>("DELETE FROM plantillas_mensaje WHERE id = $1 RETURNING *", [id])
}

// Crear plantilla de mensaje (alternativa)
export async function createMessageTemplate(data: { name: string; content: string; creator_id?: string }) {
  return executeQuery<any>(
    "INSERT INTO message_templates (name, content, creator_id) VALUES ($1, $2, $3) RETURNING *",
    [data.name, data.content, data.creator_id || null],
  )
}

// Variables
export async function getVariables() {
  return executeQuery<any[]>("SELECT * FROM variables")
}

// Crear variable
export async function crearVariable(data: { nombre: string; valor: string }) {
  return executeQuery<any>("INSERT INTO variables (nombre, valor) VALUES ($1, $2) RETURNING *", [
    data.nombre,
    data.valor,
  ])
}

// Actualizar variable
export async function actualizarVariable(id: string, data: { nombre?: string; valor?: string }) {
  const updates = []
  const values = []

  if (data.nombre) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.valor) {
    updates.push(`valor = $${updates.length + 1}`)
    values.push(data.valor)
  }

  if (updates.length === 0) return null

  values.push(id)
  return executeQuery<any>(
    `UPDATE variables SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

// Eliminar variable
export async function eliminarVariable(id: string) {
  return executeQuery<any>("DELETE FROM variables WHERE id = $1 RETURNING *", [id])
}

// Contactos
export async function getContactos() {
  return executeQuery<any[]>("SELECT * FROM contactos")
}

// Actualizar contacto
export async function actualizarContacto(
  id: string,
  data: { nombre?: string; apellido?: string; telefono?: string; correo?: string },
) {
  const updates = []
  const values = []

  if (data.nombre) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.apellido) {
    updates.push(`apellido = $${updates.length + 1}`)
    values.push(data.apellido)
  }

  if (data.telefono) {
    updates.push(`telefono = $${updates.length + 1}`)
    values.push(data.telefono)
  }

  if (data.correo) {
    updates.push(`correo = $${updates.length + 1}`)
    values.push(data.correo)
  }

  if (updates.length === 0) return null

  values.push(id)
  return executeQuery<any>(
    `UPDATE contactos SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

// Eliminar contacto
export async function eliminarContacto(id: string) {
  return executeQuery<any>("DELETE FROM contactos WHERE id = $1 RETURNING *", [id])
}

// Crear un nuevo contacto
export async function crearContacto(telefono: string, nombre: string, apellido: string, correo: string) {
  return executeQuery<any>(
    `INSERT INTO contactos (telefono, nombre, apellido, correo) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [telefono, nombre, apellido, correo],
  )
}

// Grupos de contactos
export async function getGruposContacto() {
  return executeQuery<any[]>(
    `SELECT gc.*, COUNT(mg.contacto_id) as total_contactos
     FROM grupos_contacto gc
     LEFT JOIN miembros_grupo mg ON gc.id = mg.grupo_id
     GROUP BY gc.id`,
  )
}

// Obtener detalles de un grupo
export async function getDetallesGrupo(id: string) {
  const grupo = await executeQuery<any[]>(`SELECT * FROM grupos_contacto WHERE id = $1`, [id])

  if (grupo.length === 0) return null

  const contactos = await executeQuery<any[]>(
    `SELECT c.* 
     FROM contactos c
     JOIN miembros_grupo mg ON c.id = mg.contacto_id
     WHERE mg.grupo_id = $1`,
    [id],
  )

  return {
    ...grupo[0],
    contactos,
  }
}

// Agregar contacto a grupo
export async function agregarContactoAGrupo(grupoId: string, contactoId: string) {
  return executeQuery<any>(
    `INSERT INTO miembros_grupo (grupo_id, contacto_id) 
     VALUES ($1, $2) 
     ON CONFLICT (grupo_id, contacto_id) DO NOTHING
     RETURNING *`,
    [grupoId, contactoId],
  )
}

// Eliminar contacto de grupo
export async function eliminarContactoDeGrupo(grupoId: string, contactoId: string) {
  return executeQuery<any>(
    `DELETE FROM miembros_grupo 
     WHERE grupo_id = $1 AND contacto_id = $2
     RETURNING *`,
    [grupoId, contactoId],
  )
}

// Mensajes enviados
export async function getMensajesEnviados() {
  return executeQuery<any[]>(
    `SELECT me.*, pm.nombre as nombre_plantilla
     FROM mensajes_enviados me
     LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
     ORDER BY me.fecha_envio DESC`,
  )
}

// Alias para compatibilidad
export async function getSentMessages() {
  return getMensajesEnviados()
}

// Obtener mensaje por ID
export async function getMensajeById(id: number) {
  const mensaje = await executeQuery<any[]>(
    `SELECT me.*, pm.nombre as nombre_plantilla
     FROM mensajes_enviados me
     LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
     WHERE me.id = $1`,
    [id],
  )

  return mensaje.length > 0 ? mensaje[0] : null
}

// Obtener estadísticas
export async function getEstadisticas() {
  const totalMensajes = await executeQuery<any[]>("SELECT COUNT(*) as total FROM mensajes_enviados")
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
  estado = "enviado",
) {
  return executeQuery<any>(
    `INSERT INTO mensajes_enviados (telefono, contenido_mensaje, plantilla_id, variables_usadas, estado) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [telefono, contenido, plantillaId || null, JSON.stringify(variablesUsadas || {}), estado],
  )
}

// Usuarios
export async function getUsers() {
  return executeQuery<any[]>("SELECT * FROM users")
}

export async function createUser(data: { name: string; email: string; password?: string }) {
  return executeQuery<any>("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [
    data.name,
    data.email,
    data.password || null,
  ])
}

// Configuración
export async function getConfiguracion() {
  const config = await executeQuery<any[]>("SELECT * FROM configuracion LIMIT 1")
  return config.length > 0 ? config[0] : null
}

export async function actualizarConfiguracion(data: { [key: string]: any }) {
  const existingConfig = await getConfiguracion()

  if (!existingConfig) {
    // Si no existe configuración, la creamos
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")

    return executeQuery<any>(
      `INSERT INTO configuracion (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values,
    )
  } else {
    // Si existe, la actualizamos
    const updates = Object.keys(data).map((key, i) => `${key} = $${i + 1}`)
    const values = [...Object.values(data), existingConfig.id]

    return executeQuery<any>(
      `UPDATE configuracion SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values,
    )
  }
}

// Registro de actividad
export async function registrarActividad(data: {
  tipo: string
  descripcion: string
  usuario_id?: string
  entidad_id?: string
  entidad_tipo?: string
}) {
  return executeQuery<any>(
    `INSERT INTO actividad_log (tipo, descripcion, usuario_id, entidad_id, entidad_tipo, fecha) 
     VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
    [data.tipo, data.descripcion, data.usuario_id || null, data.entidad_id || null, data.entidad_tipo || null],
  )
}

export async function getActivityLogs() {
  return executeQuery<any[]>(`SELECT * FROM actividad_log ORDER BY fecha DESC`)
}

