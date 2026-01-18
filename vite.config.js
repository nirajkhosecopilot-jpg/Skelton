import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    host: true, // Listen on all addresses, including LAN and public addresses
    strictPort: true, // Fail if port is already in use
  }
})
