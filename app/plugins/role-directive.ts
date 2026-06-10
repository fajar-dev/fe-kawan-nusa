import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('role', {
    mounted(el: HTMLElement, binding) {
      const { state } = useAuth()
      const requiredRole = binding.value as string | string[]

      const check = () => {
        const match = Array.isArray(requiredRole)
          ? requiredRole.includes(state.role as string)
          : state.role === requiredRole

        el.style.display = match ? '' : 'none'
      }

      check()

      // Watch for role changes (e.g. after login)
      const stop = watch(() => state.role, check)
      ;(el as any).__v_role_stop = stop
    },
    unmounted(el: HTMLElement) {
      (el as any).__v_role_stop?.()
    }
  })
})
