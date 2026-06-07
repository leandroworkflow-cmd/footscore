import './TopScorers.css'

const MEDALS = ['🥇', '🥈', '🥉']

export default function TopScorers({ scorers }) {
  if (!scorers || scorers.length === 0)
    return <div className="sc-empty">Artilheiros não disponíveis para esta competição.</div>

  const max = scorers[0].goals || 1

  return (
    <div className="sc-wrap fade-in">
      {scorers.map((s, i) => {
        const pct = Math.round((s.goals / max) * 100)
        return (
          <div key={s.player.id} className="sc-row">
            <span className="sc-rank">{MEDALS[i] || `#${i + 1}`}</span>
            <img
              className="sc-crest"
              src={s.team.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.team.shortName || s.team.name)}&background=1a2030&color=fff&size=24`}
              alt={s.team.name}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div className="sc-info">
              <div className="sc-name">{s.player.name}</div>
              <div className="sc-team">{s.team.shortName || s.team.name}</div>
              <div className="sc-bar-wrap">
                <div className="sc-bar" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="sc-stats">
              <div className="sc-goals">
                <span className="sc-goals-num">{s.goals}</span>
                <span className="sc-goals-label">gols</span>
              </div>
              {s.assists != null && (
                <div className="sc-assists">
                  <span>{s.assists}</span>
                  <span className="sc-goals-label">ass</span>
                </div>
              )}
              {s.penalties != null && (
                <div className="sc-pen">
                  <span>{s.penalties}</span>
                  <span className="sc-goals-label">pen</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
