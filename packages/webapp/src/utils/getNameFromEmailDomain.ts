// Free mailbox providers, matched on the domain name whatever its TLD
// (hotmail.fr, yahoo.co.uk...)
const genericDomainNames = new Set([
  '163',
  'aol',
  'bbox',
  'bluewin',
  'fastmail',
  'free',
  'gmail',
  'gmx',
  'googlemail',
  'hey',
  'hotmail',
  'icloud',
  'laposte',
  'libero',
  'live',
  'mac',
  'mail',
  'me',
  'msn',
  'neuf',
  'numericable',
  'orange',
  'outlook',
  'pm',
  'proton',
  'protonmail',
  'qq',
  'sfr',
  'skynet',
  't-online',
  'tiscali',
  'tutanota',
  'virgilio',
  'wanadoo',
  'web',
  'yahoo',
  'yandex',
  'ymail',
  'zoho',
])

// Second-level labels that come before a country TLD (acme.co.uk)
const secondLevelLabels = new Set(['co', 'com', 'org', 'net', 'ac', 'gov'])

// Suggested organization name from a company email's domain:
// "jean@acme-corp.co.uk" -> "Acme Corp". Empty for a free mailbox provider.
export function getNameFromEmailDomain(email: string | undefined): string {
  const labels = (email?.split('@')[1] ?? '').toLowerCase().split('.')
  labels.pop() // TLD
  if (labels.length > 1 && secondLevelLabels.has(labels[labels.length - 1])) {
    labels.pop()
  }
  const name = labels.pop()
  if (!name || genericDomainNames.has(name)) return ''
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
