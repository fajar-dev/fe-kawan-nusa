export const usePermission = () => {
    const { state } = useAuth()

    const permissions = computed(() => {
        if (state.role !== 'admin') return {}
        // Load from localStorage if on client
        if (import.meta.client) {
            const stored = localStorage.getItem('auth_permissions')
            if (stored) {
                try {
                    return JSON.parse(stored)
                } catch {
                    return {}
                }
            }
        }
        return {}
    })

    const can = (module: string, action: string): boolean => {
        if (state.role !== 'admin') return false
        return permissions.value[module]?.includes(action) || false
    }

    const canView = (module: string) => can(module, 'L')
    const canCreate = (module: string) => can(module, 'T')
    const canEdit = (module: string) => can(module, 'E')
    const canDelete = (module: string) => can(module, 'H')

    return { permissions, can, canView, canCreate, canEdit, canDelete }
}
