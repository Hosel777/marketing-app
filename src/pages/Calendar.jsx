import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Instagram, 
  Facebook, 
  Linkedin,
  Youtube,
  Image,
  Video,
  FileText,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  Calendar as CalendarIcon
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { getScheduledContent } from '../services/supabase'

const suggestedEvents = [
  { fecha: '2024-03-02', titulo: 'Día Mundial del Autismo', tipo: 'conciencia' },
  { fecha: '2024-03-21', titulo: 'Día del Psicólogo (Argentina)', tipo: 'celebración' },
  { fecha: '2024-03-21', titulo: 'Inicio de otoño', tipo: 'estacional' },
  { fecha: '2024-04-02', titulo: 'Día Mundial de la Concienciación sobre el Autismo', tipo: 'conciencia' },
  { fecha: '2024-04-22', titulo: 'Día de la Tierra', tipo: 'estacional' },
  { fecha: '2024-04-23', titulo: 'Día del Libro', tipo: 'educativo' },
]

const getPlataformaIcon = (plataforma) => {
  switch(plataforma) {
    case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />
    case 'facebook': return <Facebook className="w-4 h-4 text-blue-600" />
    case 'linkedin': return <Linkedin className="w-4 h-4 text-blue-700" />
    case 'youtube': return <Youtube className="w-4 h-4 text-red-600" />
    default: return <Image className="w-4 h-4 text-gray-600" />
  }
}

const getTipoIcon = (tipo) => {
  switch(tipo) {
    case 'Reel': return <Video className="w-4 h-4" />
    case 'Carousel': return <FileText className="w-4 h-4" />
    case 'Post': return <Image className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [view, setView] = useState('month')
  const [scheduledContent, setScheduledContent] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const { data } = await getScheduledContent()
    // Normalizamos los datos de Supabase para que coincidan con la UI
    const normalizedData = (data || []).map(item => ({
      ...item,
      fecha: item.fecha_publicacion || item.fecha || format(new Date(item.created_at || item.creado_en), 'yyyy-MM-dd'),
      titulo: item.titulo,
      plataforma: item.plataforma || 'instagram',
      tipo: item.tipo || 'Post',
      estado: item.estado || 'borrador'
    }))
    setScheduledContent(normalizedData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = monthStart.getDay()
  const emptyDays = Array(startDay).fill(null)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const getContentForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return scheduledContent.filter(content => content.fecha === dateStr)
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
            Calendario Editorial
          </h1>
          <p className="text-creser-text-light">
            Planifica y programa tu contenido en redes sociales
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-creser-yellow via-creser-mint to-creser-pink text-creser-text font-semibold rounded-xl hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          Nuevo Contenido
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-heading text-lg md:text-xl font-semibold text-creser-text w-32 md:w-auto text-center">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button 
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'month' ? 'bg-white text-creser-text shadow-sm' : 'text-creser-text-light hover:text-creser-text'}`}
              >
                Mes
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'week' ? 'bg-white text-creser-text shadow-sm' : 'text-creser-text-light hover:text-creser-text'}`}
              >
                Semana
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <div className="min-w-[600px] lg:min-w-0">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                <div key={index} className="text-center text-sm font-semibold text-creser-text-light py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              {days.map((day, index) => {
                const dateContent = getContentForDate(day)
                const isToday = isSameDay(day, new Date())
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-2 rounded-xl transition-all relative ${
                      isSelected 
                        ? 'bg-creser-mint/30 ring-2 ring-creser-mint' 
                        : isToday 
                          ? 'bg-creser-yellow/30' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-creser-text font-bold' : 'text-creser-text'}`}>
                      {format(day, 'd')}
                    </span>
                    {dateContent.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                        {dateContent.slice(0, 3).map((content, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-creser-pink" />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
              {selectedDate ? format(selectedDate, 'd MMMM', { locale: es }) : 'Contenido Programado'}
            </h3>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-creser-mint mb-2" />
                <p className="text-sm text-creser-text-light">Cargando contenido...</p>
              </div>
            ) : selectedDate ? (
              <div className="space-y-3">
                {getContentForDate(selectedDate).length > 0 ? (
                  getContentForDate(selectedDate).map((content) => (
                    <div key={content.id} className="p-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-creser-mint/30 transition-all">
                      {content.imagen_url && (
                        <div className="relative group mb-3">
                          <img 
                            src={content.imagen_url} 
                            alt={content.titulo} 
                            className="w-full h-32 object-cover rounded-lg shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <span className="text-white text-xs font-semibold">Ver completo</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        {getPlataformaIcon(content.plataforma)}
                        {getTipoIcon(content.tipo)}
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          content.estado === 'publicado' ? 'bg-green-100 text-green-700' :
                          content.estado === 'programado' ? 'bg-blue-100 text-blue-700' :
                          'bg-creser-mint/20 text-creser-text'
                        }`}>
                          {content.estado}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-creser-text line-clamp-2">{content.titulo}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-creser-text-light">
                          <Clock className="w-3 h-3" />
                          {content.hora || 'Sin hora'}
                        </div>
                        <button className="p-1 hover:bg-white rounded-md transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-creser-text-light">No hay contenido para este día</p>
                  </div>
                )}
                <button 
                  onClick={() => window.location.href = '/generador-contenido'}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-creser-text-light hover:border-creser-mint hover:text-creser-text transition-all hover:bg-creser-mint/5"
                >
                  + Generar nuevo con IA
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledContent.slice(0, 4).map((content) => (
                  <div key={content.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      {getPlataformaIcon(content.plataforma)}
                      <span className="text-xs text-creser-text-light">{content.fecha}</span>
                    </div>
                    <p className="text-sm font-medium text-creser-text">{content.titulo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-heading text-lg font-semibold text-creser-text mb-4">
              Fechas Relevantes
            </h3>
            <div className="space-y-3">
              {suggestedEvents.map((event, index) => (
                <div key={index} className="p-3 bg-creser-violet/20 rounded-xl">
                  <p className="text-xs text-creser-text-light mb-1">{event.fecha}</p>
                  <p className="text-sm font-medium text-creser-text">{event.titulo}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-creser-yellow/50 to-creser-mint/50 rounded-2xl p-6">
            <h3 className="font-heading text-lg font-semibold text-creser-text mb-2">
              📅 Próximo: Día del Psicólogo
            </h3>
            <p className="text-sm text-creser-text-light mb-4">
              21 de marzo - ¡No olvides programar contenido especial!
            </p>
            <button className="w-full py-2 bg-white rounded-xl text-sm font-medium text-creser-text shadow-sm">
              Crear contenido
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
