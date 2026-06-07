import { NavLink } from 'react-router-dom'
import { LEAGUES } from '../../services/api.js'
import './Sidebar.css'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">Foot<strong>Score</strong></span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <span className="nav-icon">🏠</span>
            <span>Início</span>
          </NavLink>
          <NavLink to="/live" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <span className="nav-icon">🔴</span>
            <span>Ao Vivo</span>
            <span className="live-pill">LIVE</span>
          </NavLink>
        </nav>

        <div className="sidebar-section-label">Competições</div>
        <nav className="sidebar-nav">
          {LEAGUES.map(l => (
            <NavLink
              key={l.code}
              to={`/liga/${l.code}`}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-flag">{l.country}</span>
              <span className="nav-league-name">{l.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="https://www.football-data.org" target="_blank" rel="noreferrer" className="powered-by">
            Dados: football-data.org
          </a>
        </div>
      </aside>
    </>
  )
}
