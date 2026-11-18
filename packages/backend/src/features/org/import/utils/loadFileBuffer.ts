import axios from 'axios'

// Only files hosted in Holaspirit uploads can be imported, so a crafted
// import file can't make the backend fetch internal or arbitrary URLs.
const ALLOWED_ORIGIN = 'https://app.holaspirit.com'
const ALLOWED_PATH_PREFIX = '/public/uploads/'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const TIMEOUT_MS = 10_000

export function isAllowedImportFileUrl(url: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  return (
    parsed.origin === ALLOWED_ORIGIN &&
    !parsed.username &&
    !parsed.password &&
    parsed.pathname.startsWith(ALLOWED_PATH_PREFIX) &&
    !parsed.pathname.includes('..')
  )
}

export async function loadFileBuffer(
  url: string
): Promise<Uint8Array | undefined> {
  if (!isAllowedImportFileUrl(url)) {
    console.warn(`Refused to download file: ${url}`)
    return
  }
  try {
    const result = await axios.get(url, {
      responseType: 'arraybuffer',
      maxRedirects: 0,
      timeout: TIMEOUT_MS,
      maxContentLength: MAX_FILE_SIZE,
      maxBodyLength: MAX_FILE_SIZE,
    })
    return new Uint8Array(result.data)
  } catch (e) {
    console.warn(`Error downloading file: ${url}`)
  }
}
