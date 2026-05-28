import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Singleton pattern for Supabase client (anon/publishable key — restricted by RLS)
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient> | undefined
  supabaseAdmin: ReturnType<typeof createClient> | undefined
}

/** Anon key client — respects Row Level Security */
export const supabase = globalForSupabase.supabase ?? createClient(supabaseUrl, supabaseKey)

if (process.env.NODE_ENV !== 'production') globalForSupabase.supabase = supabase

/** Service role admin client — bypasses RLS for server-side operations */
export const supabaseAdmin = supabaseServiceRoleKey
  ? (globalForSupabase.supabaseAdmin ?? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    }))
  : supabase // fallback to anon client if service role key not configured

if (process.env.NODE_ENV !== 'production' && supabaseServiceRoleKey) {
  globalForSupabase.supabaseAdmin = supabaseAdmin
}

// ============================================================================
// Type-safe database helpers — mirrors Prisma interface patterns
// Uses .maybeSingle() instead of .single() to return null when no row found
// ============================================================================

export type Role = 'ADMIN' | 'RESIDENT' | 'BUSINESS'

// ---- State ----
export const stateDb = {
  findUnique: async (where: { slug?: string; id?: string }) => {
    let query = supabase.from('State').select('*')
    if (where.slug) query = query.eq('slug', where.slug)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async () => {
    const { data } = await supabase.from('State').select('*').order('name')
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('State').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async () => {
    const { count } = await supabase.from('State').select('*', { count: 'exact', head: true })
    return count || 0
  },
}

// ---- City ----
export const cityDb = {
  findUnique: async (where: { slug?: string; id?: string }) => {
    let query = supabase.from('City').select('*')
    if (where.slug) query = query.eq('slug', where.slug)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async (where?: Record<string, unknown>) => {
    let query = supabase.from('City').select('*')
    if (where?.stateId) query = query.eq('stateId', where.stateId)
    const { data } = await query.order('name')
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('City').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async () => {
    const { count } = await supabase.from('City').select('*', { count: 'exact', head: true })
    return count || 0
  },
}

// ---- Community ----
export const communityDb = {
  findUnique: async (where: { slug?: string; id?: string }) => {
    let query = supabase.from('Community').select('*, city:City(*)')
    if (where.slug) query = query.eq('slug', where.slug)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async (where?: Record<string, unknown>) => {
    let query = supabase.from('Community').select('*, city:City(*)')
    if (where?.cityId) query = query.eq('cityId', where.cityId)
    const { data } = await query.order('name')
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('Community').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async () => {
    const { count } = await supabase.from('Community').select('*', { count: 'exact', head: true })
    return count || 0
  },
}

// ---- User ----
export const userDb = {
  findUnique: async (where: { email?: string; id?: string }, select?: string) => {
    let query = supabase.from('User').select(select || '*')
    if (where.email) query = query.eq('email', where.email)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async (options?: { take?: number; orderBy?: string; where?: Record<string, unknown> }) => {
    let query = supabase.from('User').select('*')
    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      }
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: true })
    }
    if (options?.take) {
      query = query.limit(options.take)
    }
    const { data } = await query
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('User').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  update: async (where: { id: string }, data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('User').update(data).eq('id', where.id).select().maybeSingle()
    if (error) throw error
    return result
  },
  delete: async (where: { id: string }) => {
    const { error } = await supabase.from('User').delete().eq('id', where.id)
    if (error) throw error
  },
  count: async (where?: Record<string, unknown>) => {
    let query = supabase.from('User').select('*', { count: 'exact', head: true })
    if (where) {
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value)
      }
    }
    const { count } = await query
    return count || 0
  },
}

// ---- Category ----
export const categoryDb = {
  findUnique: async (where: { slug?: string; id?: string }) => {
    let query = supabase.from('Category').select('*')
    if (where.slug) query = query.eq('slug', where.slug)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async (where?: Record<string, unknown>) => {
    let query = supabase.from('Category').select('*')
    if (where?.parentId === null) {
      query = query.is('parentId', null)
    } else if (where?.parentId) {
      query = query.eq('parentId', where.parentId)
    }
    const { data } = await query.order('name')
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('Category').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async () => {
    const { count } = await supabase.from('Category').select('*', { count: 'exact', head: true })
    return count || 0
  },
}

// ---- Business ----
export const businessDb = {
  findUnique: async (where: { slug?: string; id?: string }) => {
    let query = supabase.from('Business').select('*, category:Category(*), user:User(id, name, email, phone, avatarUrl), community:Community(id, name, slug)')
    if (where.slug) query = query.eq('slug', where.slug)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async (options?: {
    where?: Record<string, unknown>
    orderBy?: Record<string, string>
    skip?: number
    take?: number
  }) => {
    let query = supabase.from('Business').select('*, category:Category(*), user:User(id, name, email, phone, avatarUrl), community:Community(id, name, slug)')

    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (key === 'status' || key === 'isFeatured' || key === 'userId' || key === 'categoryId' || key === 'communityId') {
          query = query.eq(key, value)
        } else if (key === 'city') {
          query = query.ilike(key, `%${value}%`)
        } else if (key === 'state') {
          query = query.eq(key, value)
        }
      }
    }

    // Default ordering
    if (options?.orderBy) {
      for (const [col, dir] of Object.entries(options.orderBy)) {
        query = query.order(col, { ascending: dir === 'asc' })
      }
    } else {
      query = query.order('createdAt', { ascending: false })
    }

    if (options?.skip) {
      query = query.range(options.skip, (options.skip + (options.take || 12)) - 1)
    } else if (options?.take) {
      query = query.limit(options.take)
    }

    const { data } = await query
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('Business').insert(data).select('*, category:Category(*), user:User(id, name, email, phone, avatarUrl), community:Community(id, name, slug)').maybeSingle()
    if (error) throw error
    return result
  },
  update: async (where: { id: string }, data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('Business').update(data).eq('id', where.id).select('*, category:Category(*), user:User(id, name, email, phone, avatarUrl), community:Community(id, name, slug)').maybeSingle()
    if (error) throw error
    return result
  },
  delete: async (where: { id: string }) => {
    const { error } = await supabase.from('Business').delete().eq('id', where.id)
    if (error) throw error
  },
  count: async (where?: Record<string, unknown>) => {
    let query = supabase.from('Business').select('*', { count: 'exact', head: true })
    if (where) {
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value)
      }
    }
    const { count } = await query
    return count || 0
  },
  findFirst: async (where: Record<string, unknown>) => {
    let query = supabase.from('Business').select('*')
    for (const [key, value] of Object.entries(where)) {
      query = query.eq(key, value)
    }
    const { data } = await query.limit(1).maybeSingle()
    return data
  },
}

// ---- Event ----
export const eventDb = {
  findUnique: async (where: { slug?: string; id?: string }) => {
    let query = supabase.from('Event').select('*, business:Business(id, name, slug, logoUrl), community:Community(id, name, slug)')
    if (where.slug) query = query.eq('slug', where.slug)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async (options?: {
    where?: Record<string, unknown>
    orderBy?: Record<string, string>
    skip?: number
    take?: number
  }) => {
    let query = supabase.from('Event').select('*, business:Business(id, name, slug, logoUrl), community:Community(id, name, slug)')

    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (key === 'isPublished' || key === 'isFeatured') {
          query = query.eq(key, value)
        } else if (key === 'city') {
          query = query.ilike(key, `%${value}%`)
        } else if (key === 'state') {
          query = query.eq(key, value)
        } else if (key === 'communityId') {
          query = query.eq(key, value)
        }
      }
    }

    if (options?.orderBy) {
      for (const [col, dir] of Object.entries(options.orderBy)) {
        query = query.order(col, { ascending: dir === 'asc' })
      }
    } else {
      query = query.order('date', { ascending: true })
    }

    if (options?.skip !== undefined && options?.take) {
      query = query.range(options.skip, options.skip + options.take - 1)
    } else if (options?.take) {
      query = query.limit(options.take)
    }

    const { data } = await query
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('Event').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async (where?: Record<string, unknown>) => {
    let query = supabase.from('Event').select('*', { count: 'exact', head: true })
    if (where) {
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value)
      }
    }
    const { count } = await query
    return count || 0
  },
}

// ---- EventRegistration ----
export const eventRegistrationDb = {
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('EventRegistration').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async (where: Record<string, unknown>) => {
    let query = supabase.from('EventRegistration').select('*', { count: 'exact', head: true })
    for (const [key, value] of Object.entries(where)) {
      query = query.eq(key, value)
    }
    const { count } = await query
    return count || 0
  },
}

// ---- News ----
export const newsDb = {
  findUnique: async (where: { slug?: string; id?: string }) => {
    let query = supabase.from('News').select('*')
    if (where.slug) query = query.eq('slug', where.slug)
    if (where.id) query = query.eq('id', where.id)
    const { data } = await query.maybeSingle()
    return data
  },
  findMany: async (options?: {
    where?: Record<string, unknown>
    orderBy?: Record<string, string>
    skip?: number
    take?: number
  }) => {
    let query = supabase.from('News').select('*')

    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (key === 'isPublished' || key === 'isFeatured') {
          query = query.eq(key, value)
        } else if (key === 'category') {
          query = query.eq(key, value)
        }
      }
    }

    if (options?.orderBy) {
      for (const [col, dir] of Object.entries(options.orderBy)) {
        query = query.order(col, { ascending: dir === 'asc' })
      }
    } else {
      query = query.order('createdAt', { ascending: false })
    }

    if (options?.skip !== undefined && options?.take) {
      query = query.range(options.skip, options.skip + options.take - 1)
    } else if (options?.take) {
      query = query.limit(options.take)
    }

    const { data } = await query
    return data || []
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('News').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async (where?: Record<string, unknown>) => {
    let query = supabase.from('News').select('*', { count: 'exact', head: true })
    if (where) {
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value)
      }
    }
    const { count } = await query
    return count || 0
  },
}

// ---- ContactMessage ----
export const contactMessageDb = {
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('ContactMessage').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
  count: async (where?: Record<string, unknown>) => {
    let query = supabase.from('ContactMessage').select('*', { count: 'exact', head: true })
    if (where) {
      for (const [key, value] of Object.entries(where)) {
        query = query.eq(key, value)
      }
    }
    const { count } = await query
    return count || 0
  },
}

// ---- SiteSetting ----
export const siteSettingDb = {
  findUnique: async (where: { key: string }) => {
    const { data } = await supabase.from('SiteSetting').select('*').eq('key', where.key).maybeSingle()
    return data
  },
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('SiteSetting').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
}

// ---- ContentBlock ----
export const contentBlockDb = {
  findUnique: async (where: { key: string }) => {
    const { data } = await supabase.from('ContentBlock').select('*').eq('key', where.key).maybeSingle()
    return data
  },
}

// ---- AuditLog ----
export const auditLogDb = {
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('AuditLog').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
}

// ---- SavedBusiness ----
export const savedBusinessDb = {
  create: async (data: Record<string, unknown>) => {
    const { data: result, error } = await supabase.from('SavedBusiness').insert(data).select().maybeSingle()
    if (error) throw error
    return result
  },
}
