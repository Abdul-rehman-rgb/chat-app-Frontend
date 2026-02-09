import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to the backend during development so cookies are same-origin
      '/api': {
        target: 'https://chat-app-backend-steel-eight.vercel.app/',
        changeOrigin: true,
        secure: false,
      },
      // Proxy uploaded static files as well so images/files load in dev
      '/uploads': {
        target: 'https://chat-app-backend-steel-eight.vercel.app/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
