"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useSession } from "next-auth/react"

export function useSupabase() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up Supabase auth if user is logged in
    if (session?.user) {
      // You could set up Supabase auth session here if needed
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [session])

  return {
    supabase,
    loading,
    user: session?.user,
  }
}

