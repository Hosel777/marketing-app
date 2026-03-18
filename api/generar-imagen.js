import { InferenceClient } from '@huggingface/inference'

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY)

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
    const blob = await client.textToImage({
      model: 'black-forest-labs/FLUX.1-dev',
      inputs: prompt,
      parameters: {
        width: 1024,
        height: 1024
      }
    })

    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const imageUrl = `data:image/png;base64,${base64}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('HuggingFace image error:', error.message)
    return res.status(500).json({ error: 'Error generando imagen: ' + error.message })
  }
}
