import { supabase } from "./supabase"

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
    const { data, error } = await supabase.from("contacts").select("*").eq("user_id", userId)

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
    const { data, error } = await supabase.from("groups").select("*").eq("user_id", userId)

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
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

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
    const { data, error } = await supabase.from("templates").select("*").eq("user_id", userId)

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
    const { data, error } = await supabase.from("variables").select("*").eq("user_id", userId)

    if (error) throw error
    return data
  },

  async getVariable(id: string) {
    const { data, error } = await supabase.from("variables").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // Additional functions needed by your application
  async executeQuery(query: string, params: any[] = []) {
    // This is a compatibility function for raw SQL queries
    // In Supabase, we can use the rpc function for stored procedures
    // or the .from().select() for most queries
    try {
      const { data, error } = await supabase.rpc("execute_query", {
        query_text: query,
        params_array: params,
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error executing query:", error)
      throw error
    }
  },

  // Configuration functions
  async actualizarConfiguracion(userId: string, config: any) {
    // Check if configuration exists
    const { data: existingConfig } = await supabase.from("configuration").select("*").eq("user_id", userId).single()

    if (existingConfig) {
      // Update existing configuration
      const { data, error } = await supabase.from("configuration").update(config).eq("user_id", userId).select()

      if (error) throw error
      return data[0]
    } else {
      // Create new configuration
      const { data, error } = await supabase
        .from("configuration")
        .insert([{ user_id: userId, ...config }])
        .select()

      if (error) throw error
      return data[0]
    }
  },

  // Contact functions
  async crearContacto(contactData: any) {
    const { data, error } = await supabase.from("contacts").insert([contactData]).select()

    if (error) throw error
    return data[0]
  },

  async getContactos(userId: string) {
    const { data, error } = await supabase.from("contacts").select("*").eq("user_id", userId)

    if (error) throw error
    return data
  },

  // Group functions
  async getDetallesGrupo(groupId: string) {
    const { data, error } = await supabase
      .from("groups")
      .select(`
        *,
        contacts:group_contacts(
          contact:contacts(*)
        )
      `)
      .eq("id", groupId)
      .single()

    if (error) throw error
    return data
  },

  async getGruposContacto(contactId: string) {
    const { data, error } = await supabase
      .from("group_contacts")
      .select(`
        group:groups(*)
      `)
      .eq("contact_id", contactId)

    if (error) throw error
    return data.map((item) => item.group)
  },

  async agregarContactoAGrupo(groupId: string, contactId: string) {
    const { data, error } = await supabase
      .from("group_contacts")
      .insert([{ group_id: groupId, contact_id: contactId }])
      .select()

    if (error) throw error
    return data[0]
  },

  async eliminarContactoDeGrupo(groupId: string, contactId: string) {
    const { error } = await supabase.from("group_contacts").delete().eq("group_id", groupId).eq("contact_id", contactId)

    if (error) throw error
    return true
  },

  // Message functions
  async getMensajesEnviados(userId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        contact:contacts(*),
        template:templates(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async getMensajeById(messageId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        contact:contacts(*),
        template:templates(*)
      `)
      .eq("id", messageId)
      .single()

    if (error) throw error
    return data
  },

  async enviarMensaje(messageData: any) {
    const { data, error } = await supabase.from("messages").insert([messageData]).select()

    if (error) throw error
    return data[0]
  },

  // Template functions
  async getMessageTemplates(userId: string) {
    const { data, error } = await supabase.from("templates").select("*").eq("user_id", userId)

    if (error) throw error
    return data
  },

  async getPlantillasMensaje(userId: string) {
    return this.getMessageTemplates(userId)
  },

  async createMessageTemplate(templateData: any) {
    const { data, error } = await supabase.from("templates").insert([templateData]).select()

    if (error) throw error
    return data[0]
  },

  // Variable functions
  async crearVariable(variableData: any) {
    const { data, error } = await supabase.from("variables").insert([variableData]).select()

    if (error) throw error
    return data[0]
  },

  async actualizarVariable(id: string, variableData: any) {
    const { data, error } = await supabase.from("variables").update(variableData).eq("id", id).select()

    if (error) throw error
    return data[0]
  },

  async eliminarVariable(id: string) {
    const { error } = await supabase.from("variables").delete().eq("id", id)

    if (error) throw error
    return true
  },

  // Statistics functions
  async getEstadisticas(userId: string) {
    // Get counts from different tables
    const [contactsCount, messagesCount, templatesCount, groupsCount] = await Promise.all([
      supabase.from("contacts").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("messages").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("templates").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("groups").select("id", { count: "exact" }).eq("user_id", userId),
    ])

    // Get recent messages
    const { data: recentMessages } = await supabase
      .from("messages")
      .select(`
        *,
        contact:contacts(name, phone)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    return {
      contactsCount: contactsCount.count || 0,
      messagesCount: messagesCount.count || 0,
      templatesCount: templatesCount.count || 0,
      groupsCount: groupsCount.count || 0,
      recentMessages: recentMessages || [],
    }
  },

  // User functions
  async getUsers() {
    const { data, error } = await supabase.from("users").select("*")

    if (error) throw error
    return data
  },

  // Activity logs
  async registrarActividad(logData: any) {
    const { data, error } = await supabase.from("activity_logs").insert([logData]).select()

    if (error) throw error
    return data[0]
  },

  async getActivityLogs(userId: string) {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Add getSentMessages for compatibility
  async getSentMessages(userId: string) {
    return this.getMensajesEnviados(userId)
  },
}

// Export all the functions that are being imported directly
export {
  default
}

// Export individual functions for direct import
export const {
  getUser,
  getUserByEmail,
  createUser,
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getGroups,
  getGroup,
  getMessages,
  getMessage,
  getTemplates,
  getTemplate,
  getVariables,
  getVariable,
  executeQuery,
  actualizarConfiguracion,
  crearContacto,
  getContactos,
  getDetallesGrupo,
  getGruposContacto,
  agregarContactoAGrupo,
  eliminarContactoDeGrupo,
  getMensajesEnviados,
  getMensajeById,
  enviarMensaje,
  getMessageTemplates,
  getPlantillasMensaje,
  createMessageTemplate,
  crearVariable,
  actualizarVariable,
  eliminarVariable,
  getEstadisticas,
  getUsers,
  registrarActividad,
  getActivityLogs,
  getSentMessages,
} = db

// Export a mock Prisma client for compatibility
export const prisma = {
  user: {
    findUnique: async ({ where }: any) => {
      if (where.email) {
        return db.getUserByEmail(where.email)
      }
      if (where.id) {
        return db.getUser(where.id)
      }
      return null
    },
    findMany: async () => {
      return db.getUsers()
    },
    create: async ({ data }: any) => {
      return db.createUser(data)
    },
    update: async ({ where, data }: any) => {
      const user = await db.getUser(where.id)
      if (!user) return null
      return db.createUser({ ...user, ...data })
    },
  },
  contact: {
    findMany: async ({ where }: any) => {
      if (where?.userId) {
        return db.getContacts(where.userId)
      }
      return []
    },
    findUnique: async ({ where }: any) => {
      return db.getContact(where.id)
    },
    create: async ({ data }: any) => {
      return db.createContact(data)
    },
    update: async ({ where, data }: any) => {
      return db.updateContact(where.id, data)
    },
    delete: async ({ where }: any) => {
      await db.deleteContact(where.id)
      return { id: where.id }
    },
  },
  // Add other models as needed
  $connect: async () => {
    // No-op for compatibility
    return Promise.resolve()
  },
  $disconnect: async () => {
    // No-op for compatibility
    return Promise.resolve()
  },
}

