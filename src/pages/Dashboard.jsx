import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Instagram,
  Facebook,
  Calendar
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const metrics = [
  { label: 'Leads este mes', value: '47', change: '+23%', positive: true, icon: Users },
  { label: 'Alcance total', value: '12.4K', change: '+18%', positive: true, icon: Eye },
  { label: 'Engagement', value: '4.2K', change: '+12%', positive: true, icon: MessageCircle },
  { label: 'Citas agendadas', value: '28', change: '-5%', positive: false, icon: Calendar },
]

const weeklyData = [
  { name: 'Lun', leads: 12, engagement: 180 },
  { name: 'Mar', leads: 19, engagement: 250 },
  { name: 'Mié', leads: 15, engagement: 220 },
  { name: 'Jue', leads: 25, engagement: 310 },
  { name: 'Vie', leads: 32, engagement: 380 },
  { name: 'Sáb', leads: 18, engagement: 290 },
  { name: 'Dom', leads: 8, engagement: 120 },
]

const serviceDistribution = [
  { name: 'Fonoaudiología', value: 35, color: '#FFF9C4' },
  { name: 'Psicología', value: 28, color: '#C8E6C9' },
  { name: 'Psicomotricidad', value: 18, color: '#F8BBD9' },
  { name: 'Otros', value: 19, color: '#B3E5FC' },
]

const recentLeads = [
  { nombre: 'María González', servicio: 'Fonoaudiología', fecha: '2 min', estado: 'nuevo', sentiment: 85 },
  { nombre: 'Carlos Rodríguez', servicio: 'Psicología', fecha: '15 min', estado: 'contactado', sentiment: 72 },
  { nombre: 'Ana Martínez', servicio: 'Apoyo Escolar', fecha: '1 hora', estado: 'nuevo', sentiment: 90 },
  { nombre: 'Luis Pérez', servicio: 'Neuropsicología', fecha: '3 horas', estado: 'citado', sentiment: 65 },
]

const upcomingContent = [
  { plataforma: 'Instagram', tipo: 'Carousel', titulo: '5 señales de que tu hijo necesita fonoaudiología', fecha: 'Hoy', hora: '18:00' },
  { plataforma: 'Facebook', tipo: 'Post', titulo: 'Tips para manejar la ansiedad en niños', fecha: 'Mañana', hora: '10:00' },
  { plataforma: 'LinkedIn', tipo: 'Artículo', titulo: 'Inclusión educativa: derechos en Córdoba', fecha: '22 Mar', hora: '09:00' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
          Dashboard de Marketing
        </h1>
        <p className="text-creser-text-light">
          Resumen de las métricas de marketing de CreSer
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-creser-mint/30 to-creser-blue/30 flex items-center justify-center">
                <metric.icon className="w-6 h-6 text-creser-text" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-creser-text">{metric.value}</p>
            <p className="text-sm text-creser-text-light">{metric.label}</p>
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
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
            Rendimiento Semanal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8E6C9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C8E6C9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F8BBD9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F8BBD9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#C8E6C9" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
              <Area type="monotone" dataKey="engagement" stroke="#F8BBD9" fillOpacity={1} fill="url(#colorEngagement)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
            Leads por Servicio
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
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
          <div className="space-y-2 mt-4">
            {serviceDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-creser-text-light">{item.name}</span>
                </div>
                <span className="font-medium text-creser-text">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-creser-text">
              Leads Recientes
            </h3>
            <a href="/leads" className="text-sm text-creser-mint font-medium hover:underline">
              Ver todos
            </a>
          </div>
          <div className="space-y-4">
            {recentLeads.map((lead, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-creser-yellow to-creser-pink flex items-center justify-center text-sm font-bold text-creser-text">
                    {lead.nombre.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-creser-text">{lead.nombre}</p>
                    <p className="text-sm text-creser-text-light">{lead.servicio}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    lead.estado === 'nuevo' ? 'bg-green-100 text-green-700' :
                    lead.estado === 'contactado' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {lead.estado}
                  </span>
                  <p className="text-xs text-creser-text-light mt-1">{lead.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-creser-text">
              Contenido Programado
            </h3>
            <a href="/calendario" className="text-sm text-creser-mint font-medium hover:underline">
              Ver calendario
            </a>
          </div>
          <div className="space-y-4">
            {upcomingContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {content.plataforma === 'Instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                  {content.plataforma === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                  <div>
                    <p className="font-medium text-creser-text">{content.titulo}</p>
                    <p className="text-sm text-creser-text-light">{content.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-creser-text">{content.fecha}</p>
                  <p className="text-xs text-creser-text-light">{content.hora}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
