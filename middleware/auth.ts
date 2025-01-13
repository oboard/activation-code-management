export default defineNuxtRouteMiddleware((to) => {
  // 如果是登录页面，不需要验证
  if (to.path === '/login') {
    return
  }

  // 在客户端检查登录状态
  if (process.client) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      return navigateTo('/login')
    }
  }
}) 