"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CurrencySelectorProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function CurrencySelector({ value, onValueChange, className }: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Moneda" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="€">Euro (€)</SelectItem>
        <SelectItem value="$">Dólar ($)</SelectItem>
        <SelectItem value="£">Libra (£)</SelectItem>
        <SelectItem value="¥">Yen (¥)</SelectItem>
        <SelectItem value="₽">Rublo (₽)</SelectItem>
        <SelectItem value="₹">Rupia (₹)</SelectItem>
        <SelectItem value="₩">Won (₩)</SelectItem>
      </SelectContent>
    </Select>
  )
}