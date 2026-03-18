import { Ollama } from 'ollama'

const ollama = new Ollama({
  host: process.env.OLLAMA_BASE_URL || 'https://ollama.com',
  headers: process.env.OLLAMA_API_KEY 
    ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` }
    : {}
})

const POLLINATIONS_URL = 'https://image.pollinations.ai'
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
      objetivo
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
      message: 'Error conectando con Ollama. Verifica las variables de entorno.'
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
Eres un experto en marketing para un centro terapéutico-educativo llamado CreSer en Córdoba, Argentina.

Genera contenido para ${tipoContent[tipo] || tipoContent.post} sobre ${servicio} (${serviceContext[servicio]}).

Usa este estilo y estructura:

**Gancho** (1 línea impactante):
- Haz una pregunta o afirmación que sorprenda al родителей
- Ejemplo: "¿Sabías que la atención temprana puede marcar la diferencia?"

**Problema** (2-3 líneas):
- Describe el problema común que enfrentan las familias
- Sé empático y cercano

**Solución** (2-3 líneas):
- Cómo CreSer puede ayudar
- Destaca: equipo interdisciplinario, modalidad presencial y online, ambiente cálido y profesional

**Llamado a la acción**:
- Ejemplo: "Escríbenos para más información" o "Contáctanos"

**Tono**: ${toneInstructions[tono] || toneInstructions['cálido']}

Usa emojis relevantes. Incluye hashtags en español.

Devuelve SOLO un JSON con esta estructura exacta:
{
  "copy": "todo el texto del post con emojis",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "topic": "título corto del tema",
  "promptVisual": "descripción breve para imagen (en inglés, para IA)"
}
`

  try {
    const response = await ollama.generate({
      model: 'minimax-m2.5',
      prompt: prompt,
      format: 'json',
      options: {
        temperature: 0.8,
        top_p: 0.9,
        num_predict: 1000
      }
    })

    const responseText = response.response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return parseResponseToJSON(responseText, servicio)

  } catch (error) {
    console.error('Ollama error:', error.message)
    throw new Error('Error conectando con Ollama: ' + error.message)
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
    
    const imageUrl = `${POLLINATIONS_URL}/prompt/${encodeURIComponent(prompt)}?width=1080&height=1350&nologo=true&seed=${Math.floor(Math.random() * 100000)}`
    
    return imageUrl

  } catch (error) {
    console.error('Pollinations error:', error.message)
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

  const axios = (await import('axios')).default
  await axios.post(N8N_WEBHOOK_URL, payload, {
    timeout: 30000
  })

  return { status: 'enviado' }
}
