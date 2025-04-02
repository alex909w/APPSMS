"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react"
import Link from "next/link"
import { DocumentDialog } from "@/components/document-dialog"

export default function HelpPage() {
  const [documentDialog, setDocumentDialog] = useState<{
    open: boolean
    type: "manual" | "api" | "release-notes"
  }>({
    open: false,
    type: "manual",
  })

  const openDocument = (type: "manual" | "api" | "release-notes") => {
    setDocumentDialog({
      open: true,
      type,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Centro de Ayuda</h2>
          <p className="text-muted-foreground">Encuentra respuestas a tus preguntas</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
              <CardDescription>Respuestas a las preguntas más comunes</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>¿Cómo enviar un mensaje SMS?</AccordionTrigger>
                  <AccordionContent>
                    Para enviar un mensaje SMS, ve a la sección "Enviar SMS" en el menú lateral. Allí podrás seleccionar
                    un contacto, escribir tu mensaje y enviarlo. También puedes usar plantillas y variables para
                    personalizar tus mensajes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>¿Cómo crear una plantilla?</AccordionTrigger>
                  <AccordionContent>
                    Para crear una plantilla, ve a la sección "Plantillas" y haz clic en "Nueva Plantilla". Escribe un
                    nombre, una descripción opcional y el contenido de tu plantilla. Puedes usar variables como
                    &lt;nombre&gt; para personalizar tus mensajes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>¿Cómo importar contactos?</AccordionTrigger>
                  <AccordionContent>
                    Para importar contactos, ve a la sección "Contactos" y haz clic en "Importar". Puedes subir un
                    archivo CSV con tus contactos. El archivo debe tener columnas para nombre, apellido, teléfono y
                    correo electrónico.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>¿Cómo ver las estadísticas de mis mensajes?</AccordionTrigger>
                  <AccordionContent>
                    Para ver las estadísticas de tus mensajes, ve a la sección "Estadísticas". Allí podrás ver
                    información sobre los mensajes enviados, la tasa de entrega, la tasa de error y más.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>¿Cómo cambiar mi contraseña?</AccordionTrigger>
                  <AccordionContent>
                    Para cambiar tu contraseña, ve a la sección "Perfil" haciendo clic en tu avatar en la esquina
                    superior derecha. Luego, haz clic en "Cambiar Contraseña" y sigue las instrucciones.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tutoriales en Video</CardTitle>
              <CardDescription>Aprende a usar la plataforma con nuestros tutoriales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-lg font-semibold">Introducción a la plataforma</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Aprende los conceptos básicos de la plataforma de SMS.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-lg font-semibold">Envío masivo de mensajes</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Aprende a enviar mensajes a grupos de contactos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
              <CardDescription>¿Necesitas ayuda adicional?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>soporte@smsapp.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>+503 78573605</span>
              </div>
              <Button className="w-full mt-2">Contactar Soporte</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos</CardTitle>
              <CardDescription>Documentación y guías</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => openDocument("manual")}>
                Manual de Usuario
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => openDocument("api")}>
                Guía de API
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => openDocument("release-notes")}>
                Notas de Versión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo para mostrar documentos */}
      <DocumentDialog
        open={documentDialog.open}
        onOpenChange={(open) => setDocumentDialog((prev) => ({ ...prev, open }))}
        documentType={documentDialog.type}
      />
    </div>
  )
}

