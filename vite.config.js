import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    base: '/footscore/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v4'),
        headers: {
          'X-Auth-Token': process.env.VITE_FOOTBALL_API_KEY || ''
        }
      }
    }
  }
})
