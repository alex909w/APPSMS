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

    const { data, error } = await supabase.from("templates").select("*").eq("user_id", session.user.id).order("name")

    if (error) {
      console.error("Error fetching templates:", error)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in templates API:", error)
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
      .from("templates")
      .insert([
        {
          user_id: session.user.id,
          name: body.name,
          content: body.content,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating template:", error)
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in templates API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

