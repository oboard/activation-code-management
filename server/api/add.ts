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

      // 存储激活码信息，包括创建时间和剩余使用次数
      await redis.set(key, {
        createdAt: new Date().toISOString(),
        remainingUses: 2 // 初始可使用2次
      })
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