-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 01-04-2025 a las 04:50:11
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `app_sms`
--
CREATE DATABASE IF NOT EXISTS `app_sms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `app_sms`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_sistema`
--

DROP TABLE IF EXISTS `configuracion_sistema`;
CREATE TABLE IF NOT EXISTS `configuracion_sistema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clave_configuracion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_configuracion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encriptado` tinyint(1) DEFAULT '0',
  `actualizado_por` int DEFAULT NULL,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave_configuracion` (`clave_configuracion`),
  KEY `actualizado_por` (`actualizado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuracion_sistema`
--

INSERT INTO `configuracion_sistema` (`id`, `clave_configuracion`, `valor_configuracion`, `descripcion`, `encriptado`, `actualizado_por`, `fecha_actualizacion`) VALUES
(1, 'limite_diario_sms', '1000', 'Límite diario de SMS que se pueden enviar', 0, NULL, '2025-03-29 14:51:10'),
(2, 'proveedor_sms_predeterminado', '1', 'ID del proveedor de SMS predeterminado', 0, NULL, '2025-03-29 14:51:10'),
(3, 'correo_notificacion', 'alertas@example.com', 'Email para notificaciones del sistema', 0, NULL, '2025-03-29 14:51:10'),
(4, 'costo_mensaje', '0.032', NULL, 0, NULL, '2025-03-31 04:10:39'),
(5, 'moneda', '$', NULL, 0, NULL, '2025-03-31 04:10:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

DROP TABLE IF EXISTS `contactos`;
CREATE TABLE IF NOT EXISTS `contactos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datos_adicionales` json DEFAULT NULL,
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creado_por` (`creado_por`),
  KEY `idx_contactos_telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `contactos`
--

INSERT INTO `contactos` (`id`, `telefono`, `nombre`, `apellido`, `correo`, `datos_adicionales`, `creado_por`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(2, '+50378573605', 'Aristides Alexander Hernandez Valdez', 'Valdez', 'alex909w@hotmail.com', NULL, NULL, '2025-03-30 02:57:49', '2025-03-31 05:11:33'),
(3, '+50378573605', 'Aristides Alexander ', 'Valdez', 'alex909w@hotmail.com', NULL, NULL, '2025-03-31 02:10:57', '2025-03-31 02:10:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos_contacto`
--

DROP TABLE IF EXISTS `grupos_contacto`;
CREATE TABLE IF NOT EXISTS `grupos_contacto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creado_por` (`creado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `grupos_contacto`
--

INSERT INTO `grupos_contacto` (`id`, `nombre`, `descripcion`, `creado_por`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Varios', 'VIP', NULL, '2025-03-31 02:35:42', '2025-03-31 02:35:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes_enviados`
--

DROP TABLE IF EXISTS `mensajes_enviados`;
CREATE TABLE IF NOT EXISTS `mensajes_enviados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenido_mensaje` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `plantilla_id` int DEFAULT NULL,
  `variables_usadas` json DEFAULT NULL,
  `estado` enum('pendiente','enviado','fallido','entregado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `mensaje_error` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enviado_por` int DEFAULT NULL,
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `proveedor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_mensaje_proveedor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantilla_id` (`plantilla_id`),
  KEY `enviado_por` (`enviado_por`),
  KEY `idx_mensajes_enviados_estado` (`estado`,`fecha_envio`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mensajes_enviados`
--

INSERT INTO `mensajes_enviados` (`id`, `telefono`, `contenido_mensaje`, `plantilla_id`, `variables_usadas`, `estado`, `mensaje_error`, `enviado_por`, `fecha_envio`, `fecha_entrega`, `proveedor`, `id_mensaje_proveedor`) VALUES
(1, '+50378573605', 'Hola Alexander, bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"Alexander\"}', 'enviado', NULL, NULL, '2025-03-31 02:35:13', NULL, NULL, NULL),
(2, '+50378573605', 'Hola Clientes, tenemos una promoción especial del 20% en tu tarjeta terminada en 123468. Válida hasta 30/03.', 2, '{\"fecha\": \"30/03\", \"nombre\": \"Clientes\", \"digitos_tc\": \"123468\"}', 'enviado', NULL, NULL, '2025-03-31 02:37:25', NULL, NULL, NULL),
(3, '+50378573605', 'Hola Clientes, tenemos una promoción especial del 20% en tu tarjeta terminada en 123468. Válida hasta 30/03.', 2, '{\"fecha\": \"30/03\", \"nombre\": \"Clientes\", \"digitos_tc\": \"123468\"}', 'enviado', NULL, NULL, '2025-03-31 02:37:25', NULL, NULL, NULL),
(4, '+50378573605', 'Hola Clientes, tenemos una promoción especial del 20% en tu tarjeta terminada en 123468. Válida hasta 30/03.', 2, '{\"fecha\": \"30/03\", \"nombre\": \"Clientes\", \"digitos_tc\": \"123468\"}', 'enviado', NULL, NULL, '2025-03-31 02:37:30', NULL, NULL, NULL),
(5, '+50378573605', 'Hola Clientes, tenemos una promoción especial del 20% en tu tarjeta terminada en 123468. Válida hasta 30/03.', 2, '{\"fecha\": \"30/03\", \"nombre\": \"Clientes\", \"digitos_tc\": \"123468\"}', 'enviado', NULL, NULL, '2025-03-31 02:37:30', NULL, NULL, NULL),
(6, '+50378573605', 'Hola Alex, tenemos una promoción especial del 20% en tu tarjeta terminada en 653201.2. Válida hasta 29/03.', 2, '{\"fecha\": \"29/03\", \"nombre\": \"Alex\", \"digitos_tc\": \"653201.2\"}', 'entregado', NULL, NULL, '2025-03-31 02:56:29', NULL, NULL, NULL),
(7, '+50378573605', 'Tu código de verificación es 1234568. No lo compartas con nadie.', 3, '{\"codigo\": \"1234568\"}', 'fallido', NULL, NULL, '2025-03-31 02:56:50', NULL, NULL, NULL),
(8, '+50378573605', 'Hola , tenemos una promoción especial del 20% en tu tarjeta terminada en . Válida hasta .', 2, '{\"fecha\": \"\", \"nombre\": \"\", \"digitos_tc\": \"\"}', 'entregado', NULL, NULL, '2025-03-31 03:04:57', NULL, NULL, NULL),
(9, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 03:43:17', NULL, NULL, NULL),
(10, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 03:43:18', NULL, NULL, NULL),
(11, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros. <apellido> <digitos_tc> <Cuenta>', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 03:44:01', NULL, NULL, NULL),
(12, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros. <apellido> <digitos_tc> <Cuenta>', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 03:44:01', NULL, NULL, NULL),
(13, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 04:14:30', NULL, NULL, NULL),
(14, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 04:14:30', NULL, NULL, NULL),
(15, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"\"}', 'entregado', NULL, NULL, '2025-03-31 14:09:47', NULL, NULL, NULL),
(16, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 14:10:16', NULL, NULL, NULL),
(17, '+50378573605', 'Hola , bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 1, '{\"nombre\": \"\"}', 'enviado', NULL, NULL, '2025-03-31 16:20:51', NULL, NULL, NULL),
(18, '+50378573605', 'Hola , tenemos una promoción especial del 20% en tu tarjeta terminada en . Válida hasta .', 2, '{\"fecha\": \"\", \"nombre\": \"\", \"digitos_tc\": \"\"}', 'enviado', NULL, NULL, '2025-04-01 02:13:22', NULL, NULL, NULL),
(19, '+50378573605', 'Hola , tenemos una promoción especial del 20% en tu tarjeta terminada en . Válida hasta .', 2, '{\"fecha\": \"\", \"nombre\": \"\", \"digitos_tc\": \"\"}', 'fallido', NULL, NULL, '2025-04-01 02:13:49', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembros_grupo`
--

DROP TABLE IF EXISTS `miembros_grupo`;
CREATE TABLE IF NOT EXISTS `miembros_grupo` (
  `contacto_id` int NOT NULL,
  `grupo_id` int NOT NULL,
  `fecha_agregado` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contacto_id`,`grupo_id`),
  KEY `grupo_id` (`grupo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `miembros_grupo`
--

INSERT INTO `miembros_grupo` (`contacto_id`, `grupo_id`, `fecha_agregado`) VALUES
(2, 1, '2025-03-31 02:35:57'),
(3, 1, '2025-03-31 02:35:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plantillas_mensaje`
--

DROP TABLE IF EXISTS `plantillas_mensaje`;
CREATE TABLE IF NOT EXISTS `plantillas_mensaje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creado_por` (`creado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `plantillas_mensaje`
--

INSERT INTO `plantillas_mensaje` (`id`, `nombre`, `contenido`, `descripcion`, `activo`, `creado_por`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Bienvenida', 'Hola <nombre>, bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.', 'Mensaje de bienvenida para nuevos usuarios', 1, NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10'),
(2, 'Promoción', 'Hola <nombre>, tenemos una promoción especial del 20% en tu tarjeta terminada en <digitos_tc>. Válida hasta <fecha>.', 'Mensaje promocional con descuento', 1, NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10'),
(3, 'Verificación', 'Tu código de verificación es <codigo>. No lo compartas con nadie.', 'Mensaje para verificación de identidad', 1, NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores_sms`
--

DROP TABLE IF EXISTS `proveedores_sms`;
CREATE TABLE IF NOT EXISTS `proveedores_sms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_base` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `configuracion` json DEFAULT NULL,
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creado_por` (`creado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores_sms`
--

INSERT INTO `proveedores_sms` (`id`, `nombre`, `api_key`, `api_secret`, `url_base`, `activo`, `configuracion`, `creado_por`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Twilio', 'tu_api_key_aqui', 'tu_api_secret_aqui', 'https://api.twilio.com', 1, '{\"account_sid\": \"tu_account_sid\", \"from_number\": \"+1234567890\"}', NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_actividad`
--

DROP TABLE IF EXISTS `registros_actividad`;
CREATE TABLE IF NOT EXISTS `registros_actividad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `accion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_entidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entidad_id` int DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `direccion_ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agente_usuario` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_registros_actividad_usuario` (`usuario_id`,`fecha_creacion`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `registros_actividad`
--

INSERT INTO `registros_actividad` (`id`, `usuario_id`, `accion`, `tipo_entidad`, `entidad_id`, `descripcion`, `direccion_ip`, `agente_usuario`, `fecha_creacion`) VALUES
(1, NULL, 'create_template', NULL, NULL, 'Plantilla creada: Alex', '::1', NULL, '2025-03-29 15:17:39'),
(2, NULL, 'create_template', NULL, NULL, 'Plantilla creada: 123', '::1', NULL, '2025-03-29 15:21:24'),
(3, NULL, 'delete_template', NULL, NULL, 'Plantilla eliminada: ID 5', '::1', NULL, '2025-03-29 15:39:27'),
(4, NULL, 'update_variable', NULL, NULL, 'Variable actualizada: nombre', '::1', NULL, '2025-03-29 15:49:37'),
(5, NULL, 'create_contact', NULL, NULL, 'Contacto creado: Aristides Alexander Hernandez Valdez Valdez (+50378573605)', '::1', NULL, '2025-03-29 15:50:17'),
(6, NULL, 'update_template', NULL, NULL, 'Plantilla actualizada: Alex', '::1', NULL, '2025-03-30 02:53:49'),
(7, NULL, 'update_variable', NULL, NULL, 'Variable actualizada: nombre', '::1', NULL, '2025-03-30 02:57:08'),
(8, NULL, 'update_template', NULL, NULL, 'Plantilla actualizada: Alex', '::1', NULL, '2025-03-30 02:57:14'),
(9, NULL, 'delete_contact', NULL, NULL, 'Contacto eliminado: ID 1', '::1', NULL, '2025-03-30 02:57:30'),
(10, NULL, 'create_contact', NULL, NULL, 'Contacto creado: Aristides Alexander Hernandez Valdez Valdez (+50378573605)', '::1', NULL, '2025-03-30 02:57:49'),
(11, NULL, 'update_template', NULL, NULL, 'Plantilla actualizada: Alex', '::1', NULL, '2025-03-31 01:53:22'),
(12, NULL, 'delete_template', NULL, NULL, 'Plantilla eliminada: ID 4', '::1', NULL, '2025-03-31 01:53:27'),
(13, NULL, 'create_variable', NULL, NULL, 'Variable creada: Cuenta', '::1', NULL, '2025-03-31 01:53:58'),
(14, NULL, 'update_contact', NULL, NULL, 'Contacto actualizado: Aristides Alexander Hernandez Valdez Valdez (+50378573605)', '::1', NULL, '2025-03-31 02:05:41'),
(15, NULL, 'update_contact', NULL, NULL, 'Contacto actualizado: Aristides Alexander Hernandez Valdez Valdez (+50378573605)', '::1', NULL, '2025-03-31 02:10:37'),
(16, NULL, 'create_contact', NULL, NULL, 'Contacto creado: Aristides Alexander  Valdez (+50378573605)', '::1', NULL, '2025-03-31 02:10:57'),
(17, NULL, 'send_sms', NULL, NULL, 'Mensaje enviado a +50378573605 usando plantilla ID 1', '::1', NULL, '2025-03-31 02:35:13'),
(18, NULL, 'create_group', NULL, NULL, 'Grupo creado: Varios', '::1', NULL, '2025-03-31 02:35:42'),
(19, NULL, 'add_contacts_to_group', NULL, NULL, 'Se añadieron 2 contactos al grupo 1', '::1', NULL, '2025-03-31 02:35:57'),
(20, NULL, 'send_bulk_sms', NULL, NULL, 'Envío masivo a grupo 1: 2 enviados, 0 fallidos', '::1', NULL, '2025-03-31 02:37:25'),
(21, NULL, 'send_bulk_sms', NULL, NULL, 'Envío masivo a grupo 1: 2 enviados, 0 fallidos', '::1', NULL, '2025-03-31 02:37:30'),
(22, NULL, 'create_group', NULL, NULL, 'Grupo creado: Prueba2', '::1', NULL, '2025-03-31 02:38:50'),
(23, NULL, 'delete_group', NULL, NULL, 'Se eliminó el grupo 2', '::1', NULL, '2025-03-31 02:39:06'),
(24, NULL, 'create_group', NULL, NULL, 'Grupo creado: Prueba 2', '::1', NULL, '2025-03-31 02:43:41'),
(25, NULL, 'update_group', NULL, NULL, 'Se actualizó el grupo 3', '::1', NULL, '2025-03-31 02:43:48'),
(26, NULL, 'add_contacts_to_group', NULL, NULL, 'Se añadieron 2 contactos al grupo 3', '::1', NULL, '2025-03-31 02:43:58'),
(27, NULL, 'delete_group', NULL, NULL, 'Se eliminó el grupo 3', '::1', NULL, '2025-03-31 02:44:10'),
(28, NULL, 'send_sms', NULL, NULL, 'Mensaje enviado a +50378573605 usando plantilla ID 2', '::1', NULL, '2025-03-31 02:56:29'),
(29, NULL, 'send_sms', NULL, NULL, 'Mensaje enviado a +50378573605 usando plantilla ID 3', '::1', NULL, '2025-03-31 02:56:50'),
(30, NULL, 'send_bulk_sms', NULL, NULL, 'Envío masivo a grupo 1: 1 enviados, 1 fallidos', '::1', NULL, '2025-03-31 03:04:57'),
(31, NULL, 'create_variable', NULL, NULL, 'Variable creada: scZSC', '::1', NULL, '2025-03-31 03:17:34'),
(32, NULL, 'update_variable', NULL, NULL, 'Variable actualizada: scZSC', '::1', NULL, '2025-03-31 03:17:43'),
(33, NULL, 'delete_variable', NULL, NULL, 'Variable eliminada: ID 8', '::1', NULL, '2025-03-31 03:17:48'),
(34, NULL, 'create_template', NULL, NULL, 'Plantilla creada: xvxcvx', '::1', NULL, '2025-03-31 03:22:37'),
(35, NULL, 'update_variable', NULL, NULL, 'Variable actualizada: nombre', '::1', NULL, '2025-03-31 03:27:57'),
(36, NULL, 'update_template', NULL, NULL, 'Plantilla actualizada: xvxcvx', '::1', NULL, '2025-03-31 03:28:03'),
(37, NULL, 'update_template', NULL, NULL, 'Plantilla actualizada: xvxcvx', '::1', NULL, '2025-03-31 03:28:13'),
(38, NULL, 'create_template', NULL, NULL, 'Plantilla creada: zcvbcxvb', '::1', NULL, '2025-03-31 03:28:19'),
(39, NULL, 'delete_template', NULL, NULL, 'Plantilla eliminada: ID 7', '::1', NULL, '2025-03-31 03:28:23'),
(40, NULL, 'update_template', NULL, NULL, 'Plantilla actualizada: xvxcvx', '::1', NULL, '2025-03-31 03:28:26'),
(41, NULL, 'delete_template', NULL, NULL, 'Plantilla eliminada: ID 6', '::1', NULL, '2025-03-31 03:28:28'),
(42, NULL, 'update_variable', NULL, NULL, 'Variable actualizada: nombre', '::1', NULL, '2025-03-31 03:28:35'),
(43, NULL, 'create_variable', NULL, NULL, 'Variable creada: zxvcxzcvxzcv', '::1', NULL, '2025-03-31 03:28:44'),
(44, NULL, 'update_variable', NULL, NULL, 'Variable actualizada: zxvcxzcvxzcv', '::1', NULL, '2025-03-31 03:28:49'),
(45, NULL, 'delete_variable', NULL, NULL, 'Variable eliminada: ID 9', '::1', NULL, '2025-03-31 03:28:53'),
(46, NULL, 'create_contact', NULL, NULL, 'Contacto creado: Aristides Alexander Hernandez Valdezxzcvxcv Valdezxzcvzxcvxzcvxzcvx (+50378573605)', '::1', NULL, '2025-03-31 03:29:10'),
(47, NULL, 'update_contact', NULL, NULL, 'Contacto actualizado: Aristides Alexander Hernandez Valdezxzcvxcv fgxh (+50378573605)', '::1', NULL, '2025-03-31 03:29:22'),
(48, NULL, 'delete_contact', NULL, NULL, 'Contacto eliminado: ID 4', '::1', NULL, '2025-03-31 03:29:24'),
(49, NULL, 'create_variable', NULL, NULL, 'Variable creada: asasd', '::1', NULL, '2025-03-31 03:41:58'),
(50, NULL, 'delete_variable', NULL, NULL, 'Variable eliminada: ID 13', '::1', NULL, '2025-03-31 03:42:05'),
(51, NULL, 'create_variable', NULL, NULL, 'Variable creada: nombre1', '::1', NULL, '2025-03-31 03:42:56'),
(52, NULL, 'delete_variable', NULL, NULL, 'Variable eliminada: ID 15', '::1', NULL, '2025-03-31 03:42:59'),
(53, NULL, 'send_bulk_sms', NULL, NULL, 'Envío masivo a grupo 1: 2 enviados, 0 fallidos', '::1', NULL, '2025-03-31 03:43:18'),
(54, NULL, 'send_bulk_sms', NULL, NULL, 'Envío masivo a grupo 1: 2 enviados, 0 fallidos', '::1', NULL, '2025-03-31 03:44:01'),
(55, NULL, 'send_bulk_sms', NULL, NULL, 'Envío masivo a grupo 1: 2 enviados, 0 fallidos', '::1', NULL, '2025-03-31 04:14:30'),
(56, NULL, 'update_contact', NULL, NULL, 'Contacto actualizado: Aristides Alexander Hernandez Valdez Valdez (+50378573605)', '::1', NULL, '2025-03-31 05:11:33'),
(57, NULL, 'send_sms', NULL, NULL, 'Mensaje enviado a +50378573605 usando plantilla ID 1', '::1', NULL, '2025-03-31 14:09:47'),
(58, NULL, 'send_sms', NULL, NULL, 'Mensaje enviado a +50378573605 usando plantilla ID 1', '::1', NULL, '2025-03-31 14:10:16'),
(59, NULL, 'send_sms', NULL, NULL, 'Mensaje enviado a +50378573605 usando plantilla ID 1', '::1', NULL, '2025-03-31 16:20:51'),
(60, NULL, 'update_variable', NULL, NULL, 'Variable actualizada: nombre', '::1', NULL, '2025-03-31 22:07:55'),
(61, NULL, 'send_bulk_sms', NULL, NULL, 'Envío masivo a grupo 1: 1 enviados, 1 fallidos', '::1', NULL, '2025-04-01 02:13:22'),
(62, NULL, 'send_sms', NULL, NULL, 'Mensaje enviado a +50378573605 usando plantilla ID 2', '::1', NULL, '2025-04-01 02:13:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `rol` enum('admin','usuario') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'usuario',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `correo_electronico` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proveedor_auth` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_proveedor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `idx_correo_electronico` (`correo_electronico`),
  KEY `idx_usuarios_nombre_correo` (`nombre_usuario`,`correo`),
  KEY `idx_usuarios_correo` (`correo`),
  KEY `idx_usuarios_nombre_usuario` (`nombre_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `contrasena`, `correo`, `nombre`, `apellido`, `activo`, `rol`, `fecha_creacion`, `fecha_actualizacion`, `correo_electronico`, `proveedor_auth`, `id_proveedor`) VALUES
(4, 'admin', 'Admin2025', 'admin@appsms.com', 'Administrador', 'Sistema', 1, 'admin', '2025-03-31 14:36:14', '2025-03-31 15:39:51', NULL, NULL, NULL),
(15, 'Alex Valdez', '', '', NULL, NULL, 1, 'usuario', '2025-03-31 22:44:07', '2025-03-31 22:44:07', 'alex909w@gmail.com', 'google', '109470194202344299224');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variables`
--

DROP TABLE IF EXISTS `variables`;
CREATE TABLE IF NOT EXISTS `variables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ejemplo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `creado_por` (`creado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `variables`
--

INSERT INTO `variables` (`id`, `nombre`, `descripcion`, `ejemplo`, `creado_por`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'nombre', 'Nombre del destinatario', 'Juan Antonio', NULL, '2025-03-29 14:51:10', '2025-03-31 22:07:55'),
(2, 'apellido', 'Apellido del destinatario', 'Pérez', NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10'),
(3, 'digitos_tc', 'Últimos 4 dígitos de la tarjeta de crédito', '1234', NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10'),
(4, 'fecha', 'Fecha actual en formato DD/MM/YYYY', '01/01/2023', NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10'),
(5, 'monto', 'Monto de la transacción', '100.00', NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10'),
(6, 'codigo', 'Código de verificación o promocional', 'ABC123', NULL, '2025-03-29 14:51:10', '2025-03-29 14:51:10'),
(7, 'Cuenta', 'Cuenta banacaria', '0125423', NULL, '2025-03-31 01:53:58', '2025-03-31 01:53:58');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `configuracion_sistema`
--
ALTER TABLE `configuracion_sistema`
  ADD CONSTRAINT `configuracion_sistema_ibfk_1` FOREIGN KEY (`actualizado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD CONSTRAINT `contactos_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `grupos_contacto`
--
ALTER TABLE `grupos_contacto`
  ADD CONSTRAINT `grupos_contacto_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `mensajes_enviados`
--
ALTER TABLE `mensajes_enviados`
  ADD CONSTRAINT `mensajes_enviados_ibfk_1` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas_mensaje` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `mensajes_enviados_ibfk_2` FOREIGN KEY (`enviado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `miembros_grupo`
--
ALTER TABLE `miembros_grupo`
  ADD CONSTRAINT `miembros_grupo_ibfk_1` FOREIGN KEY (`contacto_id`) REFERENCES `contactos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `miembros_grupo_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupos_contacto` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `plantillas_mensaje`
--
ALTER TABLE `plantillas_mensaje`
  ADD CONSTRAINT `plantillas_mensaje_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `proveedores_sms`
--
ALTER TABLE `proveedores_sms`
  ADD CONSTRAINT `proveedores_sms_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `registros_actividad`
--
ALTER TABLE `registros_actividad`
  ADD CONSTRAINT `registros_actividad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `variables`
--
ALTER TABLE `variables`
  ADD CONSTRAINT `variables_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
