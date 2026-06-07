// Usa proxy local do Vite para evitar CORS
const BASE = '/api'

// A chave é enviada pelo proxy no vite.config.js
// mas também enviamos aqui como fallback
const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Auth-Token': API_KEY }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}

export const LEAGUES = [
  { code: 'PL',  name: 'Premier League',   country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'PD',  name: 'La Liga',          country: '🇪🇸' },
  { code: 'BL1', name: 'Bundesliga',       country: '🇩🇪' },
  { code: 'SA',  name: 'Serie A',          country: '🇮🇹' },
  { code: 'FL1', name: 'Ligue 1',          country: '🇫🇷' },
  { code: 'CL',  name: 'Champions League', country: '🏆' },
  { code: 'BSB', name: 'Brasileirão',      country: '🇧🇷' },
  { code: 'PPL', name: 'Primeira Liga',    country: '🇵🇹' },
  { code: 'DED', name: 'Eredivisie',       country: '🇳🇱' },
]

export const api = {
  getMatches: (league, status = '') =>
    get(`/competitions/${league}/matches?${status ? `status=${status}&` : ''}limit=20`),

  getStandings: (league) =>
    get(`/competitions/${league}/standings`),

  getScorers: (league, limit = 20) =>
    get(`/competitions/${league}/scorers?limit=${limit}`),

  getMatch: (id) =>
    get(`/matches/${id}`),

  getTeam: (id) =>
    get(`/teams/${id}`),

  getTeamMatches: (id) =>
    get(`/teams/${id}/matches?limit=10&status=FINISHED`),
}
