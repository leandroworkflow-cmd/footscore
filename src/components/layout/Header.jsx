import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import './Header.css'

export default function Header({ onMenuClick }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/busca?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Menu">
        <Menu size={20} />
      </button>

      <div className="header-logo">
        <span>⚽</span>
        <span>FootScore</span>
      </div>

      {searchOpen ? (
        <form className="search-form" onSubmit={handleSearch}>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar time ou liga..."
            className="search-input"
          />
          <button type="button" onClick={() => { setSearchOpen(false); setQuery('') }} className="icon-btn">
            <X size={18} />
          </button>
        </form>
      ) : (
        <div className="header-right">
          <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Buscar">
            <Search size={18} />
          </button>
        </div>
      )}
    </header>
  )
}
