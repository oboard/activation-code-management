import { Redis } from '@upstash/redis'

const config = useRuntimeConfig()

export const redis = new Redis({
  url: config.kvRestApiUrl,
  token: config.kvRestApiToken
}) 
