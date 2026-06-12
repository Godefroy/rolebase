// Add width param to image url
// Warning: It works only with images from Nhost storage
export function resizedImageUrl<
  Url extends string | null | undefined,
  Return = Url extends null ? Exclude<Url, null> | undefined : Url,
>(url: Url, width: number): Return {
  if (url === undefined || url === null) {
    return undefined as Return
  }
  return `${url}${url.indexOf('?') === -1 ? '?' : '&'}w=${width}` as Return
}
