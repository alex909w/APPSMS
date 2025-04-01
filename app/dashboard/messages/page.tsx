import { Suspense } from "react"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { MessagesTable } from "@/components/messages-table"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Mensajes",
}

async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  try {
    const messages = await db.getMensajesEnviados(session.user.id)

    return (
      <DashboardShell>
        <DashboardHeader heading="Mensajes" text="Gestiona y visualiza todos tus mensajes enviados.">
          <Link href="/dashboard/send-sms">
            <Button>Enviar nuevo mensaje</Button>
          </Link>
        </DashboardHeader>
        <MessagesTable messages={messages} />
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error al cargar mensajes:", error)
    return (
      <DashboardShell>
        <DashboardHeader heading="Mensajes" text="Gestiona y visualiza todos tus mensajes enviados.">
          <Link href="/dashboard/send-sms">
            <Button>Enviar nuevo mensaje</Button>
          </Link>
        </DashboardHeader>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>No se pudieron cargar los mensajes. Por favor, intenta de nuevo más tarde.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    )
  }
}

export default function MessagesPageWrapper() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <MessagesPage />
    </Suspense>
  )
}

