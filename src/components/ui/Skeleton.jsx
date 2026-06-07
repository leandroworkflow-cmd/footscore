import './Skeleton.css'

export function SkeletonMatchList() {
  return (
    <div className="sk-wrap">
      {[1, 2, 3].map(g => (
        <div key={g} className="sk-group">
          <div className="sk-date skeleton" />
          {[1, 2, 3, 4].map(m => (
            <div key={m} className="sk-match">
              <div className="sk-team">
                <div className="sk-crest skeleton" />
                <div className="sk-name skeleton" />
              </div>
              <div className="sk-score skeleton" />
              <div className="sk-team sk-team-r">
                <div className="sk-name skeleton" />
                <div className="sk-crest skeleton" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="sk-table-wrap">
      <div className="sk-thead skeleton" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="sk-trow">
          <div className="sk-pos skeleton" />
          <div className="sk-tname skeleton" />
          <div className="sk-tnums skeleton" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonScorers() {
  return (
    <div className="sk-sc-wrap">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="sk-sc-row">
          <div className="sk-rank skeleton" />
          <div className="sk-sc-info">
            <div className="sk-sc-name skeleton" />
            <div className="sk-sc-team skeleton" />
            <div className="sk-sc-bar skeleton" />
          </div>
          <div className="sk-sc-num skeleton" />
        </div>
      ))}
    </div>
  )
}
