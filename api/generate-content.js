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

  const contentTemplates = {
    post: {
      hooks: [
        '¿Sabías que la atención temprana puede marcar la diferencia en el desarrollo de tu hijo?',
        '¿Tu hijo tiene dificultades para expresarse o comunicarse?',
        'No ignores las señales que pueden indicar que tu hijo necesita ayuda profesional',
        'La salud emocional de tus hijos es igual de importante que la física'
      ],
      problems: [
        'Muchos padres no reconocen las señales de alerta en el desarrollo de sus hijos',
        'Es común que los niños presenten dificultades que no sabemos cómo abordar',
        'Las familias frecuentemente buscan ayuda cuando ya ha pasado tiempo valioso'
      ],
      solutions: [
        'En CreSer Evaluamos y acompañamos a cada niño de manera personalizada',
        'Nuestro equipo interdisciplinario trabaja en conjunto para dar la mejor atención',
        'Contamos con profesionales especializados en cada área'
      ]
    }
  }

  const templates = contentTemplates.post
  const randomHook = templates.hooks[Math.floor(Math.random() * templates.hooks.length)]
  const randomProblem = templates.problems[Math.floor(Math.random() * templates.problems.length)]
  const randomSolution = templates.solutions[Math.floor(Math.random() * templates.solutions.length)]

  let copy = ''
  const serviceName = servicio
  const tone = toneInstructions[tono] || toneInstructions['cálido']
  const context = serviceContext[servicio] || serviceContext['Fonoaudiología']

  if (tipo === 'post') {
    copy = `${randomHook}

${randomProblem}

En CreSer, centro terapéutico-educativo interdisciplinario en Córdoba, Argentina, entendemos estas preocupaciones. Nuestro equipo de ${serviceName} trabaja día a día para ayudar a niños y familias a alcanzar su máximo potencial.

${randomSolution}

✨ Modalidad presencial y online
✨ Ambiente cálido y profesional
✨ Equipo interdisciplinario especializado

💬 ¿Te gustaría más información? Escríbenos y te asesoramos sin compromiso.

#${serviceName.replace(' ', '')} #CreSer #Córdoba #Argentina #TerapiaInfantil #DesarrolloInfantil #Familia #Niños #Salud #Educación`
  } else if (tipo === 'carousel') {
    copy = `📚 CAROUSEL: Todo sobre ${serviceName}

1/5 ¿Qué es ${serviceName}?
Es una disciplina que ayuda al desarrollo integral de los niños

2/5 Señales de alerta
- Retrasos en el desarrollo
- Dificultades de comunicación
- Problemas de comportamiento

3/5 ¿Cómo podemos ayudar?
Evaluación integral y tratamiento personalizado

4/5 Nuestro enfoque
Trabajo en equipo con profesionales de diferentes áreas

5/5 Contáctanos
Estamos para ayudarte

#${serviceName.replace(' ', '')} #CreSer #Córdoba #Aprendizaje #Educación`
  } else if (tipo === 'reel') {
    copy = `🎬 ${randomHook}

(sigue para más info)

🐦 En CreSer entendemos las preocupaciones de los padres

💡 Nuestro equipo interdisciplinario está para ayudarte

📱 Escríbenos por DM para más información

#${serviceName.replace(' ', '')} #CreSer #Parenting #Córdoba #Argentina #TerapiaInfantil`
  } else {
    copy = `${randomHook}

💬 Escríbenos para más información

#${serviceName.replace(' ', '')} #CreSer #Córdoba`
  }

  const hashtags = [
    `#${serviceName.replace(' ', '')}`,
    '#CreSer',
    '#Córdoba',
    '#Argentina',
    '#TerapiaInfantil',
    '#DesarrolloInfantil',
    '#Familia',
    '#Niños',
    '#Educación'
  ]

  return res.status(200).json({
    success: true,
    content: {
      copy,
      hashtags,
      topic: `Información sobre ${serviceName}`,
      service: servicio
    }
  })
}
