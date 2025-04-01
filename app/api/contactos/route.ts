import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("contacts").select("*").eq("user_id", session.user.id).order("name")

    if (error) {
      console.error("Error fetching contacts:", error)
      return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in contacts API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          user_id: session.user.id,
          name: body.name,
          phone: body.phone,
          email: body.email || null,
          notes: body.notes || null,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating contact:", error)
      return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in contacts API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

