import axios from 'axios'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}
  const apiKey = process.env.HUGGINGFACE_API_KEY

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada' })
  }

  try {
    // Usar modelo gratuito de HuggingFace
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        responseType: 'arraybuffer',
        timeout: 180000
      }
    )

    const base64 = Buffer.from(response.data).toString('base64')
    const imageUrl = `data:image/png;base64,${base64}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('Image error:', error.message)
    return res.status(500).json({ error: 'Error: ' + error.message })
  }
}
