import { redis } from '../utils/redis'

export default defineEventHandler(async (event) => {
  try {
    const keys = await redis.keys('code:*')
    const codes = []
    
    for (const key of keys) {
      const value = await redis.get(key)
      codes.push({
        code: key.replace('code:', ''),
        createdAt: value
      })
    }
    
    return {
      success: true,
      data: codes
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch codes'
    }
  }
}) 