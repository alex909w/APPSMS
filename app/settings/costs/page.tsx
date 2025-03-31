"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { CurrencySelector } from "@/components/currency-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CostsSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    messageCost: "0.032",
    currency: "€",
    bulkDiscount: "0",
    internationalMultiplier: "1.5",
  })
  const { toast } = useToast()

  // Cargar configuración inicial
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/configuracion")
        if (response.ok) {
          const data = await response.json()
          setSettings((prev) => ({
            ...prev,
            messageCost: data.costo_mensaje || prev.messageCost,
            currency: data.moneda || prev.currency,
          }))
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/configuracion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          costo_mensaje: settings.messageCost,
          moneda: settings.currency,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar la configuración")
      }

      toast({
        title: "Configuración guardada",
        description: "La configuración de costos ha sido guardada correctamente",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la configuración",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración de Costos</h2>
          <p className="text-muted-foreground">Gestiona los costos de envío de mensajes</p>
        </div>
        <Link href="/settings">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Configuración
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Costos Básicos</TabsTrigger>
          <TabsTrigger value="advanced">Costos Avanzados</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Costo por Mensaje</CardTitle>
              <CardDescription>Configura el costo base por cada mensaje enviado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Costo por Mensaje</label>
                <div className="flex gap-2">
                  <Input
                    value={settings.messageCost}
                    onChange={(e) => handleChange("messageCost", e.target.value)}
                    type="number"
                    step="0.001"
                    min="0"
                    className="flex-1"
                  />
                  <CurrencySelector
                    value={settings.currency}
                    onValueChange={(value) => handleChange("currency", value)}
                    className="w-[100px]"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Este valor se utilizará para calcular los costos en las estadísticas
                </p>
              </div>

              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                {isLoading ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>Así se verá el costo en las estadísticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="text-2xl font-bold">
                  {settings.messageCost}
                  {settings.currency}
                </div>
                <p className="text-xs text-muted-foreground">Por mensaje enviado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Avanzada</CardTitle>
              <CardDescription>Configura descuentos y multiplicadores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Descuento por Volumen (%)</label>
                <Input
                  value={settings.bulkDiscount}
                  onChange={(e) => handleChange("bulkDiscount", e.target.value)}
                  type="number"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground">
                  Porcentaje de descuento aplicado a envíos masivos (más de 100 mensajes)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Multiplicador Internacional</label>
                <Input
                  value={settings.internationalMultiplier}
                  onChange={(e) => handleChange("internationalMultiplier", e.target.value)}
                  type="number"
                  min="1"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">Multiplicador aplicado a mensajes internacionales</p>
              </div>

              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                {isLoading ? "Guardando..." : "Guardar Configuración Avanzada"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}