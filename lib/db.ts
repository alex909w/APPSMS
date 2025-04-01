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
let pool: pg.Pool

// Inicializar el pool de conexiones
function getPool() {
  if (!pool) {
    pool = new pg.Pool(dbConfig)
    console.log("Pool de conexiones PostgreSQL creado")
  }
  return pool
}

// Función para ejecutar consultas SQL
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const pool = getPool()
    const result = await pool.query(query, params)
    return result.rows as T
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error)
    throw error
  }
}

// Funciones específicas para cada tabla

// Plantillas de mensajes
export async function getPlantillasMensaje() {
  return executeQuery<any[]>(`
    SELECT * FROM plantillas_mensaje
  `)
}

export async function getMessageTemplates() {
  return executeQuery<any[]>(`
    SELECT id, name, content, creator_id, created_at
    FROM message_templates
  `)
}

// Variables
export async function getVariables() {
  return executeQuery<any[]>(`
    SELECT * FROM variables
  `)
}

// Contactos
export async function getContactos() {
  return executeQuery<any[]>(`
    SELECT * FROM contactos
  `)
}

// Grupos de contactos
export async function getGruposContacto() {
  return executeQuery<any[]>(`
    SELECT gc.*, COUNT(mg.contacto_id) as total_contactos
    FROM grupos_contacto gc
    LEFT JOIN miembros_grupo mg ON gc.id = mg.grupo_id
    GROUP BY gc.id
  `)
}

// Mensajes enviados
export async function getMensajesEnviados() {
  return executeQuery<any[]>(`
    SELECT me.*, pm.nombre as nombre_plantilla
    FROM mensajes_enviados me
    LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
    ORDER BY me.fecha_envio DESC
  `)
}

// Función para obtener un mensaje por su ID
export async function getMensajeById(id: number) {
  try {
    const mensaje = await executeQuery<any[]>(
      `
      SELECT me.*, pm.nombre as nombre_plantilla
      FROM mensajes_enviados me
      LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
      WHERE me.id = $1
    `,
      [id],
    )

    if (mensaje.length === 0) {
      return null
    }

    return mensaje[0]
  } catch (error) {
    console.error("Error al obtener mensaje por ID:", error)
    throw error
  }
}

export async function getSentMessages() {
  return executeQuery<any[]>(`
    SELECT id, phone_number, message_content, status, sent_by_id, sent_at
    FROM sent_messages
  `)
}

// Estadísticas
export async function getEstadisticas() {
  // Total de mensajes
  const totalMensajes = await executeQuery<any[]>(`
    SELECT COUNT(*) as total FROM mensajes_enviados
  `)

  // Mensajes por estado
  const mensajesPorEstado = await executeQuery<any[]>(`
    SELECT estado, COUNT(*) as total 
    FROM mensajes_enviados 
    GROUP BY estado
  `)

  // Mensajes por día (últimos 7 días)
  const mensajesPorDia = await executeQuery<any[]>(`
    SELECT DATE(fecha_envio) as fecha, COUNT(*) as total 
    FROM mensajes_enviados 
    WHERE fecha_envio >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(fecha_envio)
    ORDER BY fecha DESC
  `)

  // Mensajes por hora (últimas 24 horas)
  const mensajesPorHora = await executeQuery<any[]>(`
    SELECT EXTRACT(HOUR FROM fecha_envio) as hora, COUNT(*) as total 
    FROM mensajes_enviados 
    WHERE fecha_envio >= NOW() - INTERVAL '24 hours'
    GROUP BY EXTRACT(HOUR FROM fecha_envio)
    ORDER BY hora
  `)

  // Mensajes por semana (últimas 4 semanas)
  const mensajesPorSemana = await executeQuery<any[]>(`
    SELECT DATE_TRUNC('week', fecha_envio) as semana, 
           MIN(DATE(fecha_envio)) as fecha_inicio,
           COUNT(*) as total 
    FROM mensajes_enviados 
    WHERE fecha_envio >= CURRENT_DATE - INTERVAL '4 weeks'
    GROUP BY DATE_TRUNC('week', fecha_envio)
    ORDER BY semana DESC
  `)

  // Plantillas más usadas
  const plantillasMasUsadas = await executeQuery<any[]>(`
    SELECT pm.id, pm.nombre, COUNT(me.id) as total,
           ROUND(COUNT(me.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM mensajes_enviados WHERE plantilla_id IS NOT NULL), 0), 1) as porcentaje
    FROM mensajes_enviados me
    JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
    GROUP BY pm.id, pm.nombre
    ORDER BY total DESC
    LIMIT 5
  `)

  // Tasa de entrega y error
  const tasaEntrega = await executeQuery<any[]>(`
    SELECT 
      ROUND(
        (SELECT COUNT(*) FROM mensajes_enviados WHERE estado = 'entregado') * 100.0 / 
        NULLIF((SELECT COUNT(*) FROM mensajes_enviados), 0),
        1
      ) as tasa_entrega,
      ROUND(
        (SELECT COUNT(*) FROM mensajes_enviados WHERE estado = 'fallido') * 100.0 / 
        NULLIF((SELECT COUNT(*) FROM mensajes_enviados), 0),
        1
      ) as tasa_error
  `)

  // Crecimiento respecto al período anterior (últimos 7 días vs 7 días anteriores)
  const crecimiento = await executeQuery<any[]>(`
    SELECT 
      (SELECT COUNT(*) FROM mensajes_enviados 
       WHERE fecha_envio >= CURRENT_DATE - INTERVAL '7 days') as periodo_actual,
      (SELECT COUNT(*) FROM mensajes_enviados 
       WHERE fecha_envio >= CURRENT_DATE - INTERVAL '14 days' 
       AND fecha_envio < CURRENT_DATE - INTERVAL '7 days') as periodo_anterior
  `)

  // Calcular porcentaje de crecimiento
  let porcentajeCrecimiento = 0
  if (crecimiento.length > 0) {
    const periodoActual = crecimiento[0].periodo_actual || 0
    const periodoAnterior = crecimiento[0].periodo_anterior || 0

    if (periodoAnterior > 0) {
      porcentajeCrecimiento = Math.round(((periodoActual - periodoAnterior) / periodoAnterior) * 100)
    } else if (periodoActual > 0) {
      porcentajeCrecimiento = 100 // Si no había mensajes antes pero ahora sí, es un 100% de crecimiento
    }
  }

  // Obtener configuración de costo y moneda
  const configCosto = (await getConfiguracion("costo_mensaje")) || "0.032"
  const configMoneda = (await getConfiguracion("moneda")) || "€"

  return {
    totalMensajes: totalMensajes[0]?.total || 0,
    mensajesPorEstado,
    mensajesPorDia,
    mensajesPorHora,
    mensajesPorSemana,
    plantillasMasUsadas,
    tasaEntrega: tasaEntrega[0]?.tasa_entrega || 0,
    tasaError: tasaEntrega[0]?.tasa_error || 0,
    porcentajeCrecimiento,
    costoPromedio: configCosto,
    moneda: configMoneda,
  }
}

// Enviar un nuevo mensaje
export async function enviarMensaje(
  telefono: string,
  contenido: string,
  plantillaId?: number,
  variablesUsadas?: any,
  estado = "enviado", // Parámetro de estado con valor predeterminado
) {
  return executeQuery<any>(
    `INSERT INTO mensajes_enviados 
     (telefono, contenido_mensaje, plantilla_id, variables_usadas, estado) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [telefono, contenido, plantillaId || null, JSON.stringify(variablesUsadas || {}), estado],
  )
}

// Crear un nuevo contacto
export async function crearContacto(telefono: string, nombre: string, apellido: string, correo: string) {
  return executeQuery<any>(
    `INSERT INTO contactos 
     (telefono, nombre, apellido, correo) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [telefono, nombre, apellido, correo],
  )
}

// Crear una nueva plantilla
export async function crearPlantilla(nombre: string, contenido: string, descripcion: string) {
  return executeQuery<any>(
    `INSERT INTO plantillas_mensaje 
     (nombre, contenido, descripcion) 
     VALUES ($1, $2, $3) RETURNING *`,
    [nombre, contenido, descripcion],
  )
}

export async function createMessageTemplate(name: string, content: string, userId: number) {
  return executeQuery<any>(
    `INSERT INTO message_templates
     (name, content, creator_id)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, content, userId],
  )
}

// Crear una nueva variable
export async function crearVariable(nombre: string, descripcion: string, ejemplo: string) {
  return executeQuery<any>(
    `INSERT INTO variables 
     (nombre, descripcion, ejemplo) 
     VALUES ($1, $2, $3) RETURNING *`,
    [nombre, descripcion, ejemplo],
  )
}

export async function createUser(username: string, passwordHash: string, email: string) {
  return executeQuery<any>(`INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *`, [
    username,
    passwordHash,
    email,
  ])
}

export async function getUsers() {
  return executeQuery<any[]>(`SELECT id, username, email, created_at FROM users`)
}

export async function getActivityLogs() {
  return executeQuery<any[]>(`
      SELECT id, user_id, username, action, description, ip_address, created_at
      FROM activity_logs
      ORDER BY created_at DESC
  `)
}

// Función para registrar actividad
export async function registrarActividad(
  usuarioId: number | null,
  accion: string,
  descripcion: string,
  direccionIp: string,
) {
  return executeQuery<any>(
    `INSERT INTO registros_actividad 
     (usuario_id, accion, descripcion, direccion_ip) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [usuarioId, accion, descripcion, direccionIp],
  )
}

// Función para obtener configuración del sistema
export async function getConfiguracion(clave: string) {
  const resultado = await executeQuery<any[]>(
    `SELECT valor_configuracion FROM configuracion_sistema WHERE clave_configuracion = $1`,
    [clave],
  )

  return resultado.length > 0 ? resultado[0].valor_configuracion : null
}

// Función para actualizar configuración del sistema
export async function actualizarConfiguracion(clave: string, valor: string, usuarioId?: number) {
  return executeQuery<any>(
    `INSERT INTO configuracion_sistema (clave_configuracion, valor_configuracion, actualizado_por)
     VALUES ($1, $2, $3)
     ON CONFLICT (clave_configuracion) 
     DO UPDATE SET valor_configuracion = $2, actualizado_por = $3 RETURNING *`,
    [clave, valor, usuarioId || null],
  )
}

// Función para obtener detalles de un grupo de contactos
export async function getDetallesGrupo(grupoId: number) {
  const grupo = await executeQuery<any[]>(`SELECT * FROM grupos_contacto WHERE id = $1`, [grupoId])

  if (grupo.length === 0) {
    return null
  }

  const miembros = await executeQuery<any[]>(
    `SELECT c.* 
     FROM contactos c
     JOIN miembros_grupo mg ON c.id = mg.contacto_id
     WHERE mg.grupo_id = $1`,
    [grupoId],
  )

  return {
    ...grupo[0],
    miembros,
  }
}

// Función para añadir un contacto a un grupo
export async function agregarContactoAGrupo(contactoId: number, grupoId: number) {
  return executeQuery<any>(`INSERT INTO miembros_grupo (contacto_id, grupo_id) VALUES ($1, $2) RETURNING *`, [contactoId, grupoId])
}

// Función para eliminar un contacto de un grupo
export async function eliminarContactoDeGrupo(contactoId: number, grupoId: number) {
  return executeQuery<any>(`DELETE FROM miembros_grupo WHERE contacto_id = $1 AND grupo_id = $2 RETURNING *`, [contactoId, grupoId])
}

// Función para eliminar una plantilla
export async function eliminarPlantilla(plantillaId: number) {
  return executeQuery<any>(`DELETE FROM plantillas_mensaje WHERE id = $1 RETURNING *`, [plantillaId])
}

// Función para eliminar una variable
export async function eliminarVariable(variableId: number) {
  return executeQuery<any>(`DELETE FROM variables WHERE id = $1 RETURNING *`, [variableId])
}

// Función para eliminar un contacto
export async function eliminarContacto(contactoId: number) {
  return executeQuery<any>(`DELETE FROM contactos WHERE id = $1 RETURNING *`, [contactoId])
}

// Función para actualizar una plantilla
export async function actualizarPlantilla(plantillaId: number, nombre: string, contenido: string, descripcion: string) {
  return executeQuery<any>(
    `UPDATE plantillas_mensaje 
     SET nombre = $1, contenido = $2, descripcion = $3, fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id = $4 RETURNING *`,
    [nombre, contenido, descripcion, plantillaId],
  )
}

// Función para actualizar una variable
export async function actualizarVariable(variableId: number, nombre: string, descripcion: string, ejemplo: string) {
  return executeQuery<any>(
    `UPDATE variables 
     SET nombre = $1, descripcion = $2, ejemplo = $3, fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id = $4 RETURNING *`,
    [nombre, descripcion, ejemplo, variableId],
  )
}

// Función para actualizar un contacto
export async function actualizarContacto(
  contactoId: number,
  telefono: string,
  nombre: string,
  apellido: string,
  correo: string,
) {
  return executeQuery<any>(
    `UPDATE contactos 
     SET telefono = $1, nombre = $2, apellido = $3, correo = $4, fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id = $5 RETURNING *`,
    [telefono, nombre, apellido, correo, contactoId],
  )
}