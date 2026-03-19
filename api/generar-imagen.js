import axios from 'axios'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' })

  // --- MOTOR 1: Hugging Face (SDXL Turbo) - Ultra Rápido ---
  try {
    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo',
      { inputs: `${prompt}, professional therapeutic illustration, soft colors, high quality` },
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
        responseType: 'arraybuffer',
        timeout: 10000
      }
    )

    const base64Image = Buffer.from(hfResponse.data, 'binary').toString('base64')
    return res.status(200).json({ 
      success: true, 
      imageUrl: `data:image/png;base64,${base64Image}`,
      source: 'huggingface'
    })

  } catch (hfError) {
    console.warn('Hugging Face ocupado o fallido, pasando a Motor de Respaldo (Horde)...')
    
    // --- MOTOR 2: AI Horde (Descentralizado) - Siempre Libre ---
    try {
      // 1. Iniciar generación
      const hordePost = await axios.post('https://stablehorde.net/api/v1/generate/async', {
        prompt: `${prompt}, professional therapeutic illustration, soft colors`,
        params: { n: 1, steps: 20, width: 512, height: 512, sampler_name: 'k_euler_a' },
        models: ["stable_diffusion"]
      }, {
        headers: { 'apikey': '0000000000', 'Client-Agent': 'CreSer:1.0:Agent' },
        timeout: 10000
      })

      const requestId = hordePost.data.id
      
      // 2. Poll limitado (3 reintentos para no exceder timeout de Vercel)
      for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 2500)) // Esperar 2.5s
        const status = await axios.get(`https://stablehorde.net/api/v1/generate/check/${requestId}`)
        
        if (status.data.done) {
          const finalResult = await axios.get(`https://stablehorde.net/api/v1/generate/status/${requestId}`)
          const imageUrl = finalResult.data.generations[0].img
          return res.status(200).json({ success: true, imageUrl, source: 'horde' })
        }
      }

      throw new Error('AI Horde tomó demasiado tiempo')

    } catch (hordeError) {
      console.error('Error total en IA:', hordeError.message)
      
      // --- FALLBACK FINAL: Pollinations URL Directa ---
      const seed = Math.floor(Math.random() * 100000)
      const fallbackUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt.substring(0, 100))}?width=1024&height=1024&nologo=true&seed=${seed}`
      
      return res.status(200).json({ 
        success: true, 
        imageUrl: fallbackUrl,
        source: 'pollinations_fallback' 
      })
    }
  }
}
