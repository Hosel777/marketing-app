export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, width = 1024, height = 1024 } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  try {
    const response = await fetch('https://api.puter.ai/v1/ai/txt2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'flux',
        prompt: `Professional colorful illustration for social media: ${prompt}. Style: modern pastel colors, warm professional healthcare theme for children, high quality, detailed, no text`,
        width,
        height
      })
    })

    if (!response.ok) {
      throw new Error(`Puter API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.image_url || data.url) {
      return res.status(200).json({
        success: true,
        imageUrl: data.image_url || data.url
      })
    }

    throw new Error('No image in response')
  } catch (error) {
    console.error('Image generation error:', error.message)
    return res.status(200).json({
      success: false,
      error: error.message,
      mock: true,
      message: 'Error al generar imagen. Intenta de nuevo.'
    })
  }
}
