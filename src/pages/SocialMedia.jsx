import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Settings,
  MessageCircle,
  Video,
  Image,
  FileText
} from 'lucide-react'

const socialAccounts = [
  { 
    id: 'instagram', 
    nombre: '@equipocreser', 
    plataforma: 'Instagram', 
    icon: Instagram, 
    color: 'bg-pink-600',
    connected: true,
    seguidores: '2.847',
    publicaciones: 156,
    engagement: '4.2%'
  },
  { 
    id: 'facebook', 
    nombre: 'CreSer Córdoba', 
    plataforma: 'Facebook', 
    icon: Facebook, 
    color: 'bg-blue-600',
    connected: true,
    seguidores: '1.523',
    publicaciones: 89,
    engagement: '3.1%'
  },
  { 
    id: 'linkedin', 
    nombre: 'CreSer Equipo Interdisciplinario', 
    plataforma: 'LinkedIn', 
    icon: Linkedin, 
    color: 'bg-blue-700',
    connected: true,
    seguidores: '456',
    publicaciones: 34,
    engagement: '2.8%'
  },
  { 
    id: 'youtube', 
    nombre: 'Canal CreSer', 
    plataforma: 'YouTube', 
    icon: Youtube, 
    color: 'bg-red-600',
    connected: false,
    seguidores: '0',
    publicaciones: 0,
    engagement: '0%'
  },
]

const recentPosts = [
  { id: 1, plataforma: 'instagram', tipo: 'Carousel', titulo: '5 señales de que tu hijo necesita fonoaudiología', fecha: '2 horas', estado: 'publicado', metricas: { alcance: '8.2K', likes: 892, comentarios: 156 } },
  { id: 2, plataforma: 'facebook', tipo: 'Post', titulo: 'Tips para manejar la ansiedad en niños', fecha: '1 día', estado: 'publicado', metricas: { alcance: '3.4K', likes: 234, comentarios: 45 } },
  { id: 3, plataforma: 'instagram', tipo: 'Reel', titulo: 'Ejercicios de psicomotricidad en casa', fecha: '2 días', estado: 'publicado', metricas: { alcance: '12.1K', likes: 1.234, comentarios: 89 } },
  { id: 4, plataforma: 'linkedin', tipo: 'Artículo', titulo: 'Inclusión educativa: derechos en Córdoba', fecha: '3 días', estado: 'publicado', metricas: { alcance: '1.2K', likes: 89, comentarios: 12 } },
]

const autoPostSettings = {
  instagram: { autoPost: true, hashtags: true, stories: true },
  facebook: { autoPost: true, hashtags: false, stories: false },
  linkedin: { autoPost: false, hashtags: true, stories: false },
}

export default function SocialMedia() {
  const [settings, setSettings] = useState(autoPostSettings)

  const getIcon = (plataforma) => {
    switch(plataforma) {
      case 'instagram': return <Instagram className="w-4 h-4" />
      case 'facebook': return <Facebook className="w-4 h-4" />
      case 'linkedin': return <Linkedin className="w-4 h-4" />
      case 'youtube': return <Youtube className="w-4 h-4" />
      default: return <Image className="w-4 h-4" />
    }
  }

  const toggleSetting = (plataforma, setting) => {
    setSettings({
      ...settings,
      [plataforma]: {
        ...settings[plataforma],
        [setting]: !settings[plataforma][setting]
      }
    })
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
          Redes Sociales
        </h1>
        <p className="text-creser-text-light">
          Gestiona tus cuentas conectadas y configuraciones de publicación automática
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {socialAccounts.map((account) => (
          <div key={account.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${account.color} flex items-center justify-center`}>
                <account.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${account.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {account.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <h3 className="font-semibold text-creser-text mb-1">{account.nombre}</h3>
            <p className="text-sm text-creser-text-light mb-4">{account.plataforma}</p>
            
            {account.connected ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-creser-text">{account.seguidores}</p>
                    <p className="text-xs text-creser-text-light">Seguidores</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-creser-text">{account.publicaciones}</p>
                    <p className="text-xs text-creser-text-light">Posts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-creser-text">{account.engagement}</p>
                    <p className="text-xs text-creser-text-light">Engagement</p>
                  </div>
                </div>
                <button className="w-full py-2 border border-gray-200 rounded-xl text-sm font-medium text-creser-text hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurar
                </button>
              </>
            ) : (
              <button className="w-full py-2 bg-creser-mint rounded-xl text-sm font-medium text-creser-text hover:bg-creser-mint/80 transition-colors">
                Conectar
              </button>
            )}
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold text-creser-text">
              Configuración de Publicación Automática
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-creser-mint/30 rounded-lg text-sm font-medium text-creser-text hover:bg-creser-mint/50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </button>
          </div>

          <div className="space-y-6">
            {socialAccounts.filter(a => a.connected).map((account) => (
              <div key={account.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${account.color} flex items-center justify-center`}>
                      <account.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-creser-text">{account.nombre}</p>
                      <p className="text-xs text-creser-text-light">{account.plataforma}</p>
                    </div>
                  </div>
                  <a href="#" className="text-creser-mint text-sm font-medium hover:underline flex items-center gap-1">
                    Ver en {account.plataforma} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer">
                    <span className="text-sm text-creser-text">Auto-publicar</span>
                    <button 
                      onClick={() => toggleSetting(account.id, 'autoPost')}
                      className={`w-10 h-6 rounded-full transition-colors relative ${settings[account.id]?.autoPost ? 'bg-creser-mint' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[account.id]?.autoPost ? 'left-5' : 'left-1'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer">
                    <span className="text-sm text-creser-text">Hashtags</span>
                    <button 
                      onClick={() => toggleSetting(account.id, 'hashtags')}
                      className={`w-10 h-6 rounded-full transition-colors relative ${settings[account.id]?.hashtags ? 'bg-creser-mint' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[account.id]?.hashtags ? 'left-5' : 'left-1'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer">
                    <span className="text-sm text-creser-text">Stories</span>
                    <button 
                      onClick={() => toggleSetting(account.id, 'stories')}
                      className={`w-10 h-6 rounded-full transition-colors relative ${settings[account.id]?.stories ? 'bg-creser-mint' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[account.id]?.stories ? 'left-5' : 'left-1'}`} />
                    </button>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
              Publicaciones Recientes
            </h3>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    {getIcon(post.plataforma)}
                    <span className="text-xs text-creser-text-light">{post.tipo}</span>
                    <span className="text-xs text-creser-text-light">•</span>
                    <span className="text-xs text-creser-text-light">{post.fecha}</span>
                  </div>
                  <p className="text-sm font-medium text-creser-text mb-2">{post.titulo}</p>
                  <div className="flex gap-3 text-xs text-creser-text-light">
                    <span>📊 {post.metricas.alcance}</span>
                    <span>❤️ {post.metricas.likes}</span>
                    <span>💬 {post.metricas.comentarios}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-creser-yellow/50 to-creser-mint/50 rounded-2xl p-6">
            <h3 className="font-heading text-lg font-semibold text-creser-text mb-2">
              Integración con Meta
            </h3>
            <p className="text-sm text-creser-text-light mb-4">
              Conecta Meta Business Suite para publicación automática
            </p>
            <button className="w-full py-3 bg-white rounded-xl font-medium text-creser-text shadow-sm hover:shadow-md transition-shadow">
              Configurar Meta API
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
