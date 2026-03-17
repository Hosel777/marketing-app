export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, width = 1024, height = 1024 } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY

  if (!apiKey) {
    return res.status(200).json({
      success: false,
      error: 'API key no configurada',
      mock: true,
      message: 'Configura HUGGINGFACE_API_KEY en Vercel para generar imágenes con IA'
    })
  }

  try {
    const hfPrompt = `Professional colorful illustration for social media: ${prompt}. Style: modern pastel colors, warm professional healthcare theme for children, high quality, detailed, no text`

    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: hfPrompt,
          parameters: { width, height }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HF API error: ${response.status} - ${errorText}`)
    }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const imageUrl = `data:image/png;base64,${base64}`

    return res.status(200).json({ success: true, imageUrl })
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
