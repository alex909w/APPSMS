"use client"

import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useRef } from "react"

export function UserManual() {
  const contentRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    // Crear un iframe oculto para imprimir solo el contenido
    const printFrame = document.createElement("iframe")
    printFrame.style.position = "absolute"
    printFrame.style.top = "-9999px"
    printFrame.style.left = "-9999px"
    document.body.appendChild(printFrame)

    // Escribir el contenido en el iframe
    const contentHtml = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual de Usuario - SMS Platform</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #fff; 
        background-color: #121212;
        max-width: 800px; 
        margin: 0 auto; 
        padding: 20px; 
      }
      h1 { 
        color: #fff; 
        border-bottom: 2px solid #444;
        padding-bottom: 12px;
        margin-bottom: 24px;
        font-size: 28px;
      }
      h2 { 
        color: #fff; 
        margin-top: 30px;
        font-size: 22px;
        background-color: #1e1e1e;
        padding: 10px 15px;
        border-radius: 6px;
        border-left: 4px solid #3b82f6;
      }
      h3 { 
        color: #eee; 
        font-size: 18px;
        margin-top: 20px;
        border-bottom: 1px solid #444;
        padding-bottom: 5px;
      }
      .page-break { 
        page-break-after: always; 
      }
      img { 
        max-width: 100%; 
        border: 1px solid #444; 
        border-radius: 4px; 
        margin: 15px 0;
      }
      code { 
        background-color: #2a2a2a; 
        padding: 2px 4px; 
        border-radius: 4px; 
        font-family: monospace;
        color: #ff9800;
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin: 20px 0; 
      }
      th, td { 
        border: 1px solid #444; 
        padding: 10px 12px; 
        text-align: left; 
      }
      th { 
        background-color: #1e1e1e; 
      }
      ol, ul {
        padding-left: 20px;
        background-color: #1e1e1e;
        padding: 15px 15px 15px 35px;
        border-radius: 6px;
        margin: 15px 0;
      }
      li {
        margin-bottom: 8px;
      }
      a {
        color: #3b82f6;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      p {
        background-color: #1e1e1e;
        padding: 10px;
        border-radius: 6px;
        margin: 15px 0;
      }
      @media print {
        body {
          color: #000;
          background-color: #fff;
        }
        h1, h2, h3 {
          color: #000;
        }
        h2 {
          background-color: #f0f0f0;
          border-left: 4px solid #3b82f6;
        }
        h3 {
          border-bottom: 1px solid #ccc;
        }
        code {
          background-color: #f0f0f0;
          color: #d97706;
        }
        p, ol, ul {
          background-color: #fff;
        }
        .page-break { page-break-after: always; }
        h2, h3 {
          break-after: avoid;
          page-break-after: avoid;
        }
        h2 + p, h3 + p, h2 + ol, h2 + ul, h3 + ol, h3 + ul {
          break-before: avoid;
          page-break-before: avoid;
        }
      }
    </style>
  </head>
  <body>
    ${contentRef.current?.innerHTML || ""}
  </body>
  </html>
`

    printFrame.contentDocument?.open()
    printFrame.contentDocument?.write(contentHtml)
    printFrame.contentDocument?.close()

    // Esperar a que se carguen los estilos y luego imprimir
    setTimeout(() => {
      printFrame.contentWindow?.print()
      document.body.removeChild(printFrame)
    }, 500)
  }

  const handleDownload = () => {
    // Crear un blob con el contenido HTML
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual de Usuario - SMS Platform</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #fff; 
        background-color: #121212;
        max-width: 800px; 
        margin: 0 auto; 
        padding: 20px; 
      }
      h1 { 
        color: #fff; 
        border-bottom: 2px solid #444;
        padding-bottom: 12px;
        margin-bottom: 24px;
        font-size: 28px;
      }
      h2 { 
        color: #fff; 
        margin-top: 30px;
        font-size: 22px;
        background-color: #1e1e1e;
        padding: 10px 15px;
        border-radius: 6px;
        border-left: 4px solid #3b82f6;
      }
      h3 { 
        color: #eee; 
        font-size: 18px;
        margin-top: 20px;
        border-bottom: 1px solid #444;
        padding-bottom: 5px;
      }
      .page-break { 
        page-break-after: always; 
      }
      img { 
        max-width: 100%; 
        border: 1px solid #444; 
        border-radius: 4px; 
        margin: 15px 0;
      }
      code { 
        background-color: #2a2a2a; 
        padding: 2px 4px; 
        border-radius: 4px; 
        font-family: monospace;
        color: #ff9800;
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin: 20px 0; 
      }
      th, td { 
        border: 1px solid #444; 
        padding: 10px 12px; 
        text-align: left; 
      }
      th { 
        background-color: #1e1e1e; 
      }
      ol, ul {
        padding-left: 20px;
        background-color: #1e1e1e;
        padding: 15px 15px 15px 35px;
        border-radius: 6px;
        margin: 15px 0;
      }
      li {
        margin-bottom: 8px;
      }
      a {
        color: #3b82f6;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      p {
        background-color: #1e1e1e;
        padding: 10px;
        border-radius: 6px;
        margin: 15px 0;
      }
    </style>
  </head>
  <body>
    ${contentRef.current?.innerHTML || ""}
  </body>
  </html>
`

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "manual-usuario-sms-platform.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white">Manual de Usuario</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
        </div>
      </div>

      <div
        ref={contentRef}
        className="prose max-w-none bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 text-white"
      >
        <h1 className="text-white border-b-2 border-gray-700 pb-3 mb-6">Manual de Usuario - SMS Platform</h1>

        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          Bienvenido al manual de usuario de SMS Platform. Esta guía te ayudará a entender y utilizar todas las
          funcionalidades de nuestra plataforma de envío de mensajes SMS.
        </p>

        <h2 id="indice" className="text-white bg-gray-800 border-l-4 border-blue-500 pl-3 rounded-md">
          Índice
        </h2>
        <ol className="space-y-2 bg-gray-800 p-4 rounded-lg">
          <li>
            <a href="#introduccion" className="text-blue-400 hover:underline">
              Introducción
            </a>
          </li>
          <li>
            <a href="#primeros-pasos" className="text-blue-400 hover:underline">
              Primeros Pasos
            </a>
          </li>
          <li>
            <a href="#envio-mensajes" className="text-blue-400 hover:underline">
              Envío de Mensajes
            </a>
          </li>
          <li>
            <a href="#plantillas" className="text-blue-400 hover:underline">
              Gestión de Plantillas
            </a>
          </li>
          <li>
            <a href="#contactos" className="text-blue-400 hover:underline">
              Gestión de Contactos
            </a>
          </li>
          <li>
            <a href="#estadisticas" className="text-blue-400 hover:underline">
              Estadísticas y Reportes
            </a>
          </li>
          <li>
            <a href="#configuracion" className="text-blue-400 hover:underline">
              Configuración de la Cuenta
            </a>
          </li>
          <li>
            <a href="#faq" className="text-blue-400 hover:underline">
              Preguntas Frecuentes
            </a>
          </li>
        </ol>

        <div className="page-break"></div>
        <h2 id="introduccion" className="text-white bg-gray-800 border-l-4 border-blue-500 pl-3 rounded-md">
          1. Introducción
        </h2>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          SMS Platform es una solución completa para el envío y gestión de mensajes SMS. Nuestra plataforma te permite
          enviar mensajes individuales o masivos, crear plantillas personalizadas, gestionar contactos y grupos, y
          analizar el rendimiento de tus campañas.
        </p>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">Características principales:</p>
        <ul className="space-y-2 bg-gray-800 p-4 rounded-lg">
          <li>Envío de mensajes individuales y masivos</li>
          <li>Creación y gestión de plantillas</li>
          <li>Gestión de contactos y grupos</li>
          <li>Programación de envíos</li>
          <li>Estadísticas y reportes detallados</li>
          <li>Integración con API</li>
        </ul>

        <div className="page-break"></div>
        <h2 id="primeros-pasos" className="text-white bg-gray-800 border-l-4 border-blue-500 pl-3 rounded-md">
          2. Primeros Pasos
        </h2>
        <h3 className="text-gray-200 border-b border-gray-700">2.1 Acceso a la Plataforma</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          Para acceder a SMS Platform, visita <code>https://smsplatform.com</code> e inicia sesión con tus credenciales.
          Si es tu primera vez, utiliza las credenciales proporcionadas por tu administrador.
        </p>
        <h3 className="text-gray-200 border-b border-gray-700">2.2 Interfaz Principal</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">La interfaz principal consta de:</p>
        <ul className="space-y-2 bg-gray-800 p-4 rounded-lg">
          <li>
            <strong className="text-blue-400">Barra de navegación superior:</strong> Acceso a tu perfil, notificaciones
            y configuración
          </li>
          <li>
            <strong className="text-blue-400">Menú lateral:</strong> Acceso a todas las secciones de la plataforma
          </li>
          <li>
            <strong className="text-blue-400">Área de contenido:</strong> Muestra la sección actual
          </li>
          <li>
            <strong className="text-blue-400">Panel de estadísticas:</strong> Resumen de actividad reciente
          </li>
        </ul>

        <div className="page-break"></div>
        <h2 id="envio-mensajes" className="text-white bg-gray-800 border-l-4 border-blue-500 pl-3 rounded-md">
          3. Envío de Mensajes
        </h2>
        <h3 className="text-gray-200 border-b border-gray-700">3.1 Envío Individual</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">Para enviar un mensaje individual:</p>
        <ol className="space-y-2 bg-gray-800 p-4 rounded-lg">
          <li>Ve a la sección "Enviar SMS" en el menú lateral</li>
          <li>Selecciona un contacto o ingresa un número de teléfono</li>
          <li>Escribe tu mensaje o selecciona una plantilla</li>
          <li>Haz clic en "Enviar"</li>
        </ol>
        <h3 className="text-gray-200 border-b border-gray-700">3.2 Envío Masivo</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">Para enviar mensajes a múltiples contactos:</p>
        <ol className="space-y-2 bg-gray-800 p-4 rounded-lg">
          <li>Ve a la sección "Envío Masivo" en el menú lateral</li>
          <li>Selecciona un grupo de contactos o contactos individuales</li>
          <li>Escribe tu mensaje o selecciona una plantilla</li>
          <li>Programa el envío (opcional)</li>
          <li>Haz clic en "Enviar"</li>
        </ol>
      </div>
    </div>
  )
}

