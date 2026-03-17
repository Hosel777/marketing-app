import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Phone,
  Mail,
  MessageCircle,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Smile,
  Meh,
  Frown
} from 'lucide-react'

const leads = [
  { id: 1, nombre: 'María González', email: 'maria.g@gmail.com', telefono: '351-876-3956', servicio: 'Fonoaudiología', fuente: 'Instagram', fecha: '2024-03-15', estado: 'nuevo', sentiment: 85, edad: 5, observaciones: 'Recomendada por amiga' },
  { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos.r@gmail.com', telefono: '351-123-4567', servicio: 'Psicología', fuente: 'WhatsApp', fecha: '2024-03-14', estado: 'contactado', sentiment: 72, edad: 8, observaciones: 'Interesado en terapia online' },
  { id: 3, nombre: 'Ana Martínez', email: 'ana.m@gmail.com', telefono: '351-987-6543', servicio: 'Apoyo Escolar', fuente: 'Facebook', fecha: '2024-03-14', estado: 'nuevo', sentiment: 90, edad: 10, observaciones: 'Necesita ayuda con matemáticas' },
  { id: 4, nombre: 'Luis Pérez', email: 'luis.p@gmail.com', telefono: '351-456-7890', servicio: 'Neuropsicología', fuente: 'Google', fecha: '2024-03-13', estado: 'citado', sentiment: 65, edad: 12, observaciones: 'Evaluación por problemas de aprendizaje' },
  { id: 5, nombre: 'Sofia Lima', email: 'sofia.l@gmail.com', telefono: '351-321-0987', servicio: 'Psicomotricidad', fuente: 'Instagram', fecha: '2024-03-13', estado: 'convertido', sentiment: 95, edad: 4, observaciones: 'Ya tiene 3 sesiones programadas' },
  { id: 6, nombre: 'Javier Torres', email: 'javier.t@gmail.com', telefono: '351-654-3210', servicio: 'Psicología', fuente: 'Referido', fecha: '2024-03-12', estado: 'perdido', sentiment: 30, edad: 35, observaciones: 'No respondió al seguimiento' },
  { id: 7, nombre: 'Carolina Ruiz', email: 'carolina.r@gmail.com', telefono: '351-789-0123', servicio: 'Fonoaudiología', fuente: 'WhatsApp', fecha: '2024-03-12', estado: 'nuevo', sentiment: 88, edad: 6, observaciones: 'Primera vez que consulta' },
  { id: 8, nombre: 'Martín Díaz', email: 'martin.d@gmail.com', telefono: '351-234-5678', servicio: 'Inclusión Educativa', fuente: 'Facebook', fecha: '2024-03-11', estado: 'contactado', sentiment: 75, edad: 9, observaciones: 'Necesita apoyo escolar' },
]

const filters = {
  servicios: ['Todos', 'Fonoaudiología', 'Psicología', 'Psicomotricidad', 'Neuropsicología', 'Inclusión Educativa', 'Apoyo Escolar'],
  estados: ['Todos', 'nuevo', 'contactado', 'citado', 'convertido', 'perdido'],
  fuentes: ['Todos', 'Instagram', 'Facebook', 'WhatsApp', 'Google', 'Referido'],
}

const stats = [
  { label: 'Total Leads', value: '247', icon: Users, color: 'bg-creser-mint' },
  { label: 'Nuevos (7 días)', value: '47', icon: TrendingUp, color: 'bg-creser-yellow' },
  { label: 'Contactados', value: '89', icon: Phone, color: 'bg-creser-blue' },
  { label: 'Convertidos', value: '28', icon: CheckCircle, color: 'bg-creser-pink' },
]

export default function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterServicio, setFilterServicio] = useState('Todos')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [filterFuente, setFilterFuente] = useState('Todos')
  const [selectedLeads, setSelectedLeads] = useState([])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesServicio = filterServicio === 'Todos' || lead.servicio === filterServicio
    const matchesEstado = filterEstado === 'Todos' || lead.estado === filterEstado
    const matchesFuente = filterFuente === 'Todos' || lead.fuente === filterFuente
    return matchesSearch && matchesServicio && matchesEstado && matchesFuente
  })

  const getSentimentIcon = (score) => {
    if (score >= 70) return <Smile className="w-4 h-4 text-green-600" />
    if (score >= 40) return <Meh className="w-4 h-4 text-yellow-600" />
    return <Frown className="w-4 h-4 text-red-600" />
  }

  const getSentimentColor = (score) => {
    if (score >= 70) return 'bg-green-100'
    if (score >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'nuevo': return 'bg-green-100 text-green-700'
      case 'contactado': return 'bg-yellow-100 text-yellow-700'
      case 'citado': return 'bg-blue-100 text-blue-700'
      case 'convertido': return 'bg-purple-100 text-purple-700'
      case 'perdido': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
            Gestión de Leads
          </h1>
          <p className="text-creser-text-light">
            Administra y haz seguimiento de tus prospectos
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-creser-mint text-creser-text font-semibold rounded-xl hover:bg-creser-mint/80 transition-colors">
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-creser-text" />
              </div>
            </div>
            <p className="text-2xl font-bold text-creser-text">{stat.value}</p>
            <p className="text-sm text-creser-text-light">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint focus:ring-2 focus:ring-creser-mint/20 outline-none"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <select
                value={filterServicio}
                onChange={(e) => setFilterServicio(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint outline-none"
              >
                {filters.servicios.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint outline-none"
              >
                {filters.estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
              </select>
              <select
                value={filterFuente}
                onChange={(e) => setFilterFuente(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-creser-mint outline-none"
              >
                {filters.fuentes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-creser-text">Lead</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-creser-text">Servicio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-creser-text">Fuente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-creser-text">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-creser-text">Sentimiento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-creser-text">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-creser-text">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-creser-text">{lead.nombre}</p>
                      <p className="text-sm text-creser-text-light">{lead.email}</p>
                      <p className="text-xs text-creser-text-light">Edad: {lead.edad} años</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-creser-mint/30 rounded-full text-sm text-creser-text">
                      {lead.servicio}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-creser-text-light">
                    {lead.fuente}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(lead.estado)}`}>
                      {lead.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-lg ${getSentimentColor(lead.sentiment)} flex items-center gap-1`}>
                        {getSentimentIcon(lead.sentiment)}
                        <span className="text-sm font-medium">{lead.sentiment}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-creser-text-light">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lead.fecha}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="WhatsApp">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Email">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Llamar">
                        <Phone className="w-4 h-4 text-creser-text" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-creser-text-light" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-100">
          <p className="text-sm text-creser-text-light">
            Mostrando {filteredLeads.length} de {leads.length} leads
          </p>
        </div>
      </motion.div>
    </div>
  )
}
