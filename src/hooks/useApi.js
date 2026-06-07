import { useState, useEffect, useCallback } from 'react'

export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, error, refetch: load }
}

export function useLeagueData(league) {
  const [matches, setMatches] = useState(null)
  const [standings, setStandings] = useState(null)
  const [scorers, setScorers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!league) return
    let cancelled = false

    async function loadAll() {
      setLoading(true)
      setError(null)
      try {
        const { api } = await import('../services/api.js')
        const [m, s, sc] = await Promise.all([
          api.getMatches(league),
          api.getStandings(league),
          api.getScorers(league),
        ])
        if (!cancelled) {
          setMatches(m)
          setStandings(s)
          setScorers(sc)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAll()
    return () => { cancelled = true }
  }, [league])

  return { matches, standings, scorers, loading, error }
}
