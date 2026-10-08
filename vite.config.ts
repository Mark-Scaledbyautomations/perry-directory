import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base path: '/' for the droplet/Docker deploy and any future custom domain.
// The GitHub Pages copy lives under /<repo>/ so its build passes
// VITE_BASE=/perry-directory/ (see .github/workflows/deploy.yml).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const publicShell = env['VITE_PUBLIC_SHELL'] === 'true'
  return {
    base: env['VITE_BASE'] || '/',
    // The public review build copies only public-shell, which contains no
    // business records or business assets. Private builds keep public/.
    publicDir: publicShell ? 'public-shell' : 'public',
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5176,
      hmr: { protocol: 'ws', host: 'localhost', port: 5176 },
    },
  }
})
