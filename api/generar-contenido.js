const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free'
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    tipo = 'post',
    servicio = 'Fonoaudiología',
    tono = 'cálido',
    objetivo = 'engagement',
    generarImagen = false,
    generarVideo = false,
    n8nWebhook = null
  } = req.body || {}

  try {
    let resultado = await generarContenido({
      tipo,
      servicio,
      tono,
      objetivo,
      topic: req.body.topic
    })

    // Fallback si no hay contenido
    if (!resultado || !resultado.copy) {
      resultado = {
        copy: `¿Sabías que la atención temprana puede marcar la diferencia en el desarrollo de tu hijo? En CreSer, centro terapéutico-educativo interdisciplinario en Córdoba, Argentina, entendemos las necesidades de cada familia. Nuestro equipo de ${servicio} trabaja día a día para ayudar a niños y familias a alcanzar su máximo potencial. Contáctanos para más información.`,
        hashtags: [`#${servicio.replace(' ', '')}`, '#CreSer', '#Córdoba', '#Argentina', '#TerapiaInfantil', '#DesarrolloInfantil', '#Familia'],
        topic: `Información sobre ${servicio}`,
        promptVisual: `${servicio} - centro terapéutico infantil`
      }
    }

    let imageUrl = null

    if (generarImagen || generarVideo) {
      imageUrl = await generarImagenIA(resultado.promptVisual)
    }

    if (N8N_WEBHOOK_URL && n8nWebhook) {
      await enviarAN8N({
        ...resultado,
        imageUrl,
        tipo,
        objetivo,
        servicio
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        copy: resultado.copy,
        hashtags: resultado.hashtags,
        topic: resultado.topic,
        imageUrl,
        promptVisual: resultado.promptVisual,
        servicio,
        tipo,
        objetivo
      }
    })

  } catch (error) {
    console.error('Error en generación:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error conectando con OpenRouter o tiempo de espera agotado. Por favor, intenta de nuevo.'
    })
  }
}

async function generarContenido({ tipo, servicio, tono, objetivo, topic }) {
  const toneInstructions = {
    profesional: 'Formal pero accesible, lenguaje técnico claro',
    cálido: 'Empático, cercano, como un amigo que recomienda',
    educativo: 'Informativo, claro, centrado en enseñar',
    motivacional: 'Inspirador, positivo, orientado a acción'
  }

  const tipoContent = {
    post: 'publicación para Instagram Feed',
    carousel: 'carousel educativo de 5 slides para Instagram',
    reel: 'script para Reel de 30-60 segundos',
    story: 'contenido para Instagram Story',
    comic: 'un cómic o historia social de 4 viñetas (social story)'
  }

  const prompt = `Genera un post para CreSer (centro terapéutico en Córdoba, Argentina) sobre ${servicio}.
Tipo: ${tipoContent[tipo] || 'post'}
Tono: ${toneInstructions[tono] || 'cálido'}
Objetivo: ${objetivo || 'engagement'}
Tema específico: ${topic || 'atención integral'}

Estructura: Gancho impactante, Problema empático, Solución CreSer, Llamado a la acción.
Usa emojis. Devuelve SOLO JSON: {"copy": "...", "hashtags": ["#..."], "topic": "...", "promptVisual": "..."}`

  const primaryModel = OPENROUTER_API_KEY ? OPENROUTER_MODEL : 'meta-llama/llama-3.1-8b-instruct:free'
  const modelsToTry = [primaryModel, 'meta-llama/llama-3.1-8b-instruct:free', 'google/gemini-flash-1.5-exp:free']

  for (const model of modelsToTry) {
    try {
      console.log(`Intentando generación de texto con: ${model}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000)

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://creser.com.ar',
          'X-Title': 'CreSer Marketing App'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'Eres un experto en marketing terapéutico para CreSer Córdoba. Devuelve siempre JSON puro.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`OpenRouter HTTP ${response.status}: ${errText.substring(0, 100)}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      const parsed = JSON.parse(content.replace(/```json/g, '').replace(/```/g, ''))
      
      return {
        ...parsed,
        topic: parsed.topic || topic || `Contenido de ${servicio}`,
        servicio: servicio
      }

    } catch (error) {
      console.warn(`Fallo con modelo ${model}:`, error.message)
      if (model === modelsToTry[modelsToTry.length - 1]) throw error
      continue
    }
  }
}

async function generarImagenIA(prompt) {
  try {
    const seed = Math.floor(Math.random() * 100000)
    const cleanPrompt = prompt.substring(0, 400).replace(/[^\w\s,]/g, '')
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt + ' professional therapeutic illustration, soft colors')}?width=1024&height=1024&nologo=true&seed=${seed}`
  } catch (e) {
    console.error('Error en imagen fallback:', e.message)
    return null
  }
}

async function enviarAN8N(data) {
  if (!N8N_WEBHOOK_URL) {
    return { message: 'Webhook de n8n no configurado' }
  }

  const payload = {
    action: 'publicar',
    ...data,
    timestamp: new Date().toISOString()
  }

  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return { status: 'enviado' }
  } catch (err) {
    console.error('Error enviando a n8n:', err.message)
    return { status: 'error', message: err.message }
  }
}
