import { HfInference } from '@huggingface/inference'
import OpenAI from 'openai'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN

const hf = new HfInference(HUGGINGFACE_API_KEY)
const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
})

const HF_MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'stabilityai/stable-diffusion-xl-base-1.0',
  'stabilityai/sd-turbo'
]

const createEnhancedPrompt = (prompt, tipo = 'post') => {
  const isComic = tipo === 'comic'
  const style = isComic 
    ? ', comic book style, vibrant colors, clear outlines, professional illustration, high quality, no text'
    : ', professional and inclusive atmosphere, warm lighting, high quality, detailed, realistic, no text in image'
  return prompt.substring(0, 700) + style
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

  // 1. INTENTO PREMIUM: OpenRouter Flux 2.Pro
  if (OPENROUTER_API_KEY) {
    try {
      console.log(`Intentando OpenRouter (Flux 2.Pro)...`)
      const apiResponse = await openRouterClient.chat.completions.create({
        model: 'black-forest-labs/flux.2-pro',
        messages: [{ role: 'user', content: enhancedPrompt }],
        modalities: ['image']
      })

      const response = apiResponse.choices[0].message
      if (response && response.images && response.images.length > 0) {
        const imageUrl = response.images[0].image_url.url
        console.log('Imagen generada con Flux 2.Pro exitosamente.')
        return res.status(200).json({
          success: true,
          imageUrl: imageUrl,
          isFallback: false,
          model: 'flux.2-pro'
        })
      }
    } catch (error) {
      console.warn('Error en OpenRouter Flux:', error.message)
    }
  }

  // 2. INTENTO SECUNDARIO: HuggingFace (Si Flux falla)
  if (HUGGINGFACE_API_KEY) {
    for (const model of HF_MODELS) {
      if ((Date.now() - startTime) > 8500) break;
      try {
        console.log(`Intentando modelo HF Secundario: ${model}`);
        const imageBlob = await hf.textToImage({
          model: model,
          inputs: enhancedPrompt,
          parameters: { guidance_scale: 7.5 }
        });
        if (!imageBlob || imageBlob.size < 100) continue;
        const arrayBuffer = await imageBlob.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        return res.status(200).json({ 
          success: true, 
          imageUrl: `data:${imageBlob.type};base64,${base64Image}`,
          source: 'huggingface',
          model
        });
      } catch (err) { 
        console.warn(`Modelo HF ${model} falló:`, err.message);
        continue; 
      }
    }
  }

  return res.status(500).json({ 
    success: false, 
    error: 'No se pudo generar con Flux 2.Pro ni con modelos HF. Intenta de nuevo.' 
  })
}
