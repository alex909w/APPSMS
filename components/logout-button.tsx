"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      redirect: true,          // Habilita la redirección automática
      callbackUrl: "/"         // Especifica la URL a la que redirigir después de cerrar sesión
    });
  };

  return (
    <Button
      variant="ghost"
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-all hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Cerrar Sesión
    </Button>
  );
}