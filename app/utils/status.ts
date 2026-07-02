/**
 * Utility functions for status formatting
 */

/**
 * Get CSS classes for a service or customer status badge
 */
export const getStatusClass = (status: string): string => {
  if (!status) return 'bg-neutral-100 text-neutral-500'
  
  const lowerStatus = status.toLowerCase()
  
  switch (lowerStatus) {
    case 'aktif':
    case 'active': 
      return 'bg-primary/10 text-primary'
    case 'tidak aktif':
    case 'inactive':
    case 'non active':
      return 'bg-red-50 text-red-500'
    case 'block':
    case 'blocked':
      return 'bg-purple-50 text-purple-500'
    case 'free':
      return 'bg-yellow-100 text-yellow-600'
    default: 
      return 'bg-neutral-100 text-neutral-500'
  }
}

/**
 * Get CSS classes for a user status badge
 */
export const getUserStatusClass = (status: string | null): string => {
  if (!status) return 'bg-neutral-100 text-neutral-500'
  
  const map: Record<string, string> = {
    active: 'bg-primary/10 text-primary',
    pending: 'bg-amber-50 text-amber-600',
    revision: 'bg-blue-50 text-blue-600',
    reject: 'bg-red-50 text-red-500',
    inactive: 'bg-neutral-100 text-neutral-500',
  }
  return map[status] || 'bg-neutral-100 text-neutral-500'
}

/**
 * Get human-readable label for a user status
 */
export const getUserStatusLabel = (status: string | null): string => {
  if (!status) return '-'

  const map: Record<string, string> = {
    active: 'Aktif',
    pending: 'Pending',
    revision: 'Revisi',
    reject: 'Ditolak',
    inactive: 'Tidak Aktif',
  }
  return map[status] || status
}
