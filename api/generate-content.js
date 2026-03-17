import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, tipo = 'post', servicio = 'Fonoaudiología', tono = 'cálido' } = req.body

  if (!prompt && !servicio) {
    return res.status(400).json({ error: 'Prompt o servicio es requerido' })
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada', mock: true })
  }

  const toneInstructions = {
    'profesional': 'Formal pero accesible, profesional de la salud',
    'cálido': 'Empático, cercano, como un amigo que da consejos',
    'educativo': 'Informativo, claro, centrado en enseñar',
    'motivacional': 'Inspirador, positivo, orientado a la acción'
  }

  const serviceContext = {
    'Fonoaudiología': 'desarrollo del lenguaje, habla y comunicación en niños',
    'Psicología': 'salud mental y bienestar emocional infantil',
    'Psicomotricidad': 'desarrollo motor y coordinación en niños',
    'Evaluación Neuropsicológica': 'evaluaciones cognitivas y de aprendizaje',
    'Inclusión Educativa': 'apoyo a estudiantes con NEE',
    'Apoyo Escolar': 'refuerzo académico y métodos de estudio'
  }

  let systemPrompt = ''
  
  if (tipo === 'post') {
    systemPrompt = `Eres un experto en marketing para centros terapéuticos-educativos. Genera un post para Instagram sobre ${servicio} (${serviceContext[servicio] || ''}). 

Tono: ${toneInstructions[tono] || toneInstructions['cálido']}

Requisitos:
- Un gancho emocional al inicio (pregunta o afirmación impactante)
- Explicación breve del problema o necesidad
- Cómo CreSer puede ayudar (centro en Córdoba, Argentina)
- Llamado a la acción (CTA)
- Emojis relevantes
- Hashtags en español (#Córdoba, #Argentina, #${servicio.replace(' ', '')}, #Trelew, #niños, #familia)

Máximo 200 palabras. Estructura: gancho - problema - solución - CTA - hashtags.`
  } else if (tipo === 'carousel') {
    systemPrompt = `Eres un experto en marketing para centros terapéuticos. Genera contenido para un carousel educativo de Instagram sobre ${servicio}.

Tono: ${toneInstructions[tono] || toneInstructions['cálido']}

Estructura (7 slides):
1: Título atractivo
2: Introducción al tema
3-5: Puntos clave o señales de alerta
6: Cómo CreSer puede ayudar
7: Llamado a la acción + hashtags

Cada slide máximo 25 palabras. Incluye emojis.`
  } else if (tipo === 'reel') {
    systemPrompt = `Eres un experto en marketing. Genera un script para Reel/TikTok de 30-60 segundos sobre ${servicio}.

Tono: ${toneInstructions[tono] || toneInstructions['cálido']}

Estructura:
- Hook (3 segundos, pregunta impactante)
- Problema común
- Solución o consejo práctico
- Llamado a la acción
- Hashtags

Máximo 150 palabras.`
  } else if (tipo === 'story') {
    systemPrompt = `Genera contenido para Instagram Story sobre ${servicio}. Tono: ${toneInstructions[tono] || toneInstructions['cálido']}. Máximo 50 palabras. Incluye sugerencia de sticker (pregunta/encuesta).`
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
      {
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.8,
          top_p: 0.9
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    )

    const generatedText = response.data?.[0]?.generated_text || ''
    const content = extractContent(generatedText, servicio, tipo)

    res.status(200).json({ 
      success: true, 
      content,
      raw: generatedText
    })
  } catch (error) {
    console.error('Error generating content:', error.message)
    res.status(500).json({ error: error.message, mock: true })
  }
}

function extractContent(text, servicio, tipo) {
  const lines = text.split('\n').filter(l => l.trim())
  
  const hashtags = text.match(/#[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]+/g) || [
    `#${servicio.replace(' ', '')}`, '#Córdoba', '#CreSer', '#Argentina', '#niños'
  ]

  const cleanHashtags = [...new Set(hashtags)].slice(0, 10)

  let copy = text.replace(/^.*?:\s*/s, '').replace(/#.*$/gs, '').trim()
  
  if (copy.length < 50) {
    copy = lines.slice(0, 8).join('\n')
  }

  return {
    copy: copy.substring(0, 1000),
    hashtags: cleanHashtags,
    topic: lines[0]?.substring(0, 60) || `Tema sobre ${servicio}`,
    service: servicio
  }
}
