import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, width = 1024, height = 1024 } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  const hfPrompt = `Professional and colorful illustration for social media about: ${prompt}. Style: modern illustration, pastel colors (yellow, mint green, pink, light blue), warm and professional style, no text in the image, high quality, detailed, cheerful children healthcare theme.`

  const apiKey = process.env.HUGGINGFACE_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada', mock: true })
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      { inputs: hfPrompt, parameters: { width, height } },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 120000
      }
    )

    const base64Image = Buffer.from(response.data).toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`

    res.status(200).json({ success: true, imageUrl })
  } catch (error) {
    console.error('Error generating image:', error.message)
    res.status(500).json({ error: error.message, mock: true })
  }
}
