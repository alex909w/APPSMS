--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: dbappsms_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO dbappsms_user;

--
-- Name: estado_mensaje; Type: TYPE; Schema: public; Owner: dbappsms_user
--

CREATE TYPE public.estado_mensaje AS ENUM (
    'pendiente',
    'enviado',
    'fallido',
    'entregado'
);


ALTER TYPE public.estado_mensaje OWNER TO dbappsms_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actividad_log; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.actividad_log (
    id integer NOT NULL,
    tipo character varying(255) NOT NULL,
    descripcion text NOT NULL,
    usuario_id character varying(255),
    entidad_id character varying(255),
    entidad_tipo character varying(255),
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.actividad_log OWNER TO dbappsms_user;

--
-- Name: actividad_log_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.actividad_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actividad_log_id_seq OWNER TO dbappsms_user;

--
-- Name: actividad_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.actividad_log_id_seq OWNED BY public.actividad_log.id;


--
-- Name: configuracion_sistema; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.configuracion_sistema (
    id integer NOT NULL,
    clave_configuracion character varying(100) NOT NULL,
    valor_configuracion text NOT NULL,
    descripcion character varying(255),
    encriptado boolean DEFAULT false,
    actualizado_por integer,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.configuracion_sistema OWNER TO dbappsms_user;

--
-- Name: configuracion_sistema_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.configuracion_sistema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_sistema_id_seq OWNER TO dbappsms_user;

--
-- Name: configuracion_sistema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.configuracion_sistema_id_seq OWNED BY public.configuracion_sistema.id;


--
-- Name: contactos; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.contactos (
    id integer NOT NULL,
    telefono character varying(20) NOT NULL,
    nombre character varying(50),
    apellido character varying(50),
    correo character varying(100),
    datos_adicionales jsonb,
    creado_por integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contactos OWNER TO dbappsms_user;

--
-- Name: contactos_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.contactos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contactos_id_seq OWNER TO dbappsms_user;

--
-- Name: contactos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.contactos_id_seq OWNED BY public.contactos.id;


--
-- Name: grupos_contacto; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.grupos_contacto (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    creado_por integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.grupos_contacto OWNER TO dbappsms_user;

--
-- Name: grupos_contacto_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.grupos_contacto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grupos_contacto_id_seq OWNER TO dbappsms_user;

--
-- Name: grupos_contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.grupos_contacto_id_seq OWNED BY public.grupos_contacto.id;


--
-- Name: mensajes_enviados; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.mensajes_enviados (
    id integer NOT NULL,
    telefono character varying(20) NOT NULL,
    contenido_mensaje text NOT NULL,
    plantilla_id integer,
    variables_usadas jsonb,
    estado public.estado_mensaje DEFAULT 'pendiente'::public.estado_mensaje,
    mensaje_error character varying(255),
    enviado_por integer,
    fecha_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega timestamp without time zone,
    proveedor character varying(50),
    id_mensaje_proveedor character varying(100)
);


ALTER TABLE public.mensajes_enviados OWNER TO dbappsms_user;

--
-- Name: mensajes_enviados_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.mensajes_enviados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mensajes_enviados_id_seq OWNER TO dbappsms_user;

--
-- Name: mensajes_enviados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.mensajes_enviados_id_seq OWNED BY public.mensajes_enviados.id;


--
-- Name: message_templates; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.message_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content text NOT NULL,
    creator_id character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.message_templates OWNER TO dbappsms_user;

--
-- Name: message_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.message_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_templates_id_seq OWNER TO dbappsms_user;

--
-- Name: message_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.message_templates_id_seq OWNED BY public.message_templates.id;


--
-- Name: miembros_grupo; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.miembros_grupo (
    contacto_id integer NOT NULL,
    grupo_id integer NOT NULL,
    fecha_agregado timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.miembros_grupo OWNER TO dbappsms_user;

--
-- Name: plantillas_mensaje; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.plantillas_mensaje (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    contenido text NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true,
    creado_por integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.plantillas_mensaje OWNER TO dbappsms_user;

--
-- Name: plantillas_mensaje_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.plantillas_mensaje_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plantillas_mensaje_id_seq OWNER TO dbappsms_user;

--
-- Name: plantillas_mensaje_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.plantillas_mensaje_id_seq OWNED BY public.plantillas_mensaje.id;


--
-- Name: proveedores_sms; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.proveedores_sms (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    api_key character varying(255),
    api_secret character varying(255),
    url_base character varying(255),
    activo boolean DEFAULT true,
    configuracion jsonb,
    creado_por integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.proveedores_sms OWNER TO dbappsms_user;

--
-- Name: proveedores_sms_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.proveedores_sms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedores_sms_id_seq OWNER TO dbappsms_user;

--
-- Name: proveedores_sms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.proveedores_sms_id_seq OWNED BY public.proveedores_sms.id;


--
-- Name: registros_actividad; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.registros_actividad (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(100) NOT NULL,
    tipo_entidad character varying(50),
    entidad_id integer,
    descripcion text,
    direccion_ip character varying(45),
    agente_usuario character varying(255),
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registros_actividad OWNER TO dbappsms_user;

--
-- Name: registros_actividad_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.registros_actividad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registros_actividad_id_seq OWNER TO dbappsms_user;

--
-- Name: registros_actividad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.registros_actividad_id_seq OWNED BY public.registros_actividad.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO dbappsms_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO dbappsms_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    contrasena character varying(255) NOT NULL,
    correo character varying(100) NOT NULL,
    nombre character varying(50),
    apellido character varying(50),
    activo boolean DEFAULT true,
    rol character varying(10) DEFAULT 'usuario'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    correo_electronico character varying(255),
    proveedor_auth character varying(50),
    id_proveedor character varying(255),
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['admin'::character varying, 'usuario'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO dbappsms_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO dbappsms_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: variables; Type: TABLE; Schema: public; Owner: dbappsms_user
--

CREATE TABLE public.variables (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255) NOT NULL,
    ejemplo character varying(100),
    creado_por integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.variables OWNER TO dbappsms_user;

--
-- Name: variables_id_seq; Type: SEQUENCE; Schema: public; Owner: dbappsms_user
--

CREATE SEQUENCE public.variables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variables_id_seq OWNER TO dbappsms_user;

--
-- Name: variables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbappsms_user
--

ALTER SEQUENCE public.variables_id_seq OWNED BY public.variables.id;


--
-- Name: actividad_log id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.actividad_log ALTER COLUMN id SET DEFAULT nextval('public.actividad_log_id_seq'::regclass);


--
-- Name: configuracion_sistema id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.configuracion_sistema ALTER COLUMN id SET DEFAULT nextval('public.configuracion_sistema_id_seq'::regclass);


--
-- Name: contactos id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.contactos ALTER COLUMN id SET DEFAULT nextval('public.contactos_id_seq'::regclass);


--
-- Name: grupos_contacto id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.grupos_contacto ALTER COLUMN id SET DEFAULT nextval('public.grupos_contacto_id_seq'::regclass);


--
-- Name: mensajes_enviados id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.mensajes_enviados ALTER COLUMN id SET DEFAULT nextval('public.mensajes_enviados_id_seq'::regclass);


--
-- Name: message_templates id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.message_templates ALTER COLUMN id SET DEFAULT nextval('public.message_templates_id_seq'::regclass);


--
-- Name: plantillas_mensaje id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.plantillas_mensaje ALTER COLUMN id SET DEFAULT nextval('public.plantillas_mensaje_id_seq'::regclass);


--
-- Name: proveedores_sms id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.proveedores_sms ALTER COLUMN id SET DEFAULT nextval('public.proveedores_sms_id_seq'::regclass);


--
-- Name: registros_actividad id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.registros_actividad ALTER COLUMN id SET DEFAULT nextval('public.registros_actividad_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: variables id; Type: DEFAULT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.variables ALTER COLUMN id SET DEFAULT nextval('public.variables_id_seq'::regclass);


--
-- Data for Name: actividad_log; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.actividad_log (id, tipo, descripcion, usuario_id, entidad_id, entidad_tipo, fecha) FROM stdin;
\.


--
-- Data for Name: configuracion_sistema; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.configuracion_sistema (id, clave_configuracion, valor_configuracion, descripcion, encriptado, actualizado_por, fecha_actualizacion) FROM stdin;
1	limite_diario_sms	1000	L¡mite diario de SMS que se pueden enviar	f	\N	2025-04-01 15:33:27.822721
2	proveedor_sms_predeterminado	1	ID del proveedor de SMS predeterminado	f	\N	2025-04-01 15:33:27.822721
3	correo_notificacion	alertas@example.com	Email para notificaciones del sistema	f	\N	2025-04-01 15:33:27.822721
4	costo_mensaje	0.032	\N	f	\N	2025-04-01 15:33:27.822721
5	moneda	$	\N	f	\N	2025-04-01 15:33:27.822721
\.


--
-- Data for Name: contactos; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.contactos (id, telefono, nombre, apellido, correo, datos_adicionales, creado_por, fecha_creacion, fecha_actualizacion) FROM stdin;
1	+50378573605	Aristides Alexander Hernandez Valdez	Valdez	alex909w@hotmail.com	\N	\N	2025-04-01 15:33:28.109942	2025-04-01 15:33:28.109942
2	+50378573605	Aristides Alexander	Valdez	alex909w@hotmail.com	\N	\N	2025-04-01 15:33:28.109942	2025-04-01 15:33:28.109942
3	+50378573610	Luis antonio	Valdez	admin@colegio.com	\N	\N	2025-04-01 15:55:20.30534	2025-04-01 15:55:20.30534
\.


--
-- Data for Name: grupos_contacto; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.grupos_contacto (id, nombre, descripcion, creado_por, fecha_creacion, fecha_actualizacion) FROM stdin;
1	Varios	VIP	\N	2025-04-01 15:33:28.253955	2025-04-01 15:33:28.253955
\.


--
-- Data for Name: mensajes_enviados; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.mensajes_enviados (id, telefono, contenido_mensaje, plantilla_id, variables_usadas, estado, mensaje_error, enviado_por, fecha_envio, fecha_entrega, proveedor, id_mensaje_proveedor) FROM stdin;
\.


--
-- Data for Name: message_templates; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.message_templates (id, name, content, creator_id, created_at) FROM stdin;
\.


--
-- Data for Name: miembros_grupo; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.miembros_grupo (contacto_id, grupo_id, fecha_agregado) FROM stdin;
1	1	2025-04-01 15:33:28.402232
2	1	2025-04-01 15:33:28.402232
\.


--
-- Data for Name: plantillas_mensaje; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.plantillas_mensaje (id, nombre, contenido, descripcion, activo, creado_por, fecha_creacion, fecha_actualizacion) FROM stdin;
1	Bienvenida	Hola <nombre>, bienvenido a nuestro servicio. Estamos encantados de tenerte con nosotros.	Mensaje de bienvenida para nuevos usuarios	t	\N	2025-04-01 15:33:28.564623	2025-04-01 15:33:28.564623
2	Promoci¢n	Hola <nombre>, tenemos una promoci¢n especial del 20% en tu tarjeta terminada en <digitos_tc>. V lida hasta <fecha>.	Mensaje promocional con descuento	t	\N	2025-04-01 15:33:28.564623	2025-04-01 15:33:28.564623
3	Verificaci¢n	Tu c¢digo de verificaci¢n es <codigo>. No lo compartas con nadie.	Mensaje para verificaci¢n de identidad	t	\N	2025-04-01 15:33:28.564623	2025-04-01 15:33:28.564623
\.


--
-- Data for Name: proveedores_sms; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.proveedores_sms (id, nombre, api_key, api_secret, url_base, activo, configuracion, creado_por, fecha_creacion, fecha_actualizacion) FROM stdin;
1	Twilio	tu_api_key_aqui	tu_api_secret_aqui	https://api.twilio.com	t	{"account_sid": "tu_account_sid", "from_number": "+1234567890"}	\N	2025-04-01 15:33:28.710482	2025-04-01 15:33:28.710482
\.


--
-- Data for Name: registros_actividad; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.registros_actividad (id, usuario_id, accion, tipo_entidad, entidad_id, descripcion, direccion_ip, agente_usuario, fecha_creacion) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.users (id, name, email, password, role, created_at) FROM stdin;
1	Admin	admin@example.com	$2a$10$mLK.rrdlvx9DCFb6Eck1t.TlltnGulepXnov3bBp5T2TloO1MYj52	admin	2025-04-01 16:29:47.843544
2	Alex Valdez	alex909w@gmail.com	\N	user	2025-04-01 16:40:59.556909
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.usuarios (id, nombre_usuario, contrasena, correo, nombre, apellido, activo, rol, fecha_creacion, fecha_actualizacion, correo_electronico, proveedor_auth, id_proveedor) FROM stdin;
1	admin	Admin2025	admin@appsms.com	Administrador	Sistema	t	admin	2025-04-01 15:33:27.967399	2025-04-01 15:33:27.967399	\N	\N	\N
\.


--
-- Data for Name: variables; Type: TABLE DATA; Schema: public; Owner: dbappsms_user
--

COPY public.variables (id, nombre, descripcion, ejemplo, creado_por, fecha_creacion, fecha_actualizacion) FROM stdin;
1	nombre	Nombre del destinatario	Juan Antonio	\N	2025-04-01 15:33:31.36613	2025-04-01 15:33:31.36613
2	apellido	Apellido del destinatario	P‚rez	\N	2025-04-01 15:33:31.36613	2025-04-01 15:33:31.36613
3	digitos_tc	éltimos 4 d¡gitos de la tarjeta de cr‚dito	1234	\N	2025-04-01 15:33:31.36613	2025-04-01 15:33:31.36613
4	fecha	Fecha actual en formato DD/MM/YYYY	01/01/2023	\N	2025-04-01 15:33:31.36613	2025-04-01 15:33:31.36613
5	monto	Monto de la transacci¢n	100.00	\N	2025-04-01 15:33:31.36613	2025-04-01 15:33:31.36613
6	codigo	C¢digo de verificaci¢n o promocional	ABC123	\N	2025-04-01 15:33:31.36613	2025-04-01 15:33:31.36613
7	Cuenta	Cuenta banacaria	0125423	\N	2025-04-01 15:33:31.36613	2025-04-01 15:33:31.36613
\.


--
-- Name: actividad_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.actividad_log_id_seq', 1, false);


--
-- Name: configuracion_sistema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.configuracion_sistema_id_seq', 5, true);


--
-- Name: contactos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.contactos_id_seq', 3, true);


--
-- Name: grupos_contacto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.grupos_contacto_id_seq', 1, true);


--
-- Name: mensajes_enviados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.mensajes_enviados_id_seq', 1, false);


--
-- Name: message_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.message_templates_id_seq', 1, false);


--
-- Name: plantillas_mensaje_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.plantillas_mensaje_id_seq', 13, true);


--
-- Name: proveedores_sms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.proveedores_sms_id_seq', 1, true);


--
-- Name: registros_actividad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.registros_actividad_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- Name: variables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dbappsms_user
--

SELECT pg_catalog.setval('public.variables_id_seq', 7, true);


--
-- Name: actividad_log actividad_log_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.actividad_log
    ADD CONSTRAINT actividad_log_pkey PRIMARY KEY (id);


--
-- Name: configuracion_sistema configuracion_sistema_clave_configuracion_key; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_clave_configuracion_key UNIQUE (clave_configuracion);


--
-- Name: configuracion_sistema configuracion_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_pkey PRIMARY KEY (id);


--
-- Name: contactos contactos_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT contactos_pkey PRIMARY KEY (id);


--
-- Name: grupos_contacto grupos_contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.grupos_contacto
    ADD CONSTRAINT grupos_contacto_pkey PRIMARY KEY (id);


--
-- Name: mensajes_enviados mensajes_enviados_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.mensajes_enviados
    ADD CONSTRAINT mensajes_enviados_pkey PRIMARY KEY (id);


--
-- Name: message_templates message_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.message_templates
    ADD CONSTRAINT message_templates_pkey PRIMARY KEY (id);


--
-- Name: miembros_grupo miembros_grupo_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.miembros_grupo
    ADD CONSTRAINT miembros_grupo_pkey PRIMARY KEY (contacto_id, grupo_id);


--
-- Name: plantillas_mensaje plantillas_mensaje_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.plantillas_mensaje
    ADD CONSTRAINT plantillas_mensaje_pkey PRIMARY KEY (id);


--
-- Name: proveedores_sms proveedores_sms_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.proveedores_sms
    ADD CONSTRAINT proveedores_sms_pkey PRIMARY KEY (id);


--
-- Name: registros_actividad registros_actividad_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.registros_actividad
    ADD CONSTRAINT registros_actividad_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_electronico_key UNIQUE (correo_electronico);


--
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- Name: usuarios usuarios_nombre_usuario_key; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_usuario_key UNIQUE (nombre_usuario);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: variables variables_nombre_key; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_nombre_key UNIQUE (nombre);


--
-- Name: variables variables_pkey; Type: CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_pkey PRIMARY KEY (id);


--
-- Name: idx_contactos_telefono; Type: INDEX; Schema: public; Owner: dbappsms_user
--

CREATE INDEX idx_contactos_telefono ON public.contactos USING btree (telefono);


--
-- Name: idx_mensajes_enviados_estado; Type: INDEX; Schema: public; Owner: dbappsms_user
--

CREATE INDEX idx_mensajes_enviados_estado ON public.mensajes_enviados USING btree (estado, fecha_envio);


--
-- Name: idx_registros_actividad_usuario; Type: INDEX; Schema: public; Owner: dbappsms_user
--

CREATE INDEX idx_registros_actividad_usuario ON public.registros_actividad USING btree (usuario_id, fecha_creacion);


--
-- Name: configuracion_sistema fk_actualizado_por; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT fk_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: miembros_grupo fk_contacto_id; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.miembros_grupo
    ADD CONSTRAINT fk_contacto_id FOREIGN KEY (contacto_id) REFERENCES public.contactos(id) ON DELETE CASCADE;


--
-- Name: contactos fk_creado_por; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: grupos_contacto fk_creado_por; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.grupos_contacto
    ADD CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: plantillas_mensaje fk_creado_por; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.plantillas_mensaje
    ADD CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: proveedores_sms fk_creado_por; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.proveedores_sms
    ADD CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: variables fk_creado_por; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.variables
    ADD CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: mensajes_enviados fk_enviado_por; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.mensajes_enviados
    ADD CONSTRAINT fk_enviado_por FOREIGN KEY (enviado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: miembros_grupo fk_grupo_id; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.miembros_grupo
    ADD CONSTRAINT fk_grupo_id FOREIGN KEY (grupo_id) REFERENCES public.grupos_contacto(id) ON DELETE CASCADE;


--
-- Name: mensajes_enviados fk_plantilla_id; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.mensajes_enviados
    ADD CONSTRAINT fk_plantilla_id FOREIGN KEY (plantilla_id) REFERENCES public.plantillas_mensaje(id) ON DELETE SET NULL;


--
-- Name: registros_actividad fk_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: dbappsms_user
--

ALTER TABLE ONLY public.registros_actividad
    ADD CONSTRAINT fk_usuario_id FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO dbappsms_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO dbappsms_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO dbappsms_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dbappsms_user;


--
-- PostgreSQL database dump complete
--

