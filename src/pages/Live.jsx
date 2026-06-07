import { useState, useEffect, useRef } from 'react'
import { RefreshCw } from 'lucide-react'
import MatchList from '../components/matches/MatchList.jsx'
import { SkeletonMatchList } from '../components/ui/Skeleton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import { api, LEAGUES } from '../services/api.js'
import './Live.css'

export default function Live() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const timerRef = useRef(null)

  async function load() {
    try {
      setError(null)
      const results = await Promise.allSettled(
        LEAGUES.map(l => api.getMatches(l.code, 'LIVE').then(r => r.matches || []))
      )
      const all = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
      setMatches(all)
      setLastUpdate(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    timerRef.current = setInterval(load, 60000) // refresh every 60s
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="live-page">
      <div className="live-header">
        <div>
          <h1><span className="live-dot" />Jogos ao Vivo</h1>
          {lastUpdate && (
            <p className="live-update">
              Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              · atualiza a cada 60s
            </p>
          )}
        </div>
        <button className="refresh-btn" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spinning' : ''} /> Atualizar
        </button>
      </div>

      {loading && <SkeletonMatchList />}
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && matches.length === 0 && (
        <div className="live-empty">
          <span>😴</span>
          <p>Nenhum jogo ao vivo no momento.</p>
          <p className="le-sub">Volte mais tarde ou explore as ligas no menu.</p>
        </div>
      )}
      {!loading && !error && matches.length > 0 && <MatchList matches={matches} />}
    </div>
  )
}
