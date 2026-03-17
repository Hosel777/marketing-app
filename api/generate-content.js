import axios from 'axios'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tipo = 'post', servicio = 'Fonoaudiología', tono = 'cálido' } = req.body || {}

  const toneInstructions = {
    'profesional': 'Formal pero accesible',
    'cálido': 'Empático y cercano',
    'educativo': 'Informativo y claro',
    'motivacional': 'Inspirador y positivo'
  }

  const serviceContext = {
    'Fonoaudiología': 'desarrollo del lenguaje y comunicación en niños',
    'Psicología': 'salud mental y bienestar emocional',
    'Psicomotricidad': 'desarrollo motor y coordinación',
    'Evaluación Neuropsicológica': 'evaluaciones cognitivas y de aprendizaje',
    'Inclusión Educativa': 'apoyo a estudiantes con NEE',
    'Apoyo Escolar': 'refuerzo académico'
  }

  const tone = toneInstructions[tono] || toneInstructions['cálido']
  const context = serviceContext[servicio] || serviceContext['Fonoaudiología']

  const prompt = `Eres un experto en marketing para centros terapéuticos-educativos en Córdoba, Argentina. 
Genera un ${tipo} para Instagram sobre ${servicio} (${context}).
Tono: ${tone}
Incluye: gancho emocional, problema común, cómo CreSer puede ayudar, CTA, emojis y hashtags en español.
Máximo 200 palabras.`

  try {
    const response = await axios.post(
      'https://api.puter.ai/v1/ai/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Eres un experto en marketing para centros terapéuticos. Generates contenido en español argentino.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    )

    const text = response.data?.choices?.[0]?.message?.content || ''
    
    const hashtags = text.match(/#[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]+/g) || [
      `#${servicio.replace(' ', '')}`, '#CreSer', '#Córdoba', '#Argentina', '#TerapiaInfantil'
    ]

    return res.status(200).json({
      success: true,
      content: {
        copy: text.replace(/^.*?(?=\n|$)/s, '').trim() || text,
        hashtags: [...new Set(hashtags)].slice(0, 10),
        topic: `Contenido sobre ${servicio}`,
        service: servicio
      }
    })
  } catch (error) {
    console.error('Puter AI error:', error.message)
    return generateLocalContent(servicio, tipo)
  }
}

function generateLocalContent(servicio, tipo) {
  const templates = {
    post: {
      hooks: [
        '¿Sabías que la atención temprana puede marcar la diferencia en el desarrollo de tu hijo?',
        '¿Tu hijo tiene dificultades para expresarse?',
        'No ignores las señales que pueden indicar que tu hijo necesita ayuda profesional'
      ]
    }
  }

  const randomHook = templates.post.hooks[Math.floor(Math.random() * templates.post.hooks.length)]
  const serviceName = servicio

  const copy = `${randomHook}

En CreSer, centro terapéutico-educativo interdisciplinario en Córdoba, Argentina, entendemos estas preocupaciones. Nuestro equipo de ${serviceName} trabaja día a día para ayudar a niños y familias a alcanzar su máximo potencial.

✨ Modalidad presencial y online
✨ Ambiente cálido y profesional
✨ Equipo interdisciplinario especializado

💬 ¿Te gustaría más información? Escríbenos y te asesoramos sin compromiso.

#${serviceName.replace(' ', '')} #CreSer #Córdoba #Argentina #TerapiaInfantil #DesarrolloInfantil #Familia #Niños`

  return {
    success: true,
    content: {
      copy,
      hashtags: [`#${serviceName.replace(' ', '')}`, '#CreSer', '#Córdoba', '#Argentina', '#TerapiaInfantil', '#DesarrolloInfantil'],
      topic: `Información sobre ${serviceName}`,
      service: servicio
    }
  }
}
