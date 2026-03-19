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
    // Usamos Pollinations por su estabilidad y velocidad (gratuito)
    const refinedPrompt = `${prompt}, professional colorful illustration, modern office children therapy center, warm pastel colors, high quality, detailed, no text, 4k`
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(refinedPrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 100000)}`

    // ParaPollinations, el archivo es la propia URL, no hace falta procesar blob
    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('Image error:', error.message)
    return res.status(500).json({ error: 'Error: ' + error.message })
  }
}
