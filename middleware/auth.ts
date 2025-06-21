export default defineNuxtRouteMiddleware((to) => {
  console.log('Auth middleware running, route:', to.path)
  
  // 如果是登录页面，不需要验证
  if (to.path === '/login') {
    console.log('在登录页面，跳过验证')
    return
  }

  const cookie = useCookie('isLoggedIn')
  
  console.log('Cookie value:', cookie.value)
  console.log('Cookie type:', typeof cookie.value)
  
  // 直接比较字符串值
  if (String(cookie.value) === 'true') {
    console.log('验证通过')
    return
  }
  
  console.log('未登录，重定向到登录页')
  return navigateTo('/login')
}) 