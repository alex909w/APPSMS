"use client"

import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useRef } from "react"

export function ReleaseNotes() {
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
        <title>Notas de Versión - SMS Platform</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          h2 { color: #4b5563; margin-top: 30px; }
          h3 { color: #6b7280; }
          .page-break { page-break-after: always; }
          .version { border-left: 4px solid #2563eb; padding-left: 15px; margin-bottom: 30px; }
          .version-header { display: flex; justify-content: space-between; align-items: center; }
          .version-date { color: #6b7280; font-size: 0.9em; }
          .feature { margin-bottom: 10px; }
          .feature-type { font-weight: bold; margin-right: 5px; }
          .new { color: #059669; }
          .improved { color: #0284c7; }
          .fixed { color: #d97706; }
          .security { color: #dc2626; }
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
        <title>Notas de Versión - SMS Platform</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          h2 { color: #4b5563; margin-top: 30px; }
          h3 { color: #6b7280; }
          .page-break { page-break-after: always; }
          .version { border-left: 4px solid #2563eb; padding-left: 15px; margin-bottom: 30px; }
          .version-header { display: flex; justify-content: space-between; align-items: center; }
          .version-date { color: #6b7280; font-size: 0.9em; }
          .feature { margin-bottom: 10px; }
          .feature-type { font-weight: bold; margin-right: 5px; }
          .new { color: #059669; }
          .improved { color: #0284c7; }
          .fixed { color: #d97706; }
          .security { color: #dc2626; }
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
    a.download = "notas-version-sms-platform.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notas de Versión</h2>
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
        <h1>Notas de Versión - SMS Platform</h1>

        <p>
          Este documento contiene las notas de versión de SMS Platform, detallando las nuevas características, mejoras y
          correcciones de errores en cada versión.
        </p>

        <div className="version">
          <div className="version-header">
            <h2>Versión 2.5.0</h2>
            <span className="version-date">15 de mayo de 2023</span>
          </div>

          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Integración con Google Contacts para importar contactos directamente.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Soporte para variables condicionales en plantillas de mensajes.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Rendimiento del panel de estadísticas con carga asíncrona de datos.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Interfaz de usuario para la programación de mensajes.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Error al importar contactos con caracteres especiales en los nombres.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Problema de visualización en el historial de mensajes en dispositivos móviles.
          </div>
          <div className="feature">
            <span className="feature-type security">Seguridad:</span>
            Actualización de dependencias para corregir vulnerabilidades.
          </div>
        </div>

        <div className="version">
          <div className="version-header">
            <h2>Versión 2.4.0</h2>
            <span className="version-date">1 de abril de 2023</span>
          </div>

          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Soporte para mensajes multimedia (MMS) en mercados seleccionados.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            API para gestión de grupos de contactos.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Opción para programar mensajes recurrentes (diarios, semanales, mensuales).
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Velocidad de envío de mensajes masivos.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Interfaz de usuario para la gestión de plantillas.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Error al cancelar mensajes programados.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Problema con la paginación en la lista de contactos.
          </div>
        </div>

        <div className="version">
          <div className="version-header">
            <h2>Versión 2.3.0</h2>
            <span className="version-date">15 de febrero de 2023</span>
          </div>

          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Soporte para autenticación de dos factores.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Integración con Zapier para automatizar flujos de trabajo.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Exportación de reportes en formato Excel y PDF.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Diseño responsivo para dispositivos móviles.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Rendimiento de la API con caché optimizada.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Error al actualizar la información de perfil.
          </div>
          <div className="feature">
            <span className="feature-type security">Seguridad:</span>
            Mejoras en la protección contra ataques de fuerza bruta.
          </div>
        </div>

        <div className="version">
          <div className="version-header">
            <h2>Versión 2.2.0</h2>
            <span className="version-date">1 de enero de 2023</span>
          </div>

          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Soporte para webhooks para notificaciones en tiempo real.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Integración con Google Analytics para seguimiento de conversiones.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Interfaz de usuario con nuevo tema oscuro.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Proceso de importación de contactos con validación mejorada.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Problema con la visualización de estadísticas en Safari.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Error al eliminar plantillas en uso.
          </div>
        </div>

        <div className="version">
          <div className="version-header">
            <h2>Versión 2.1.0</h2>
            <span className="version-date">15 de noviembre de 2022</span>
          </div>

          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Soporte para variables personalizadas en plantillas.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Integración con CRM populares (Salesforce, HubSpot).
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Rendimiento del panel de estadísticas.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Proceso de registro y onboarding.
          </div>
          <div className="feature">
            <span className="feature-type fixed">Corregido:</span>
            Error al programar mensajes en zonas horarias diferentes.
          </div>
        </div>

        <div className="version">
          <div className="version-header">
            <h2>Versión 2.0.0</h2>
            <span className="version-date">1 de octubre de 2022</span>
          </div>

          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Rediseño completo de la interfaz de usuario.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            API RESTful completamente documentada.
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Soporte para múltiples idiomas (Español, Inglés, Francés).
          </div>
          <div className="feature">
            <span className="feature-type new">Nuevo:</span>
            Panel de estadísticas avanzado con gráficos interactivos.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Velocidad y rendimiento general de la plataforma.
          </div>
          <div className="feature">
            <span className="feature-type improved">Mejorado:</span>
            Sistema de gestión de contactos con soporte para grupos.
          </div>
          <div className="feature">
            <span className="feature-type security">Seguridad:</span>
            Implementación de autenticación JWT y permisos basados en roles.
          </div>
        </div>
      </div>
    </div>
  )
}

