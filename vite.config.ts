import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base path: '/' for the droplet/Docker deploy and any future custom domain.
// The GitHub Pages copy lives under /<repo>/ so its build passes
// VITE_BASE=/perry-directory/ (see .github/workflows/deploy.yml).
export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, '.', 'VITE_')['VITE_BASE'] || '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5176,
    hmr: { protocol: 'ws', host: 'localhost', port: 5176 },
  },
}))
