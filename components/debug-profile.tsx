"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugProfile() {
  const { data: session } = useSession()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchDebugInfo = async () => {
    if (!session?.user?.email) return

    try {
      setLoading(true)
      const response = await fetch("/api/debug-profile")
      if (response.ok) {
        const data = await response.json()
        setDebugInfo(data)
      }
    } catch (error) {
      console.error("Error fetching debug info:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Información de Depuración</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={fetchDebugInfo} disabled={loading}>
          {loading ? "Cargando..." : "Cargar información de depuración"}
        </Button>

        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto">
            <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

