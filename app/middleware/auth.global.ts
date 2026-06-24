import { useAuth } from "~/composables/useAuth"

export default defineNuxtRouteMiddleware((to) => {
    const { state } = useAuth()
    
    const publicPaths = ['/auth/sign-in', '/auth/forgot-password', '/auth/reset-password', '/auth/admin', '/auth/verify-email']
    
    // Allow public pages
    if (publicPaths.includes(to.path) || to.path.startsWith('/auth/register')) return

    // Require authentication
    if (!state.token) {
      return navigateTo('/auth/sign-in')
    }

    // Boarding flow: if not boarded, force to boarding pages
    if (state.user && state.user.role === 'user' && !state.user.isBoarding) {
      if (!to.path.startsWith('/boarding')) {
        return navigateTo('/boarding')
      }
      return
    }

    // Already boarded: block access to boarding pages
    if (state.user && state.user.isBoarding && to.path.startsWith('/boarding')) {
      return navigateTo('/')
    }

    // Enforce role-based access (set via definePageMeta({ role: 'user' }))
    const requiredRole = to.meta.role as string | undefined
    if (requiredRole && state.role !== requiredRole) {
      return navigateTo('/')
    }
})