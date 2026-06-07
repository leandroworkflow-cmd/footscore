import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import Header from './components/layout/Header.jsx'
import Home from './pages/Home.jsx'
import League from './pages/League.jsx'
import MatchDetail from './pages/MatchDetail.jsx'
import Live from './pages/Live.jsx'
import './App.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<Live />} />
            <Route path="/liga/:code" element={<League />} />
            <Route path="/jogo/:id" element={<MatchDetail />} />
            <Route path="*" element={
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <p style={{ fontSize: 48, marginBottom: 12 }}>⚽</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Página não encontrada</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}
