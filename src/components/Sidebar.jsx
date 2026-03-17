import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Wand2, 
  Users, 
  CalendarDays, 
  BarChart3, 
  Share2, 
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/generador-contenido', label: 'Generador IA', icon: Wand2 },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/calendario', label: 'Calendario', icon: CalendarDays },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/redes-sociales', label: 'Redes', icon: Share2 },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
]

export default function Sidebar() {
  const [logo, setLogo] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const savedLogo = localStorage.getItem('creser_logo')
    if (savedLogo) {
      setLogo(savedLogo)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const SidebarContent = ({ onClose }) => (
    <>
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-creser-yellow via-creser-mint to-creser-pink flex items-center justify-center overflow-hidden flex-shrink-0">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Sparkles className="w-5 h-5 text-creser-text" />
              )}
            </div>
            <div className="hidden md:block">
              <h1 className="font-heading font-bold text-lg text-creser-text">CreSer</h1>
              <p className="text-xs text-creser-text-light">Marketing</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-creser-mint/50 to-creser-blue/30 text-creser-text font-semibold'
                  : 'text-creser-text-light hover:bg-gray-50 hover:text-creser-text'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm md:text-base">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-2 md:p-4 border-t border-gray-100 hidden md:block">
        <div className="bg-gradient-to-r from-creser-yellow/50 to-creser-mint/50 rounded-xl p-4">
          <p className="text-sm font-medium text-creser-text mb-2">¿Necesitas ayuda?</p>
          <button className="w-full py-2 bg-white rounded-lg text-sm font-medium text-creser-text shadow-sm hover:shadow-md transition-shadow">
            Ver guías
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <Menu className="w-6 h-6 text-creser-text" />
        </button>
      )}

      <AnimatePresence>
        {mobileOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col z-50"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isMobile && (
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50"
        >
          <SidebarContent />
        </motion.aside>
      )}
    </>
  )
}
