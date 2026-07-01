import type { Element } from 'hast'

// Hostnames qui restent en follow (partenaires, clients, sources de confiance).
// Ajouter avec et sans "www." si on veut couvrir les deux formes.
const FOLLOW_LIST = new Set([
  'raconte.ai',
  'lonestone.io',
  'github.com'
])

export function getExternalLinkRel(element: Element): string[] {
  const href = element.properties?.href
  if (typeof href === 'string') {
    try {
      const { hostname } = new URL(href)
      if (FOLLOW_LIST.has(hostname)) {
        return ['noopener', 'noreferrer']
      }
    } catch {
      // href relatif ou invalide : le plugin filtre déjà les non-externes
    }
  }
  return ['nofollow', 'noopener', 'noreferrer']
}
