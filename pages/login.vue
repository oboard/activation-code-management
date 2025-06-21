<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          激活码管理系统
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="password" class="sr-only">密码</label>
          <input id="password" v-model="password" name="password" type="password" required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="请输入管理密码" />
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            登录
          </button>
        </div>

        <div v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const router = useRouter()
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    console.log('登录密码验证:', password.value === config.public.adminPassword)

    if (password.value === config.public.adminPassword) {
      // 存储登录状态到 cookie
      const cookie = useCookie('isLoggedIn')
      cookie.value = 'true'
      console.log('Cookie已设置，值为:', cookie.value)
      console.log('Cookie类型:', typeof cookie.value)

      // 使用 await 等待路由跳转完成
      await navigateTo('/')
    } else {
      error.value = '密码错误'
    }
  } catch (e) {
    console.error('登录过程出错:', e)
    error.value = '登录过程出错'
  }
}

// 如果已经登录，直接跳转到主页
onMounted(() => {
  const cookie = useCookie('isLoggedIn', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    secure: true,
    sameSite: 'strict'
  })
  if (cookie.value === 'true') {
    router.push('/')
  }
})
</script>