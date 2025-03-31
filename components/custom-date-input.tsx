"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

interface DateInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CustomDateInput({ value, onChange, className }: DateInputProps) {
  const [open, setOpen] = useState(false)

  // Función para validar el formato de fecha (YYYY-MM-DD)
  const validateDate = (input: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(input)) return false

    const date = new Date(input)
    return !isNaN(date.getTime())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className={cn("relative", className)}>
      <Input type="date" value={value} onChange={handleInputChange} max={today} className="pr-10" />
      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    </div>
  )
}

