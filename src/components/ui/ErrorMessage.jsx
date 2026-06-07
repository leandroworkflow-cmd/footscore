import { AlertCircle, RefreshCw } from 'lucide-react'
import './ErrorMessage.css'

export default function ErrorMessage({ message, onRetry }) {
  const isApiKey = message?.includes('403') || message?.includes('auth') || message?.includes('token')

  return (
    <div className="err-wrap">
      <AlertCircle size={32} className="err-icon" />
      <p className="err-title">Erro ao carregar dados</p>
      <p className="err-msg">{message}</p>
      {isApiKey && (
        <p className="err-hint">
          Verifique se a variável <code>VITE_FOOTBALL_API_KEY</code> está configurada no arquivo <code>.env</code>.
          Obtenha sua chave em{' '}
          <a href="https://www.football-data.org" target="_blank" rel="noreferrer">football-data.org</a>
        </p>
      )}
      {onRetry && (
        <button className="err-retry" onClick={onRetry}>
          <RefreshCw size={14} /> Tentar novamente
        </button>
      )}
    </div>
  )
}
