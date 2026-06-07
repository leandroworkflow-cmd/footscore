import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import './MatchCard.css'

function statusLabel(status, minute) {
  switch (status) {
    case 'IN_PROGRESS':
    case 'LIVE':
      return <span className="badge-live">{minute ? `${minute}'` : 'AO VIVO'}</span>
    case 'FINISHED':
      return <span className="badge-ft">FT</span>
    case 'HALF_TIME':
      return <span className="badge-live">Intervalo</span>
    case 'PAUSED':
      return <span className="badge-live">⏸</span>
    case 'POSTPONED':
      return <span className="badge-postponed">Adiado</span>
    case 'CANCELLED':
      return <span className="badge-postponed">Cancelado</span>
    default:
      return null
  }
}

function getScore(match) {
  const h = match.score?.fullTime?.home
  const a = match.score?.fullTime?.away
  if (h === null || h === undefined) {
    // try halfTime
    const hh = match.score?.halfTime?.home
    const ha = match.score?.halfTime?.away
    if (hh !== null && hh !== undefined) return { home: hh, away: ha }
    return null
  }
  return { home: h, away: a }
}

export default function MatchCard({ match }) {
  const score = getScore(match)
  const isLive = ['IN_PROGRESS', 'LIVE', 'HALF_TIME', 'PAUSED'].includes(match.status)
  const isFinished = match.status === 'FINISHED'
  const isScheduled = ['TIMED', 'SCHEDULED'].includes(match.status)

  let timeDisplay = null
  if (isScheduled) {
    try {
      timeDisplay = format(new Date(match.utcDate), 'HH:mm', { locale: ptBR })
    } catch { timeDisplay = '--:--' }
  }

  const homeWin = score && score.home > score.away
  const awayWin = score && score.away > score.home

  return (
    <Link to={`/jogo/${match.id}`} className={`match-card ${isLive ? 'is-live' : ''}`}>
      <div className="match-team">
        <img
          className="team-crest"
          src={match.homeTeam.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.homeTeam.shortName || match.homeTeam.name)}&background=1a2030&color=fff&size=32&bold=true&font-size=0.4`}
          alt={match.homeTeam.shortName || match.homeTeam.name}
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.homeTeam.shortName || match.homeTeam.name)}&background=1a2030&color=fff&size=32` }}
        />
        <span className={`team-name ${homeWin ? 'winner' : ''} ${isFinished && awayWin ? 'loser' : ''}`}>
          {match.homeTeam.shortName || match.homeTeam.name}
        </span>
      </div>

      <div className="match-center">
        {score ? (
          <div className="match-score">
            <span className={homeWin ? 'score-winner' : ''}>{score.home}</span>
            <span className="score-sep">:</span>
            <span className={awayWin ? 'score-winner' : ''}>{score.away}</span>
          </div>
        ) : (
          <div className="match-time">{timeDisplay || '--:--'}</div>
        )}
        <div className="match-status-label">
          {statusLabel(match.status, match.minute)}
        </div>
      </div>

      <div className="match-team match-team-away">
        <span className={`team-name team-name-right ${awayWin ? 'winner' : ''} ${isFinished && homeWin ? 'loser' : ''}`}>
          {match.awayTeam.shortName || match.awayTeam.name}
        </span>
        <img
          className="team-crest"
          src={match.awayTeam.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.awayTeam.shortName || match.awayTeam.name)}&background=1a2030&color=fff&size=32&bold=true&font-size=0.4`}
          alt={match.awayTeam.shortName || match.awayTeam.name}
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.awayTeam.shortName || match.awayTeam.name)}&background=1a2030&color=fff&size=32` }}
        />
      </div>
    </Link>
  )
}
