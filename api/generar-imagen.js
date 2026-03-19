import { HfInference } from '@huggingface/inference'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY
const hf = new HfInference(HUGGINGFACE_API_KEY)

const HF_MODELS = [
  'stabilityai/sdxl-turbo',
  'Lykon/DreamShaper',
  'SG161222/Realistic_Vision_V5.1_noVAE'
]

const createEnhancedPrompt = (prompt, tipo = 'post') => {
  const isComic = tipo === 'comic'
  const style = isComic 
    ? ', comic book style, vibrant colors, clear outlines, professional therapeutic illustration, friendly characters, high quality, no text'
    : ', professional therapeutic illustration, soft pastel colors (mint, light yellow, soft pink), warm and welcoming, high quality, detailed, no text in image'
  return prompt.substring(0, 500) + style
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, width = 1024, height = 1024, tipo = 'post' } = req.body || {}
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  if (!HUGGINGFACE_API_KEY) {
    console.warn('HUGGINGFACE_API_KEY no configurada. Usando fallback directo.')
  } else {
    const enhancedPrompt = createEnhancedPrompt(prompt, tipo)

    for (const model of HF_MODELS) {
      try {
        console.log(`Intentando modelo HF: ${model}`)
        
        const imageBlob = await hf.textToImage({
          model: model,
          inputs: enhancedPrompt,
          parameters: {
            guidance_scale: 7.5,
          }
        })

        if (!imageBlob || imageBlob.size < 100) {
          throw new Error('Imagen generada inválida o vacía')
        }

        const arrayBuffer = await imageBlob.arrayBuffer()
        const base64Image = Buffer.from(arrayBuffer).toString('base64')
        const mimeType = imageBlob.type || 'image/png'
        
        console.log(`Imagen generada con éxito (${model}): ${mimeType}, ${imageBlob.size} bytes`)

        return res.status(200).json({ 
          success: true, 
          imageUrl: `data:${mimeType};base64,${base64Image}`,
          source: 'huggingface',
          model
        })

      } catch (hfError) {
        console.warn(`Modelo ${model} falló:`, hfError.message)
        continue
      }
    }
  }

  // Fallback a Pollinations
  console.log('Usando fallback: Pollinations')
  const seed = Math.floor(Math.random() * 100000)
  const cleanPrompt = prompt.substring(0, 400).replace(/[^\w\s,]/g, '')
  // Cambiamos a pollinations.ai/p/ para ver si es más estable
  const fallbackUrl = `https://pollinations.ai/p/${encodeURIComponent(cleanPrompt + (tipo === 'comic' ? ' comic style' : ' professional illustration'))}?width=${width}&height=${height}&nologo=true&seed=${seed}`
  
  return res.status(200).json({ 
    success: true, 
    imageUrl: fallbackUrl,
    source: 'pollinations_fallback' 
  })
}
