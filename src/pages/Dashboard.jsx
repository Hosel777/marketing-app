import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Eye,
  ArrowUpRight,
  RefreshCw,
  Calendar
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getLeads, getScheduledContent } from '../services/supabase'

const weeklyData = [
  { name: 'Lun', leads: 0, engagement: 0 },
  { name: 'Mar', leads: 0, engagement: 0 },
  { name: 'Mié', leads: 0, engagement: 0 },
  { name: 'Jue', leads: 0, engagement: 0 },
  { name: 'Vie', leads: 0, engagement: 0 },
  { name: 'Sáb', leads: 0, engagement: 0 },
  { name: 'Dom', leads: 0, engagement: 0 },
]

const serviceColors = {
  'Fonoaudiología': '#FFF9C4',
  'Psicología': '#C8E6C9',
  'Psicomotricidad': '#F8BBD9',
  'Evaluación Neuropsicológica': '#B3E5FC',
  'Inclusión Educativa': '#E1BEE7',
  'Apoyo Escolar': '#B2DFDB',
}

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [recentContent, setRecentContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    const [leadsRes, contentRes] = await Promise.all([
      getLeads(),
      getScheduledContent()
    ])
    setLeads(leadsRes.data || [])
    setRecentContent((contentRes.data || []).slice(0, 3))
    setLastUpdate(new Date())
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const nuevosLeads = leads.filter(l => l.estado === 'nuevo' || !l.estado).length
  const contactados = leads.filter(l => l.estado === 'contactado').length
  const citados = leads.filter(l => l.estado === 'citado').length
  const convertidos = leads.filter(l => l.estado === 'convertido').length

  const leadsByService = leads.reduce((acc, lead) => {
    const servicio = lead.servicio_interes || 'Otro'
    acc[servicio] = (acc[servicio] || 0) + 1
    return acc
  }, {})

  const serviceDistribution = Object.entries(leadsByService).map(([name, value]) => ({
    name,
    value,
    color: serviceColors[name] || '#E1BEE7'
  }))

  const leadsBySource = leads.reduce((acc, lead) => {
    const fuente = lead.fuente || 'web'
    acc[fuente] = (acc[fuente] || 0) + 1
    return acc
  }, {})

  const sourceData = Object.entries(leadsBySource).map(([name, value]) => ({ name, value }))

  const metrics = [
    { label: 'Total Leads', value: leads.length.toString(), change: '+23%', positive: true, icon: Users },
    { label: 'Leads Nuevos', value: nuevosLeads.toString(), change: '+18%', positive: true, icon: ArrowUpRight },
    { label: 'Contactados', value: contactados.toString(), change: '+12%', positive: true, icon: MessageCircle },
    { label: 'Convertidos', value: convertidos.toString(), change: '+5%', positive: true, icon: Eye },
  ]

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '¡Buen día!'
    if (hour < 20) return '¡Buenas tardes!'
    return '¡Buenas noches!'
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-creser-blue via-creser-mint to-creser-yellow p-8 md:p-12 rounded-[2rem] shadow-xl shadow-creser-mint/10 border border-white/50"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-creser-text mb-4 tracking-tight">
              {greeting()} <span className="text-white/80">Bienvenido a CreSer.</span>
            </h1>
            <p className="text-creser-text text-lg font-medium opacity-90 max-w-md">
              Tu centro de mando para el marketing terapéutico y gestión de pacientes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl text-creser-text font-bold shadow-lg hover:bg-white transition-all disabled:opacity-50 group active:scale-95"
            >
              <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
              Actualizar datos
            </button>
            <button 
              onClick={() => window.location.href = '/generador-contenido'}
              className="flex items-center gap-2 px-6 py-4 bg-creser-text text-white rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95"
            >
              <TrendingUp className="w-5 h-5" />
              Nuevo Contenido
            </button>
          </div>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[10%] w-96 h-96 bg-creser-pink/20 rounded-full blur-3xl" />
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white hover:shadow-xl hover:shadow-creser-mint/10 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-creser-mint/20 to-creser-blue/20`}>
                <metric.icon className="w-6 h-6 text-creser-text" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${metric.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {metric.change}
              </span>
            </div>
            <h4 className="text-3xl font-bold text-creser-text mb-1 tracking-tight">{metric.value}</h4>
            <p className="text-sm font-medium text-creser-text-light">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
            Distribución por Servicio
          </h3>
          {leads.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8E6C9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C8E6C9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="#C8E6C9" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-creser-text-light">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos aún</p>
                <p className="text-sm">Los leads aparecerán cuando alguien se registre</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
            Leads por Servicio
          </h3>
          {serviceDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {serviceDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-creser-text-light truncate">{item.name}</span>
                    </div>
                    <span className="font-medium text-creser-text">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-creser-text-light text-sm">
              Sin datos aún
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
            Leads Recientes
          </h3>
          {leads.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-creser-text text-sm">{lead.nombre}</p>
                    <p className="text-xs text-creser-text-light">{lead.servicio_interes || 'No especificado'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    lead.estado === 'nuevo' || !lead.estado ? 'bg-green-100 text-green-700' :
                    lead.estado === 'contactado' ? 'bg-yellow-100 text-yellow-700' :
                    lead.estado === 'convertido' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.estado || 'nuevo'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-creser-text-light text-sm">
              No hay leads aún
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
            Por Fuente
          </h3>
          {sourceData.length > 0 ? (
            <div className="space-y-3">
              {sourceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-creser-text">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-creser-mint rounded-full" 
                        style={{ width: `${(item.value / leads.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-creser-text w-8 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-creser-text-light text-sm">
              Sin datos aún
            </div>
          )}
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-xl font-semibold text-creser-text">
              Propuestas IA Recientes
            </h3>
            <button 
              onClick={() => window.location.href = '/calendario'}
              className="text-creser-mint text-sm font-semibold hover:underline"
            >
              Ver todo el historial →
            </button>
          </div>
          {recentContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentContent.map((content) => (
                <div key={content.id} className="group flex flex-col p-4 bg-gray-50 rounded-2xl hover:bg-creser-mint/5 transition-all border border-transparent hover:border-creser-mint/20 cursor-pointer">
                  <div className="aspect-square rounded-xl bg-gray-200 overflow-hidden mb-4 shadow-sm relative">
                    {content.imagen_url ? (
                      <img src={content.imagen_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-creser-violet/10">
                        <Calendar className="w-8 h-8 text-creser-violet/30" />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] uppercase font-bold text-creser-text shadow-sm">
                      {content.plataforma}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-creser-text text-sm mb-1 line-clamp-2">{content.titulo}</p>
                    <p className="text-xs text-creser-text-light">{content.servicio} • {content.tipo}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[10px] uppercase font-black text-creser-mint">{content.estado}</span>
                      <span className="text-[10px] text-gray-400">{new Date(content.created_at || content.creado_en).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-creser-text-light text-sm border-2 border-dashed border-gray-100 rounded-2xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
              Todavía no has generado contenido con IA
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
