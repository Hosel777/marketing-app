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
    // Prompt súper simplificado para evitar URLs largas y errores
    const shortPrompt = prompt.split(',')[0].substring(0, 100)
    const refinedPrompt = `${shortPrompt}, professional therapeutic illustration, soft pastel colors, warm theme, high quality`
    
    const seed = Math.floor(Math.random() * 100000)
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(refinedPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('Image generation error:', error.message)
    return res.status(500).json({ error: 'Error al generar la imagen.' })
  }
}
