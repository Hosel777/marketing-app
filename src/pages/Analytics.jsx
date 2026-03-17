import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Users,
  ArrowUpRight,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const overviewMetrics = [
  { label: 'Alcance Total', value: '45.2K', change: '+23%', icon: Eye, positive: true },
  { label: 'Impresiones', value: '89.1K', change: '+18%', icon: Users, positive: true },
  { label: 'Engagement', value: '12.4K', change: '+31%', icon: Heart, positive: true },
  { label: 'Clics en Link', value: '1.847', change: '+12%', icon: ArrowUpRight, positive: true },
]

const reachData = [
  { name: 'Ene', instagram: 12000, facebook: 8000, linkedin: 3000 },
  { name: 'Feb', instagram: 15000, facebook: 9500, linkedin: 4000 },
  { name: 'Mar', instagram: 18000, facebook: 11000, linkedin: 5000 },
]

const topContent = [
  { titulo: '5 señales de que tu hijo necesita fonoaudiología', alcance: '8.2K', engagement: '4.5%', likes: 892, comentarios: 156 },
  { titulo: 'Tips para manejar la ansiedad en niños', alcance: '6.7K', engagement: '3.8%', likes: 654, comentarios: 89 },
  { titulo: 'Evaluación neuropsicológica: qué esperar', alcance: '5.9K', engagement: '3.2%', likes: 432, comentarios: 67 },
  { titulo: 'Inclusión educativa en Córdoba', alcance: '5.2K', engagement: '2.9%', likes: 387, comentarios: 45 },
]

const contentByService = [
  { name: 'Fonoaudiología', value: 35, color: '#FFF9C4' },
  { name: 'Psicología', value: 28, color: '#C8E6C9' },
  { name: 'Psicomotricidad', value: 18, color: '#F8BBD9' },
  { name: 'Neuropsicología', value: 12, color: '#B3E5FC' },
  { name: 'Otros', value: 7, color: '#E1BEE7' },
]

const conversionsByService = [
  { servicio: 'Fonoaudiología', leads: 45, citas: 18, conversion: '40%' },
  { servicio: 'Psicología', leads: 38, citas: 12, conversion: '32%' },
  { servicio: 'Apoyo Escolar', leads: 28, citas: 15, conversion: '54%' },
  { servicio: 'Neuropsicología', leads: 15, citas: 8, conversion: '53%' },
  { servicio: 'Psicomotricidad', leads: 12, citas: 6, conversion: '50%' },
]

export default function Analytics() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
          Analytics
        </h1>
        <p className="text-creser-text-light">
          Métricas y análisis de rendimiento de tus campañas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {overviewMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-creser-mint/30 to-creser-blue/30 flex items-center justify-center">
                <metric.icon className="w-6 h-6 text-creser-text" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
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
            Alcance por Plataforma
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reachData}>
              <defs>
                <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E1306C" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E1306C" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4267B2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4267B2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLinkedin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0077B5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0077B5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="instagram" stackId="1" stroke="#E1306C" fill="url(#colorInstagram)" />
              <Area type="monotone" dataKey="facebook" stackId="1" stroke="#4267B2" fill="url(#colorFacebook)" />
              <Area type="monotone" dataKey="linkedin" stackId="1" stroke="#0077B5" fill="url(#colorLinkedin)" />
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
            Contenido por Servicio
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={contentByService}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {contentByService.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {contentByService.map((item, index) => (
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
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
            Contenido con Mejor Rendimiento
          </h3>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-creser-text flex-1">{content.titulo}</p>
                  <span className="text-xs text-creser-text-light">#{index + 1}</span>
                </div>
                <div className="flex gap-4 text-sm text-creser-text-light">
                  <span>📊 {content.alcance}</span>
                  <span>❤️ {content.engagement}</span>
                  <span>💬 {content.comentarios}</span>
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
          <h3 className="font-heading text-lg font-semibold text-creser-text mb-6">
            Conversión por Servicio
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={conversionsByService} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
              <YAxis dataKey="servicio" type="category" stroke="#9CA3AF" fontSize={11} width={100} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="leads" fill="#C8E6C9" radius={[0, 4, 4, 0]} />
              <Bar dataKey="citas" fill="#F8BBD9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-creser-mint" />
              <span className="text-creser-text-light">Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-creser-pink" />
              <span className="text-creser-text-light">Citas</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
