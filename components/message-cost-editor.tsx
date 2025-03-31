"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CurrencySelector } from "./currency-selector"
import { useToast } from "@/components/ui/use-toast"

interface MessageCostEditorProps {
  initialCost: string
  initialCurrency: string
  onSave: (cost: string, currency: string) => Promise<void>
}

export function MessageCostEditor({ initialCost, initialCurrency, onSave }: MessageCostEditorProps) {
  const [cost, setCost] = useState(initialCost)
  const [currency, setCurrency] = useState(initialCurrency)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(cost, currency)
      toast({
        title: "Configuración guardada",
        description: "El costo por mensaje ha sido actualizado correctamente",
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          type="number"
          step="0.001"
          min="0"
          className="flex-1"
          placeholder="Costo por mensaje"
        />
        <CurrencySelector value={currency} onValueChange={setCurrency} className="w-[100px]" />
      </div>
      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  )
}

