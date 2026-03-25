import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',

  modules: [
    "nuxt-charts",
    "nuxt-toast",
    "@vite-pwa/nuxt",
  ],

  devtools: { enabled: true },
  
  routeRules: {
    '/api/**': { proxy: process.env.API_BASE_URL + '/**' }
  },

  vite: {
    plugins: [tailwindcss() as any],
  },
  
  css: ['~/assets/css/main.css'],

  toast: {
    settings: {
      position: 'topRight',
      timeout: 3000,
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: "Kawan Nusa",
      short_name: "Kawan Nusa",
      description: "Portal Referral PT. Media Antar Nusa",
      lang: 'id',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#629E43',
      icons: [
        {
          src: '/icons/icon_64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/icons/icon_144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/icons/icon_192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {

          src: '/icons/icon_384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: '/icons/icon_512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api/],
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      cleanupOutdatedCaches: true
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    }
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL,
    }
  },
})