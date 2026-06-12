import emojiData, { EmojiMartData } from '@emoji-mart/data'

export interface EmojiItem {
  emoji: string
  id: string
  name: string
  keywords: string[]
}

let cache: EmojiItem[] | undefined

export function getEmojiList(): EmojiItem[] {
  if (!cache) {
    cache = Object.entries((emojiData as EmojiMartData).emojis)
      .map(([id, emoji]) => ({
        emoji: emoji.skins[0]?.native ?? '',
        id,
        name: emoji.name,
        keywords: emoji.keywords ?? [],
      }))
      .filter((item) => item.emoji)
  }
  return cache
}

// Search emojis, best matches first: exact id, then id prefix,
// then id substring, then keyword prefix, then keyword substring
export function searchEmojis(query: string, limit = 8): EmojiItem[] {
  const lowerQuery = query.toLowerCase()
  const scored: Array<{ item: EmojiItem; score: number }> = []

  for (const item of getEmojiList()) {
    let score: number
    if (item.id === lowerQuery) {
      score = 0
    } else if (item.id.startsWith(lowerQuery)) {
      score = 1
    } else if (item.id.includes(lowerQuery)) {
      score = 2
    } else if (item.keywords.some((keyword) => keyword.startsWith(lowerQuery))) {
      score = 3
    } else if (item.keywords.some((keyword) => keyword.includes(lowerQuery))) {
      score = 4
    } else {
      continue
    }
    scored.push({ item, score })
  }

  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((entry) => entry.item)
}
