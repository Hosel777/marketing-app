import axios from 'axios'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  try {
    // Restauramos Puter AI por su excelente calidad de imagen (FLUX) y estabilidad
    const response = await axios.post('https://api.puter.ai/v1/ai/txt2img', {
      prompt: `${prompt}, professional therapeutic illustration, soft colors, high quality, realistic details, no text`,
      model: 'flux',
      width: 1024,
      height: 1024
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
      timeout: 30000 // Aumentamos timeout para generación compleja
    })

    const base64Image = Buffer.from(response.data, 'binary').toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('Puter AI error:', error.message)
    
    // Fallback a Pollinations con URL directa (Usa la IP del usuario, evitando bloqueos de servidor)
    const seed = Math.floor(Math.random() * 100000)
    const fallbackUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt.substring(0, 150))}?width=1024&height=1024&nologo=true&seed=${seed}`
    
    return res.status(200).json({ 
      success: true, 
      imageUrl: fallbackUrl,
      source: 'fallback_direct' 
    })
  }
}
