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

// Funciones para usuarios
export async function getUsuarios() {
  return executeQuery<any[]>("SELECT id, nombre_usuario, correo, nombre, apellido, activo, rol FROM usuarios")
}

export async function crearUsuario(data: {
  nombre_usuario: string;
  contrasena: string;
  correo: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
}) {
  return executeQuery<any>(
    "INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombre, apellido, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre_usuario, correo, nombre, apellido, rol",
    [data.nombre_usuario, data.contrasena, data.correo, data.nombre || null, data.apellido || null, data.rol || 'usuario']
  )
}

// Funciones para configuración del sistema
export async function getConfiguracionSistema() {
  return executeQuery<any[]>("SELECT * FROM configuracion_sistema")
}

export async function actualizarConfiguracionSistema(clave: string, valor: string) {
  return executeQuery<any>(
    `INSERT INTO configuracion_sistema (clave_configuracion, valor_configuracion) 
     VALUES ($1, $2)
     ON CONFLICT (clave_configuracion) 
     DO UPDATE SET valor_configuracion = $2, fecha_actualizacion = CURRENT_TIMESTAMP
     RETURNING *`,
    [clave, valor]
  )
}

// Funciones para contactos
export async function getContactos() {
  return executeQuery<any[]>("SELECT * FROM contactos")
}

export async function crearContacto(data: {
  telefono: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  datos_adicionales?: object;
  creado_por?: number;
}) {
  return executeQuery<any>(
    `INSERT INTO contactos (telefono, nombre, apellido, correo, datos_adicionales, creado_por) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      data.telefono,
      data.nombre || null,
      data.apellido || null,
      data.correo || null,
      data.datos_adicionales ? JSON.stringify(data.datos_adicionales) : null,
      data.creado_por || null
    ]
  )
}

export async function actualizarContacto(
  id: number,
  data: {
    telefono?: string;
    nombre?: string;
    apellido?: string;
    correo?: string;
    datos_adicionales?: object;
  }
) {
  const updates = []
  const values = []

  if (data.telefono) {
    updates.push(`telefono = $${updates.length + 1}`)
    values.push(data.telefono)
  }

  if (data.nombre) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.apellido) {
    updates.push(`apellido = $${updates.length + 1}`)
    values.push(data.apellido)
  }

  if (data.correo) {
    updates.push(`correo = $${updates.length + 1}`)
    values.push(data.correo)
  }

  if (data.datos_adicionales) {
    updates.push(`datos_adicionales = $${updates.length + 1}`)
    values.push(JSON.stringify(data.datos_adicionales))
  }

  if (updates.length === 0) return null

  // Siempre actualizamos la fecha de actualización
  updates.push(`fecha_actualizacion = CURRENT_TIMESTAMP`)

  values.push(id)
  return executeQuery<any>(
    `UPDATE contactos SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

export async function eliminarContacto(id: number) {
  return executeQuery<any>("DELETE FROM contactos WHERE id = $1 RETURNING *", [id])
}

// Funciones para grupos de contacto
export async function getGruposContacto() {
  return executeQuery<any[]>(
    `SELECT gc.*, COUNT(mg.contacto_id) as total_contactos
     FROM grupos_contacto gc
     LEFT JOIN miembros_grupo mg ON gc.id = mg.grupo_id
     GROUP BY gc.id`
  )
}

export async function crearGrupoContacto(data: {
  nombre: string;
  descripcion?: string;
  creado_por?: number;
}) {
  return executeQuery<any>(
    `INSERT INTO grupos_contacto (nombre, descripcion, creado_por) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [data.nombre, data.descripcion || null, data.creado_por || null]
  )
}

export async function actualizarGrupoContacto(
  id: number,
  data: {
    nombre?: string;
    descripcion?: string;
  }
) {
  const updates = []
  const values = []

  if (data.nombre) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.descripcion) {
    updates.push(`descripcion = $${updates.length + 1}`)
    values.push(data.descripcion)
  }

  if (updates.length === 0) return null

  // Siempre actualizamos la fecha de actualización
  updates.push(`fecha_actualizacion = CURRENT_TIMESTAMP`)

  values.push(id)
  return executeQuery<any>(
    `UPDATE grupos_contacto SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

export async function eliminarGrupoContacto(id: number) {
  return executeQuery<any>("DELETE FROM grupos_contacto WHERE id = $1 RETURNING *", [id])
}

// Funciones para miembros de grupo
export async function getMiembrosGrupo(grupoId: number) {
  return executeQuery<any[]>(
    `SELECT c.* 
     FROM contactos c
     JOIN miembros_grupo mg ON c.id = mg.contacto_id
     WHERE mg.grupo_id = $1`,
    [grupoId]
  )
}

export async function agregarContactoAGrupo(grupoId: number, contactoId: number) {
  return executeQuery<any>(
    `INSERT INTO miembros_grupo (grupo_id, contacto_id) 
     VALUES ($1, $2) 
     ON CONFLICT (grupo_id, contacto_id) DO NOTHING
     RETURNING *`,
    [grupoId, contactoId]
  )
}

export async function eliminarContactoDeGrupo(grupoId: number, contactoId: number) {
  return executeQuery<any>(
    `DELETE FROM miembros_grupo 
     WHERE grupo_id = $1 AND contacto_id = $2
     RETURNING *`,
    [grupoId, contactoId]
  )
}

// Funciones para plantillas de mensaje
export async function getPlantillasMensaje() {
  return executeQuery<any[]>("SELECT * FROM plantillas_mensaje WHERE activo = true")
}

export async function crearPlantillaMensaje(data: {
  nombre: string;
  contenido: string;
  descripcion?: string;
  creado_por?: number;
}) {
  return executeQuery<any>(
    `INSERT INTO plantillas_mensaje (nombre, contenido, descripcion, creado_por) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [data.nombre, data.contenido, data.descripcion || null, data.creado_por || null]
  )
}

export async function actualizarPlantillaMensaje(
  id: number,
  data: {
    nombre?: string;
    contenido?: string;
    descripcion?: string;
    activo?: boolean;
  }
) {
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

  if (data.descripcion) {
    updates.push(`descripcion = $${updates.length + 1}`)
    values.push(data.descripcion)
  }

  if (data.activo !== undefined) {
    updates.push(`activo = $${updates.length + 1}`)
    values.push(data.activo)
  }

  if (updates.length === 0) return null

  // Siempre actualizamos la fecha de actualización
  updates.push(`fecha_actualizacion = CURRENT_TIMESTAMP`)

  values.push(id)
  return executeQuery<any>(
    `UPDATE plantillas_mensaje SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

export async function eliminarPlantillaMensaje(id: number) {
  // En lugar de borrar, marcamos como inactivo
  return executeQuery<any>(
    `UPDATE plantillas_mensaje SET activo = false, fecha_actualizacion = CURRENT_TIMESTAMP 
     WHERE id = $1 RETURNING *`,
    [id]
  )
}

// Funciones para mensajes enviados
export async function getMensajesEnviados() {
  return executeQuery<any[]>(
    `SELECT me.*, pm.nombre as nombre_plantilla, u.nombre || ' ' || u.apellido as nombre_usuario
     FROM mensajes_enviados me
     LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
     LEFT JOIN usuarios u ON me.enviado_por = u.id
     ORDER BY me.fecha_envio DESC`
  )
}

export async function getMensajeById(id: number) {
  const mensaje = await executeQuery<any[]>(
    `SELECT me.*, pm.nombre as nombre_plantilla, u.nombre || ' ' || u.apellido as nombre_usuario
     FROM mensajes_enviados me
     LEFT JOIN plantillas_mensaje pm ON me.plantilla_id = pm.id
     LEFT JOIN usuarios u ON me.enviado_por = u.id
     WHERE me.id = $1`,
    [id]
  )

  return mensaje.length > 0 ? mensaje[0] : null
}

export async function enviarMensaje(data: {
  telefono: string;
  contenido_mensaje: string;
  plantilla_id?: number;
  variables_usadas?: object;
  enviado_por?: number;
  proveedor?: string;
}) {
  return executeQuery<any>(
    `INSERT INTO mensajes_enviados 
     (telefono, contenido_mensaje, plantilla_id, variables_usadas, enviado_por, proveedor) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      data.telefono,
      data.contenido_mensaje,
      data.plantilla_id || null,
      data.variables_usadas ? JSON.stringify(data.variables_usadas) : null,
      data.enviado_por || null,
      data.proveedor || null
    ]
  )
}

export async function actualizarEstadoMensaje(id: number, estado: string, mensaje_error?: string) {
  return executeQuery<any>(
    `UPDATE mensajes_enviados 
     SET estado = $1, mensaje_error = $2, fecha_entrega = CASE WHEN $1 = 'entregado' THEN CURRENT_TIMESTAMP ELSE fecha_entrega END
     WHERE id = $3 
     RETURNING *`,
    [estado, mensaje_error || null, id]
  )
}

// Funciones para proveedores SMS
export async function getProveedoresSMS() {
  return executeQuery<any[]>("SELECT * FROM proveedores_sms WHERE activo = true")
}

export async function crearProveedorSMS(data: {
  nombre: string;
  api_key: string;
  api_secret: string;
  url_base: string;
  configuracion?: object;
  creado_por?: number;
}) {
  return executeQuery<any>(
    `INSERT INTO proveedores_sms 
     (nombre, api_key, api_secret, url_base, configuracion, creado_por) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      data.nombre,
      data.api_key,
      data.api_secret,
      data.url_base,
      data.configuracion ? JSON.stringify(data.configuracion) : null,
      data.creado_por || null
    ]
  )
}

export async function actualizarProveedorSMS(
  id: number,
  data: {
    nombre?: string;
    api_key?: string;
    api_secret?: string;
    url_base?: string;
    configuracion?: object;
    activo?: boolean;
  }
) {
  const updates = []
  const values = []

  if (data.nombre) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.api_key) {
    updates.push(`api_key = $${updates.length + 1}`)
    values.push(data.api_key)
  }

  if (data.api_secret) {
    updates.push(`api_secret = $${updates.length + 1}`)
    values.push(data.api_secret)
  }

  if (data.url_base) {
    updates.push(`url_base = $${updates.length + 1}`)
    values.push(data.url_base)
  }

  if (data.configuracion) {
    updates.push(`configuracion = $${updates.length + 1}`)
    values.push(JSON.stringify(data.configuracion))
  }

  if (data.activo !== undefined) {
    updates.push(`activo = $${updates.length + 1}`)
    values.push(data.activo)
  }

  if (updates.length === 0) return null

  // Siempre actualizamos la fecha de actualización
  updates.push(`fecha_actualizacion = CURRENT_TIMESTAMP`)

  values.push(id)
  return executeQuery<any>(
    `UPDATE proveedores_sms SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

// Funciones para variables
export async function getVariables() {
  return executeQuery<any[]>("SELECT * FROM variables")
}

export async function crearVariable(data: {
  nombre: string;
  descripcion: string;
  ejemplo?: string;
  creado_por?: number;
}) {
  return executeQuery<any>(
    `INSERT INTO variables (nombre, descripcion, ejemplo, creado_por) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [data.nombre, data.descripcion, data.ejemplo || null, data.creado_por || null]
  )
}

export async function actualizarVariable(
  id: number,
  data: {
    nombre?: string;
    descripcion?: string;
    ejemplo?: string;
  }
) {
  const updates = []
  const values = []

  if (data.nombre) {
    updates.push(`nombre = $${updates.length + 1}`)
    values.push(data.nombre)
  }

  if (data.descripcion) {
    updates.push(`descripcion = $${updates.length + 1}`)
    values.push(data.descripcion)
  }

  if (data.ejemplo) {
    updates.push(`ejemplo = $${updates.length + 1}`)
    values.push(data.ejemplo)
  }

  if (updates.length === 0) return null

  // Siempre actualizamos la fecha de actualización
  updates.push(`fecha_actualizacion = CURRENT_TIMESTAMP`)

  values.push(id)
  return executeQuery<any>(
    `UPDATE variables SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  )
}

export async function eliminarVariable(id: number) {
  return executeQuery<any>("DELETE FROM variables WHERE id = $1 RETURNING *", [id])
}

// Funciones para registros de actividad
export async function getRegistrosActividad() {
  return executeQuery<any[]>(
    `SELECT ra.*, u.nombre || ' ' || u.apellido as nombre_usuario
     FROM registros_actividad ra
     LEFT JOIN usuarios u ON ra.usuario_id = u.id
     ORDER BY ra.fecha_creacion DESC`
  )
}

export async function registrarActividad(data: {
  usuario_id?: number;
  accion: string;
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

// Funciones de estadísticas
export async function getEstadisticas() {
  const [
    totalMensajes,
    mensajesPorEstado,
    totalContactos,
    totalGrupos,
    totalPlantillas,
    mensajesPorDia
  ] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as total FROM mensajes_enviados"),
    executeQuery<any[]>("SELECT estado, COUNT(*) as total FROM mensajes_enviados GROUP BY estado"),
    executeQuery<any[]>("SELECT COUNT(*) as total FROM contactos"),
    executeQuery<any[]>("SELECT COUNT(*) as total FROM grupos_contacto"),
    executeQuery<any[]>("SELECT COUNT(*) as total FROM plantillas_mensaje WHERE activo = true"),
    executeQuery<any[]>(
      `SELECT DATE(fecha_envio) as fecha, COUNT(*) as total 
       FROM mensajes_enviados 
       WHERE fecha_envio >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(fecha_envio) 
       ORDER BY fecha`
    )
  ])

  return {
    totalMensajes: totalMensajes[0]?.total || 0,
    mensajesPorEstado: mensajesPorEstado,
    totalContactos: totalContactos[0]?.total || 0,
    totalGrupos: totalGrupos[0]?.total || 0,
    totalPlantillas: totalPlantillas[0]?.total || 0,
    mensajesPorDia: mensajesPorDia
  }
}