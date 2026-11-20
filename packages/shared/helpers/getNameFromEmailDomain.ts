// Free mailbox, alias and disposable inbox providers, matched on the domain
// name whatever its TLD (hotmail.fr, yahoo.co.uk...)
const genericDomainNames = new Set([
  '126',
  '163',
  '10minutemail',
  'addy',
  'aleeas',
  'anonaddy',
  'aol',
  'appleid',
  'att',
  'bbox',
  'bigpond',
  'bluewin',
  'btinternet',
  'comcast',
  'daum',
  'duck',
  'ecomail',
  'fastmail',
  'free',
  'gmail',
  'gmx',
  'googlemail',
  'guerrillamail',
  'hey',
  'hotmail',
  'icloud',
  'inbox',
  'interia',
  'keemail',
  'laposte',
  'libero',
  'live',
  'mac',
  'mail',
  'mailbox',
  'maildrop',
  'mailinator',
  'mailo',
  'me',
  'mozmail',
  'msn',
  'naver',
  'neuf',
  'ntlworld',
  'numericable',
  'onet',
  'optusnet',
  'orange',
  'outlook',
  'passinbox',
  'pm',
  'posteo',
  'proton',
  'protonmail',
  'qq',
  'rambler',
  'rediffmail',
  'sbcglobal',
  'seznam',
  'sfr',
  'sina',
  'simplelogin',
  'skynet',
  'slmail',
  'sympatico',
  't-online',
  'telenet',
  'tempmail',
  'tiscali',
  'trashmail',
  'tuta',
  'tutamail',
  'tutanota',
  'ukr',
  'verizon',
  'videotron',
  'virginmedia',
  'virgilio',
  'wanadoo',
  'web',
  'yahoo',
  'yandex',
  'ymail',
  'yopmail',
  'zoho',
])

// Shared providers whose domain name alone is too common to match on
const genericDomains = new Set([
  'alice.it',
  'bk.ru',
  'ik.me',
  'list.ru',
  'o2.pl',
  'relay.firefox.com',
  'rogers.com',
  'shaw.ca',
  'sky.com',
  'sunrise.ch',
  'tin.it',
  'wp.pl',
])

// Student subdomains (etu.unige.ch), shared by a whole school
const studentLabels = new Set([
  'alumni',
  'eleve',
  'eleves',
  'etu',
  'etud',
  'etudiant',
  'etudiants',
  'stu',
  'stud',
  'student',
  'students',
])

// Second-level labels that come before a country TLD (acme.co.uk)
const secondLevelLabels = new Set(['co', 'com', 'org', 'net', 'ac', 'gov'])

// Whether an email domain is shared by unrelated people: free mailboxes,
// aliases and disposable inboxes, students of a school, French education
// academies (ac-*.fr) and .edu domains. It says nothing about a company.
export function isSharedEmailDomain(domain: string): boolean {
  domain = domain.toLowerCase()
  if (genericDomains.has(domain)) return true
  const labels = domain.split('.')
  if (studentLabels.has(labels[0])) return true
  if (labels.includes('edu')) return true
  if (/^ac-[a-z-]+\.fr$/.test(domain)) return true

  labels.pop() // TLD
  if (labels.length > 1 && secondLevelLabels.has(labels[labels.length - 1])) {
    labels.pop()
  }
  const name = labels.pop()
  return !name || genericDomainNames.has(name)
}

// Suggested organization name from a company email's domain:
// "jean@acme-corp.co.uk" -> "Acme Corp". Empty for a shared domain.
export function getNameFromEmailDomain(email: string | undefined): string {
  const domain = (email?.split('@')[1] ?? '').toLowerCase()
  if (!domain || isSharedEmailDomain(domain)) return ''
  const labels = domain.split('.')
  labels.pop() // TLD
  if (labels.length > 1 && secondLevelLabels.has(labels[labels.length - 1])) {
    labels.pop()
  }
  const name = labels.pop()
  if (!name) return ''
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
