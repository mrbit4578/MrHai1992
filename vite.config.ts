import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://mrbit4578.github.io/MrHai1992/
// Local dev keeps base "/" so http://localhost:5173 works.
const isPages = process.env.GITHUB_ACTIONS === 'true'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages needs /MrHai1992/; Render/Vercel/local use root /
  base: isPages ? '/MrHai1992/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true,
  },
})
