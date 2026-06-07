import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { api } from '../services/api.js'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import './MatchDetail.css'

function StatBar({ label, home, away }) {
  const total = (home || 0) + (away || 0) || 1
  const pct = Math.round(((home || 0) / total) * 100)
  return (
    <div className="stat-row">
      <span className="stat-val stat-val-l">{home ?? '—'}</span>
      <div className="stat-mid">
        <span className="stat-label">{label}</span>
        <div className="stat-bars">
          <div className="sbar sbar-l" style={{ width: `${pct}%` }} />
          <div className="sbar sbar-r" style={{ width: `${100 - pct}%` }} />
        </div>
      </div>
      <span className="stat-val stat-val-r">{away ?? '—'}</span>
    </div>
  )
}

function GoalEvent({ goal, homeTeamId }) {
  const isHome = goal.team?.id === homeTeamId
  return (
    <div className={`goal-event ${isHome ? 'ge-home' : 'ge-away'}`}>
      {!isHome && <div className="ge-spacer" />}
      <div className={`ge-content ${isHome ? '' : 'ge-content-r'}`}>
        <span className="ge-icon">⚽</span>
        <div className="ge-info">
          <span className="ge-scorer">{goal.scorer?.name || 'Gol'}</span>
          {goal.assist && <span className="ge-assist">Assistência: {goal.assist.name}</span>}
        </div>
        <span className="ge-min">{goal.minute}'</span>
      </div>
      {isHome && <div className="ge-spacer" />}
    </div>
  )
}

export default function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('resumo')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMatch(id)
      setMatch(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  if (loading) return (
    <div className="md-page">
      <div className="md-loading">
        <div className="md-skeleton skeleton" style={{ height: 160 }} />
        <div className="md-skeleton skeleton" style={{ height: 300, marginTop: 16 }} />
      </div>
    </div>
  )

  if (error) return <div className="md-page"><ErrorMessage message={error} onRetry={load} /></div>
  if (!match) return null

  const h = match.score?.fullTime?.home
  const a = match.score?.fullTime?.away
  const hHalf = match.score?.halfTime?.home
  const aHalf = match.score?.halfTime?.away
  const isLive = ['IN_PROGRESS', 'LIVE', 'HALF_TIME'].includes(match.status)
  const isFinished = match.status === 'FINISHED'
  const homeWin = h > a
  const awayWin = a > h

  let dateStr = ''
  try { dateStr = format(new Date(match.utcDate), "EEEE, d 'de' MMMM 'de' yyyy · HH:mm", { locale: ptBR }) } catch {}

  const goals = match.goals || []
  const bookings = match.bookings || []
  const homeStats = match.homeTeam
  const awayStats = match.awayTeam

  return (
    <div className="md-page fade-in">
      <button className="md-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* Hero Score */}
      <div className="md-hero">
        <div className="md-competition">
          {match.competition?.emblem && (
            <img src={match.competition.emblem} alt="" className="comp-emblem" onError={e => e.target.style.display = 'none'} />
          )}
          <span>{match.competition?.name}</span>
          {match.matchday && <span className="md-round">· Rodada {match.matchday}</span>}
        </div>

        <div className="md-scoreboard">
          <div className="md-team-col">
            <img
              src={match.homeTeam.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.homeTeam.shortName || match.homeTeam.name)}&background=1a2030&color=fff&size=64`}
              alt={match.homeTeam.name}
              className="md-crest"
              onError={e => e.target.style.display = 'none'}
            />
            <span className={`md-team-name ${homeWin ? 'md-winner' : ''}`}>{match.homeTeam.name}</span>
          </div>

          <div className="md-score-col">
            {h !== null && h !== undefined ? (
              <>
                <div className="md-score">
                  <span className={homeWin ? 'md-s-win' : isFinished && awayWin ? 'md-s-lose' : ''}>{h}</span>
                  <span className="md-s-sep">—</span>
                  <span className={awayWin ? 'md-s-win' : isFinished && homeWin ? 'md-s-lose' : ''}>{a}</span>
                </div>
                {isFinished && hHalf !== null && hHalf !== undefined && (
                  <div className="md-halftime">Intervalo {hHalf} — {aHalf}</div>
                )}
                {isLive ? (
                  <span className="badge-live">AO VIVO</span>
                ) : isFinished ? (
                  <span className="md-status-ft">Finalizado</span>
                ) : null}
              </>
            ) : (
              <>
                <div className="md-vs">VS</div>
                <div className="md-date-time">{dateStr}</div>
              </>
            )}
          </div>

          <div className="md-team-col">
            <img
              src={match.awayTeam.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.awayTeam.shortName || match.awayTeam.name)}&background=1a2030&color=fff&size=64`}
              alt={match.awayTeam.name}
              className="md-crest"
              onError={e => e.target.style.display = 'none'}
            />
            <span className={`md-team-name ${awayWin ? 'md-winner' : ''}`}>{match.awayTeam.name}</span>
          </div>
        </div>

        {dateStr && isFinished && (
          <div className="md-meta">
            <Clock size={12} /> {dateStr}
            {match.venue && ` · ${match.venue}`}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="md-tabs">
        {['resumo', 'eventos', 'escalações'].map(t => (
          <button key={t} className={`md-tab ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="md-content">
        {tab === 'resumo' && (
          <div className="md-section">
            <div className="md-card">
              <div className="md-card-title">Estatísticas</div>
              {match.homeScore || match.awayScore ? (
                <>
                  <StatBar label="Posse de Bola" home={match.homeScore?.possession} away={match.awayScore?.possession} />
                  <StatBar label="Chutes" home={match.homeScore?.totalShots} away={match.awayScore?.totalShots} />
                  <StatBar label="Chutes no Gol" home={match.homeScore?.onTarget} away={match.awayScore?.onTarget} />
                  <StatBar label="Escanteios" home={match.homeScore?.corners} away={match.awayScore?.corners} />
                  <StatBar label="Faltas" home={match.homeScore?.fouls} away={match.awayScore?.fouls} />
                </>
              ) : (
                <div className="md-no-stats">
                  <StatBar label="Gols" home={h ?? 0} away={a ?? 0} />
                  <p className="md-stats-note">Estatísticas detalhadas não disponíveis no plano gratuito da API.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'eventos' && (
          <div className="md-section">
            {goals.length > 0 ? (
              <div className="md-card">
                <div className="md-card-title">Gols</div>
                <div className="goals-list">
                  {goals.map((g, i) => <GoalEvent key={i} goal={g} homeTeamId={match.homeTeam.id} />)}
                </div>
              </div>
            ) : (
              <div className="md-card">
                <div className="md-card-title">Gols</div>
                <p className="md-no-data">Sem gols registrados ou dados não disponíveis.</p>
              </div>
            )}

            {bookings.length > 0 && (
              <div className="md-card">
                <div className="md-card-title">Cartões</div>
                <div className="bookings-list">
                  {bookings.map((b, i) => (
                    <div key={i} className="booking-row">
                      <span className={`card-icon ${b.card === 'RED_CARD' || b.card === 'YELLOW_RED_CARD' ? 'card-red' : 'card-yellow'}`} />
                      <span className="bk-player">{b.player?.name}</span>
                      <span className="bk-team">{b.team?.name}</span>
                      <span className="bk-min">{b.minute}'</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'escalações' && (
          <div className="md-section">
            <div className="md-card">
              <div className="lineup-wrap">
                <div className="lineup-col">
                  <div className="lineup-header">
                    <img src={match.homeTeam.crest} alt="" className="lu-crest" onError={e=>e.target.style.display='none'} />
                    {match.homeTeam.shortName || match.homeTeam.name}
                  </div>
                  {(match.homeTeam.lineup || []).map((p, i) => (
                    <div key={i} className="player-row">
                      <span className="player-num">{p.shirtNumber || i + 1}</span>
                      <span className="player-name">{p.name}</span>
                      <span className="player-pos">{p.position}</span>
                    </div>
                  ))}
                  {(!match.homeTeam.lineup || match.homeTeam.lineup.length === 0) && (
                    <p className="md-no-data">Escalação não disponível.</p>
                  )}
                </div>
                <div className="lineup-divider" />
                <div className="lineup-col">
                  <div className="lineup-header">
                    <img src={match.awayTeam.crest} alt="" className="lu-crest" onError={e=>e.target.style.display='none'} />
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </div>
                  {(match.awayTeam.lineup || []).map((p, i) => (
                    <div key={i} className="player-row">
                      <span className="player-num">{p.shirtNumber || i + 1}</span>
                      <span className="player-name">{p.name}</span>
                      <span className="player-pos">{p.position}</span>
                    </div>
                  ))}
                  {(!match.awayTeam.lineup || match.awayTeam.lineup.length === 0) && (
                    <p className="md-no-data">Escalação não disponível.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
