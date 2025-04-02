"use client"

import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useRef } from "react"

export function ApiGuide() {
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
    <title>Guía de API - SMS Platform</title>
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
      pre { 
        background-color: #1e1e1e; 
        padding: 16px; 
        border-radius: 6px; 
        overflow-x: auto;
        border: 1px solid #444;
        margin: 20px 0;
        color: #ff9800;
      }
      code { 
        font-family: monospace; 
      }
      .method { 
        display: inline-block; 
        padding: 3px 8px; 
        border-radius: 4px; 
        font-weight: bold;
        margin-right: 8px;
      }
      .get { 
        background-color: #0d47a1; 
        color: #fff; 
      }
      .post { 
        background-color: #2e7d32; 
        color: #fff; 
      }
      .put { 
        background-color: #ef6c00; 
        color: #fff; 
      }
      .delete { 
        background-color: #c62828; 
        color: #fff; 
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin: 20px 0; 
        background-color: #1e1e1e;
        border-radius: 6px;
        overflow: hidden;
      }
      th, td { 
        border: 1px solid #444; 
        padding: 10px 12px; 
        text-align: left; 
      }
      th { 
        background-color: #2a2a2a; 
        font-weight: bold;
      }
      tr:nth-child(even) {
        background-color: #2a2a2a;
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
        pre, code {
          background-color: #f0f0f0;
          color: #d97706;
          border-color: #ccc;
        }
        p, ol, ul, table {
          background-color: #fff;
        }
        .method {
          border: 1px solid #000;
        }
        .get, .post, .put, .delete {
          color: #000;
          background-color: #f0f0f0;
        }
        .page-break { page-break-after: always; }
        pre, table {
          break-inside: avoid;
          page-break-inside: avoid;
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
    <title>Guía de API - SMS Platform</title>
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
      pre { 
        background-color: #1e1e1e; 
        padding: 16px; 
        border-radius: 6px; 
        overflow-x: auto;
        border: 1px solid #444;
        margin: 20px 0;
        color: #ff9800;
      }
      code { 
        font-family: monospace; 
      }
      .method { 
        display: inline-block; 
        padding: 3px 8px; 
        border-radius: 4px; 
        font-weight: bold;
        margin-right: 8px;
      }
      .get { 
        background-color: #0d47a1; 
        color: #fff; 
      }
      .post { 
        background-color: #2e7d32; 
        color: #fff; 
      }
      .put { 
        background-color: #ef6c00; 
        color: #fff; 
      }
      .delete { 
        background-color: #c62828; 
        color: #fff; 
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin: 20px 0; 
        background-color: #1e1e1e;
        border-radius: 6px;
        overflow: hidden;
      }
      th, td { 
        border: 1px solid #444; 
        padding: 10px 12px; 
        text-align: left; 
      }
      th { 
        background-color: #2a2a2a; 
        font-weight: bold;
      }
      tr:nth-child(even) {
        background-color: #2a2a2a;
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
    a.download = "guia-api-sms-platform.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white">Guía de API</h2>
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
        <h1 className="text-white border-b-2 border-gray-700 pb-3 mb-6">Guía de API - SMS Platform</h1>

        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          Esta guía proporciona toda la información necesaria para integrar tu aplicación con la API de SMS Platform.
          Nuestra API RESTful te permite enviar mensajes, gestionar contactos, plantillas y más.
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
            <a href="#autenticacion" className="text-blue-400 hover:underline">
              Autenticación
            </a>
          </li>
          <li>
            <a href="#mensajes" className="text-blue-400 hover:underline">
              API de Mensajes
            </a>
          </li>
          <li>
            <a href="#contactos" className="text-blue-400 hover:underline">
              API de Contactos
            </a>
          </li>
          <li>
            <a href="#plantillas" className="text-blue-400 hover:underline">
              API de Plantillas
            </a>
          </li>
          <li>
            <a href="#reportes" className="text-blue-400 hover:underline">
              API de Reportes
            </a>
          </li>
          <li>
            <a href="#webhooks" className="text-blue-400 hover:underline">
              Webhooks
            </a>
          </li>
          <li>
            <a href="#errores" className="text-blue-400 hover:underline">
              Códigos de Error
            </a>
          </li>
          <li>
            <a href="#limites" className="text-blue-400 hover:underline">
              Límites y Cuotas
            </a>
          </li>
        </ol>

        <div className="page-break"></div>
        <h2 id="introduccion" className="text-white bg-gray-800 border-l-4 border-blue-500 pl-3 rounded-md">
          1. Introducción
        </h2>
        <h3 className="text-gray-200 border-b border-gray-700">1.1 Base URL</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          Todas las URLs referenciadas en esta documentación tienen el siguiente prefijo:
        </p>
        <pre className="bg-gray-800 border border-gray-700 rounded-md text-orange-400">
          <code>https://api.smsplatform.com/v1</code>
        </pre>
        <h3 className="text-gray-200 border-b border-gray-700">1.2 Formato de Respuesta</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          Todas las respuestas son devueltas en formato JSON. Un ejemplo de respuesta exitosa:
        </p>
        <pre className="bg-gray-800 border border-gray-700 rounded-md text-orange-400">
          <code>{`{
"success": true,
"data": {
  // Los datos solicitados
}
}`}</code>
        </pre>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">En caso de error:</p>
        <pre className="bg-gray-800 border border-gray-700 rounded-md text-orange-400">
          <code>{`{
"success": false,
"error": {
  "code": "error_code",
  "message": "Descripción del error"
}
}`}</code>
        </pre>

        <div className="page-break"></div>
        <h2 id="autenticacion" className="text-white bg-gray-800 border-l-4 border-blue-500 pl-3 rounded-md">
          2. Autenticación
        </h2>
        <h3 className="text-gray-200 border-b border-gray-700">2.1 Obtener API Key</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          Para utilizar la API, necesitas una API Key. Para obtenerla:
        </p>
        <ol className="space-y-2 bg-gray-800 p-4 rounded-lg">
          <li>Inicia sesión en tu cuenta de SMS Platform</li>
          <li>Ve a Configuración > API</li>
          <li>Haz clic en "Generar API Key"</li>
        </ol>
        <h3 className="text-gray-200 border-b border-gray-700">2.2 Autenticación en Solicitudes</h3>
        <p className="text-gray-300 bg-gray-80000 p-4 rounded-lg">
          Incluye tu API Key en el encabezado de todas las solicitudes:
        </p>
        <pre className="bg-gray-800 border border-gray-700 rounded-md text-orange-400">
          <code>Authorization: Bearer TU_API_KEY</code>
        </pre>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">Ejemplo con curl:</p>
        <pre className="bg-gray-800 border border-gray-700 rounded-md text-orange-400">
          <code>{`curl -X GET \\
https://api.smsplatform.com/v1/messages \\
-H 'Authorization: Bearer TU_API_KEY'`}</code>
        </pre>

        <div className="page-break"></div>
        <h2 id="mensajes" className="text-white bg-gray-800 border-l-4 border-blue-500 pl-3 rounded-md">
          3. API de Mensajes
        </h2>
        <h3 className="text-gray-200 border-b border-gray-700">3.1 Enviar un Mensaje</h3>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
          <span className="method post">POST</span> <code className="text-orange-400">/messages</code>
        </p>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">Envía un mensaje SMS a un número de teléfono.</p>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">Parámetros de solicitud:</p>
        <table className="border-collapse border border-gray-700 bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="bg-gray-700">Parámetro</th>
              <th className="bg-gray-700">Tipo</th>
              <th className="bg-gray-700">Requerido</th>
              <th className="bg-gray-700">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>to</td>
              <td>string</td>
              <td>Sí</td>
              <td>Número de teléfono del destinatario (formato E.164)</td>
            </tr>
            <tr className="bg-gray-700">
              <td>message</td>
              <td>string</td>
              <td>Sí</td>
              <td>Contenido del mensaje</td>
            </tr>
            <tr>
              <td>from</td>
              <td>string</td>
              <td>No</td>
              <td>Remitente del mensaje (si no se especifica, se usa el predeterminado)</td>
            </tr>
            <tr className="bg-gray-700">
              <td>template_id</td>
              <td>integer</td>
              <td>No</td>
              <td>ID de la plantilla a utilizar</td>
            </tr>
            <tr>
              <td>variables</td>
              <td>object</td>
              <td>No</td>
              <td>Variables para la plantilla (si se usa template_id)</td>
            </tr>
            <tr className="bg-gray-700">
              <td>schedule_time</td>
              <td>string</td>
              <td>No</td>
              <td>Fecha y hora para enviar el mensaje (formato ISO 8601)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

