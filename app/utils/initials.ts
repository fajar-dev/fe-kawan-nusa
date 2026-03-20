/**
 * Utility functions for string manipulation
 */

/**
 * Get initials from a name (max 2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase()
}
