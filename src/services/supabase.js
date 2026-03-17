import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bqxnxwzfrbgbfcztpfnu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeG54d3pmcmJnYmZjenRwZm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzI1NDUsImV4cCI6MjA4OTMwODU0NX0.-uEwps0mGBLtUoaMiTxi21I7dj1vE7yesskOtVyqNNk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const tables = {
  leads: 'leads',
  content: 'scheduled_posts',
  appointments: 'appointments',
  services: 'services',
  settings: 'settings'
}

export async function getLeads() {
  const { data, error } = await supabase
    .from(tables.leads)
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data: data || [], error }
}

export async function addLead(lead) {
  const { data, error } = await supabase
    .from(tables.leads)
    .insert([lead])
    .select()
  
  return { data, error }
}

export async function updateLead(id, updates) {
  const { data, error } = await supabase
    .from(tables.leads)
    .update(updates)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export async function deleteLead(id) {
  const { error } = await supabase
    .from(tables.leads)
    .delete()
    .eq('id', id)
  
  return { error }
}

export async function getScheduledContent() {
  const { data, error } = await supabase
    .from(tables.content)
    .select('*')
    .order('fecha_publicacion', { ascending: true })
  
  return { data: data || [], error }
}

export async function addScheduledContent(content) {
  const { data, error } = await supabase
    .from(tables.content)
    .insert([content])
    .select()
  
  return { data, error }
}

export async function getServices() {
  const { data, error } = await supabase
    .from(tables.services)
    .select('*')
    .eq('activo', true)
  
  return { data: data || [], error }
}

export async function getSettings() {
  const { data, error } = await supabase
    .from(tables.settings)
    .select('*')
  
  if (error) return { data: {}, error }
  
  const settings = {}
  data.forEach(item => {
    settings[item.clave] = item.valor
  })
  
  return { data: settings, error }
}

export async function updateSetting(clave, valor) {
  const { data, error } = await supabase
    .from(tables.settings)
    .upsert({ clave, valor, updated_at: new Date().toISOString() })
    .select()
  
  return { data, error }
}
