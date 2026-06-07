import './StandingsTable.css'

function FormBadge({ result }) {
  const map = { W: { cls: 'fw', label: 'V' }, D: { cls: 'fd', label: 'E' }, L: { cls: 'fl', label: 'D' } }
  const r = map[result]
  if (!r) return null
  return <span className={`form-b ${r.cls}`} title={result === 'W' ? 'Vitória' : result === 'D' ? 'Empate' : 'Derrota'}>{r.label}</span>
}

export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0)
    return <div className="st-empty">Classificação não disponível para esta liga.</div>

  const total = standings.length

  return (
    <div className="st-wrap fade-in">
      <table className="st-table">
        <thead>
          <tr>
            <th className="col-pos">#</th>
            <th className="col-team">Time</th>
            <th title="Jogos">J</th>
            <th title="Vitórias">V</th>
            <th title="Empates">E</th>
            <th title="Derrotas">D</th>
            <th title="Gols Pró">GP</th>
            <th title="Gols Contra">GC</th>
            <th title="Saldo de Gols">SG</th>
            <th title="Pontos" className="col-pts">Pts</th>
            <th className="col-form">Forma</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(row => {
            const pos = row.position
            const sg = row.goalDifference
            const form = (row.form || '').split(',').filter(Boolean).slice(-5)

            let rowCls = ''
            if (pos <= 4) rowCls = 'zone-cl'
            else if (pos === 5) rowCls = 'zone-uel'
            else if (pos > total - 3) rowCls = 'zone-rel'

            return (
              <tr key={row.team.id} className={rowCls}>
                <td className="col-pos">
                  <span className={`pos-num ${pos <= 4 ? 'p-cl' : pos > total - 3 ? 'p-rel' : ''}`}>
                    {pos}
                  </span>
                </td>
                <td className="col-team">
                  <img
                    src={row.team.crest || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.team.shortName || row.team.name)}&background=1a2030&color=fff&size=24`}
                    alt=""
                    className="team-crest-sm"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <span className="team-n">{row.team.shortName || row.team.name}</span>
                </td>
                <td>{row.playedGames}</td>
                <td>{row.won}</td>
                <td>{row.draw}</td>
                <td>{row.lost}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td className={sg > 0 ? 'sg-pos' : sg < 0 ? 'sg-neg' : ''}>{sg > 0 ? `+${sg}` : sg}</td>
                <td className="col-pts"><strong>{row.points}</strong></td>
                <td className="col-form">
                  <div className="form-row">
                    {form.map((f, i) => <FormBadge key={i} result={f} />)}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="st-legend">
        <span className="leg-item"><span className="leg-dot dot-cl" /> Champions League</span>
        <span className="leg-item"><span className="leg-dot dot-uel" /> Europa League</span>
        <span className="leg-item"><span className="leg-dot dot-rel" /> Rebaixamento</span>
      </div>
    </div>
  )
}
