import { useState, useEffect } from 'react'
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
  Loader2,
  Save,
  Database
} from 'lucide-react'
import { saveContentHistory } from '../services/supabase'

const puter = window.puter

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
  const [savingHistory, setSavingHistory] = useState(false)

  const handleSaveToHistory = async () => {
    if (!generatedContent) return
    setSavingHistory(true)
    try {
      const { error } = await saveContentHistory({
        titulo: generatedContent.topic || formData.topic,
        copy: generatedContent.copy,
        hashtags: generatedContent.hashtags,
        imagen_url: generatedImage,
        servicio: formData.service,
        tipo: formData.contentType,
        plataforma: formData.platform,
        estado: 'borrador'
      })
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      alert('¡Contenido guardado exitosamente! Puedes verlo en tu Dashboard o Calendario.')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error al conectar con la base de datos de CreSer. Intenta de nuevo.')
    } finally {
      setSavingHistory(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerated(false)

    try {
      const response = await fetch('/api/generar-contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: formData.contentType,
          servicio: formData.service,
          tono: formData.tone,
          topic: formData.topic,
          objetivo: 'engagement',
          generarImagen: false
        })
      })

      const data = await response.json()

      if (data.success && data.data) {
        setGeneratedContent({
          copy: data.data.copy,
          hashtags: data.data.hashtags || [],
          topic: data.data.topic,
          service: data.data.servicio,
          platform: formData.platform,
          type: formData.contentType,
          promptVisual: data.data.promptVisual,
          createdAt: new Date().toISOString()
        })
        setGenerated(true)

        if (data.data.imageUrl) {
          setGeneratedImage(data.data.imageUrl)
        }
      } else {
        alert('Error: ' + (data.error || data.message || 'Sin respuesta del servidor'))
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Error conectando con el servidor de IA. Verifica que las variables de entorno estén configuradas en Vercel.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fetchWithPollinationsRetry = async (url, retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Intento de imagen ${i + 1}/${retries}...`)
        // Cache-buster para evitar errores cacheados
        const finalUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`
        const res = await fetch(finalUrl)
        
        if (res.ok && res.headers.get('content-type')?.startsWith('image/')) {
          const blob = await res.blob()
          return URL.createObjectURL(blob)
        }
      } catch (err) {
        console.warn('Error en fetch de imagen:', err)
      }
      
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1500))
      }
    }
    throw new Error('Servidor ocupado')
  }

  const handleGenerateImage = async () => {
    if (!generatedContent) return
    setGeneratingImage(true)
    setGeneratedImage(null)

    const prompt = generatedContent.promptVisual || `${formData.service}: ${formData.topic || 'bienestar y salud'}. Professional high quality photo.`

    try {
      const response = await fetch('/api/generar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt,
          tipo: formData.contentType || 'post'
        })
      })

      const result = await response.json()

      if (result.success && result.imageUrl) {
        if (result.isFallback) {
          // Si es fallback de Pollinations, usamos nuestra lógica de reintentos
          const imageObjectUrl = await fetchWithPollinationsRetry(result.imageUrl)
          setGeneratedImage(imageObjectUrl)
        } else {
          // Si es base64 directo de HF
          setGeneratedImage(result.imageUrl)
        }
      } else {
        throw new Error('Error en API')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      // FALLBACK DIRECTO AL CLIENTE: Si llegamos aquí, nada funcionó.
      // Intentamos cargar Pollinations directamente desde el navegador.
      const directFallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', professional therapeutic illustration')}?width=1024&height=1024&nologo=true`
      setGeneratedImage(directFallbackUrl)
    } finally {
      setGeneratingImage(false)
    }
  }

  const handleGenerateVideo = async () => {
    if (!generatedContent) return

    setGeneratingImage(true)
    try {
      const response = await fetch('/api/generar-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${generatedContent.service}: ${generatedContent.topic}. Professional video clip, healthcare theme, children, warm colors`
        })
      })

      const data = await response.json()

      if (data.videoUrl) {
        setGeneratedImage(data.videoUrl)
      } else if (data.error) {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error generating video:', error)
      alert('Error al generar video')
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
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${formData.contentType === type.id
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
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${formData.platform === platform.id
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
                <label className="block text-sm font-medium text-creser-text mb-2">Tema (escribe el tuyo o elige uno)</label>
                <input
                  type="text"
                  list="topic-suggestions"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ej: Mindfulness para adultos, Terapia de pareja..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint outline-none"
                />
                <datalist id="topic-suggestions">
                  {(templatesByService[formData.service]?.topics || []).map((topic) => (
                    <option key={topic} value={topic} />
                  ))}
                </datalist>
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
              <button
                onClick={handleSaveToHistory}
                disabled={savingHistory || !generatedContent}
                className="w-full flex items-center justify-center gap-3 py-4 bg-creser-mint/20 border-2 border-dashed border-creser-mint/50 rounded-2xl text-creser-text font-bold hover:bg-creser-mint/30 transition-all group disabled:opacity-50"
              >
                {savingHistory ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                {savingHistory ? 'Guardando...' : 'Guardar en Historial de CreSer'}
              </button>
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
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = generatedImage
                        link.download = `cre-ser-${Date.now()}.png`
                        link.click()
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                      title="Descargar"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  {generatedImage.includes('.mp4') || generatedImage.includes('video') ? (
                    <video src={generatedImage} controls className="w-full rounded-xl shadow-inner bg-gray-50" />
                  ) : (
                    <img 
                      src={generatedImage} 
                      alt="Imagen generada" 
                      className="w-full rounded-xl shadow-inner bg-gray-50 object-cover"
                    />
                  )}
                  <p className="mt-4 text-xs text-gray-500 italic text-center">
                    * Imagen generada con IA para fines ilustrativos. 
                    Puedes descargarla o usarla como referencia.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !generatedContent}
                  className="py-4 bg-gradient-to-r from-creser-pink to-creser-yellow rounded-xl font-semibold text-creser-text flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {generatingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5" />
                      Imagen IA
                    </>
                  )}
                </button>

                <button
                  onClick={handleGenerateVideo}
                  disabled={generatingImage || !generatedContent}
                  className="py-4 bg-gradient-to-r from-creser-mint to-creser-pink rounded-xl font-semibold text-creser-text flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {generatingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Video IA
                    </>
                  )}
                </button>
              </div>

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
