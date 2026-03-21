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
