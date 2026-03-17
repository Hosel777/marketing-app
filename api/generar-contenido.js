import axios from 'axios'

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'https://api.ollama.ai/v1'
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY
const POLLINATIONS_URL = 'https://text.pollinations.ai'
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
    const resultado = await generarContenido({
      tipo,
      servicio,
      tono,
      objetivo
    })

    let imageUrl = null
    let videoUrl = null

    if (generarImagen) {
      imageUrl = await generarImagenIA(resultado.promptVisual)
    }

    if (generarVideo && n8nWebhook) {
      videoUrl = await solicitarVideoAN8N({
        ...resultado,
        imageUrl,
        tipo,
        objetivo,
        webhook: n8nWebhook
      })
    }

    if (N8N_WEBHOOK_URL && n8nWebhook) {
      await enviarAN8N({
        ...resultado,
        imageUrl,
        videoUrl,
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
        videoUrl,
        servicio,
        tipo,
        objetivo
      }
    })

  } catch (error) {
    console.error('Error en generación:', error.message)
    return res.status(200).json({
      success: false,
      error: error.message,
      fallback: await generarContenidoLocal(servicio, tipo)
    })
  }
}

async function generarContenido({ tipo, servicio, tono, objetivo }) {
  const toneInstructions = {
    profesional: 'Formal pero accesible, lenguaje técnico claro',
    cálido: 'Empático, cercano, como un amigo que recomienda',
    educativo: 'Informativo, claro, centrado en enseñar',
    motivacional: 'Inspirador, positivo, orientado a acción'
  }

  const serviceContext = {
    'Fonoaudiología': 'desarrollo del lenguaje, habla y comunicación en niños',
    'Psicología': 'salud mental y bienestar emocional infantil y familiar',
    'Psicomotricidad': 'desarrollo motor fino y grueso en niños',
    'Evaluación Neuropsicológica': 'evaluaciones cognitivas y de aprendizaje',
    'Inclusión Educativa': 'apoyo a estudiantes con NEE y adaptaciones curriculares',
    'Apoyo Escolar': 'refuerzo académico y técnicas de estudio'
  }

  const tipoContent = {
    post: 'publicación para Instagram Feed',
    carousel: 'carousel educativo de 5 slides para Instagram',
    reel: 'script para Reel de 30-60 segundos',
    story: 'contenido para Instagram Story'
  }

  const objetivoText = {
    venta: 'Incluye llamado a la acción fuerte para comprar/contactar',
    engagement: 'Enfocado en generar interacción y comentarios',
    conciencia: 'Contenido educativo e informativo'
  }

  const prompt = `
Eres experto en marketing digital para centros terapéuticos-educativos en Argentina.
Genera un ${tipoContent[tipo] || tipoContent.post} sobre ${servicio} (${serviceContext[servicio]}).
Tono: ${toneInstructions[tono] || toneInstructions['cálido']}.
Objetivo: ${objetivoText[objeto] || objetivoText['engagement']}.
Contexto: CreSer - Centro Terapéutico-Educativo Interdisciplinario en Córdoba, Argentina.
Requisitos:
- Gancho emocional en los primeros 3 segundos/líneas
- Problema o necesidad que detecta el público
- Cómo CreSer puede ayudar
- Llamado a la acción claro
- Emojis relevantes
- Hashtags en español (#Córdoba, #Argentina, #${servicio.replace(' ', '')}, #CreSer, #TerapiaInfantil, #Familia)
Máximo 280 caracteres para posts, más largo para carousel/reel.
Devuelve en formato JSON con campos: copy, hashtags (array), topic (título corto), promptVisual (descripción de imagen para IA)
`

  try {
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/chat/completions`,
      {
        model: 'llama-3.2-90b-text-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
      },
      {
        timeout: 120000,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OLLAMA_API_KEY}`
        }
      }
    )

    const responseText = response.data.choices?.[0]?.message?.content || ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return parseResponseToJSON(responseText, servicio)

  } catch (error) {
    console.error('Ollama error:', error.message)
    return generarContenidoLocal(servicio, tipo)
  }
}

function parseResponseToJSON(text, servicio) {
  const hashtags = text.match(/#[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]+/g) || [
    `#${servicio.replace(' ', '')}`, '#CreSer', '#Córdoba', '#Argentina'
  ]

  const lines = text.split('\n').filter(l => l.trim())
  
  return {
    copy: text.substring(0, 1000),
    hashtags: [...new Set(hashtags)].slice(0, 10),
    topic: lines[0]?.substring(0, 60) || `Contenido sobre ${servicio}`,
    promptVisual: `${servicio} - ${lines[0] || 'professional healthcare illustration for social media'}`
  }
}

async function generarImagenIA(promptVisual) {
  try {
    const prompt = `${promptVisual}, professional colorful illustration, modern pastel colors (yellow, mint green, soft pink), warm healthcare theme for children, high quality, detailed, no text, 4k`
    
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1350&nologo=true&seed=${Math.floor(Math.random() * 100000)}`
    
    return imageUrl

  } catch (error) {
    console.error('Pollinations error:', error.message)
    return null
  }
}

async function solicitarVideoAN8N(data) {
  if (!N8N_WEBHOOK_URL) {
    return { message: 'Webhook de n8n no configurado' }
  }

  try {
    const webhookPayload = {
      action: 'generar_video',
      tipo: data.tipo,
      objetivo: data.objetivo,
      servicio: data.servicio,
      copy: data.copy,
      promptVisual: data.promptVisual,
      imageUrl: data.imageUrl,
      timestamp: new Date().toISOString()
    }

    await axios.post(N8N_WEBHOOK_URL, webhookPayload, {
      timeout: 30000
    })

    return { 
      status: 'solicitado', 
      message: 'Video solicitado a n8n - procesando en segundo plano'
    }

  } catch (error) {
    console.error('Error enviando a n8n para video:', error.message)
    return null
  }
}

async function enviarAN8N(data) {
  if (!N8N_WEBHOOK_URL) {
    return { message: 'Webhook de n8n no configurado' }
  }

  const payload = {
    action: 'publicar',
    tipo: data.tipo,
    objetivo: data.objetivo,
    servicio: data.servicio,
    copy: data.copy,
    hashtags: data.hashtags,
    topic: data.topic,
    promptVisual: data.promptVisual,
    imageUrl: data.imageUrl,
    videoUrl: data.videoUrl,
    timestamp: new Date().toISOString()
  }

  await axios.post(N8N_WEBHOOK_URL, payload, {
    timeout: 30000
  })

  return { status: 'enviado' }
}

function generarContenidoLocal(servicio, tipo) {
  const templates = {
    post: {
      hooks: [
        '¿Sabías que la atención temprana puede marcar la diferencia en el desarrollo de tu hijo?',
        '¿Tu hijo tiene dificultades para expresarse o comunicarse?',
        'No ignores las señales que pueden indicar que tu hijo necesita ayuda profesional'
      ]
    }
  }

  const randomHook = templates.post.hooks[Math.floor(Math.random() * templates.post.hooks.length)]
  const serviceName = servicio

  const copy = `${randomHook}

En CreSer, centro terapéutico-educativo interdisciplinario en Córdoba, Argentina, entendemos estas preocupaciones. Nuestro equipo de ${serviceName} trabaja para ayudar a niños y familias a alcanzar su máximo potencial.

✨ Modalidad presencial y online
✨ Ambiente cálido y profesional

💬 ¿Te gustaría más información? Escríbenos.

#${serviceName.replace(' ', '')} #CreSer #Córdoba #Argentina #TerapiaInfantil #DesarrolloInfantil`

  return {
    copy,
    hashtags: [`#${serviceName.replace(' ', '')}`, '#CreSer', '#Córdoba', '#Argentina', '#TerapiaInfantil'],
    topic: `Información sobre ${serviceName}`,
    promptVisual: `${serviceName} - centro terapéutico infantil, colores pasteles, profesionales atendiendo niños`
  }
}
