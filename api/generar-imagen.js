import axios from 'axios'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

const HF_MODELS = [
  'stabilityai/sdxl-turbo',
  'Lykon/DreamShaper',
  'SG161222/Realistic_Vision_V5.1_noVAE'
]

const createEnhancedPrompt = (prompt) => {
  const style = ', professional therapeutic illustration, soft pastel colors (mint, light yellow, soft pink), warm and welcoming, high quality, detailed, no text in image'
  return prompt.substring(0, 500) + style
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, width = 1024, height = 1024 } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' })

  const enhancedPrompt = createEnhancedPrompt(prompt)

  for (const model of HF_MODELS) {
    try {
      console.log(`Intentando modelo: ${model}`)
      
      const hfResponse = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs: enhancedPrompt },
        {
          headers: { 
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer',
          timeout: 15000
        }
      )

      const base64Image = Buffer.from(hfResponse.data, 'binary').toString('base64')
      return res.status(200).json({ 
        success: true, 
        imageUrl: `data:image/png;base64,${base64Image}`,
        source: 'huggingface',
        model
      })

    } catch (hfError) {
      console.warn(`Modelo ${model} falló:`, hfError.message)
      continue
    }
  }

  const seed = Math.floor(Math.random() * 100000)
  const fallbackUrl = `https://pollinations.ai/p/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}&referrer=creser`
  
  return res.status(200).json({ 
    success: true, 
    imageUrl: fallbackUrl,
    source: 'pollinations_fallback' 
  })
}
