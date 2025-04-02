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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          h2 { color: #4b5563; margin-top: 30px; }
          h3 { color: #6b7280; }
          .page-break { page-break-after: always; }
          img { max-width: 100%; border: 1px solid #e5e7eb; border-radius: 4px; }
          code { background-color: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
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
        <title>Manual de Usuario - SMS Platform</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          h2 { color: #4b5563; margin-top: 30px; }
          h3 { color: #6b7280; }
          .page-break { page-break-after: always; }
          img { max-width: 100%; border: 1px solid #e5e7eb; border-radius: 4px; }
          code { background-color: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
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
    a.download = "manual-usuario-sms-platform.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manual de Usuario</h2>
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
        <h1>Manual de Usuario - SMS Platform</h1>

        <p>
          Bienvenido al manual de usuario de SMS Platform. Esta guía te ayudará a entender y utilizar todas las
          funcionalidades de nuestra plataforma de envío de mensajes SMS.
        </p>

        <h2>Índice</h2>
        <ol>
          <li>
            <a href="#introduccion">Introducción</a>
          </li>
          <li>
            <a href="#primeros-pasos">Primeros Pasos</a>
          </li>
          <li>
            <a href="#envio-mensajes">Envío de Mensajes</a>
          </li>
          <li>
            <a href="#plantillas">Gestión de Plantillas</a>
          </li>
          <li>
            <a href="#contactos">Gestión de Contactos</a>
          </li>
          <li>
            <a href="#estadisticas">Estadísticas y Reportes</a>
          </li>
          <li>
            <a href="#configuracion">Configuración de la Cuenta</a>
          </li>
          <li>
            <a href="#faq">Preguntas Frecuentes</a>
          </li>
        </ol>

        <div className="page-break"></div>
        <h2 id="introduccion">1. Introducción</h2>
        <p>
          SMS Platform es una solución completa para el envío y gestión de mensajes SMS. Nuestra plataforma te permite
          enviar mensajes individuales o masivos, crear plantillas personalizadas, gestionar contactos y grupos, y
          analizar el rendimiento de tus campañas.
        </p>
        <p>Características principales:</p>
        <ul>
          <li>Envío de mensajes individuales y masivos</li>
          <li>Creación y gestión de plantillas</li>
          <li>Gestión de contactos y grupos</li>
          <li>Programación de envíos</li>
          <li>Estadísticas y reportes detallados</li>
          <li>Integración con API</li>
        </ul>

        <div className="page-break"></div>
        <h2 id="primeros-pasos">2. Primeros Pasos</h2>
        <h3>2.1 Acceso a la Plataforma</h3>
        <p>
          Para acceder a SMS Platform, visita <code>https://smsplatform.com</code> e inicia sesión con tus credenciales.
          Si es tu primera vez, utiliza las credenciales proporcionadas por tu administrador.
        </p>
        <h3>2.2 Interfaz Principal</h3>
        <p>La interfaz principal consta de:</p>
        <ul>
          <li>
            <strong>Barra de navegación superior:</strong> Acceso a tu perfil, notificaciones y configuración
          </li>
          <li>
            <strong>Menú lateral:</strong> Acceso a todas las secciones de la plataforma
          </li>
          <li>
            <strong>Área de contenido:</strong> Muestra la sección actual
          </li>
          <li>
            <strong>Panel de estadísticas:</strong> Resumen de actividad reciente
          </li>
        </ul>

        <div className="page-break"></div>
        <h2 id="envio-mensajes">3. Envío de Mensajes</h2>
        <h3>3.1 Envío Individual</h3>
        <p>Para enviar un mensaje individual:</p>
        <ol>
          <li>Ve a la sección "Enviar SMS" en el menú lateral</li>
          <li>Selecciona un contacto o ingresa un número de teléfono</li>
          <li>Escribe tu mensaje o selecciona una plantilla</li>
          <li>Haz clic en "Enviar"</li>
        </ol>
        <h3>3.2 Envío Masivo</h3>
        <p>Para enviar mensajes a múltiples contactos:</p>
        <ol>
          <li>Ve a la sección "Envío Masivo" en el menú lateral</li>
          <li>Selecciona un grupo de contactos o contactos individuales</li>
          <li>Escribe tu mensaje o selecciona una plantilla</li>
          <li>Programa el envío (opcional)</li>
          <li>Haz clic en "Enviar"</li>
        </ol>
        <h3>3.3 Programación de Mensajes</h3>
        <p>Puedes programar el envío de mensajes para una fecha y hora específicas:</p>
        <ol>
          <li>En la pantalla de envío, marca la opción "Programar envío"</li>
          <li>Selecciona la fecha y hora deseadas</li>
          <li>Completa el resto de la información y haz clic en "Programar"</li>
        </ol>

        <div className="page-break"></div>
        <h2 id="plantillas">4. Gestión de Plantillas</h2>
        <h3>4.1 Crear Plantilla</h3>
        <p>Para crear una nueva plantilla:</p>
        <ol>
          <li>Ve a la sección "Plantillas" en el menú lateral</li>
          <li>Haz clic en "Nueva Plantilla"</li>
          <li>Ingresa un nombre y descripción para la plantilla</li>
          <li>Escribe el contenido del mensaje</li>
          <li>
            Utiliza variables como <code>&lt;nombre&gt;</code> para personalizar el mensaje
          </li>
          <li>Haz clic en "Guardar"</li>
        </ol>
        <h3>4.2 Editar Plantilla</h3>
        <p>Para editar una plantilla existente:</p>
        <ol>
          <li>Ve a la sección "Plantillas"</li>
          <li>Busca la plantilla que deseas editar</li>
          <li>Haz clic en el botón "Editar"</li>
          <li>Realiza los cambios necesarios</li>
          <li>Haz clic en "Guardar"</li>
        </ol>

        <div className="page-break"></div>
        <h2 id="contactos">5. Gestión de Contactos</h2>
        <h3>5.1 Añadir Contacto</h3>
        <p>Para añadir un nuevo contacto:</p>
        <ol>
          <li>Ve a la sección "Contactos" en el menú lateral</li>
          <li>Haz clic en "Nuevo Contacto"</li>
          <li>Ingresa la información del contacto (nombre, teléfono, etc.)</li>
          <li>Asigna el contacto a uno o más grupos (opcional)</li>
          <li>Haz clic en "Guardar"</li>
        </ol>
        <h3>5.2 Importar Contactos</h3>
        <p>Para importar contactos desde un archivo CSV:</p>
        <ol>
          <li>Ve a la sección "Contactos"</li>
          <li>Haz clic en "Importar"</li>
          <li>Descarga la plantilla CSV si es necesario</li>
          <li>Selecciona tu archivo CSV</li>
          <li>Mapea las columnas del archivo con los campos de contacto</li>
          <li>Haz clic en "Importar"</li>
        </ol>
        <h3>5.3 Gestión de Grupos</h3>
        <p>Para crear y gestionar grupos de contactos:</p>
        <ol>
          <li>Ve a la sección "Grupos" dentro de "Contactos"</li>
          <li>Haz clic en "Nuevo Grupo" para crear un grupo</li>
          <li>Para añadir contactos a un grupo, selecciona el grupo y haz clic en "Añadir Contactos"</li>
          <li>Para eliminar contactos de un grupo, selecciona los contactos y haz clic en "Eliminar del Grupo"</li>
        </ol>

        <div className="page-break"></div>
        <h2 id="estadisticas">6. Estadísticas y Reportes</h2>
        <h3>6.1 Panel de Estadísticas</h3>
        <p>El panel de estadísticas muestra información general sobre tus envíos:</p>
        <ul>
          <li>Total de mensajes enviados</li>
          <li>Tasa de entrega</li>
          <li>Tasa de error</li>
          <li>Costo promedio por mensaje</li>
        </ul>
        <h3>6.2 Reportes Detallados</h3>
        <p>Para ver reportes más detallados:</p>
        <ol>
          <li>Ve a la sección "Estadísticas" en el menú lateral</li>
          <li>Selecciona el período de tiempo que deseas analizar</li>
          <li>Explora las diferentes pestañas para ver diferentes tipos de datos</li>
          <li>Utiliza los filtros para refinar la información mostrada</li>
        </ol>
        <h3>6.3 Exportar Reportes</h3>
        <p>Para exportar un reporte:</p>
        <ol>
          <li>Configura el reporte con los filtros deseados</li>
          <li>Haz clic en el botón "Exportar"</li>
          <li>Selecciona el formato de exportación (CSV, Excel, PDF)</li>
          <li>Haz clic en "Descargar"</li>
        </ol>

        <div className="page-break"></div>
        <h2 id="configuracion">7. Configuración de la Cuenta</h2>
        <h3>7.1 Perfil de Usuario</h3>
        <p>Para editar tu perfil de usuario:</p>
        <ol>
          <li>Haz clic en tu avatar en la esquina superior derecha</li>
          <li>Selecciona "Perfil"</li>
          <li>Actualiza tu información personal</li>
          <li>Haz clic en "Guardar Cambios"</li>
        </ol>
        <h3>7.2 Cambiar Contraseña</h3>
        <p>Para cambiar tu contraseña:</p>
        <ol>
          <li>Haz clic en tu avatar en la esquina superior derecha</li>
          <li>Selecciona "Cambiar Contraseña"</li>
          <li>Ingresa tu contraseña actual y la nueva contraseña</li>
          <li>Haz clic en "Actualizar Contraseña"</li>
        </ol>
        <h3>7.3 Configuración de Notificaciones</h3>
        <p>Para configurar tus preferencias de notificaciones:</p>
        <ol>
          <li>Ve a la sección "Configuración" en el menú lateral</li>
          <li>Selecciona la pestaña "Notificaciones"</li>
          <li>Activa o desactiva las notificaciones según tus preferencias</li>
          <li>Haz clic en "Guardar"</li>
        </ol>

        <div className="page-break"></div>
        <h2 id="faq">8. Preguntas Frecuentes</h2>
        <h3>¿Cómo sé si un mensaje ha sido entregado?</h3>
        <p>
          Puedes verificar el estado de tus mensajes en la sección "Mensajes Enviados". Los mensajes pueden tener uno de
          los siguientes estados: Enviado, Entregado, Fallido o Pendiente.
        </p>
        <h3>¿Puedo programar mensajes recurrentes?</h3>
        <p>
          Sí, puedes programar mensajes recurrentes en la sección "Programación" dentro de "Envío Masivo". Selecciona la
          frecuencia (diaria, semanal, mensual) y configura los detalles.
        </p>
        <h3>¿Cómo puedo personalizar mis mensajes para cada contacto?</h3>
        <p>
          Utiliza variables en tus plantillas, como <code>&lt;nombre&gt;</code> o <code>&lt;apellido&gt;</code>. Estas
          variables serán reemplazadas con la información de cada contacto al enviar el mensaje.
        </p>
        <h3>¿Qué hago si un mensaje falla?</h3>
        <p>Si un mensaje falla, verifica lo siguiente:</p>
        <ul>
          <li>El número de teléfono está en formato correcto (incluye el código de país)</li>
          <li>El contacto no ha bloqueado los mensajes de tu remitente</li>
          <li>Tienes saldo suficiente en tu cuenta</li>
          <li>No hay problemas con el proveedor de servicios</li>
        </ul>
        <p>Si el problema persiste, contacta a soporte técnico.</p>
      </div>
    </div>
  )
}

