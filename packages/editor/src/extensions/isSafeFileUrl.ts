const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:']

// Only absolute http(s) and mailto URLs can be used as a file link,
// so stored content can't inject javascript: or data: hrefs
export function isSafeFileUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url) return false
  try {
    return ALLOWED_PROTOCOLS.includes(new URL(url).protocol)
  } catch {
    return false
  }
}

export function sanitizeFileUrl(url: unknown): string {
  return isSafeFileUrl(url) ? url : ''
}
