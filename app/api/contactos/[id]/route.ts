import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.error("Error fetching contact:", error)
      return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // First check if the contact belongs to the user
    const { data: existingContact, error: fetchError } = await supabase
      .from("contacts")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (fetchError || !existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("contacts")
      .update({
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        notes: body.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) {
      console.error("Error updating contact:", error)
      return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First check if the contact belongs to the user
    const { data: existingContact, error: fetchError } = await supabase
      .from("contacts")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (fetchError || !existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const { error } = await supabase.from("contacts").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting contact:", error)
      return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

