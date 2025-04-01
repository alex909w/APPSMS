-- Creación de la base de datos (ejecutar primero en psql)
CREATE DATABASE app_sms WITH ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';

-- Conectarse a la base de datos (desde CMD)
\c app_sms

-- Crear extensión para UUID si es necesario
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla configuracion_sistema
CREATE TABLE configuracion_sistema (
  id SERIAL PRIMARY KEY,
  clave_configuracion VARCHAR(100) NOT NULL UNIQUE,
  valor_configuracion TEXT NOT NULL,
  descripcion VARCHAR(255),
  encriptado BOOLEAN DEFAULT FALSE,
  actualizado_por INTEGER,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  rol VARCHAR(10) DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  correo_electronico VARCHAR(255) UNIQUE,
  proveedor_auth VARCHAR(50),
  id_proveedor VARCHAR(255)
);

-- Añadir restricción de clave foránea a configuracion_sistema
ALTER TABLE configuracion_sistema ADD CONSTRAINT fk_actualizado_por 
FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

-- Tabla contactos
CREATE TABLE contactos (
  id SERIAL PRIMARY KEY,
  telefono VARCHAR(20) NOT NULL,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  correo VARCHAR(100),
  datos_adicionales JSONB,
  creado_por INTEGER,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contactos_telefono ON contactos(telefono);

-- Tabla grupos_contacto
CREATE TABLE grupos_contacto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  creado_por INTEGER,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla plantillas_mensaje
CREATE TABLE plantillas_mensaje (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  contenido TEXT NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  creado_por INTEGER,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla mensajes_enviados
CREATE TYPE estado_mensaje AS ENUM ('pendiente', 'enviado', 'fallido', 'entregado');

CREATE TABLE mensajes_enviados (
  id SERIAL PRIMARY KEY,
  telefono VARCHAR(20) NOT NULL,
  contenido_mensaje TEXT NOT NULL,
  plantilla_id INTEGER,
  variables_usadas JSONB,
  estado estado_mensaje DEFAULT 'pendiente',
  mensaje_error VARCHAR(255),
  enviado_por INTEGER,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega TIMESTAMP,
  proveedor VARCHAR(50),
  id_mensaje_proveedor VARCHAR(100)
);

CREATE INDEX idx_mensajes_enviados_estado ON mensajes_enviados(estado, fecha_envio);

-- Tabla miembros_grupo
CREATE TABLE miembros_grupo (
  contacto_id INTEGER NOT NULL,
  grupo_id INTEGER NOT NULL,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (contacto_id, grupo_id)
);

-- Tabla proveedores_sms
CREATE TABLE proveedores_sms (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  url_base VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  configuracion JSONB,
  creado_por INTEGER,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla registros_actividad
CREATE TABLE registros_actividad (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER,
  accion VARCHAR(100) NOT NULL,
  tipo_entidad VARCHAR(50),
  entidad_id INTEGER,
  descripcion TEXT,
  direccion_ip VARCHAR(45),
  agente_usuario VARCHAR(255),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registros_actividad_usuario ON registros_actividad(usuario_id, fecha_creacion);

-- Tabla variables
CREATE TABLE variables (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NOT NULL,
  ejemplo VARCHAR(100),
  creado_por INTEGER,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restricciones de clave foránea
ALTER TABLE contactos ADD CONSTRAINT fk_creado_por 
FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE grupos_contacto ADD CONSTRAINT fk_creado_por 
FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE plantillas_mensaje ADD CONSTRAINT fk_creado_por 
FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE mensajes_enviados ADD CONSTRAINT fk_plantilla_id 
FOREIGN KEY (plantilla_id) REFERENCES plantillas_mensaje(id) ON DELETE SET NULL;

ALTER TABLE mensajes_enviados ADD CONSTRAINT fk_enviado_por 
FOREIGN KEY (enviado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE miembros_grupo ADD CONSTRAINT fk_contacto_id 
FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE;

ALTER TABLE miembros_grupo ADD CONSTRAINT fk_grupo_id 
FOREIGN KEY (grupo_id) REFERENCES grupos_contacto(id) ON DELETE CASCADE;

ALTER TABLE proveedores_sms ADD CONSTRAINT fk_creado_por 
FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE registros_actividad ADD CONSTRAINT fk_usuario_id 
FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;

ALTER TABLE variables ADD CONSTRAINT fk_creado_por 
FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

-- Insertar datos de configuración
INSERT INTO configuracion_sistema (clave_configuracion, valor_configuracion, descripcion, encriptado) VALUES
('limite_diario_sms', '1000', 'Límite diario de SMS que se pueden enviar', FALSE),
('proveedor_sms_predeterminado', '1', 'ID del proveedor de SMS predeterminado', FALSE),
('correo_notificacion', 'alertas@example.com', 'Email para notificaciones del sistema', FALSE),
('costo_mensaje', '0.032', NULL, FALSE),
('moneda', '$', NULL, FALSE);

-- Insertar usuarios
INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombre, apellido, activo, rol) VALUES
('admin', 'Admin2025', 'admin@appsms.com', 'Administrador', 'Sistema', TRUE, 'admin');

-- Insertar contactos
INSERT INTO contactos (telefono, nombre, apellido, correo) VALUES
('+50378573605', 'Aristides Alexander Hernandez Valdez', 'Valdez', 'alex909w@hotmail.com'),
('+50378573605', 'Aristides Alexander', 'Valdez', 'alex909w@hotmail.com');

-- Insertar grupos
INSERT INTO grupos_contacto (nombre, descripcion) VALUES
('Varios', 'VIP');

-- Insertar miembros de grupo
INSERT INTO miembros_grupo (contacto_id, grupo_id) VALUES
(1, 1), (2, 1);

-- Insertar plantillas
INSERT INTO plantillas_mensaje (nombre, contenido, descripcion, activo) VALUES
('Bienvenida', 'Hola <nombre>, bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 'Mensaje de bienvenida para nuevos usuarios', TRUE),
('Promoción', 'Hola <nombre>, tenemos una promoción especial del 20% en tu tarjeta terminada en <digitos_tc>. Válida hasta <fecha>.', 'Mensaje promocional con descuento', TRUE),
('Verificación', 'Tu código de verificación es <codigo>. No lo compartas con nadie.', 'Mensaje para verificación de identidad', TRUE);

-- Insertar proveedores
INSERT INTO proveedores_sms (nombre, api_key, api_secret, url_base, activo, configuracion) VALUES
('Twilio', 'tu_api_key_aqui', 'tu_api_secret_aqui', 'https://api.twilio.com', TRUE, '{"account_sid": "tu_account_sid", "from_number": "+1234567890"}');

-- Insertar variables
INSERT INTO variables (nombre, descripcion, ejemplo) VALUES
('nombre', 'Nombre del destinatario', 'Juan Antonio'),
('apellido', 'Apellido del destinatario', 'Pérez'),
('digitos_tc', 'Últimos 4 dígitos de la tarjeta de crédito', '1234'),
('fecha', 'Fecha actual en formato DD/MM/YYYY', '01/01/2023'),
('monto', 'Monto de la transacción', '100.00'),
('codigo', 'Código de verificación o promocional', 'ABC123'),
('Cuenta', 'Cuenta banacaria', '0125423');