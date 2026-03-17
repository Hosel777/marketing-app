import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const supabaseAdmin = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export const tables = {
  leads: 'leads',
  content: 'content',
  scheduledPosts: 'scheduled_posts',
  analytics: 'analytics',
  services: 'services',
  team: 'team_members'
}

export async function insertLead(leadData) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from(tables.leads)
    .insert([leadData])
    .select()
  
  return { data, error }
}

export async function getLeads(filters = {}) {
  if (!supabase) return { data: [], error: 'Supabase not configured' }
  
  let query = supabase.from(tables.leads).select('*')
  
  if (filters.servicio) {
    query = query.eq('servicio_interes', filters.servicio)
  }
  if (filters.estado) {
    query = query.eq('estado', filters.estado)
  }
  if (filters.fuente) {
    query = query.eq('fuente', filters.fuente)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  return { data: data || [], error }
}

export async function updateLead(id, updates) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from(tables.leads)
    .update(updates)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export async function deleteLead(id) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from(tables.leads)
    .delete()
    .eq('id', id)
  
  return { data, error }
}

export async function getAnalytics(period = '30d') {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  
  const { data: leads, error } = await supabase
    .from(tables.leads)
    .select('*')
    .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
  
  if (error) return { data: null, error }
  
  const total = leads.length
  const nuevos = leads.filter(l => l.estado === 'nuevo').length
  const contactados = leads.filter(l => l.estado === 'contactado').length
  const citados = leads.filter(l => l.estado === 'citado').length
  const convertidos = leads.filter(l => l.estado === 'convertido').length
  
  const porServicio = leads.reduce((acc, lead) => {
    acc[lead.servicio_interes] = (acc[lead.servicio_interes] || 0) + 1
    return acc
  }, {})
  
  const porFuente = leads.reduce((acc, lead) => {
    acc[lead.fuente] = (acc[lead.fuente] || 0) + 1
    return acc
  }, {})
  
  return {
    data: {
      total,
      nuevos,
      contactados,
      citados,
      convertidos,
      tasaConversion: total > 0 ? ((convertidos / total) * 100).toFixed(1) : 0,
      porServicio,
      porFuente
    },
    error: null
  }
}

export async function saveScheduledContent(content) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase
    .from(tables.scheduledPosts)
    .insert([content])
    .select()
  
  return { data, error }
}

export async function getScheduledContent(filters = {}) {
  if (!supabase) return { data: [], error: 'Supabase not configured' }
  
  let query = supabase.from(tables.scheduledPosts).select('*')
  
  if (filters.fecha) {
    query = query.eq('fecha_publicacion', filters.fecha)
  }
  if (filters.estado) {
    query = query.eq('estado', filters.estado)
  }
  
  const { data, error } = await query.order('fecha_publicacion', { ascending: true })
  
  return { data: data || [], error }
}
