"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  User,
  UserCircle,
  UserCog,
  UserRound,
  UserCheck,
  CircleUser,
  UserPlus,
  Users,
  UserX,
  Smile,
  Heart,
  Star,
  Sparkles,
  Crown,
  Gem,
  Rocket,
  Zap,
  Award,
  Medal,
  Trophy,
} from "lucide-react"

const icons = [
  { value: "user", label: "Usuario", icon: User },
  { value: "user-circle", label: "Usuario Círculo", icon: UserCircle },
  { value: "user-cog", label: "Usuario Configuración", icon: UserCog },
  { value: "user-round", label: "Usuario Redondo", icon: UserRound },
  { value: "user-check", label: "Usuario Verificado", icon: UserCheck },
  { value: "circle-user", label: "Círculo Usuario", icon: CircleUser },
  { value: "user-plus", label: "Usuario Plus", icon: UserPlus },
  { value: "users", label: "Usuarios", icon: Users },
  { value: "user-x", label: "Usuario X", icon: UserX },
  { value: "smile", label: "Sonrisa", icon: Smile },
  { value: "heart", label: "Corazón", icon: Heart },
  { value: "star", label: "Estrella", icon: Star },
  { value: "sparkles", label: "Destellos", icon: Sparkles },
  { value: "crown", label: "Corona", icon: Crown },
  { value: "gem", label: "Gema", icon: Gem },
  { value: "rocket", label: "Cohete", icon: Rocket },
  { value: "zap", label: "Rayo", icon: Zap },
  { value: "award", label: "Premio", icon: Award },
  { value: "medal", label: "Medalla", icon: Medal },
  { value: "trophy", label: "Trofeo", icon: Trophy },
]

export interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedIcon = React.useMemo(() => {
    return icons.find((icon) => icon.value === value)
  }, [value])

  const IconComponent = selectedIcon?.icon || User

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center">
            <IconComponent className="mr-2 h-4 w-4" />
            <span>{selectedIcon?.label || "Seleccionar icono"}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar icono..." />
          <CommandList>
            <CommandEmpty>No se encontraron iconos.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {icons.map((icon) => {
                const Icon = icon.icon
                return (
                  <CommandItem
                    key={icon.value}
                    value={icon.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue)
                      setOpen(false)
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{icon.label}</span>
                    {value === icon.value && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

