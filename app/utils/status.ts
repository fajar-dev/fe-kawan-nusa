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
    case 'free': 
      return 'bg-yellow-100 text-yellow-600'
    case 'block': 
      return 'bg-purple-100 text-purple-600'
    case 'active':
    case 'aktif': 
      return 'bg-accent text-primary'
    case 'non active':
    case 'inactive':
    case 'tidak aktif': 
      return 'bg-red-100 text-red-500'
    default: 
      return 'bg-neutral-100 text-neutral-500'
  }
}
