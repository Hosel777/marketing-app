import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  Loader2,
  Calendar,
  Clock,
  Tag
} from 'lucide-react'
import { getScheduledContent } from '../services/supabase'

export default function MediaLibrary() {
  const [content, setContent] = useState([])
  const [filteredContent, setFilteredContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterService, setFilterService] = useState('todos')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data } = await getScheduledContent()
      // Filtramos solo los que tienen imagen
      const itemsWithMedia = (data || []).filter(item => item.imagen_url)
      setContent(itemsWithMedia)
      setFilteredContent(itemsWithMedia)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    let result = content

    if (searchTerm) {
      result = result.filter(item => 
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.copy?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterService !== 'todos') {
      result = result.filter(item => item.servicio === filterService)
    }

    setFilteredContent(result)
  }, [searchTerm, filterService, content])

  const services = ['todos', ...new Set(content.map(item => item.servicio).filter(Boolean))]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-heading text-3xl font-bold text-creser-text mb-2">
            Librería de Medios
          </h1>
          <p className="text-creser-text-light">
            Explora y descarga todas las creaciones generadas con IA para CreSer
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:border-creser-mint shadow-sm transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="pl-12 pr-8 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:border-creser-mint shadow-sm appearance-none cursor-pointer text-creser-text"
          >
            {services.map(service => (
              <option key={service} value={service}>
                {service === 'todos' ? 'Todos los servicios' : service}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-creser-mint mb-4" />
          <p className="text-creser-text-light">Cargando biblioteca...</p>
        </div>
      ) : filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img 
                  src={item.imagen_url} 
                  alt={item.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = item.imagen_url
                      link.download = `creser-${item.id}.png`
                      link.click()
                    }}
                    className="p-3 bg-white rounded-full text-creser-text hover:bg-creser-mint hover:text-white transition-colors"
                    title="Descargar"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-creser-mint text-creser-text rounded-md">
                    {item.plataforma}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                    {item.tipo}
                  </span>
                </div>
                <h3 className="font-bold text-creser-text line-clamp-2 mb-2 h-10">
                  {item.titulo}
                </h3>
                <div className="flex items-center gap-3 text-xs text-creser-text-light mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at || item.creado_en).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span className="truncate w-24">{item.servicio}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-creser-text mb-2">No se encontró contenido</h3>
          <p className="text-creser-text-light">Prueba ajustando los filtros o genera contenido nuevo.</p>
        </div>
      )}
    </div>
  )
}
