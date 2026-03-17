import express from 'express'
import { generateContent, generateImage } from '../services/ai.js'
import { saveScheduledContent, getScheduledContent } from '../services/supabase.js'

const router = express.Router()

router.post('/generate', async (req, res) => {
  try {
    const options = req.body
    
    const result = await generateContent(options)
    
    res.json({
      success: true,
      data: result.content,
      mock: result.mock || false
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al generar contenido' })
  }
})

router.post('/generate-image', async (req, res) => {
  try {
    const { prompt, width, height } = req.body
    
    const result = await generateImage(prompt, { width, height })
    
    res.json({
      success: true,
      data: result,
      mock: result.mock || false
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al generar imagen' })
  }
})

router.post('/schedule', async (req, res) => {
  try {
    const { titulo, tipo, plataforma, contenido, imagen_url, fecha_publicacion, hora_publicacion } = req.body
    
    const scheduledData = {
      titulo,
      tipo,
      plataforma,
      contenido,
      imagen_url: imagen_url || null,
      fecha_publicacion,
      hora_publicacion: hora_publicacion || '10:00',
      estado: 'programado',
      created_at: new Date().toISOString()
    }

    const { data, error } = await saveScheduledContent(scheduledData)
    
    if (error) {
      console.error('Error scheduling content:', error)
      return res.status(500).json({ error: 'Error al programar contenido' })
    }

    res.json({
      success: true,
      data: data[0],
      message: 'Contenido programado correctamente'
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/scheduled', async (req, res) => {
  try {
    const { fecha, estado } = req.query
    
    const filters = {}
    if (fecha) filters.fecha = fecha
    if (estado) filters.estado = estado
    
    const { data, error } = await getScheduledContent(filters)
    
    if (error) {
      console.error('Error fetching scheduled content:', error)
      return res.status(500).json({ error: 'Error al obtener contenido' })
    }

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
