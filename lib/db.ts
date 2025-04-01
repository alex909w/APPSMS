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
export async function crearPlantilla(data: { 
  nombre: string;
  contenido: string;
  descripcion?: string;
  creado_por?: number;
}) {
  return executeQuery<any>(
    "INSERT INTO plantillas_mensaje (nombre, contenido, descripcion, creado_por) VALUES ($1, $2, $3, $4) RETURNING *",
    [data.nombre, data.contenido, data.descripcion || null, data.creado_por || null]
  );
}

// Actualizar plantilla de mensaje
export async function actualizarPlantilla(data: {
  id: number;
  nombre: string;
  contenido: string;
  descripcion?: string | null;
}) {
  // Validación básica
  if (!data.nombre || !data.contenido) {
    throw new Error("Nombre y contenido son requeridos")
  }

  return executeQuery<any>(
    `UPDATE plantillas_mensaje 
     SET nombre = $1, contenido = $2, descripcion = $3, fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [data.nombre, data.contenido, data.descripcion || null, data.id]
  )
}

// Eliminar plantilla de mensaje
export async function eliminarPlantilla(id: number) {
  return executeQuery<any>(
    "DELETE FROM plantillas_mensaje WHERE id = $1 RETURNING *",
    [id]
  )
}

// Crear plantilla de mensaje (alternativa)
export async function createMessageTemplate(data: { name: string; content: string; creator_id?: string }) {
  return executeQuery<any>(
    "INSERT INTO message_templates (name, content, creator_id) VALUES ($1, $2, $3) RETURNING *",
    [data.name, data.content, data.creator_id || null],
  )
}

// Obtener detalles de Plantillas
export async function getPlantillaById(id: number) {
  return executeQuery<any>(
    `SELECT * FROM plantillas_mensaje WHERE id = $1`,
    [id]
  )
}

// Variables
export async function getVariables() {
  return executeQuery<any[]>("SELECT * FROM variables")
}

// Crear variable
export async function crearVariable(data: {
  nombre: string;
  descripcion: string;
  ejemplo?: string;
  creado_por?: number;
}) {
  return executeQuery<any>(
    `INSERT INTO variables 
     (nombre, descripcion, ejemplo, creado_por, fecha_creacion, fecha_actualizacion) 
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
     RETURNING *`,
    [
      data.nombre,
      data.descripcion,
      data.ejemplo || null,
      data.creado_por || null
    ]
  );
}

// Actualizar variable
export async function actualizarVariable(data: {
  id: number;
  nombre: string;
  descripcion: string;
  ejemplo?: string | null;
}) {
  return executeQuery<any>(
    `UPDATE variables 
     SET nombre = $1, descripcion = $2, ejemplo = $3, fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [data.nombre, data.descripcion, data.ejemplo || null, data.id]
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
  data: { nombre?: string; apellido?: string | null; telefono?: string; correo?: string | null },
) {
  const updates = []
  const values = []

  // Usar !== undefined para incluir valores vacíos y null
  if (data.nombre !== undefined) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.apellido !== undefined) {
    updates.push(`apellido = $${updates.length + 1}`)
    values.push(data.apellido)
  }

  if (data.telefono !== undefined) {
    updates.push(`telefono = $${updates.length + 1}`)
    values.push(data.telefono)
  }

  if (data.correo !== undefined) {
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
export async function crearContacto(data: {
  telefono: string
  nombre: string
  apellido?: string | null
  correo?: string | null
}) {
  const client = await pool.connect()
  
  try {
    const result = await client.query(
      `INSERT INTO contactos (telefono, nombre, apellido, correo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, telefono, nombre, apellido, correo, creado_en`,
      [data.telefono, data.nombre, data.apellido, data.correo]
    )
    
    return result.rows[0]
  } finally {
    client.release()
  }
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
export async function getDetallesGrupo(grupoId: number): Promise<any> {
  try {
    // Obtener información básica del grupo
    const grupo = await executeQuery<any[]>(`SELECT * FROM grupos_contacto WHERE id = $1`, [grupoId])

    if (grupo.length === 0) return null

    // Obtener los contactos asociados al grupo
    const miembros = await executeQuery<any[]>(
      `SELECT c.* 
       FROM contactos c
       JOIN miembros_grupo mg ON c.id = mg.contacto_id
       WHERE mg.grupo_id = $1`,
      [grupoId],
    )

    // Devolver el grupo con sus miembros
    return {
      ...grupo[0],
      miembros: miembros || [],
    }
  } catch (error) {
    console.error("Error al obtener detalles del grupo:", error)
    throw error
  }
}

// Agregar contacto a grupo
export async function agregarContactoAGrupo(grupoId: string, contactoId: string): Promise<void> {
  try {
    await executeQuery(
      `INSERT INTO miembros_grupo (grupo_id, contacto_id) 
       VALUES ($1, $2) 
       ON CONFLICT (grupo_id, contacto_id) DO NOTHING`,
      [grupoId, contactoId],
    )
  } catch (error) {
    console.error(`Error al agregar contacto ${contactoId} al grupo ${grupoId}:`, error)
    throw error
  }
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
  try {
    // Total de mensajes
    const totalMensajes = await executeQuery<any[]>("SELECT COUNT(*) as total FROM mensajes_enviados")

    // Mensajes por estado
    const mensajesPorEstado = await executeQuery<any[]>(
      `SELECT 
         estado, COUNT(*) as total 
       FROM mensajes_enviados 
       GROUP BY estado`,
    )

    // Tasa de entrega y error
    const tasaEntrega = await executeQuery<any[]>(
      `SELECT 
         ROUND((COUNT(*) FILTER (WHERE estado = 'entregado') * 100.0 / NULLIF(COUNT(*), 0)), 2) as tasa_entrega,
         ROUND((COUNT(*) FILTER (WHERE estado = 'fallido') * 100.0 / NULLIF(COUNT(*), 0)), 2) as tasa_error
       FROM mensajes_enviados`,
    )

    // Plantillas más usadas
    const plantillasMasUsadas = await executeQuery<any[]>(
      `SELECT 
         pm.id, 
         pm.nombre, 
         COUNT(me.id) as total,
         ROUND((COUNT(me.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM mensajes_enviados WHERE plantilla_id IS NOT NULL), 0)), 2) as porcentaje
       FROM plantillas_mensaje pm
       JOIN mensajes_enviados me ON pm.id = me.plantilla_id
       GROUP BY pm.id, pm.nombre
       ORDER BY total DESC
       LIMIT 5`,
    )

    // Mensajes por hora (últimas 24 horas)
    const mensajesPorHora = await executeQuery<any[]>(
      `SELECT 
         EXTRACT(HOUR FROM fecha_envio) as hora, 
         COUNT(*) as total
       FROM mensajes_enviados
       WHERE fecha_envio >= NOW() - INTERVAL '24 hours'
       GROUP BY hora
       ORDER BY hora`,
    )

    // Mensajes por día (últimos 7 días)
    const mensajesPorDia = await executeQuery<any[]>(
      `SELECT 
         DATE(fecha_envio) as fecha, 
         COUNT(*) as total
       FROM mensajes_enviados
       WHERE fecha_envio >= NOW() - INTERVAL '7 days'
       GROUP BY fecha
       ORDER BY fecha`,
    )

    // Mensajes por semana (últimas 4 semanas)
    const mensajesPorSemana = await executeQuery<any[]>(
      `SELECT 
         DATE_TRUNC('week', fecha_envio) as fecha_inicio,
         COUNT(*) as total
       FROM mensajes_enviados
       WHERE fecha_envio >= NOW() - INTERVAL '4 weeks'
       GROUP BY fecha_inicio
       ORDER BY fecha_inicio`,
    )

    // Porcentaje de crecimiento (comparando con el período anterior)
    const porcentajeCrecimiento = await executeQuery<any[]>(
      `SELECT 
         ROUND(
           (
             (SELECT COUNT(*) FROM mensajes_enviados WHERE fecha_envio >= NOW() - INTERVAL '7 days') - 
             (SELECT COUNT(*) FROM mensajes_enviados WHERE fecha_envio >= NOW() - INTERVAL '14 days' AND fecha_envio < NOW() - INTERVAL '7 days')
           ) * 100.0 / 
           NULLIF((SELECT COUNT(*) FROM mensajes_enviados WHERE fecha_envio >= NOW() - INTERVAL '14 days' AND fecha_envio < NOW() - INTERVAL '7 days'), 0),
           2
         ) as porcentaje`,
    )

    return {
      totalMensajes: Number.parseInt(totalMensajes[0]?.total) || 0,
      mensajesPorEstado: mensajesPorEstado || [],
      tasaEntrega: Number.parseFloat(tasaEntrega[0]?.tasa_entrega) || 0,
      tasaError: Number.parseFloat(tasaEntrega[0]?.tasa_error) || 0,
      plantillasMasUsadas: plantillasMasUsadas || [],
      mensajesPorHora: mensajesPorHora || [],
      mensajesPorDia: mensajesPorDia || [],
      mensajesPorSemana: mensajesPorSemana || [],
      porcentajeCrecimiento: Number.parseFloat(porcentajeCrecimiento[0]?.porcentaje) || 0,
      costoPromedio: 0.032, // Valor predeterminado
      moneda: "€", // Valor predeterminado
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    // Devolver valores predeterminados en caso de error
    return {
      totalMensajes: 0,
      mensajesPorEstado: [],
      tasaEntrega: 0,
      tasaError: 0,
      plantillasMasUsadas: [],
      mensajesPorHora: [],
      mensajesPorDia: [],
      mensajesPorSemana: [],
      porcentajeCrecimiento: 0,
      costoPromedio: 0.032,
      moneda: "$",
    }
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
  usuario_id?: number;
  accion: string;  // Corresponde a la columna 'tipo' en la BD
  tipo_entidad?: string;
  entidad_id?: number;
  descripcion?: string;
  direccion_ip?: string;
  agente_usuario?: string;
}) {
  return executeQuery<any>(
    `INSERT INTO registros_actividad 
     (usuario_id, accion, tipo_entidad, entidad_id, descripcion, direccion_ip, agente_usuario) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [
      data.usuario_id || null,
      data.accion,
      data.tipo_entidad || null,
      data.entidad_id || null,
      data.descripcion || null,
      data.direccion_ip || null,
      data.agente_usuario || null
    ]
  )
}

export async function getActivityLogs() {
  return executeQuery<any[]>(`SELECT * FROM actividad_log ORDER BY fecha DESC`)
}

