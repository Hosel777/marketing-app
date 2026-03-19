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
    // Limpiamos el prompt para evitar redundancias y URLs excesivamente largas
    const cleanPrompt = prompt.replace(/Realistic professional photo, modern office, children therapy center, warm colors, high quality, 4k/g, '').trim()
    const refinedPrompt = `${cleanPrompt}, professional illustration, soft pastel colors, warm healthcare theme, high quality, 4k, no text`
    
    const seed = Math.floor(Math.random() * 100000)
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(refinedPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`

    // Descargamos la imagen en el servidor para convertirla a Base64
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const base64Image = Buffer.from(response.data, 'binary').toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('Image generation/proxy error:', error.message)
    return res.status(500).json({ 
      error: 'Error al generar la imagen. El motor está saturado, intenta de nuevo.',
      details: error.message 
    })
  }
}
