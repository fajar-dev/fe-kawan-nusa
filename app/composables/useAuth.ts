import { authService } from "~/services/auth-service"

export const useAuth = () => {
  return {
    state: {
      get token() {
        return authService.token.value
      },
      get user() {
        return authService.user.value
      },
      get role() {
        return authService.user.value?.role ?? null
      },
      get isUser() {
        return authService.user.value?.role === 'user'
      },
      get isAdmin() {
        return authService.user.value?.role === 'admin'
      },
      hasRole(role: 'user' | 'admin') {
        return authService.user.value?.role === role
      }
    },
    service: authService
  }
}