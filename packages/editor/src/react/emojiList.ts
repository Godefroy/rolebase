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

export function searchEmojis(query: string, limit = 8): EmojiItem[] {
  const lowerQuery = query.toLowerCase()
  return getEmojiList()
    .filter(
      (item) =>
        item.id.includes(lowerQuery) ||
        item.keywords.some((keyword) => keyword.includes(lowerQuery))
    )
    .slice(0, limit)
}
