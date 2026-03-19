import { HfInference } from '@huggingface/inference'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY
const hf = new HfInference(HUGGINGFACE_API_KEY)

const HF_MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'Lykon/DreamShaper',
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
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, width = 1024, height = 1024, tipo = 'post' } = req.body || {}
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  const enhancedPrompt = createEnhancedPrompt(prompt, tipo)

  if (!HUGGINGFACE_API_KEY) {
    console.warn('HUGGINGFACE_API_KEY no configurada. Usando fallback directo.')
  } else {
    for (const model of HF_MODELS) {
      try {
        console.log(`Intentando modelo HF: ${model}`)
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Hugging Face Timeout (Límite 7s)')), 7000)
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

  // Fallback a Pollinations con Reintentos en el Servidor
  console.log('Usando fallback: Pollinations (Server Side)')
  const cleanPrompt = prompt.substring(0, 400).replace(/[^\w\s,]/g, '')
  const finalPrompt = encodeURIComponent(cleanPrompt + (tipo === 'comic' ? ' comic book illustration' : ' professional therapeutic illustration'))
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const seed = Math.floor(Math.random() * 100000)
      const fallbackUrl = `https://image.pollinations.ai/prompt/${finalPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`
      
      const pollRes = await fetch(fallbackUrl, {
        headers: { 'User-Agent': 'CreSer-Marketing-App' }
      })

      const contentType = pollRes.headers.get('content-type')
      
      if (pollRes.ok && contentType && contentType.startsWith('image/')) {
        const arrayBuffer = await pollRes.arrayBuffer()
        const base64Image = Buffer.from(arrayBuffer).toString('base64')
        return res.status(200).json({ 
          success: true, 
          imageUrl: `data:${contentType};base64,${base64Image}`,
          source: 'pollinations_server_fallback' 
        })
      } else {
        const errText = await pollRes.text()
        console.warn(`Intento ${attempt} de Pollinations falló. Respuesta no es imagen:`, errText.substring(0, 100))
        if (attempt === 1) await new Promise(resolve => setTimeout(resolve, 2000)) // Esperar 2s antes de reintentar
      }

    } catch (fallbackError) {
      console.warn(`Intento ${attempt} de Pollinations falló (${fallbackError.message})`)
      if (attempt === 1) await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.error('Error fatal: Ningún proveedor pudo generar la imagen')
  return res.status(500).json({ 
    success: false, 
    error: 'Cola de IA llena. Por favor, intenta de nuevo en unos segundos.' 
  })
}
