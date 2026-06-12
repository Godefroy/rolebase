import TiptapYoutube from '@tiptap/extension-youtube'

// Markdown syntax: bare video URL alone in a paragraph
const YOUTUBE_MD_REGEX =
  /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+\S*(?:\n+|$)/

export const Youtube = TiptapYoutube.extend({
  markdownTokenizer: {
    name: 'youtube',
    level: 'block',
    // Only match YouTube URLs: a too-greedy `start` would make marked
    // interrupt paragraphs at any https:// occurrence
    start: (src: string) =>
      src.search(/https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)/),
    tokenize(src: string) {
      const match = YOUTUBE_MD_REGEX.exec(src)
      if (!match) return undefined
      return {
        type: 'youtube',
        raw: match[0],
        src: match[0].trim(),
      }
    },
  },

  parseMarkdown(token, helpers) {
    return helpers.createNode('youtube', { src: token.src })
  },

  renderMarkdown(node) {
    return String(node.attrs?.src ?? '')
  },
})
