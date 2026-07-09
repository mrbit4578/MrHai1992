import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://mrbit4578.github.io/MrHai1992/
// Local dev keeps base "/" so http://localhost:5173 works.
const isPages = process.env.GITHUB_ACTIONS === 'true'

// https://vite.dev/config/
export default defineConfig({
  base: isPages ? '/MrHai1992/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,        // Cho phép truy cập từ localhost và network
    open: true,        // Tự động mở trình duyệt khi chạy
  },
})
