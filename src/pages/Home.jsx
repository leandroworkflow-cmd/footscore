import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MatchCard from '../components/matches/MatchCard.jsx'
import { SkeletonMatchList } from '../components/ui/Skeleton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import { api, LEAGUES } from '../services/api.js'
import './Home.css'

export default function Home() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadMatches() {
    setLoading(true)
    setError(null)
    try {
      const mainLeagues = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'CL', 'BSB']
      const results = await Promise.allSettled(
        mainLeagues.map(code =>
          api.getMatches(code, 'FINISHED').then(r => ({ code, matches: r.matches || [] }))
        )
      )
      const grouped = {}
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          const { code, matches } = r.value
          if (matches.length > 0) {
            const sorted = [...matches].sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
            grouped[code] = sorted.slice(0, 6)
          }
        }
      })
      setData(grouped)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMatches() }, [])

  if (loading) return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Resultados ao Vivo</h1>
        <p>Acompanhe os placares em tempo real</p>
      </div>
      <SkeletonMatchList />
    </div>
  )

  if (error) return (
    <div className="home-page">
      <ErrorMessage message={error} onRetry={loadMatches} />
    </div>
  )

  const hasData = Object.keys(data).length > 0

  return (
    <div className="home-page fade-in">
      <div className="home-hero">
        <h1>Resultados Recentes</h1>
        <p>Últimos jogos de todas as ligas</p>
      </div>

      {!hasData ? (
        <div className="no-matches">
          <span>😴</span>
          <p>Nenhuma partida encontrada.</p>
          <p className="nm-sub">Tente selecionar uma liga específica no menu.</p>
        </div>
      ) : (
        <div className="home-sections">
          {Object.entries(data).map(([code, matches]) => {
            const league = LEAGUES.find(l => l.code === code)
            if (!league || matches.length === 0) return null
            return (
              <div key={code} className="home-section">
                <Link to={`/liga/${code}`} className="section-header">
                  <span className="sh-flag">{league.country}</span>
                  <span className="sh-name">{league.name}</span>
                  <span className="sh-arrow">Ver todos →</span>
                </Link>
                <div className="section-matches">
                  {matches.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
