import { redis } from '../utils/redis'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        let { code } = typeof body === 'string' ? JSON.parse(body) : body
        code = code.trim().toUpperCase();
        
        if (!code) {
            return {
                success: false,
                error: 'Code is required'
            }
        }

        const key = `code:${code}`
        const exists = await redis.exists(key)

        if (!exists) {
            return {
                success: false,
                error: '激活码无效'
            }
        }

        // 获取剩余次数
        const data = await redis.get<{ remainingUses: number, createdAt: string }>(key)
        if (!data || data.remainingUses <= 0) {
            await redis.del(key)
            return {
                success: false,
                error: '激活码已失效'
            }
        }

        // 减少使用次数
        data.remainingUses -= 1
        if (data.remainingUses > 0) {
            await redis.set(key, data)
        } else {
            await redis.del(key)
        }

        return {
            success: true,
            message: '激活码有效',
            data: { remainingUses: data.remainingUses }
        }
    } catch (error) {
        return {
            success: false,
            error: '激活码错误'
        }
    }
}) 