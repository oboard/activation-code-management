export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  typescript: {
    strict: true,
    shim: false
  },

  runtimeConfig: {
    kvRestApiUrl: process.env.KV_REST_API_URL,
    kvRestApiToken: process.env.KV_REST_API_TOKEN,
    public: {
      adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
    }
  },

  app: {
    head: {
      title: 'Activation Code System'
    }
  },

  compatibilityDate: '2025-01-13'
})