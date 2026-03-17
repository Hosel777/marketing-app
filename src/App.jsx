import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ContentGenerator from './pages/ContentGenerator'
import LeadManagement from './pages/LeadManagement'
import Calendar from './pages/Calendar'
import Analytics from './pages/Analytics'
import SocialMedia from './pages/SocialMedia'
import Settings from './pages/Settings'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generador-contenido" element={<ContentGenerator />} />
          <Route path="/leads" element={<LeadManagement />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/redes-sociales" element={<SocialMedia />} />
          <Route path="/configuracion" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
