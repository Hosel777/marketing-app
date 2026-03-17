import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Wand2, 
  Users, 
  CalendarDays, 
  BarChart3, 
  Share2, 
  Settings,
  Sparkles
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/generador-contenido', label: 'Generador IA', icon: Wand2 },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/calendario', label: 'Calendario', icon: CalendarDays },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/redes-sociales', label: 'Redes Sociales', icon: Share2 },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-creser-yellow via-creser-mint to-creser-pink flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-creser-text" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-creser-text">CreSer</h1>
            <p className="text-xs text-creser-text-light">Marketing Digital</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-creser-mint/50 to-creser-blue/30 text-creser-text font-semibold'
                  : 'text-creser-text-light hover:bg-gray-50 hover:text-creser-text'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-creser-yellow/50 to-creser-mint/50 rounded-xl p-4">
          <p className="text-sm font-medium text-creser-text mb-2">¿Necesitas ayuda?</p>
          <p className="text-xs text-creser-text-light mb-3">Consulta la documentación</p>
          <button className="w-full py-2 bg-white rounded-lg text-sm font-medium text-creser-text shadow-sm hover:shadow-md transition-shadow">
            Ver guías
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
