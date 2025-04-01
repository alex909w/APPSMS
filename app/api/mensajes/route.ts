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

    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        contact:contact_id (
          id,
          name,
          phone
        ),
        template:template_id (
          id,
          name
        )
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in messages API:", error)
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

    // Create the message
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          user_id: session.user.id,
          contact_id: body.contactId || null,
          template_id: body.templateId || null,
          content: body.content,
          status: "pending",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating message:", error)
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    // Here you would typically call your SMS provider API to send the message
    // For now, we'll just simulate a successful send

    // Update the message status to sent
    const { error: updateError } = await supabase
      .from("messages")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", data[0].id)

    if (updateError) {
      console.error("Error updating message status:", updateError)
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in messages API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

