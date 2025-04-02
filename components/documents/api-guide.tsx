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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          h2 { color: #4b5563; margin-top: 30px; }
          h3 { color: #6b7280; }
          .page-break { page-break-after: always; }
          pre { background-color: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto; }
          code { font-family: monospace; }
          .method { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
          .get { background-color: #dbeafe; color: #1e40af; }
          .post { background-color: #dcfce7; color: #166534; }
          .put { background-color: #fef3c7; color: #92400e; }
          .delete { background-color: #fee2e2; color: #b91c1c; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
          th { background-color: #f9fafb; }
          @media print {
            .page-break { page-break-after: always; }
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          h2 { color: #4b5563; margin-top: 30px; }
          h3 { color: #6b7280; }
          .page-break { page-break-after: always; }
          pre { background-color: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto; }
          code { font-family: monospace; }
          .method { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
          .get { background-color: #dbeafe; color: #1e40af; }
          .post { background-color: #dcfce7; color: #166534; }
          .put { background-color: #fef3c7; color: #92400e; }
          .delete { background-color: #fee2e2; color: #b91c1c; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
          th { background-color: #f9fafb; }
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Guía de API</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
        </div>
      </div>

      <div ref={contentRef} className="prose max-w-none">
        <h1>Guía de API - SMS Platform</h1>

        <p>
          Esta guía proporciona toda la información necesaria para integrar tu aplicación con la API de SMS Platform.
          Nuestra API RESTful te permite enviar mensajes, gestionar contactos, plantillas y más.
        </p>

        <h2>Índice</h2>
        <ol>
          <li>
            <a href="#introduccion">Introducción</a>
          </li>
          <li>
            <a href="#autenticacion">Autenticación</a>
          </li>
          <li>
            <a href="#mensajes">API de Mensajes</a>
          </li>
          <li>
            <a href="#contactos">API de Contactos</a>
          </li>
          <li>
            <a href="#plantillas">API de Plantillas</a>
          </li>
          <li>
            <a href="#reportes">API de Reportes</a>
          </li>
          <li>
            <a href="#webhooks">Webhooks</a>
          </li>
          <li>
            <a href="#errores">Códigos de Error</a>
          </li>
          <li>
            <a href="#limites">Límites y Cuotas</a>
          </li>
        </ol>

        <div className="page-break"></div>
        <h2 id="introduccion">1. Introducción</h2>
        <h3>1.1 Base URL</h3>
        <p>Todas las URLs referenciadas en esta documentación tienen el siguiente prefijo:</p>
        <pre>
          <code>https://api.smsplatform.com/v1</code>
        </pre>
        <h3>1.2 Formato de Respuesta</h3>
        <p>Todas las respuestas son devueltas en formato JSON. Un ejemplo de respuesta exitosa:</p>
        <pre>
          <code>{`{
  "success": true,
  "data": {
    // Los datos solicitados
  }
}`}</code>
        </pre>
        <p>En caso de error:</p>
        <pre>
          <code>{`{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Descripción del error"
  }
}`}</code>
        </pre>

        <div className="page-break"></div>
        <h2 id="autenticacion">2. Autenticación</h2>
        <h3>2.1 Obtener API Key</h3>
        <p>Para utilizar la API, necesitas una API Key. Para obtenerla:</p>
        <ol>
          <li>Inicia sesión en tu cuenta de SMS Platform</li>
          <li>Ve a Configuración > API</li>
          <li>Haz clic en "Generar API Key"</li>
        </ol>
        <h3>2.2 Autenticación en Solicitudes</h3>
        <p>Incluye tu API Key en el encabezado de todas las solicitudes:</p>
        <pre>
          <code>Authorization: Bearer TU_API_KEY</code>
        </pre>
        <p>Ejemplo con curl:</p>
        <pre>
          <code>{`curl -X GET \\
  https://api.smsplatform.com/v1/messages \\
  -H 'Authorization: Bearer TU_API_KEY'`}</code>
        </pre>

        <div className="page-break"></div>
        <h2 id="mensajes">3. API de Mensajes</h2>
        <h3>3.1 Enviar un Mensaje</h3>
        <p>
          <span className="method post">POST</span> <code>/messages</code>
        </p>
        <p>Envía un mensaje SMS a un número de teléfono.</p>
        <p>Parámetros de solicitud:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Requerido</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>to</td>
              <td>string</td>
              <td>Sí</td>
              <td>Número de teléfono del destinatario (formato E.164)</td>
            </tr>
            <tr>
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
            <tr>
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
            <tr>
              <td>schedule_time</td>
              <td>string</td>
              <td>No</td>
              <td>Fecha y hora para enviar el mensaje (formato ISO 8601)</td>
            </tr>
          </tbody>
        </table>
        <p>Ejemplo de solicitud:</p>
        <pre>
          <code>{`{
  "to": "+12345678901",
  "message": "Hola, este es un mensaje de prueba",
  "from": "MiEmpresa"
}`}</code>
        </pre>
        <p>Ejemplo de respuesta:</p>
        <pre>
          <code>{`{
  "success": true,
  "data": {
    "id": 123456,
    "to": "+12345678901",
    "from": "MiEmpresa",
    "message": "Hola, este es un mensaje de prueba",
    "status": "enviado",
    "created_at": "2023-05-15T10:30:00Z"
  }
}`}</code>
        </pre>

        <h3>3.2 Enviar Mensajes Masivos</h3>
        <p>
          <span className="method post">POST</span> <code>/messages/bulk</code>
        </p>
        <p>Envía mensajes SMS a múltiples destinatarios.</p>
        <p>Parámetros de solicitud:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Requerido</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>recipients</td>
              <td>array</td>
              <td>Sí</td>
              <td>Array de objetos con información de destinatarios</td>
            </tr>
            <tr>
              <td>message</td>
              <td>string</td>
              <td>Sí*</td>
              <td>Contenido del mensaje (requerido si no se usa template_id)</td>
            </tr>
            <tr>
              <td>template_id</td>
              <td>integer</td>
              <td>Sí*</td>
              <td>ID de la plantilla (requerido si no se usa message)</td>
            </tr>
            <tr>
              <td>from</td>
              <td>string</td>
              <td>No</td>
              <td>Remitente del mensaje</td>
            </tr>
            <tr>
              <td>schedule_time</td>
              <td>string</td>
              <td>No</td>
              <td>Fecha y hora para enviar los mensajes (formato ISO 8601)</td>
            </tr>
          </tbody>
        </table>
        <p>Ejemplo de solicitud:</p>
        <pre>
          <code>{`{
  "recipients": [
    {
      "to": "+12345678901",
      "variables": {
        "nombre": "Juan",
        "codigo": "ABC123"
      }
    },
    {
      "to": "+12345678902",
      "variables": {
        "nombre": "María",
        "codigo": "XYZ789"
      }
    }
  ],
  "template_id": 42,
  "from": "MiEmpresa"
}`}</code>
        </pre>

        <h3>3.3 Obtener un Mensaje</h3>
        <p>
          <span className="method get">GET</span> <code>/messages/{"{id}"}</code>
        </p>
        <p>Obtiene información detallada sobre un mensaje específico.</p>
        <p>Parámetros de ruta:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>id</td>
              <td>integer</td>
              <td>ID del mensaje</td>
            </tr>
          </tbody>
        </table>

        <h3>3.4 Listar Mensajes</h3>
        <p>
          <span className="method get">GET</span> <code>/messages</code>
        </p>
        <p>Obtiene una lista de mensajes enviados, con opciones de filtrado y paginación.</p>
        <p>Parámetros de consulta:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>page</td>
              <td>integer</td>
              <td>Número de página (por defecto: 1)</td>
            </tr>
            <tr>
              <td>limit</td>
              <td>integer</td>
              <td>Número de resultados por página (por defecto: 20, máximo: 100)</td>
            </tr>
            <tr>
              <td>status</td>
              <td>string</td>
              <td>Filtrar por estado (enviado, entregado, fallido, pendiente)</td>
            </tr>
            <tr>
              <td>from</td>
              <td>string</td>
              <td>Filtrar por remitente</td>
            </tr>
            <tr>
              <td>to</td>
              <td>string</td>
              <td>Filtrar por destinatario</td>
            </tr>
            <tr>
              <td>start_date</td>
              <td>string</td>
              <td>Fecha de inicio (formato ISO 8601)</td>
            </tr>
            <tr>
              <td>end_date</td>
              <td>string</td>
              <td>Fecha de fin (formato ISO 8601)</td>
            </tr>
          </tbody>
        </table>

        <div className="page-break"></div>
        <h2 id="contactos">4. API de Contactos</h2>
        <h3>4.1 Crear un Contacto</h3>
        <p>
          <span className="method post">POST</span> <code>/contacts</code>
        </p>
        <p>Crea un nuevo contacto.</p>
        <p>Parámetros de solicitud:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Requerido</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>phone</td>
              <td>string</td>
              <td>Sí</td>
              <td>Número de teléfono (formato E.164)</td>
            </tr>
            <tr>
              <td>first_name</td>
              <td>string</td>
              <td>No</td>
              <td>Nombre del contacto</td>
            </tr>
            <tr>
              <td>last_name</td>
              <td>string</td>
              <td>No</td>
              <td>Apellido del contacto</td>
            </tr>
            <tr>
              <td>email</td>
              <td>string</td>
              <td>No</td>
              <td>Correo electrónico del contacto</td>
            </tr>
            <tr>
              <td>group_ids</td>
              <td>array</td>
              <td>No</td>
              <td>IDs de los grupos a los que pertenece el contacto</td>
            </tr>
            <tr>
              <td>custom_fields</td>
              <td>object</td>
              <td>No</td>
              <td>Campos personalizados para el contacto</td>
            </tr>
          </tbody>
        </table>

        <h3>4.2 Obtener un Contacto</h3>
        <p>
          <span className="method get">GET</span> <code>/contacts/{"{id}"}</code>
        </p>
        <p>Obtiene información detallada sobre un contacto específico.</p>

        <h3>4.3 Actualizar un Contacto</h3>
        <p>
          <span className="method put">PUT</span> <code>/contacts/{"{id}"}</code>
        </p>
        <p>Actualiza la información de un contacto existente.</p>

        <h3>4.4 Eliminar un Contacto</h3>
        <p>
          <span className="method delete">DELETE</span> <code>/contacts/{"{id}"}</code>
        </p>
        <p>Elimina un contacto.</p>

        <h3>4.5 Listar Contactos</h3>
        <p>
          <span className="method get">GET</span> <code>/contacts</code>
        </p>
        <p>Obtiene una lista de contactos, con opciones de filtrado y paginación.</p>

        <div className="page-break"></div>
        <h2 id="plantillas">5. API de Plantillas</h2>
        <h3>5.1 Crear una Plantilla</h3>
        <p>
          <span className="method post">POST</span> <code>/templates</code>
        </p>
        <p>Crea una nueva plantilla de mensaje.</p>
        <p>Parámetros de solicitud:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Requerido</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>name</td>
              <td>string</td>
              <td>Sí</td>
              <td>Nombre de la plantilla</td>
            </tr>
            <tr>
              <td>content</td>
              <td>string</td>
              <td>Sí</td>
              <td>Contenido de la plantilla</td>
            </tr>
            <tr>
              <td>description</td>
              <td>string</td>
              <td>No</td>
              <td>Descripción de la plantilla</td>
            </tr>
          </tbody>
        </table>

        <h3>5.2 Obtener una Plantilla</h3>
        <p>
          <span className="method get">GET</span> <code>/templates/{"{id}"}</code>
        </p>
        <p>Obtiene información detallada sobre una plantilla específica.</p>

        <h3>5.3 Actualizar una Plantilla</h3>
        <p>
          <span className="method put">PUT</span> <code>/templates/{"{id}"}</code>
        </p>
        <p>Actualiza una plantilla existente.</p>

        <h3>5.4 Eliminar una Plantilla</h3>
        <p>
          <span className="method delete">DELETE</span> <code>/templates/{"{id}"}</code>
        </p>
        <p>Elimina una plantilla.</p>

        <h3>5.5 Listar Plantillas</h3>
        <p>
          <span className="method get">GET</span> <code>/templates</code>
        </p>
        <p>Obtiene una lista de plantillas, con opciones de filtrado y paginación.</p>

        <div className="page-break"></div>
        <h2 id="reportes">6. API de Reportes</h2>
        <h3>6.1 Reporte de Mensajes</h3>
        <p>
          <span className="method get">GET</span> <code>/reports/messages</code>
        </p>
        <p>Obtiene estadísticas sobre los mensajes enviados.</p>
        <p>Parámetros de consulta:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>start_date</td>
              <td>string</td>
              <td>Fecha de inicio (formato ISO 8601)</td>
            </tr>
            <tr>
              <td>end_date</td>
              <td>string</td>
              <td>Fecha de fin (formato ISO 8601)</td>
            </tr>
            <tr>
              <td>group_by</td>
              <td>string</td>
              <td>Agrupar por (day, week, month)</td>
            </tr>
          </tbody>
        </table>

        <h3>6.2 Reporte de Entrega</h3>
        <p>
          <span className="method get">GET</span> <code>/reports/delivery</code>
        </p>
        <p>Obtiene estadísticas sobre la entrega de mensajes.</p>

        <div className="page-break"></div>
        <h2 id="webhooks">7. Webhooks</h2>
        <h3>7.1 Configurar Webhook</h3>
        <p>
          <span className="method post">POST</span> <code>/webhooks</code>
        </p>
        <p>Configura un nuevo webhook para recibir notificaciones.</p>
        <p>Parámetros de solicitud:</p>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Requerido</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>url</td>
              <td>string</td>
              <td>Sí</td>
              <td>URL del webhook</td>
            </tr>
            <tr>
              <td>events</td>
              <td>array</td>
              <td>Sí</td>
              <td>Eventos a los que suscribirse (message.sent, message.delivered, message.failed)</td>
            </tr>
            <tr>
              <td>description</td>
              <td>string</td>
              <td>No</td>
              <td>Descripción del webhook</td>
            </tr>
          </tbody>
        </table>

        <h3>7.2 Formato de Notificaciones</h3>
        <p>Cuando ocurre un evento, se envía una notificación POST a la URL configurada con el siguiente formato:</p>
        <pre>
          <code>{`{
  "event": "message.delivered",
  "timestamp": "2023-05-15T10:35:00Z",
  "data": {
    "message_id": 123456,
    "to": "+12345678901",
    "from": "MiEmpresa",
    "status": "entregado",
    "delivered_at": "2023-05-15T10:35:00Z"
  }
}`}</code>
        </pre>

        <div className="page-break"></div>
        <h2 id="errores">8. Códigos de Error</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>authentication_error</td>
              <td>Error de autenticación. Verifica tu API Key.</td>
            </tr>
            <tr>
              <td>invalid_request</td>
              <td>Solicitud inválida. Verifica los parámetros.</td>
            </tr>
            <tr>
              <td>resource_not_found</td>
              <td>Recurso no encontrado.</td>
            </tr>
            <tr>
              <td>rate_limit_exceeded</td>
              <td>Límite de tasa excedido. Intenta más tarde.</td>
            </tr>
            <tr>
              <td>insufficient_credits</td>
              <td>Créditos insuficientes para enviar mensajes.</td>
            </tr>
            <tr>
              <td>invalid_phone_number</td>
              <td>Número de teléfono inválido.</td>
            </tr>
            <tr>
              <td>server_error</td>
              <td>Error interno del servidor.</td>
            </tr>
          </tbody>
        </table>

        <div className="page-break"></div>
        <h2 id="limites">9. Límites y Cuotas</h2>
        <p>La API tiene los siguientes límites:</p>
        <table>
          <thead>
            <tr>
              <th>Recurso</th>
              <th>Límite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solicitudes por minuto</td>
              <td>60</td>
            </tr>
            <tr>
              <td>Mensajes por solicitud (envío masivo)</td>
              <td>1,000</td>
            </tr>
            <tr>
              <td>Tamaño máximo de mensaje</td>
              <td>1,600 caracteres</td>
            </tr>
            <tr>
              <td>Contactos por importación</td>
              <td>10,000</td>
            </tr>
          </tbody>
        </table>
        <p>
          Estos límites pueden variar según tu plan de suscripción. Contacta con soporte para aumentar estos límites.
        </p>
      </div>
    </div>
  )
}

