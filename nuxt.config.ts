export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'radix-vue/nuxt'
  ],

  typescript: {
    strict: true,
    shim: false
  },

  runtimeConfig: {
    kvRestApiUrl: process.env.KV_REST_API_URL,
    kvRestApiToken: process.env.KV_REST_API_TOKEN
  },

  app: {
    head: {
      title: 'Activation Code System'
    }
  },

  compatibilityDate: '2025-01-13'
})