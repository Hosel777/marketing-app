import axios from 'axios'

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'API key de HuggingFace no configurada' })
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/ai-forever/playground-v2',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 120000
      }
    )

    const base64 = Buffer.from(response.data).toString('base64')
    const imageUrl = `data:image/png;base64,${base64}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('HuggingFace image error:', error.message)
    return res.status(500).json({ error: 'Error generando imagen: ' + error.message })
  }
}
