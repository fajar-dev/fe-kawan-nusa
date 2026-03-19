import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',

  modules: ["nuxt-charts", "nuxt-toast"],

  devtools: { enabled: true },

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

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL,
    }
  },
})