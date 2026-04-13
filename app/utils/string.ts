/**
 * Strip HTML tags from a string
 */
export const stripHtml = (html: string): string => {
    if (!html) return ''
    return html.replace(/<[^>]*>?/gm, '')
}
