import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Palette, 
  Key, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Camera,
  Check,
  ExternalLink
} from 'lucide-react'

const tabs = [
  { id: 'general', label: 'General', icon: User },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'apariencia', label: 'Apariencia', icon: Palette },
  { id: 'integraciones', label: 'Integraciones', icon: Key },
]

const integrations = [
  { 
    id: 'supabase', 
    nombre: 'Supabase', 
    descripcion: 'Base de datos para leads y usuarios',
    icon: '🗄️',
    connected: true 
  },
  { 
    id: 'whatsapp', 
    nombre: 'WhatsApp Business', 
    descripcion: 'Bot de captación y notificaciones',
    icon: '💬',
    connected: true 
  },
  { 
    id: 'meta', 
    nombre: 'Meta Business Suite', 
    descripcion: 'Publicación automática en Facebook e Instagram',
    icon: '📘',
    connected: false 
  },
  { 
    id: 'gemini', 
    nombre: 'Nano Banana 2 (Gemini)', 
    descripcion: 'Generación de contenido con IA',
    icon: '✨',
    connected: false 
  },
  { 
    id: 'n8n', 
    nombre: 'n8n', 
    descripcion: 'Automatizaciones y workflows',
    icon: '🔄',
    connected: false 
  },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const [institutionData, setInstitutionData] = useState({
    nombre: 'CreSer Equipo Interdisciplinario',
    email: 'equipocreser@equipocreser.com',
    telefono: '351-876-3956',
    direccion: 'Niceto Vega 1844, Barrio Patricios Oeste, Córdoba',
    instagram: '@equipocreser',
    facebook: 'cresercba',
    linkedin: 'CreSer Equipo Interdisciplinario',
    horarios: 'Lunes a Viernes: 8:00 a 20:00',
  })

  const [notifications, setNotifications] = useState({
    nuevosLeads: true,
    recordatoriosCitas: true,
    contenidoProgramado: true,
    analyticsSemanal: true,
    emailNotifications: true,
    pushNotifications: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
          Configuración
        </h1>
        <p className="text-creser-text-light">
          Administra la configuración de tu aplicación de marketing
        </p>
      </motion.div>

      <div className="flex gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 flex-shrink-0"
        >
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-creser-mint/30 text-creser-text font-semibold'
                    : 'text-creser-text-light hover:bg-gray-50 hover:text-creser-text'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
                  Información de la Institución
                </h3>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-creser-yellow via-creser-mint to-creser-pink flex items-center justify-center">
                    <span className="text-3xl">🐦</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-creser-text hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4" />
                    Cambiar logo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-creser-text mb-2">Nombre</label>
                    <input
                      type="text"
                      value={institutionData.nombre}
                      onChange={(e) => setInstitutionData({ ...institutionData, nombre: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-creser-text mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={institutionData.email}
                        onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-creser-text mb-2">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={institutionData.telefono}
                        onChange={(e) => setInstitutionData({ ...institutionData, telefono: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-creser-text mb-2">Dirección</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={institutionData.direccion}
                        onChange={(e) => setInstitutionData({ ...institutionData, direccion: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-creser-text mb-2">Horarios</label>
                    <input
                      type="text"
                      value={institutionData.horarios}
                      onChange={(e) => setInstitutionData({ ...institutionData, horarios: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
                  Redes Sociales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-creser-text mb-2">Instagram</label>
                    <input
                      type="text"
                      value={institutionData.instagram}
                      onChange={(e) => setInstitutionData({ ...institutionData, instagram: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-creser-text mb-2">Facebook</label>
                    <input
                      type="text"
                      value={institutionData.facebook}
                      onChange={(e) => setInstitutionData({ ...institutionData, facebook: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-creser-text mb-2">LinkedIn</label>
                    <input
                      type="text"
                      value={institutionData.linkedin}
                      onChange={(e) => setInstitutionData({ ...institutionData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-creser-mint text-creser-text font-semibold rounded-xl hover:bg-creser-mint/80 transition-colors"
              >
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? 'Guardado!' : 'Guardar cambios'}
              </button>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
                  Preferencias de Notificaciones
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'nuevosLeads', label: 'Nuevos leads', desc: 'Recibe una notificación cuando alguien complete un formulario' },
                    { key: 'recordatoriosCitas', label: 'Recordatorios de citas', desc: 'Notificaciones 24h antes de cada cita programada' },
                    { key: 'contenidoProgramado', label: 'Contenido programado', desc: 'Avisa cuando se publique contenido automáticamente' },
                    { key: 'analyticsSemanal', label: 'Reporte semanal', desc: 'Resumen semanal de métricas el setiap Domingo' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                      <div>
                        <p className="font-medium text-creser-text">{item.label}</p>
                        <p className="text-sm text-creser-text-light">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key] ? 'bg-creser-mint' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key] ? 'left-7' : 'left-1'}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-creser-mint text-creser-text font-semibold rounded-xl hover:bg-creser-mint/80 transition-colors"
              >
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? 'Guardado!' : 'Guardar cambios'}
              </button>
            </div>
          )}

          {activeTab === 'apariencia' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
                  Colores de Marca
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: 'Amarillo', color: '#FFF9C4' },
                    { name: 'Verde Menta', color: '#C8E6C9' },
                    { name: 'Rosa', color: '#F8BBD9' },
                    { name: 'Azul Claro', color: '#B3E5FC' },
                    { name: 'Violeta', color: '#E1BEE7' },
                  ].map((item) => (
                    <div key={item.name} className="text-center">
                      <div 
                        className="w-full h-16 rounded-xl mb-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-sm text-creser-text">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integraciones' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
                  Integraciones Conectadas
                </h3>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl">
                          {integration.icon}
                        </div>
                        <div>
                          <p className="font-medium text-creser-text">{integration.nombre}</p>
                          <p className="text-sm text-creser-text-light">{integration.descripcion}</p>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          integration.connected 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-creser-mint/30 text-creser-text hover:bg-creser-mint/50'
                        }`}
                      >
                        {integration.connected ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-4 h-4" /> Conectado
                          </span>
                        ) : (
                          'Conectar'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
