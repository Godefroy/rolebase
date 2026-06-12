import TiptapMention from '@tiptap/extension-mention'

export enum MentionEntities {
  Member = 'member',
}

export interface Mentionable {
  id: string
  name: string
  entity: MentionEntities
}

// Markdown syntax: [@Jane Doe](rolebase://member/uuid)
const MENTION_MD_REGEX =
  /^\[@([^\]]+)\]\(rolebase:\/\/([a-z]+)\/([a-zA-Z0-9-]+)\)/

export const Mention = TiptapMention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      entity: {
        default: MentionEntities.Member,
        parseHTML: (element) => element.getAttribute('data-entity'),
        renderHTML: (attributes) => ({ 'data-entity': attributes.entity }),
      },
    }
  },

  markdownTokenizer: {
    name: 'mention',
    level: 'inline',
    start: (src: string) => src.indexOf('[@'),
    tokenize(src: string) {
      const match = MENTION_MD_REGEX.exec(src)
      if (!match) return undefined
      return {
        type: 'mention',
        raw: match[0],
        label: match[1],
        entity: match[2],
        id: match[3],
      }
    },
  },

  parseMarkdown(token, helpers) {
    return helpers.createNode('mention', {
      id: token.id,
      label: token.label,
      entity: token.entity,
    })
  },

  renderMarkdown(node) {
    const { id, label, entity } = node.attrs ?? {}
    return `[@${label ?? id}](rolebase://${entity ?? MentionEntities.Member}/${id})`
  },
})
