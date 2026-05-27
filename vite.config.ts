import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'
  const useHttps = env.VITE_HTTPS === 'true'

  return {
    base,
    plugins: [
      react(),
      ...(useHttps ? [basicSsl()] : []),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['placeholder-index.png', 'placeholder-index.svg', 'placeholder-index.gif'],
        manifest: {
          name: 'SQL Index Simulator',
          short_name: 'SQL Index',
          description: 'Симулятор SQL-индексов — каталог и заявки',
          theme_color: '#2c3e50',
          background_color: '#e5eaf0',
          display: 'standalone',
          start_url: base,
          icons: [
            {
              src: 'placeholder-index.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'placeholder-index.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,gif}'],
          globIgnores: ['**/ort-wasm*.wasm', '**/search.worker*.js'],
          navigateFallback: `${base.replace(/\/?$/, '/')}index.html`,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
    ],
    server: {
      port: 3000,
      host: true,
      https: useHttps,
      proxy: {
        '/api': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        '/media': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/media/, ''),
        },
      },
    },
    preview: {
      port: 3000,
      host: true,
      https: useHttps,
    },
  }
})
