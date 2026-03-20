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
  const [accounts, setAccounts] = useState(socialAccounts)
  const [settings, setSettings] = useState(autoPostSettings)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleConnect = (id) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, connected: !acc.connected } : acc
    ))
  }

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      alert('Sincronización con Meta y TikTok completada con éxito.')
    }, 1500)
  }

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
              Redes Sociales
            </h1>
            <p className="text-creser-text-light font-medium">
              Gestiona tus cuentas conectadas y configuraciones de publicación automática
            </p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => window.location.href = '/configuracion'}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-creser-text shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Settings className="w-4 h-4" />
                API Settings
              </button>
              <button 
                onClick={() => window.location.href = '/generador-contenido'}
                className="flex items-center gap-2 px-5 py-3 bg-creser-text text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Crear Post
              </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-creser-mint/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${account.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <account.icon className="w-7 h-7 text-white" />
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold tracking-wider ${account.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {account.connected ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <h3 className="font-bold text-xl text-creser-text mb-1">{account.nombre}</h3>
            <p className="text-sm font-medium text-creser-text-light mb-6">{account.plataforma}</p>
            
            {account.connected ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-8 text-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                  <div>
                    <p className="text-lg font-bold text-creser-text">{account.seguidores}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Segs</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-creser-text">{account.publicaciones}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Posts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-creser-text">{account.engagement}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Eng</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleConnect(account.id)}
                  className="w-full py-4 border border-gray-200 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <X className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                  Desconectar
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleConnect(account.id)}
                className="w-full py-4 bg-creser-mint rounded-2xl text-sm font-bold text-creser-text hover:bg-creser-mint/80 shadow-lg shadow-creser-mint/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Conectar ahora
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
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-creser-mint/30 rounded-xl text-sm font-bold text-creser-text hover:bg-creser-mint/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </button>
          </div>

          <div className="space-y-6">
            {accounts.filter(a => a.connected).map((account) => (
              <div key={account.id} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${account.color} flex items-center justify-center shadow-md`}>
                      <account.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-creser-text">{account.nombre}</p>
                      <p className="text-xs font-medium text-creser-text-light">{account.plataforma}</p>
                    </div>
                  </div>
                  <a 
                    href={`https://instagram.com/${account.nombre.replace('@','')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-creser-mint text-sm font-bold hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    Ver perfil <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100/50">
                    <span className="text-sm font-medium text-creser-text">Auto-post</span>
                    <button 
                      onClick={() => toggleSetting(account.id, 'autoPost')}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings[account.id]?.autoPost ? 'bg-creser-mint' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[account.id]?.autoPost ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100/50">
                    <span className="text-sm font-medium text-creser-text">Hashtags</span>
                    <button 
                      onClick={() => toggleSetting(account.id, 'hashtags')}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings[account.id]?.hashtags ? 'bg-creser-mint' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[account.id]?.hashtags ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100/50">
                    <span className="text-sm font-medium text-creser-text">Stories</span>
                    <button 
                      onClick={() => toggleSetting(account.id, 'stories')}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings[account.id]?.stories ? 'bg-creser-mint' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[account.id]?.stories ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
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
                <div key={post.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-creser-mint/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        {getIcon(post.plataforma)}
                      </div>
                      <span className="text-xs font-bold text-creser-text-light uppercase tracking-wider">{post.tipo}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{post.fecha}</span>
                  </div>
                  <p className="text-sm font-bold text-creser-text mb-3 line-clamp-2">{post.titulo}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
                    <div className="flex gap-4 text-[11px] font-bold text-creser-text-light">
                      <span className="flex items-center gap-1">📊 {post.metricas.alcance}</span>
                      <span className="flex items-center gap-1 text-pink-500">❤️ {post.metricas.likes}</span>
                    </div>
                    <button className="text-[10px] font-bold text-creser-mint hover:underline flex items-center gap-1 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      VER POST <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-creser-violet/20 via-creser-mint/10 to-creser-blue/20 rounded-3xl p-8 border border-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-heading text-xl font-bold text-creser-text mb-2">
                Integración con Meta
              </h3>
              <p className="text-sm font-medium text-creser-text-light mb-6">
                Conecta Meta Business Suite para habilitar la publicación automática, ads y métricas en tiempo real.
              </p>
              <button 
                onClick={() => window.location.href = '/configuracion'}
                className="w-full py-4 bg-creser-text text-white rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Configurar Meta API
              </button>
            </div>
            {/* Background blob */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/40 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
