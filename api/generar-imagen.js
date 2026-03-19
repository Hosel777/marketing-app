import { HfInference } from '@huggingface/inference'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY
const hf = new HfInference(HUGGINGFACE_API_KEY)

const HF_MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'stabilityai/stable-diffusion-xl-base-1.0',
  'prompthero/openjourney'
]

const createEnhancedPrompt = (prompt, tipo = 'post') => {
  const isComic = tipo === 'comic'
  const style = isComic 
    ? ', comic book style, vibrant colors, clear outlines, professional therapeutic illustration, friendly characters, high quality, no text'
    : ', professional therapeutic illustration, soft pastel colors (mint, light yellow, soft pink), warm and welcoming, high quality, detailed, no text in image'
  return prompt.substring(0, 500) + style
}

export default async function handler(req, res) {
  const startTime = Date.now()
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, width = 1024, height = 1024, tipo = 'post' } = req.body || {}
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  const enhancedPrompt = createEnhancedPrompt(prompt, tipo)

  if (HUGGINGFACE_API_KEY) {
    // Intentaremos modelos HF solo mientras nos queden al menos 2 segundos de los 10 de Vercel
    for (const model of HF_MODELS) {
      const elapsed = Date.now() - startTime
      if (elapsed > 8000) {
        console.warn('Tiempo límite global de HF alcanzado (8s). Saltando a fallback.')
        break
      }

      try {
        console.log(`Intentando modelo HF (${Math.round(elapsed)}ms transcurridos): ${model}`)
        
        // Timeout individual de 5s por modelo para no agotar el tiempo total
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('HF Model Timeout (5s)')), 5000)
        )

        const hfPromise = hf.textToImage({
          model: model,
          inputs: enhancedPrompt,
          parameters: {
            guidance_scale: 7.5,
          }
        })

        const imageBlob = await Promise.race([hfPromise, timeoutPromise])

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

  // Fallback a Pollinations (Client Side + Retry handled by frontend)
  console.log('Usando fallback: Pollinations (Client Side)')
  try {
    const seed = Math.floor(Math.random() * 100000)
    const cleanPrompt = prompt.substring(0, 400).replace(/[^\w\s,]/g, '')
    const finalPrompt = encodeURIComponent(cleanPrompt + (tipo === 'comic' ? ' comic book illustration' : ' professional therapeutic illustration'))
    
    // Agregamos un timestamp para forzar que el navegador no use caché, aunque usaremos semilla.
    const fallbackUrl = `https://image.pollinations.ai/prompt/${finalPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`
    
    return res.status(200).json({ 
      success: true, 
      imageUrl: fallbackUrl,
      source: 'pollinations_fallback' 
    })
  } catch (fallbackError) {
    console.error('Error fatal en fallback:', fallbackError.message)
    return res.status(500).json({ 
      success: false, 
      error: 'Cola de IA llena. Por favor, intenta de nuevo en unos segundos.' 
    })
  }
}
