import { useState, useEffect } from 'react'
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
  ExternalLink,
  Loader2
} from 'lucide-react'
import { getSettings, updateSetting } from '../services/supabase'

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
  const [loading, setLoading] = useState(true)
  const [logoPreview, setLogoPreview] = useState(null)

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const [institutionData, setInstitutionData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    horarios: '',
  })

  const [integrationsData, setIntegrationsData] = useState({
    supabase: { key: '', webhook: '' },
    whatsapp: { key: '', webhook: '' },
    meta: { key: '', webhook: '' },
    gemini: { key: '', webhook: '' },
    n8n: { key: '', webhook: '' },
  })

  const [notifications, setNotifications] = useState({
    nuevosLeads: true,
    recordatoriosCitas: true,
    contenidoProgramado: true,
    analyticsSemanal: true,
    emailNotifications: true,
    pushNotifications: true,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await getSettings()
      if (data) {
        if (data.institution) setInstitutionData(JSON.parse(data.institution))
        if (data.notifications) setNotifications(JSON.parse(data.notifications))
        if (data.integrations) setIntegrationsData(JSON.parse(data.integrations))
        if (data.logo) setLogoPreview(data.logo)
      }
    } catch (e) {
      console.error('Error fetching settings:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    setSaved(false)
    setLoading(true)
    try {
      const results = await Promise.all([
        updateSetting('institution', JSON.stringify(institutionData)),
        updateSetting('notifications', JSON.stringify(notifications)),
        updateSetting('integrations', JSON.stringify(integrationsData)),
        updateSetting('logo', logoPreview || '')
      ])
      
      const hasError = results.some(r => r.error)
      if (hasError) {
        const errors = results.filter(r => r.error).map(r => r.error.message).join('\n')
        alert('Error(s) de Supabase:\n' + errors)
      } else {
        setSaved(true)
      }
    } catch (e) {
      console.error('Error general at saving settings:', e)
      alert('Error en la conexión. Revisa la consola.')
    }
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-heading text-3xl font-bold text-creser-text mb-2 flex items-center gap-3">
            Configuración
            {loading && <Loader2 className="w-6 h-6 animate-spin text-creser-mint" />}
          </h1>
          <p className="text-creser-text-light">
            Administra la configuración de tu aplicación de marketing
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 flex-shrink-0"
        >
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all whitespace-nowrap min-w-fit md:w-full ${
                  activeTab === tab.id
                    ? 'bg-creser-mint text-creser-text font-bold shadow-lg shadow-creser-mint/10 border border-creser-mint/20'
                    : 'bg-white border border-gray-100 text-creser-text-light hover:bg-gray-50 hover:text-creser-text'
                }`}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 w-full min-w-0"
        >
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
                  Información de la Institución
                </h3>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-creser-yellow via-creser-mint to-creser-pink flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🐦</span>
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-creser-text hover:bg-gray-50 transition-colors cursor-pointer">
                    <Camera className="w-4 h-4" />
                    Cambiar logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
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
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <h3 className="font-heading text-xl font-bold text-creser-text mb-8">
                  Integraciones del Ecosistema
                </h3>
                <div className="space-y-6">
                  {integrations.map((integration) => {
                    const isConnected = integrationsData[integration.id]?.webhook || integrationsData[integration.id]?.key
                    return (
                      <div key={integration.id} className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 transition-all">
                        <div className="flex items-center justify-between mb-0">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-gray-50">
                              {integration.icon}
                            </div>
                            <div>
                              <p className="font-bold text-creser-text">{integration.nombre}</p>
                              <p className="text-xs font-medium text-creser-text-light">{integration.descripcion}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const current = document.getElementById(`config-${integration.id}`)
                              current.classList.toggle('hidden')
                            }}
                            className={`px-6 py-2.5 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-95 ${
                              isConnected 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-creser-mint text-creser-text hover:bg-creser-mint/80'
                            }`}
                          >
                            {isConnected ? 'Configurar' : 'Conectar'}
                          </button>
                        </div>
                        
                        <div id={`config-${integration.id}`} className="mt-6 pt-6 border-t border-gray-200/50 hidden">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 px-1">Clave API / Token</label>
                              <input 
                                type="password"
                                placeholder="sk-..."
                                value={integrationsData[integration.id]?.key || ''}
                                onChange={(e) => setIntegrationsData({
                                  ...integrationsData,
                                  [integration.id]: { ...integrationsData[integration.id], key: e.target.value }
                                })}
                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-creser-mint transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 px-1">Webhook URL (n8n)</label>
                              <input 
                                type="text"
                                placeholder="https://n8n.tudominio.com/..."
                                value={integrationsData[integration.id]?.webhook || ''}
                                onChange={(e) => setIntegrationsData({
                                  ...integrationsData,
                                  [integration.id]: { ...integrationsData[integration.id], webhook: e.target.value }
                                })}
                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-creser-mint transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-creser-text to-gray-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Key className="w-5 h-5 text-creser-mint" /> Hub de Automatización
                  </h3>
                  <p className="text-sm opacity-80 mb-6 max-w-md font-medium">
                    Centraliza tus credenciales para que el generador distribuya contenido automáticamente a todas tus plataformas.
                  </p>
                  <button 
                    onClick={handleSave}
                    className="px-8 py-4 bg-creser-mint text-creser-text font-bold rounded-2xl hover:bg-white transition-all active:scale-95 shadow-lg"
                  >
                    Guardar Todas las Credenciales
                  </button>
                </div>
                <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-creser-mint/10 rounded-full blur-3xl" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
