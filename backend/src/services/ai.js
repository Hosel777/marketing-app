import axios from 'axios'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview:generateContent'

const SERVICE_TONES = {
  'profesional': 'Formal pero accesible, utilizando terminología profesional de manera clara',
  'cálido': 'Empático, cercano y acogedor, como si fuera un amigo que da consejos',
  'educativo': 'Informativo y claro, centrado en enseñar y explicar',
  'motivacional': 'Inspirador, positivo y orientado a la acción'
}

const SERVICE_CONTEXT = {
  'Fonoaudiología': 'especializada en desarrollo del lenguaje, habla y comunicación en niños',
  'Psicología': 'especializada en salud mental y bienestar emocional',
  'Psicomotricidad': 'especializada en desarrollo motor y coordinación',
  'Evaluación Neuropsicológica': 'especializada en evaluaciones cognitivas y de aprendizaje',
  'Inclusión Educativa': 'especializada en apoyo a estudiantes con NEE',
  'Apoyo Escolar': 'especializada en refuerzo académico y métodos de estudio'
}

export async function generateContent(options) {
  const { 
    tipo = 'post', 
    plataforma = 'instagram', 
    servicio = 'Fonoaudiología',
    tono = 'cálido',
    tema = '',
    generarImagen = true 
  } = options

  const config = {
    apiKey: process.env.GEMINI_API_KEY
  }

  const toneInstruction = SERVICE_TONES[tono] || SERVICE_TONES['cálido']
  const serviceContext = SERVICE_CONTEXT[servicio] || SERVICE_CONTEXT['Fonoaudiología']

  let prompt = ''

  if (tipo === 'post') {
    prompt = `Genera un post para ${plataforma} sobre ${servicio}. 

Contexto: CreSer es un centro terapéutico-educativo interdisciplinario en Córdoba, Argentina, ${serviceContext}.

Tono: ${toneInstruction}

El post debe:
- Tener un gancho emocional al inicio
- Explicar un problema común
- Mostrar cómo CreSer puede ayudar
- Incluir un llamado a la acción claro
- Usar emojis relevantes
- Incluir hashtags locales (#Córdoba #TerapiaCórdoba #${servicio.replace(' ', '')})

Máximo 200 palabras.`
  } else if (tipo === 'carousel') {
    prompt = `Genera el contenido para un carousel educativo de Instagram sobre ${servicio}.

Contexto: CreSer es un centro terapéutico-educativo interdisciplinario en Córdoba, Argentina, ${serviceContext}.

Tono: ${toneInstruction}

Estructura:
- Slide 1: Título atractivo
- Slide 2: Introducción al tema
- Slides 3-5: Puntos clave o señales de alerta
- Slide 6: Cómo CreSer puede ayudar
- Slide 7: Llamado a la acción

Cada slide: máximo 30 palabras.`
  } else if (tipo === 'reel') {
    prompt = `Genera un script para un Reel de Instagram de 30-60 segundos sobre ${servicio}.

Contexto: CreSer es un centro terapéutico-educativo interdisciplinario en Córdoba, Argentina, ${serviceContext}.

Tono: ${toneInstruction}

Estructura:
- Hook (primeros 3 segundos)
- Problema común
- Solución / Consejo práctico
- Llamado a la acción
- Hashtags relevantes

Máximo 150 palabras.`
  } else if (tipo === 'story') {
    prompt = `Genera contenido para una Story de Instagram sobre ${servicio}.

Contexto: CreSer es un centro terapéutico-educativo interdisciplinario en Córdoba, Argentina.

Tono: ${toneInstruction}

Incluye:
- Texto corto y directo
- Llamado a la acción
- Sticker de pregunta o encuesta sugerido

Máximo 50 palabras.`
  }

  if (tema) {
    prompt += `\n\nTema específico: ${tema}`
  }

  if (!config.apiKey) {
    return {
      mock: true,
      content: {
        copy: generateMockContent(tipo, servicio),
        hashtags: generateMockHashtags(servicio),
        tema: tema || generateMockTopic(servicio)
      }
    }
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${config.apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      }
    )

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
      content: {
        copy: extractCopy(generatedText),
        hashtags: extractHashtags(generatedText, servicio),
        tema: tema || extractTopic(generatedText)
      }
    }
  } catch (error) {
    console.error('Error generating content:', error.message)
    return {
      content: {
        copy: generateMockContent(tipo, servicio),
        hashtags: generateMockHashtags(servicio),
        tema: tema || generateMockTopic(servicio)
      },
      error: error.message
    }
  }
}

function extractCopy(text) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.slice(0, 10).join('\n')
}

function extractHashtags(text, servicio) {
  const hashtags = text.match(/#\w+/g) || []
  if (hashtags.length === 0) {
    return generateMockHashtags(servicio)
  }
  return [...hashtags, `#${servicio.replace(' ', '')}`, '#Córdoba', '#CreSer'].slice(0, 10)
}

function extractTopic(text) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines[0]?.replace(/^[0-9]+[\.\)]\s*/, '').substring(0, 60) || 'Tema sugerido'
}

function generateMockContent(tipo, servicio) {
  const templates = {
    post: `📣 ¿Sabías que la atención temprana puede marcar la diferencia en el desarrollo de tu hijo?

En CreSer, nuestro equipo de ${servicio} trabaja día a día para ayudar a niños y familias a alcanzar su máximo potencial.

✅ Evaluación gratuita
✅ Modalidad presencial y online
✅ Profesionales especializados

💬 ¿Te gustaría conocer más? Escríbenos por WhatsApp.

#${servicio.replace(' ', '')} #DesarrolloInfantil #CreSer #Córdoba #TerapiaTemprana`,
    
    carousel: `📚 CAROUSEL: 5 señales de que tu hijo necesita ${servicio}

1/5 ¿Tu hijo presenta dificultades en...?
2/5 Señal 1: Retraso en el desarrollo
3/5 Señal 2: Dificultades de comunicación
4/5 Señal 3: Comportamientos repetitivos
5/5 ✅ En CreSer podemos ayudarte. Contáctanos.

#${servicio.replace(' ', '')} #Educación #CreSer`,
    
    reel: `🎬 SCRIPT REEL:

[Hook] ¿Tu hijo tiene dificultades para...?

[Problema] Muchos padres no reconocen las señales de alerta.

[Solución] En CreSer evaluamos y acompañamos a tu hijo.

[CTA] Escríbenos para una evaluación gratuita.

#${servicio.replace(' ', '')} #Parenting #CreSer`,
    
    story: `💭 ¿Sabías que...?

La intervención temprana en ${servicio} puede hacer toda la diferencia.

💬 Escríbenos para más info!

#${servicio.replace(' ', '')} #CreSer`
  }
  
  return templates[tipo] || templates.post
}

function generateMockHashtags(servicio) {
  return [
    `#${servicio.replace(' ', '')}`,
    '#DesarrolloInfantil',
    '#CreSer',
    '#Córdoba',
    '#TerapiaCórdoba',
    '#Familia',
    '#Niños',
    '#Educación'
  ]
}

function generateMockTopic(servicio) {
  const topics = {
    'Fonoaudiología': '5 señales de retrasos en el lenguaje',
    'Psicología': 'Cómo manejar la ansiedad infantil',
    'Psicomotricidad': 'Juegos para desarrollar coordinación',
    'Evaluación Neuropsicológica': 'Qué esperar en una evaluación',
    'Inclusión Educativa': 'Derechos de estudiantes con NEE',
    'Apoyo Escolar': 'Técnicas de estudio efectivas'
  }
  return topics[servicio] || `Todo sobre ${servicio}`
}

export async function generateImage(prompt, options = {}) {
  const { width = 1024, height = 1024 } = options

  if (!process.env.GEMINI_API_KEY) {
    return {
      mock: true,
      imageUrl: null,
      message: 'API no configurada - usando imagen placeholder'
    }
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Genera una imagen profesional y colorida para redes sociales sobre: ${prompt}. Estilo: ilustración moderna, colores pastel (amarillo, verde menta, rosa, azul claro), estilo cálido y profesional, sin texto en la imagen.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
          responseModalities: ["image", "text"]
        }
      }
    )

    return {
      imageUrl: response.data.candidates?.[0]?.content?.parts?.[0]?.image?.url || null
    }
  } catch (error) {
    console.error('Error generating image:', error.message)
    return { error: error.message }
  }
}

export async function analyzeSentiment(text) {
  if (!process.env.GEMINI_API_KEY) {
    return { score: 50, label: 'neutral' }
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Analiza el sentimiento del siguiente texto y responde solo con un número del 0 al 100 (0=muy negativo, 100=muy positivo): "${text.substring(0, 500)}"`
          }]
        }]
      }
    )

    const scoreText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '50'
    const score = parseInt(scoreText.replace(/[^0-9]/g, '').substring(0, 3)) || 50

    return {
      score,
      label: score >= 70 ? 'positivo' : score >= 40 ? 'neutral' : 'negativo'
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error.message)
    return { score: 50, label: 'neutral' }
  }
}
