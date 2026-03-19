import axios from 'axios'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' })

  // --- MOTOR 1: Hugging Face (SDXL Turbo) - Timeout Corto (6s) ---
  try {
    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo',
      { inputs: `${prompt}, professional therapeutic illustration, soft colors` },
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
        responseType: 'arraybuffer',
        timeout: 6000 // Máximo 6 segundos para dejar margen al fallback
      }
    )

    const base64Image = Buffer.from(hfResponse.data, 'binary').toString('base64')
    return res.status(200).json({ 
      success: true, 
      imageUrl: `data:image/png;base64,${base64Image}`,
      source: 'huggingface'
    })

  } catch (hfError) {
    console.warn('HF Timeout o Fallo, intentando fallback inmediato...')
    
    // --- MOTOR DE RESPALDO: Pollinations (Garantía de Entrega < 2s) ---
    // Usamos el API de Pollinations vía backend solo como generador de URL
    const seed = Math.floor(Math.random() * 100000)
    const fallbackUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt.substring(0, 150))}?width=1024&height=1024&nologo=true&seed=${seed}`
    
    // Retornamos la URL para que el frontend la cargue directamente
    return res.status(200).json({ 
      success: true, 
      imageUrl: fallbackUrl,
      source: 'pollinations_fallback' 
    })
  }
}
