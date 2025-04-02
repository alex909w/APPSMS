"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserManual } from "@/components/documents/user-manual"
import { ApiGuide } from "@/components/documents/api-guide"
import { ReleaseNotes } from "@/components/documents/release-notes"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentType: "manual" | "api" | "release-notes"
}

export function DocumentDialog({ open, onOpenChange, documentType }: DocumentDialogProps) {
  const renderDocument = () => {
    switch (documentType) {
      case "manual":
        return <UserManual />
      case "api":
        return <ApiGuide />
      case "release-notes":
        return <ReleaseNotes />
      default:
        return <div>Documento no encontrado</div>
    }
  }

  const getTitle = () => {
    switch (documentType) {
      case "manual":
        return "Manual de Usuario"
      case "api":
        return "Guía de API"
      case "release-notes":
        return "Notas de Versión"
      default:
        return "Documento"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">{renderDocument()}</ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

