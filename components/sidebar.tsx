"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, MessageSquare, FileText, Variable, Send, Settings, Home, ClipboardList } from "lucide-react"
import { LogoutButton } from "./logout-button" // Importar el componente de logout

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/templates",
      icon: FileText,
      label: "Plantillas",
      active: pathname === "/templates" || pathname.startsWith("/templates/"),
    },
    {
      href: "/variables",
      icon: Variable,
      label: "Variables",
      active: pathname === "/variables" || pathname.startsWith("/variables/"),
    },
    {
      href: "/contacts",
      icon: Users,
      label: "Contactos",
      active: pathname === "/contacts" || pathname.startsWith("/contacts/"),
    },
    {
      href: "/messages",
      icon: MessageSquare,
      label: "Mensajes",
      active: pathname === "/messages" || pathname.startsWith("/messages/"),
    },
    {
      href: "/send-sms",
      icon: Send,
      label: "Enviar SMS",
      active: pathname === "/send-sms",
    },
    {
      href: "/send-bulk",
      icon: Send,
      label: "Envío Masivo",
      active: pathname === "/send-bulk",
    },
    {
      href: "/stats",
      icon: BarChart3,
      label: "Estadísticas",
      active: pathname === "/stats",
    },
    {
      href: "/logs",
      icon: ClipboardList,
      label: "Logs",
      active: pathname === "/logs",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Configuración",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="p-6">
        <h2 className="text-xl font-bold">SMS App</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                route.active
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <LogoutButton />
      </div>
    </div>
  )
}

