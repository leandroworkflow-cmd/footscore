# ⚽ FootScore — Site de Futebol estilo SofaScore

Site completo de resultados de futebol com dados reais da API [football-data.org](https://www.football-data.org).

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar chave da API
Crie o arquivo `.env` na raiz do projeto:
```bash
cp .env.example .env
```
Abra `.env` e coloque sua chave:
```
VITE_FOOTBALL_API_KEY=sua_chave_aqui
```
> Chave gratuita em: https://www.football-data.org/client/register

### 3. Rodar em desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### 4. Build para produção
```bash
npm run build
```

---

## 🏆 Funcionalidades

- **Página inicial** — partidas recentes de todas as ligas
- **Ao Vivo** — jogos em tempo real, atualização automática a cada 60s
- **Liga** — partidas, classificação completa e artilheiros
- **Detalhe do jogo** — placar, gols, cartões, escalações
- **Design responsivo** — funciona no celular e desktop
- **Dark mode** nativo

## 📁 Estrutura

```
src/
├── components/
│   ├── layout/     # Sidebar, Header
│   ├── matches/    # MatchCard, MatchList
│   ├── standings/  # StandingsTable
│   ├── scorers/    # TopScorers
│   └── ui/         # Skeleton, ErrorMessage
├── pages/          # Home, League, MatchDetail, Live
├── hooks/          # useApi
├── services/       # api.js (football-data.org)
└── styles/         # global.css
```

## 🌍 Ligas suportadas

| Liga | Código |
|------|--------|
| Premier League | PL |
| La Liga | PD |
| Bundesliga | BL1 |
| Serie A | SA |
| Ligue 1 | FL1 |
| Champions League | CL |
| Brasileirão Série A | BSB |
| Primeira Liga (Portugal) | PPL |
| Eredivisie | DED |

## ⚠️ Limites da API gratuita

- 10 requisições por minuto
- Acesso a competições selecionadas
- Sem dados de estatísticas detalhadas (posse, chutes)
- Para mais recursos: planos pagos em football-data.org
