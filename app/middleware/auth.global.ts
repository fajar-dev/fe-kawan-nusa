import { useAuth } from "~/composables/useAuth"

export default defineNuxtRouteMiddleware((to) => {
    const { state } = useAuth()
    
    const publicPaths = ['/auth/sign-in', '/auth/forgot-password', '/auth/reset-password', '/auth/admin']
    
    // Allow public pages
    if (publicPaths.includes(to.path)) return

    // Require authentication
    if (!state.token) {
      return navigateTo('/auth/sign-in')
    }

    // Enforce role-based access (set via definePageMeta({ role: 'user' }))
    const requiredRole = to.meta.role as string | undefined
    if (requiredRole && state.role !== requiredRole) {
      return navigateTo('/')
    }
})