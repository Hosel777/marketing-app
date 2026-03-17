import express from 'express'
import { generateContent, generateImage, analyzeSentiment } from '../services/ai.js'

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

router.post('/sentiment', async (req, res) => {
  try {
    const { text } = req.body
    
    if (!text) {
      return res.status(400).json({ error: 'Texto es requerido' })
    }

    const result = await analyzeSentiment(text)
    
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al analizar sentimiento' })
  }
})

export default router
