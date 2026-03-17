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
  RefreshCw
} from 'lucide-react'

const contentTypes = [
  { id: 'carousel', label: 'Carousel', icon: FileText, desc: 'Posts educativos en formato carrusel' },
  { id: 'reel', label: 'Reel/TikTok', icon: Video, desc: 'Videos cortos de 30-60 segundos' },
  { id: 'post', label: 'Post', icon: Image, desc: 'Imagen con copy para feed' },
  { id: 'story', label: 'Story', icon: Instagram, desc: 'Contenido efímero' },
]

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-600' },
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
  { id: 'profesional', label: 'Profesional', desc: 'Formal pero accesible' },
  { id: 'cálido', label: 'Cálido', desc: 'Empático y cercano' },
  { id: 'educativo', label: 'Educativo', desc: 'Informativo y claro' },
  { id: 'motivacional', label: 'Motivacional', desc: 'Inspirador y positivo' },
]

const generatedContent = {
  copy: `📣 ¿Tu hijo tiene dificultades para expresarse?

🗣️ La fonoaudiología puede ayudar a tu hijo a desarrollar sus habilidades comunicativas de manera divertida y efectiva.

✅ En CreSer, nuestros especialistas trabajan con:
• Niños con retrasos en el habla
• Dificultades de pronunciación
• Problemas de lenguaje

💡 ¿Sabías que el lenguaje se desarrolla principalmente entre los 0 y 5 años? No esperes más para buscar ayuda profesional.

📞 ¿Te gustaría una evaluación gratuita? Escríbenos por WhatsApp.

#Fonoaudiología #Lenguaje #DesarrolloInfantil #CreSer #Córdoba`,
  hashtags: ['#Fonoaudiología', '#Lenguaje', '#DesarrolloInfantil', '#CreSer', '#Córdoba', '#TerapiaInfantil', '#Niños'],
  suggestedPosts: [
    '5 señales de que tu hijo necesita fonoaudiología',
    'Juegos para estimular el lenguaje en casa',
    'Mitos y verdades sobre la terapia del habla',
    'Cómo ayudar a tu hijo a pronunciar la "R"',
  ]
}

export default function ContentGenerator() {
  const [formData, setFormData] = useState({
    contentType: 'post',
    platform: 'instagram',
    service: 'Fonoaudiología',
    tone: 'cálido',
    topic: '',
    generateImage: true,
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setGenerating(false)
    setGenerated(true)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
          Generador de Contenido con IA
        </h1>
        <p className="text-creser-text-light">
          Crea contenido para redes sociales automáticamente con Nano Banana 2
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
              Configuración
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">
                  Tipo de contenido
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, contentType: type.id })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.contentType === type.id
                          ? 'border-creser-mint bg-creser-mint/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className="w-5 h-5 mx-auto mb-1 text-creser-text" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">
                  Plataforma
                </label>
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
                <label className="block text-sm font-medium text-creser-text mb-2">
                  Servicio
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                >
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">
                  Tono
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setFormData({ ...formData, tone: tone.id })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.tone === tone.id
                          ? 'border-creser-mint bg-creser-mint/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{tone.label}</span>
                      <p className="text-xs text-creser-text-light">{tone.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-creser-text mb-2">
                  Tema específico (opcional)
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ej: ansiedad en exámenes"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="generateImage"
                  checked={formData.generateImage}
                  onChange={(e) => setFormData({ ...formData, generateImage: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-creser-mint focus:ring-creser-mint"
                />
                <label htmlFor="generateImage" className="text-sm text-creser-text">
                  Generar imagen con IA (Nano Banana 2)
                </label>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-4 bg-gradient-to-r from-creser-yellow via-creser-mint to-creser-pink rounded-xl font-semibold text-creser-text flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
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
          className="lg:col-span-2 space-y-6"
        >
          {generated ? (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-creser-text">
                  {generatedContent.copy}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-creser-text">
                    Hashtags Sugeridos
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

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
                  Imagen Generada
                </h3>
                <div className="bg-gradient-to-br from-creser-yellow via-creser-mint to-creser-pink rounded-xl p-8 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-16 h-16 mx-auto mb-4 text-creser-text/50" />
                    <p className="text-creser-text font-medium">Imagen representativa del tema</p>
                    <p className="text-sm text-creser-text-light">Próximamente: Integración con Nano Banana 2</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 py-3 bg-creser-mint/30 rounded-xl font-medium text-creser-text hover:bg-creser-mint/50 transition-colors">
                    Regenerar
                  </button>
                  <button className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-creser-text hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
                  Temas Sugeridos
                </h3>
                <div className="space-y-2">
                  {generatedContent.suggestedPosts.map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-creser-text">{post}</span>
                      <button 
                        onClick={() => {
                          setFormData({ ...formData, topic: post })
                          handleGenerate()
                        }}
                        className="px-3 py-1 bg-creser-yellow/50 rounded-lg text-sm font-medium hover:bg-creser-yellow/70 transition-colors"
                      >
                        Generar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <Wand2 className="w-16 h-16 mx-auto mb-4 text-creser-mint" />
              <h3 className="font-heading text-xl font-semibold text-creser-text mb-2">
                Sin contenido generado
              </h3>
              <p className="text-creser-text-light">
                Completa la configuración y genera contenido automáticamente con IA
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
