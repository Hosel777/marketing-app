import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Download, 
  MoreVertical,
  Phone,
  Mail,
  MessageCircle,
  TrendingUp,
  Users,
  Clock,
  RefreshCw
} from 'lucide-react'
import { getLeads } from '../services/supabase'

const filters = {
  servicios: ['Todos', 'Fonoaudiología', 'Psicología', 'Psicomotricidad', 'Evaluación Neuropsicológica', 'Inclusión Educativa', 'Apoyo Escolar'],
  estados: ['Todos', 'nuevo', 'contactado', 'citado', 'convertido', 'perdido'],
  fuentes: ['Todos', 'Instagram', 'Facebook', 'WhatsApp', 'Google', 'Referido'],
}

export default function LeadManagement() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterServicio, setFilterServicio] = useState('Todos')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [filterFuente, setFilterFuente] = useState('Todos')

  const fetchLeads = async () => {
    setLoading(true)
    const { data } = await getLeads()
    setLeads(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesServicio = filterServicio === 'Todos' || lead.servicio_interes === filterServicio
    const matchesEstado = filterEstado === 'Todos' || lead.estado === filterEstado
    const matchesFuente = filterFuente === 'Todos' || lead.fuente === filterFuente
    return matchesSearch && matchesServicio && matchesEstado && matchesFuente
  })

  const stats = [
    { label: 'Total Leads', value: leads.length.toString(), icon: Users, color: 'bg-creser-mint' },
    { label: 'Nuevos (7 días)', value: leads.filter(l => l.estado === 'nuevo').length.toString(), icon: TrendingUp, color: 'bg-creser-yellow' },
    { label: 'Contactados', value: leads.filter(l => l.estado === 'contactado').length.toString(), icon: Phone, color: 'bg-creser-blue' },
    { label: 'Convertidos', value: leads.filter(l => l.estado === 'convertido').length.toString(), icon: Users, color: 'bg-creser-pink' },
  ]

  const handleUpdateStatus = (id, newStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...acc, estado: newStatus } : l))
    alert(`Estado del lead actualizado a: ${newStatus}`)
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Nombre", "Email", "Servicio", "Estado"].join(",") + "\n"
      + filteredLeads.map(l => [l.nombre, l.email, l.servicio_interes, l.estado].join(",")).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `leads-creser-${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
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

  const getSentimentColor = (score) => {
    if (score >= 70) return 'bg-green-100'
    if (score >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
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
          <p className="text-creser-text-light font-medium">
            Administra y haz seguimiento de tus prospectos en tiempo real
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-creser-text shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button 
            onClick={fetchLeads}
            className="flex items-center gap-2 px-5 py-3 bg-creser-mint text-creser-text font-bold rounded-2xl shadow-lg shadow-creser-mint/20 hover:bg-creser-mint/80 transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-creser-text" />
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

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-creser-mint" />
            <p className="mt-4 text-creser-text-light">Cargando leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-creser-text-light">No hay leads aún</p>
            <p className="text-sm text-creser-text-light mt-1">Los leads aparecerán cuando alguien complete un formulario</p>
          </div>
        ) : (
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
                        <p className="text-xs text-creser-text-light">Edad: {lead.edad_paciente || '-'} años</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-creser-mint/30 rounded-full text-sm text-creser-text">
                        {lead.servicio_interes || 'No especificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-creser-text-light">
                      {lead.fuente || 'web'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.estado || 'nuevo'}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border-none outline-none cursor-pointer transition-all ${getEstadoColor(lead.estado)}`}
                      >
                        {filters.estados.filter(e => e !== 'Todos').map(st => (
                          <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`px-3 py-1.5 rounded-xl ${getSentimentColor(lead.sentiment_score)} flex items-center justify-center gap-1 w-fit shadow-sm border border-white`}>
                        <span className="text-xs font-bold text-creser-text">{lead.sentiment_score || 50}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-creser-text-light font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-AR') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a href={`tel:${lead.telefono}`} className="p-2.5 bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Llamar">
                          <Phone className="w-4 h-4 text-creser-text" />
                        </a>
                        <a href={`mailto:${lead.email}`} className="p-2.5 bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Email">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </a>
                        <a href={`https://wa.me/${lead.telefono?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md rounded-xl transition-all" title="WhatsApp">
                          <MessageCircle className="w-4 h-4 text-green-600" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-6 border-t border-gray-100">
          <p className="text-sm text-creser-text-light">
            Mostrando {filteredLeads.length} de {leads.length} leads
          </p>
        </div>
      </motion.div>
    </div>
  )
}
