import { redis } from '../utils/redis'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        console.log(body);
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

        // Delete the code if it exists
        await redis.del(key)
        console.log('delete key', key)

        return {
            success: true,
            message: '激活码有效'
        }
    } catch (error) {
        return {
            success: false,
            error: '激活码错误'
        }
    }
}) 