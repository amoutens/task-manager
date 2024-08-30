import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/tasks': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true
      // },
      '/auth': 'http://localhost:3000'
      
    }
  }
})
