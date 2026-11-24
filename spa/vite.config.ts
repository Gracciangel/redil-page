import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages publica proyectos en /<repo>/, así que todo (manifest, SW e
// iconos) debe vivir debajo de esa base.
const BASE = '/redil-page/'

// La landing es una SPA estática, pero también es la puerta de entrada a la PWA:
// el manifest y el service worker se generan en el build (no en dev).
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        id: BASE,
        name: 'Redil — un lugar para conectar iglesia',
        short_name: 'Redil',
        description:
          'Registro y validación de congregaciones, miembros, ministerios, grupos, eventos y avisos en un punto de conexión digital. Sin costo, con donaciones opcionales.',
        lang: 'es',
        dir: 'ltr',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        theme_color: '#000000',
        background_color: '#000000',
        categories: ['productivity', 'lifestyle'],
        icons: [
          {
            src: `${BASE}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${BASE}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${BASE}icons/maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Conocer Redil',
            short_name: 'Redil',
            url: BASE,
            icons: [{ src: `${BASE}icons/icon-192.png`, sizes: '192x192' }],
          },
          {
            name: 'Congregaciones',
            short_name: 'Congregaciones',
            url: `${BASE}#congregaciones`,
            icons: [{ src: `${BASE}icons/icon-192.png`, sizes: '192x192' }],
          },
          {
            name: 'Progreso del proyecto',
            short_name: 'Progreso',
            url: `${BASE}#progreso`,
            icons: [{ src: `${BASE}icons/icon-192.png`, sizes: '192x192' }],
          },
          {
            name: 'Preguntas frecuentes',
            short_name: 'FAQ',
            url: `${BASE}#faq`,
            icons: [{ src: `${BASE}icons/icon-192.png`, sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff,woff2,webmanifest}'],
        cleanupOutdatedCaches: true,
        navigateFallback: `${BASE}index.html`,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
