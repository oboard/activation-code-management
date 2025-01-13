import { redis } from '../utils/redis'

function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { amount } = JSON.parse(body)

    const codes = []
    for (let i = 0; i < amount; i++) {
      let code: string
      let key: string
      
      // 确保生成的代码是唯一的
      do {
        code = generateRandomCode()
        key = `code:${code}`
      } while (await redis.exists(key))

      await redis.set(key, new Date().toISOString())
      console.log('set key',key)
      codes.push(code)
    }

    return {
      success: true,
      data: codes
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to generate codes'
    }
  }
}) 