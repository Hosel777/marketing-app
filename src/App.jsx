import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './services/supabase'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ContentGenerator from './pages/ContentGenerator'
import LeadManagement from './pages/LeadManagement'
import Calendar from './pages/Calendar'
import Analytics from './pages/Analytics'
import SocialMedia from './pages/SocialMedia'
import Settings from './pages/Settings'
import Login from './pages/Login'
import MediaLibrary from './pages/MediaLibrary'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-creser-mint border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 w-full min-h-screen md:ml-[18.5rem] transition-all duration-500">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generador-contenido" element={<ContentGenerator />} />
            <Route path="/leads" element={<LeadManagement />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/biblioteca" element={<MediaLibrary />} />
            <Route path="/redes-sociales" element={<SocialMedia />} />
            <Route path="/configuracion" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
