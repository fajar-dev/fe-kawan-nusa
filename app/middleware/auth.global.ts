import { useAuth } from "~/composables/useAuth"

export default defineNuxtRouteMiddleware((to) => {
    const { state } = useAuth()
    
    const publicPaths = ['/auth/sign-in', '/auth/forgot-password', '/auth/reset-password', '/auth/admin']
    
    if (!state.token && !publicPaths.includes(to.path)) {
      return navigateTo('/auth/sign-in')
    }
})