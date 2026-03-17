import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wand2, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Copy, 
  Check,
  Download,
  Sparkles,
  Image,
  Video,
  FileText,
  RefreshCw,
  Loader2
} from 'lucide-react'

const contentTypes = [
  { id: 'carousel', label: 'Carousel', icon: FileText },
  { id: 'reel', label: 'Reel/TikTok', icon: Video },
  { id: 'post', label: 'Post', icon: Image },
  { id: 'story', label: 'Story', icon: Instagram },
]

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
]

const services = [
  'Fonoaudiología',
  'Psicología',
  'Psicomotricidad',
  'Evaluación Neuropsicológica',
  'Inclusión Educativa',
  'Apoyo Escolar',
]

const tones = [
  { id: 'profesional', label: 'Profesional' },
  { id: 'cálido', label: 'Cálido' },
  { id: 'educativo', label: 'Educativo' },
  { id: 'motivacional', label: 'Motivacional' },
]

const templatesByService = {
  'Fonoaudiología': {
    topics: [
      '5 señales de que tu hijo necesita fonoaudiología',
      'Juegos para estimular el lenguaje en casa',
      'Mitos y verdades sobre la terapia del habla',
      'Cómo ayudar a tu hijo a pronunciar la R',
      'Desarrollo del lenguaje por edades',
    ],
    hooks: [
      '¿Tu hijo tiene dificultades para expresarse?',
      '¿Sabías que el lenguaje se desarrolla principalmente entre los 0 y 5 años?',
      'No ignores estas señales del desarrollo del habla de tu hijo',
    ]
  },
  'Psicología': {
    topics: [
      'Cómo manejar la ansiedad en niños',
      'Señales de que tu hijo necesita terapia psicológica',
      'Mitos y realidades de la terapia psicológica',
      'Cómo hablar con tus hijos sobre sus emociones',
      'Estrategias para mejorar la comunicación familiar',
    ],
    hooks: [
      'La salud mental de tus hijos es igual de importante que la física',
      '¿Tu hijo está atravesando una situación difícil?',
      'No esperes a que sea tarde para buscar ayuda profesional',
    ]
  },
  'Psicomotricidad': {
    topics: [
      'Ejercicios de psicomotricidad fina en casa',
      'Cómo desarrollar la coordinación de tu hijo',
      'Juegos sensoriales para niños de 0 a 3 años',
      'La importancia del movimiento en el aprendizaje',
      'Señales de retrasos motores en niños',
    ],
    hooks: [
      'El movimiento es la puerta al aprendizaje',
      '¿Tu hijo tiene dificultades con la coordinación?',
      'A través del juego, los niños aprenden mejor',
    ]
  },
  'Evaluación Neuropsicológica': {
    topics: [
      'Qué esperar en una evaluación neuropsicológica',
      'Diferencia entre evaluación psicológica y neuropsicológica',
      'Cómo preparar a tu hijo para una evaluación',
      'Señales que indican la necesidad de una evaluación',
      'Qué evalúa una evaluación neuropsicológica',
    ],
    hooks: [
      'Conocer cómo funciona el cerebro de tu hijo puede cambiar su futuro',
      '¿Tu hijo tiene dificultades para aprender?',
      'Una evaluación neuropsicológica puede revelar el camino a seguir',
    ]
  },
  'Inclusión Educativa': {
    topics: [
      'Derechos de estudiantes con NEE en Córdoba',
      'Cómo pedir adaptaciones curriculares',
      'Rol de los maestros de apoyo en la escuela',
      'Inclusión educativa: qué dice la ley',
      'Cómo colaborar con la escuela de tu hijo',
    ],
    hooks: [
      'Todo niño tiene derecho a una educación inclusiva',
      '¿Sabías que tu hijo con NEE tiene derechos protegidos por ley?',
      'La inclusión educativa es un derecho, no un privilegio',
    ]
  },
  'Apoyo Escolar': {
    topics: [
      'Técnicas de estudio efectivas para primaria',
      'Cómo ayudar a tu hijo con las tareas',
      'Organización del tiempo de estudio',
      'Estrategias para mejorar la concentración',
      'Cómo preparar exámenes sin estrés',
    ],
    hooks: [
      'El éxito académico comienza con buena organización',
      '¿Tu hijo struggles con los estudios?',
      'Aprende a estudiar smarter, no harder',
    ]
  },
}

const hashtagsByService = {
  'Fonoaudiología': ['#Fonoaudiología', '#Lenguaje', '#DesarrolloInfantil', '#TerapiaInfantil', '#CreSer', '#Córdoba', '#Niños'],
  'Psicología': ['#Psicología', '#SaludMental', '#BienestarEmocional', '#TerapiaPsicológica', '#CreSer', '#Córdoba', '#Familia'],
  'Psicomotricidad': ['#Psicomotricidad', '#DesarrolloMotor', '#NiñosActivos', '#JuegoYAprendizaje', '#CreSer', '#Córdoba'],
  'Evaluación Neuropsicológica': ['#Neuropsicología', '#EvaluaciónCognitiva', '#Aprendizaje', '#CreSer', '#Córdoba', '#Educación'],
  'Inclusión Educativa': ['#InclusiónEducativa', '#NEET', '#DerechosEducativos', '#EscuelaInclusiva', '#CreSer', '#Córdoba'],
  'Apoyo Escolar': ['#ApoyoEscolar', '#Estudios', '#TécnicasDeEstudio', '#Organización', '#CreSer', '#Córdoba', '#Educación'],
}

export default function ContentGenerator() {
  const [formData, setFormData] = useState({
    contentType: 'post',
    platform: 'instagram',
    service: 'Fonoaudiología',
    tone: 'cálido',
    topic: '',
  })
  const [generating, setGenerating] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [generatedImage, setGeneratedImage] = useState(null)

  const handleGenerate = () => {
    setGenerating(true)
    
    setTimeout(() => {
      const serviceData = templatesByService[formData.service] || templatesByService['Fonoaudiología']
      const randomHook = serviceData.hooks[Math.floor(Math.random() * serviceData.hooks.length)]
      const hashtags = hashtagsByService[formData.service] || hashtagsByService['Fonoaudiología']
      
      let copy = ''
      
      if (formData.contentType === 'post') {
        copy = `${randomHook}\n\nEn CreSer, nuestro equipo interdisciplinario trabaja día a día para ayudar a niños y familias a alcanzar su máximo potencial en ${formData.service.toLowerCase()}.\n\n✨ Contamos con profesionales especializados\n✨ Modalidad presencial y online\n✨ Ambiente cálido y profesional\n\n💬 ¿Te gustaría más información? Escríbenos\n\n${hashtags.slice(0, 5).join(' ')}`
      } else if (formData.contentType === 'carousel') {
        copy = `📚 CAROUSEL: ${formData.topic || serviceData.topics[0]}\n\n1/5 ¿Qué es ${formData.service}?\n2/5 Señales de alerta\n3/5 Cómo podemos ayudar\n4/5 Casos de éxito\n5/5 Contáctanos\n\n${hashtags.slice(0, 4).join(' ')}`
      } else if (formData.contentType === 'reel') {
        copy = `🎬 ${randomHook}\n\n(sigue para más info)\n\n🐦 En CreSer ayudamos a familias como la tuya\n\n💬 DM para más información\n\n${hashtags.slice(0, 6).join(' ')}`
      } else {
        copy = `${randomHook}\n\n💬 Escríbenos para más info\n\n${hashtags.slice(0, 5).join(' ')}`
      }
      
      const content = {
        copy,
        hashtags,
        topic: formData.topic || serviceData.topics[0],
        service: formData.service,
        platform: formData.platform,
        type: formData.contentType,
        createdAt: new Date().toISOString()
      }
      
      setGeneratedContent(content)
      setGenerated(true)
      setGenerating(false)
    }, 2000)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateImage = async () => {
    if (!generatedContent) return
    
    setGeneratingImage(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${generatedContent.service} - ${generatedContent.topic}`,
          width: 1024,
          height: 1024
        })
      })
      
      const data = await response.json()
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setGeneratingImage(false)
    }
  }

  const handleDownloadImage = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `creser-${generatedContent?.service?.toLowerCase()}-${Date.now()}.png`
    link.click()
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-creser-text mb-2">
          Generador de Contenido
        </h1>
        <p className="text-creser-text-light">
          Crea contenido para redes sociales con plantillas profesionales
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-4"
        >
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
              Configuración
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">Tipo de contenido</label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, contentType: type.id })}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        formData.contentType === type.id
                          ? 'border-creser-mint bg-creser-mint/20 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className="w-5 h-5 mx-auto mb-1" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">Plataforma</label>
                <div className="flex gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setFormData({ ...formData, platform: platform.id })}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        formData.platform === platform.id
                          ? 'border-creser-mint bg-creser-mint/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <platform.icon className="w-5 h-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">Servicio</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint outline-none"
                >
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">Tono</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint outline-none"
                >
                  {tones.map((tone) => (
                    <option key={tone.id} value={tone.id}>{tone.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">Tema (opcional)</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint outline-none"
                >
                  <option value="">Aleatorio</option>
                  {(templatesByService[formData.service]?.topics || []).map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-4 bg-gradient-to-r from-creser-yellow via-creser-mint to-creser-pink rounded-xl font-semibold text-creser-text flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generar Contenido
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          {generated && generatedContent ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-creser-text">
                    Copy Generado
                  </h3>
                  <button
                    onClick={() => handleCopy(generatedContent.copy)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm text-creser-text">
                  {generatedContent.copy}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-creser-text">
                    Hashtags
                  </h3>
                  <button
                    onClick={() => handleCopy(generatedContent.hashtags.join(' '))}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-creser-mint/30 rounded-full text-sm text-creser-text">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {generatedImage && (
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg font-semibold text-creser-text">
                      Imagen Generada
                    </h3>
                    <button
                      onClick={handleDownloadImage}
                      className="flex items-center gap-2 px-4 py-2 bg-creser-mint rounded-lg text-sm font-medium hover:bg-creser-mint/80 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                  </div>
                  <img 
                    src={generatedImage} 
                    alt="Imagen generada" 
                    className="w-full rounded-xl"
                  />
                </div>
              )}

              <button
                onClick={handleGenerateImage}
                disabled={generatingImage || !generatedContent}
                className="w-full py-4 bg-gradient-to-r from-creser-pink via-creser-yellow to-creser-mint rounded-xl font-semibold text-creser-text flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {generatingImage ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando imagen...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    Generar Imagen con IA
                  </>
                )}
              </button>

              <div className="bg-gradient-to-r from-creser-yellow/50 to-creser-mint/50 rounded-2xl p-4 md:p-6">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-2">
                  📝 Tips para este contenido
                </h3>
                <ul className="text-sm text-creser-text space-y-1">
                  <li>• Publicar en horarios de mayor engagement (9am-11am o 7pm-9pm)</li>
                  <li>• Usar imagen de alta calidad (1080x1080 para feed)</li>
                  <li>• Responder todos los comentarios rápidamente</li>
                  <li>• Incluir call-to-action claro</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
              <Wand2 className="w-16 h-16 mx-auto mb-4 text-creser-mint" />
              <h3 className="font-heading text-xl font-semibold text-creser-text mb-2">
                Sin contenido generado
              </h3>
              <p className="text-creser-text-light">
                Configura las opciones y genera contenido automáticamente
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
