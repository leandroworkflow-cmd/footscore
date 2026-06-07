import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MatchList from '../components/matches/MatchList.jsx'
import StandingsTable from '../components/standings/StandingsTable.jsx'
import TopScorers from '../components/scorers/TopScorers.jsx'
import { SkeletonMatchList, SkeletonTable, SkeletonScorers } from '../components/ui/Skeleton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import { api, LEAGUES } from '../services/api.js'
import './League.css'

const TABS = [
  { id: 'matches', label: 'Partidas' },
  { id: 'standings', label: 'Classificação' },
  { id: 'scorers', label: 'Artilheiros' },
]

const MATCH_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'SCHEDULED', label: 'Agendadas' },
  { value: 'FINISHED', label: 'Finalizadas' },
]

export default function League() {
  const { code } = useParams()
  const league = LEAGUES.find(l => l.code === code)
  const [tab, setTab] = useState('matches')
  const [filter, setFilter] = useState('')
  const [matches, setMatches] = useState(null)
  const [standings, setStandings] = useState(null)
  const [scorers, setScorers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [m, s, sc] = await Promise.all([
        api.getMatches(code, filter),
        api.getStandings(code).catch(() => ({ standings: [] })),
        api.getScorers(code).catch(() => ({ scorers: [] })),
      ])
      setMatches(m.matches || [])
      setStandings((s.standings?.[0]?.table) || [])
      setScorers(sc.scorers || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [code, filter])

  // Metrics
  const totalGoals = matches ? matches.filter(m => m.status === 'FINISHED').reduce((a, m) => a + (m.score.fullTime.home || 0) + (m.score.fullTime.away || 0), 0) : 0
  const finished = matches ? matches.filter(m => m.status === 'FINISHED').length : 0
  const avgGoals = finished > 0 ? (totalGoals / finished).toFixed(1) : '—'
  const leader = standings?.[0]

  return (
    <div className="league-page">
      <div className="league-header">
        <div className="lh-flag">{league?.country || '🏆'}</div>
        <div className="lh-info">
          <h1 className="lh-name">{league?.name || code}</h1>
          <p className="lh-sub">Temporada 2024/25</p>
        </div>
      </div>

      {!loading && !error && matches && (
        <div className="league-metrics">
          <div className="lm-card">
            <div className="lm-label">Partidas</div>
            <div className="lm-val">{matches.length}</div>
          </div>
          <div className="lm-card">
            <div className="lm-label">Gols (média)</div>
            <div className="lm-val">{avgGoals}</div>
          </div>
          <div className="lm-card">
            <div className="lm-label">Total de gols</div>
            <div className="lm-val">{totalGoals}</div>
          </div>
          {leader && (
            <div className="lm-card lm-leader">
              <div className="lm-label">Líder</div>
              <div className="lm-val lm-val-sm">{leader.team.shortName || leader.team.name.split(' ')[0]}</div>
              <div className="lm-sub">{leader.points} pts</div>
            </div>
          )}
          {scorers?.[0] && (
            <div className="lm-card">
              <div className="lm-label">Artilheiro</div>
              <div className="lm-val lm-val-sm">{scorers[0].player.name.split(' ').pop()}</div>
              <div className="lm-sub">{scorers[0].goals} gols</div>
            </div>
          )}
        </div>
      )}

      <div className="league-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`ltab ${tab === t.id ? 'on' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'matches' && (
        <div className="filter-bar">
          {MATCH_FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn ${filter === f.value ? 'on' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="league-content">
        {loading && (
          tab === 'matches' ? <SkeletonMatchList /> :
          tab === 'standings' ? <div className="content-card"><SkeletonTable /></div> :
          <div className="content-card"><SkeletonScorers /></div>
        )}
        {error && <ErrorMessage message={error} onRetry={loadData} />}
        {!loading && !error && (
          <>
            {tab === 'matches' && <MatchList matches={matches} />}
            {tab === 'standings' && <div className="content-card"><StandingsTable standings={standings} /></div>}
            {tab === 'scorers' && <div className="content-card"><TopScorers scorers={scorers} /></div>}
          </>
        )}
      </div>
    </div>
  )
}
