"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    appName: "SMS App",
    adminEmail: "admin@example.com",
    timezone: "Europe/Madrid",
    darkMode: false,
    smsProvider: "twilio",
    apiKey: "your_api_key_here",
    apiSecret: "your_api_secret_here",
    fromNumber: "+34600000000",
    dailyLimit: "1000",
    testMode: false,
    messageCost: "0.032",
    currency: "€",
    clientId: "default_client",
    clientSecret: "default_secret",
    redirectUri: "http://localhost:3000/callback",
    tokenExpiration: "3600",
    enableApi: true,
    emailNotifications: true,
    smsNotifications: false,
    errorNotifications: true,
    notificationEmail: "alerts@example.com",
    notificationPhone: "+34600000000",
    messageCost: "0.05",
    currency: "€",
  })
  const { toast } = useToast()

  // Simular carga de configuración desde la base de datos
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // En una aplicación real, aquí se cargarían las configuraciones desde la API
        // Por ahora, usamos los valores predeterminados definidos en el estado inicial

        // Simulamos una carga
        await new Promise((resolve) => setTimeout(resolve, 500))

        // En una aplicación real, aquí se cargaría la configuración desde la API
        const configResponse = await fetch("/api/configuracion")
        if (configResponse.ok) {
          const configData = await configResponse.json()

          // Actualizar el estado con los valores de la configuración
          setSettings((prev) => ({
            ...prev,
            messageCost: configData.costo_mensaje || prev.messageCost,
            currency: configData.moneda || prev.currency,
          }))
        }

        // No hacemos nada más porque ya tenemos los valores predeterminados
      } catch (error) {
        console.error("Error al cargar la configuración:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración",
          variant: "destructive",
        })
      }
    }

    fetchSettings()
  }, [toast])

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true)

    try {
      // Simulamos el guardado de la configuración
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Si la sección es "SMS", guardar la configuración de costo y moneda
      if (section === "SMS") {
        // En una aplicación real, aquí se enviaría una petición a la API
        // para guardar la configuración en la base de datos
        await fetch("/api/configuracion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            costo_mensaje: settings.messageCost,
            moneda: settings.currency,
          }),
        })
      }

      toast({
        title: "Configuración guardada",
        description: `La configuración de ${section} ha sido guardada correctamente`,
      })
    } catch (error) {
      console.error("Error al guardar la configuración:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Gestiona la configuración de la aplicación</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sms">Configuración SMS</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configura los ajustes generales de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nombre de la Aplicación</Label>
                <Input
                  id="app-name"
                  value={settings.appName}
                  onChange={(e) => handleChange("general", "appName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email de Administración</Label>
                <Input
                  id="admin-email"
                  value={settings.adminEmail}
                  onChange={(e) => handleChange("general", "adminEmail", e.target.value)}
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleChange("general", "timezone", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Modo Oscuro</Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleChange("general", "darkMode", checked)}
                />
              </div>
              <Button onClick={() => handleSaveSettings("General")} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sms" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de SMS</CardTitle>
              <CardDescription>Configura los ajustes para el envío de SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms-provider">Proveedor de SMS</Label>
                <Select
                  value={settings.smsProvider}
                  onValueChange={(value) => handleChange("sms", "smsProvider", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="nexmo">Nexmo</SelectItem>
                    <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  value={settings.apiKey}
                  onChange={(e) => handleChange("sms", "apiKey", e.target.value)}
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input
                  id="api-secret"
                  value={settings.apiSecret}
                  onChange={(e) => handleChange("sms", "apiSecret", e.target.value)}
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-number">Número de Origen</Label>
                <Input
                  id="from-number"
                  value={settings.fromNumber}
                  onChange={(e) => handleChange("sms", "fromNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daily-limit">Límite Diario de SMS</Label>
                <Input
                  id="daily-limit"
                  value={settings.dailyLimit}
                  onChange={(e) => handleChange("sms", "dailyLimit", e.target.value)}
                  type="number"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="test-mode">Modo de Prueba</Label>
                <Switch
                  id="test-mode"
                  checked={settings.testMode}
                  onCheckedChange={(checked) => handleChange("sms", "testMode", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message-cost">Costo por Mensaje</Label>
                <div className="flex gap-2">
                  <Input
                    id="message-cost"
                    value={settings.messageCost}
                    onChange={(e) => handleChange("sms", "messageCost", e.target.value)}
                    type="number"
                    step="0.001"
                    min="0"
                    className="flex-1"
                  />
                  <Select value={settings.currency} onValueChange={(value) => handleChange("sms", "currency", value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="€">Euro (€)</SelectItem>
                      <SelectItem value="$">Dólar ($)</SelectItem>
                      <SelectItem value="£">Libra (£)</SelectItem>
                      <SelectItem value="¥">Yen (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Este valor se utilizará para calcular los costos en las estadísticas
                </p>
              </div>
              <Button onClick={() => handleSaveSettings("SMS")} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <div className="mt-4 pt-4 border-t">
                <Link href="/settings/costs">
                  <Button variant="outline" className="w-full">
                    Configuración Avanzada de Costos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de API</CardTitle>
              <CardDescription>Configura los ajustes para la API REST</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  value={settings.clientId}
                  onChange={(e) => handleChange("api", "clientId", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  value={settings.clientSecret}
                  onChange={(e) => handleChange("api", "clientSecret", e.target.value)}
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirect-uri">URI de Redirección</Label>
                <Input
                  id="redirect-uri"
                  value={settings.redirectUri}
                  onChange={(e) => handleChange("api", "redirectUri", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token-expiration">Expiración del Token (segundos)</Label>
                <Input
                  id="token-expiration"
                  value={settings.tokenExpiration}
                  onChange={(e) => handleChange("api", "tokenExpiration", e.target.value)}
                  type="number"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-api">Habilitar API</Label>
                <Switch
                  id="enable-api"
                  checked={settings.enableApi}
                  onCheckedChange={(checked) => handleChange("api", "enableApi", checked)}
                  defaultChecked
                />
              </div>
              <Button onClick={() => handleSaveSettings("API")} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Configura las notificaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange("notifications", "emailNotifications", checked)}
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">Notificaciones por SMS</Label>
                <Switch
                  id="sms-notifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleChange("notifications", "smsNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="error-notifications">Notificaciones de Error</Label>
                <Switch
                  id="error-notifications"
                  checked={settings.errorNotifications}
                  onCheckedChange={(checked) => handleChange("notifications", "errorNotifications", checked)}
                  defaultChecked
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-email">Email para Notificaciones</Label>
                <Input
                  id="notification-email"
                  value={settings.notificationEmail}
                  onChange={(e) => handleChange("notifications", "notificationEmail", e.target.value)}
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-phone">Teléfono para Notificaciones</Label>
                <Input
                  id="notification-phone"
                  value={settings.notificationPhone}
                  onChange={(e) => handleChange("notifications", "notificationPhone", e.target.value)}
                />
              </div>
              <Button onClick={() => handleSaveSettings("Notificaciones")} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}