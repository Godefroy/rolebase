import { getNameFromEmailDomain } from './getNameFromEmailDomain'

// Icon of the website behind a company email's domain, from Google's favicon
// service: the best icon of the site, up to 128px. It answers 404 with a 16px
// globe when it knows none. Undefined for a free mailbox provider.
export function getEmailDomainIconUrl(
  email: string | undefined
): string | undefined {
  if (!email || !getNameFromEmailDomain(email)) return
  const domain = email.split('@')[1].toLowerCase()
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
}
