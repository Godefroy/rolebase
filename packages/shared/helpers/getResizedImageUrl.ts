export const AVATAR_SM_WIDTH = 72
export const AVATAR_HEADING_WIDTH = 256
export const AVATAR_GRAPH_WIDTH = 128

// Add width param to image url
// Warning: It works only with images from Nhost storage
export function getResizedImageUrl<
  Url extends string | null | undefined,
  Return = Url extends null ? Exclude<Url, null> | undefined : Url,
>(url: Url, width: number): Return {
  if (url === undefined || url === null) {
    return undefined as Return
  }
  return `${url}${url.indexOf('?') === -1 ? '?' : '&'}w=${width}` as Return
}
