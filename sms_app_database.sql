-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS app_sms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE app_sms;

-- Tabla de usuarios para autenticación
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  rol ENUM('admin', 'usuario') DEFAULT 'usuario',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla para clientes OAuth2.0
CREATE TABLE IF NOT EXISTS clientes_oauth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id VARCHAR(80) NOT NULL UNIQUE,
  cliente_secreto VARCHAR(80) NOT NULL,
  uri_redireccion VARCHAR(2000),
  tipos_concesion VARCHAR(80),
  alcance VARCHAR(4000),
  usuario_id INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla para tokens de acceso OAuth2.0
CREATE TABLE IF NOT EXISTS tokens_acceso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token_acceso VARCHAR(255) NOT NULL UNIQUE,
  cliente_id VARCHAR(80) NOT NULL,
  usuario_id INT,
  expira TIMESTAMP NOT NULL,
  alcance VARCHAR(4000),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla para tokens de actualización OAuth2.0
CREATE TABLE IF NOT EXISTS tokens_actualizacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token_actualizacion VARCHAR(255) NOT NULL UNIQUE,
  cliente_id VARCHAR(80) NOT NULL,
  usuario_id INT,
  expira TIMESTAMP NOT NULL,
  alcance VARCHAR(4000),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla para códigos de autorización OAuth2.0
CREATE TABLE IF NOT EXISTS codigos_autorizacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_autorizacion VARCHAR(255) NOT NULL UNIQUE,
  cliente_id VARCHAR(80) NOT NULL,
  usuario_id INT,
  uri_redireccion VARCHAR(2000),
  expira TIMESTAMP NOT NULL,
  alcance VARCHAR(4000),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla para variables predefinidas que pueden usarse en los mensajes SMS
CREATE TABLE IF NOT EXISTS variables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NOT NULL,
  ejemplo VARCHAR(100),
  creado_por INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla para plantillas de mensajes SMS
CREATE TABLE IF NOT EXISTS plantillas_mensaje (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  contenido TEXT NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  creado_por INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla para contactos (destinatarios de SMS)
CREATE TABLE IF NOT EXISTS contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(20) NOT NULL,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  correo VARCHAR(100),
  datos_adicionales JSON,
  creado_por INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla para grupos de contactos
CREATE TABLE IF NOT EXISTS grupos_contacto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  creado_por INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla de relación entre contactos y grupos
CREATE TABLE IF NOT EXISTS miembros_grupo (
  contacto_id INT NOT NULL,
  grupo_id INT NOT NULL,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (contacto_id, grupo_id),
  FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
  FOREIGN KEY (grupo_id) REFERENCES grupos_contacto(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla para mensajes SMS enviados
CREATE TABLE IF NOT EXISTS mensajes_enviados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(20) NOT NULL,
  contenido_mensaje TEXT NOT NULL,
  plantilla_id INT,
  variables_usadas JSON,
  estado ENUM('pendiente', 'enviado', 'fallido', 'entregado') DEFAULT 'pendiente',
  mensaje_error VARCHAR(255),
  enviado_por INT,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega TIMESTAMP NULL,
  proveedor VARCHAR(50),
  id_mensaje_proveedor VARCHAR(100),
  FOREIGN KEY (plantilla_id) REFERENCES plantillas_mensaje(id) ON DELETE SET NULL,
  FOREIGN KEY (enviado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla para logs de actividad del sistema
CREATE TABLE IF NOT EXISTS registros_actividad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  accion VARCHAR(100) NOT NULL,
  tipo_entidad VARCHAR(50),
  entidad_id INT,
  descripcion TEXT,
  direccion_ip VARCHAR(45),
  agente_usuario VARCHAR(255),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla para configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion_sistema (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave_configuracion VARCHAR(100) NOT NULL UNIQUE,
  valor_configuracion TEXT NOT NULL,
  descripcion VARCHAR(255),
  encriptado BOOLEAN DEFAULT FALSE,
  actualizado_por INT,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla para proveedores de SMS
CREATE TABLE IF NOT EXISTS proveedores_sms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  url_base VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  configuracion JSON,
  creado_por INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Insertar datos iniciales

-- Usuario administrador (contraseña: admin123)
INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombre, apellido, rol)
VALUES ('admin', '$2b$10$X/tHXz.SqMm1T4DgUj9RJOZxkHiJEpj7V4mYfEODKXwGQ.VhMD.Oe', 'admin@example.com', 'Admin', 'Usuario', 'admin');

-- Cliente OAuth2.0 predeterminado
INSERT INTO clientes_oauth (cliente_id, cliente_secreto, uri_redireccion, tipos_concesion, alcance, usuario_id)
VALUES ('cliente_predeterminado', 'secreto_predeterminado', 'http://localhost:3000/callback', 'authorization_code,password,refresh_token,client_credentials', 'lectura,escritura', 1);

-- Variables predefinidas para mensajes
INSERT INTO variables (nombre, descripcion, ejemplo, creado_por)
VALUES 
('nombre', 'Nombre del destinatario', 'Juan', 1),
('apellido', 'Apellido del destinatario', 'Pérez', 1),
('digitos_tc', 'Últimos 4 dígitos de la tarjeta de crédito', '1234', 1),
('fecha', 'Fecha actual en formato DD/MM/YYYY', '01/01/2023', 1),
('monto', 'Monto de la transacción', '100.00', 1),
('codigo', 'Código de verificación o promocional', 'ABC123', 1);

-- Plantillas de mensajes predeterminadas
INSERT INTO plantillas_mensaje (nombre, contenido, descripcion, creado_por)
VALUES 
('Bienvenida', 'Hola <nombre>, bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 'Mensaje de bienvenida para nuevos usuarios', 1),
('Promoción', 'Hola <nombre>, tenemos una promoción especial del 20% en tu tarjeta terminada en <digitos_tc>. Válida hasta <fecha>.', 'Mensaje promocional con descuento', 1),
('Verificación', 'Tu código de verificación es <codigo>. No lo compartas con nadie.', 'Mensaje para verificación de identidad', 1);

-- Configuración del sistema
INSERT INTO configuracion_sistema (clave_configuracion, valor_configuracion, descripcion, actualizado_por)
VALUES 
('limite_diario_sms', '1000', 'Límite diario de SMS que se pueden enviar', 1),
('proveedor_sms_predeterminado', '1', 'ID del proveedor de SMS predeterminado', 1),
('correo_notificacion', 'alertas@example.com', 'Email para notificaciones del sistema', 1);

-- Proveedor de SMS predeterminado (ejemplo)
INSERT INTO proveedores_sms (nombre, api_key, api_secret, url_base, activo, configuracion, creado_por)
VALUES ('Twilio', 'tu_api_key_aqui', 'tu_api_secret_aqui', 'https://api.twilio.com', TRUE, '{"account_sid": "tu_account_sid", "from_number": "+1234567890"}', 1);

-- Índices para mejorar el rendimiento

-- Índice para búsqueda de usuarios por nombre_usuario o correo
CREATE INDEX idx_usuarios_nombre_correo ON usuarios(nombre_usuario, correo);

-- Índice para búsqueda de tokens
CREATE INDEX idx_tokens_acceso ON tokens_acceso(token_acceso, expira);
CREATE INDEX idx_tokens_actualizacion ON tokens_actualizacion(token_actualizacion, expira);

-- Índice para búsqueda de mensajes por estado y fecha
CREATE INDEX idx_mensajes_enviados_estado ON mensajes_enviados(estado, fecha_envio);

-- Índice para búsqueda de logs por usuario y fecha
CREATE INDEX idx_registros_actividad_usuario ON registros_actividad(usuario_id, fecha_creacion);

-- Índice para búsqueda de contactos por número de teléfono
CREATE INDEX idx_contactos_telefono ON contactos(telefono);

