import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (authError) {
      console.error("Error creating user in Supabase Auth:", authError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Hash password for our users table
    const hashedPassword = await hash(password, 10)

    // Create user in our users table
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user?.id,
          name,
          email,
          password: hashedPassword,
          role: "user",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating user in database:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error in register API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

