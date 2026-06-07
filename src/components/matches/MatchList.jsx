import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import MatchCard from './MatchCard.jsx'
import './MatchList.css'

function groupByDate(matches) {
  const groups = {}
  matches.forEach(m => {
    const key = m.utcDate.slice(0, 10)
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  })
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T12:00:00')
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (d.toDateString() === today.toDateString()) return 'Hoje'
    if (d.toDateString() === yesterday.toDateString()) return 'Ontem'
    if (d.toDateString() === tomorrow.toDateString()) return 'Amanhã'
    return format(d, "EEEE, d 'de' MMMM", { locale: ptBR })
  } catch { return dateStr }
}

export default function MatchList({ matches }) {
  if (!matches || matches.length === 0) {
    return <div className="empty-matches">Nenhuma partida encontrada.</div>
  }

  const groups = groupByDate(matches)

  return (
    <div className="match-list fade-in">
      {groups.map(([date, dayMatches]) => (
        <div key={date} className="match-group">
          <div className="match-date-header">
            <span className="date-label">{formatDate(date)}</span>
            <span className="date-count">{dayMatches.length} jogos</span>
          </div>
          <div className="match-group-body">
            {dayMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
