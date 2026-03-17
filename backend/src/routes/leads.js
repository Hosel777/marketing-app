import express from 'express'
import { insertLead, getLeads, updateLead, deleteLead } from '../services/supabase.js'
import { analyzeSentiment } from '../services/sentiment.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono, edad_paciente, servicio_interes, fuente, mensaje } = req.body
    
    if (!nombre || !telefono) {
      return res.status(400).json({ error: 'Nombre y teléfono son requeridos' })
    }

    const sentimentScore = mensaje ? analyzeSentiment(mensaje) : 50
    
    const leadData = {
      nombre,
      email: email || null,
      telefono,
      edad_paciente: edad_paciente || null,
      servicio_interes: servicio_interes || 'No especificado',
      fuente: fuente || 'web',
      mensaje: mensaje || null,
      sentiment_score: sentimentScore,
      estado: 'nuevo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await insertLead(leadData)
    
    if (error) {
      console.error('Error inserting lead:', error)
      return res.status(500).json({ error: 'Error al guardar lead' })
    }

    res.status(201).json({ 
      success: true, 
      data: data[0],
      message: 'Lead creado correctamente'
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/', async (req, res) => {
  try {
    const { servicio, estado, fuente, search } = req.query
    
    const filters = {}
    if (servicio) filters.servicio = servicio
    if (estado) filters.estado = estado
    if (fuente) filters.fuente = fuente
    
    const { data, error } = await getLeads(filters)
    
    if (error) {
      console.error('Error fetching leads:', error)
      return res.status(500).json({ error: 'Error al obtener leads' })
    }

    let filteredLeads = data
    if (search) {
      const searchLower = search.toLowerCase()
      filteredLeads = data.filter(lead => 
        lead.nombre.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.telefono.includes(search)
      )
    }

    res.json({ 
      success: true, 
      data: filteredLeads,
      total: filteredLeads.length
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await getLeads({})
    
    if (error) {
      return res.status(500).json({ error: 'Error al obtener lead' })
    }

    const lead = data.find(l => l.id === parseInt(id))
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead no encontrado' })
    }

    res.json({ success: true, data: lead })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await updateLead(id, updates)
    
    if (error) {
      console.error('Error updating lead:', error)
      return res.status(500).json({ error: 'Error al actualizar lead' })
    }

    res.json({ 
      success: true, 
      data: data[0],
      message: 'Lead actualizado correctamente'
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { error } = await deleteLead(id)
    
    if (error) {
      console.error('Error deleting lead:', error)
      return res.status(500).json({ error: 'Error al eliminar lead' })
    }

    res.json({ 
      success: true, 
      message: 'Lead eliminado correctamente'
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.post('/:id/cambiar-estado', async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body
    
    const estadosValidos = ['nuevo', 'contactado', 'citado', 'convertido', 'perdido']
    
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const { data, error } = await updateLead(id, { 
      estado,
      updated_at: new Date().toISOString()
    })
    
    if (error) {
      console.error('Error changing estado:', error)
      return res.status(500).json({ error: 'Error al cambiar estado' })
    }

    res.json({ 
      success: true, 
      data: data[0],
      message: `Estado cambiado a ${estado}`
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
