import emojiData, { EmojiMartData } from '@emoji-mart/data'

export default Object.entries((emojiData as EmojiMartData).emojis).map(
  ([id, emoji]) => ({
    description: emoji.name,
    emoji: emoji.skins[0]?.native,
    aliases: [id],
    tags: emoji.keywords,
    category: '',
    unicode_version: '6.0',
    ios_version: '6.0',
  })
)
