import { supabase } from "./supabase"
import { PrismaClient } from "@prisma/client"

// Keep the Prisma client for compatibility with existing code
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Supabase database helper functions
export const db = {
  // Users
  async getUser(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  async createUser(userData: any) {
    const { data, error } = await supabase.from("users").insert([userData]).select()

    if (error) throw error
    return data[0]
  },

  // Contacts
  async getContacts(userId: string) {
    const { data, error } = await supabase.from("contacts").select("*").eq("userId", userId)

    if (error) throw error
    return data
  },

  async getContact(id: string) {
    const { data, error } = await supabase.from("contacts").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async createContact(contactData: any) {
    const { data, error } = await supabase.from("contacts").insert([contactData]).select()

    if (error) throw error
    return data[0]
  },

  async updateContact(id: string, contactData: any) {
    const { data, error } = await supabase.from("contacts").update(contactData).eq("id", id).select()

    if (error) throw error
    return data[0]
  },

  async deleteContact(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id)

    if (error) throw error
    return true
  },

  // Groups
  async getGroups(userId: string) {
    const { data, error } = await supabase.from("groups").select("*").eq("userId", userId)

    if (error) throw error
    return data
  },

  async getGroup(id: string) {
    const { data, error } = await supabase.from("groups").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // Messages
  async getMessages(userId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false })

    if (error) throw error
    return data
  },

  async getMessage(id: string) {
    const { data, error } = await supabase.from("messages").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // Templates
  async getTemplates(userId: string) {
    const { data, error } = await supabase.from("templates").select("*").eq("userId", userId)

    if (error) throw error
    return data
  },

  async getTemplate(id: string) {
    const { data, error } = await supabase.from("templates").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // Variables
  async getVariables(userId: string) {
    const { data, error } = await supabase.from("variables").select("*").eq("userId", userId)

    if (error) throw error
    return data
  },

  async getVariable(id: string) {
    const { data, error } = await supabase.from("variables").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },
}

