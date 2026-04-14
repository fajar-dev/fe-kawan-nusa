/**
 * Strip HTML tags from a string
 */
export const stripHtml = (html: string): string => {
    if (!html) return ''
    return html.replace(/<[^>]*>?/gm, '')
}
/**
 * Format number to Indonesian locale
 */
/**
 * Format number to Indonesian locale (thousand separator with dot)
 */
export const formatNumber = (num: number | string): string => {
    if (num === null || num === undefined) return '0'
    const val = typeof num === 'string' ? parseFloat(num) : num
    if (isNaN(val)) return '0'
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

/**
 * Format service unit to Indonesian
 */
export const formatUnit = (unit: string): string => {
    if (!unit) return ''
    const mapping: Record<string, string> = {
        'User': 'User',
        'Monthly': 'Bulan',
        'Yearly': 'Tahun'
    }
    return mapping[unit] || unit
}
