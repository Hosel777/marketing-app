import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

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
    // Usamos SD v1.5 por su extrema estabilidad y baja latencia (evita timeouts en Vercel)
    const imageBlob = await hf.textToImage({
      model: "runwayml/stable-diffusion-v1-5",
      inputs: `${prompt}, professional illustration, colors, high quality`,
      parameters: { width: 512, height: 512 }
    })

    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const imageUrl = `data:image/png;base64,${base64}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('Hugging Face error:', error.message)
    return res.status(500).json({ 
      error: 'Error en Hugging Face: ' + error.message,
      tip: 'Verifica que HUGGINGFACE_API_KEY esté en Vercel y sea válida.'
    })
  }
}
