import express from 'express'
import { getAnalytics } from '../services/supabase.js'

const router = express.Router()

router.get('/overview', async (req, res) => {
  try {
    const { period = '30d' } = req.query
    
    const { data, error } = await getAnalytics(period)
    
    if (error) {
      console.error('Error fetching analytics:', error)
      return res.status(500).json({ error: 'Error al obtener analytics' })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/leads-by-service', async (req, res) => {
  try {
    const { data, error } = await getAnalytics('90d')
    
    if (error) {
      return res.status(500).json({ error: 'Error al obtener datos' })
    }

    const porServicio = Object.entries(data.porServicio || {}).map(([servicio, count]) => ({
      servicio,
      count,
      percentage: Math.round((count / data.total) * 100)
    }))

    res.json({
      success: true,
      data: porServicio
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/leads-by-source', async (req, res) => {
  try {
    const { data, error } = await getAnalytics('90d')
    
    if (error) {
      return res.status(500).json({ error: 'Error al obtener datos' })
    }

    const porFuente = Object.entries(data.porFuente || {}).map(([fuente, count]) => ({
      fuente,
      count,
      percentage: Math.round((count / data.total) * 100)
    }))

    res.json({
      success: true,
      data: porFuente
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/conversion', async (req, res) => {
  try {
    const { data, error } = await getAnalytics('30d')
    
    if (error) {
      return res.status(500).json({ error: 'Error al obtener datos' })
    }

    const conversionData = {
      totalLeads: data.total,
      nuevos: data.nuevos,
      contactados: data.contactados,
      citados: data.citados,
      convertidos: data.convertidos,
      tasaConversion: data.tasaConversion,
      tasaConversionByStage: {
        nuevoToContactado: data.total > 0 ? Math.round((data.contactados / data.total) * 100) : 0,
        contactadoToCitado: data.contactados > 0 ? Math.round((data.citados / data.contactados) * 100) : 0,
        citadoToConvertido: data.citados > 0 ? Math.round((data.convertidos / data.citados) * 100) : 0
      }
    }

    res.json({
      success: true,
      data: conversionData
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
