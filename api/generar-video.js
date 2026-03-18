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
    const blob = await client.textToVideo({
      model: 'damo-vilab/text-to-video-ms-1.7b',
      inputs: prompt,
      parameters: {
        num_inference_steps: 25,
        guidance_scale: 7.5
      }
    })

    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const videoUrl = `data:video/mp4;base64,${base64}`

    return res.status(200).json({ success: true, videoUrl })

  } catch (error) {
    console.error('HuggingFace video error:', error.message)
    return res.status(500).json({ error: 'Error generando video: ' + error.message })
  }
}
