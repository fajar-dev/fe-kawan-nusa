import { useAuth } from "~/composables/useAuth"

export default defineNuxtRouteMiddleware((to) => {
    const { state } = useAuth()
    
    const publicPaths = ['/auth/sign-in', '/auth/forgot-password', '/auth/reset-password', '/auth/admin', '/auth/verify-email']
    
    // Allow public pages
    if (publicPaths.includes(to.path) || to.path.startsWith('/auth/register') || to.path.startsWith('/auth/otp')) return

    // Require authentication
    if (!state.token) {
      return navigateTo('/auth/sign-in')
    }

    const user = state.user
    if (!user) return

    // Admin: no boarding flow, just role check
    if (user.role === 'admin') {
      if (to.path.startsWith('/boarding')) return navigateTo('/')
      const requiredRole = to.meta.role as string | undefined
      if (requiredRole && state.role !== requiredRole) return navigateTo('/')
      return
    }

    // === User Role Flow ===

    // 1. Not verified → only allow boarding/success (show "cek email" or status)
    if (!user.isVerified) {
      if (to.path !== '/boarding/success') return navigateTo('/boarding/success')
      return
    }

    // 2. Not boarded → must complete boarding (regardless of status)
    if (!user.isBoarding) {
      if (!to.path.startsWith('/boarding') || to.path === '/boarding/success') {
        return navigateTo('/boarding')
      }
      return
    }

    // 3. Status reject → show rejection page
    if (user.status === 'reject') {
      if (to.path !== '/boarding/success') return navigateTo('/boarding/success')
      return
    }

    // 4. Status inactive → show inactive page
    if (user.status === 'inactive') {
      if (to.path !== '/boarding/success') return navigateTo('/boarding/success')
      return
    }

    // 5. Status pending → waiting approval
    if (user.status === 'pending') {
      if (to.path !== '/boarding/success') return navigateTo('/boarding/success')
      return
    }

    // 6. Status revision → back to boarding (re-fill data)
    if (user.status === 'revision') {
      if (!to.path.startsWith('/boarding') || to.path === '/boarding/success') {
        return navigateTo('/boarding')
      }
      return
    }

    // 7. Status active → normal access, block boarding pages
    if (user.status === 'active') {
      if (to.path.startsWith('/boarding')) return navigateTo('/')
    }

    // Enforce role-based access
    const requiredRole = to.meta.role as string | undefined
    if (requiredRole && state.role !== requiredRole) {
      return navigateTo('/')
    }
})