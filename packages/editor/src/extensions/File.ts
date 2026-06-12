import { Node } from '@tiptap/core'

export interface FileAttributes {
  url: string
  name: string
  size: number
  mime: string
}

// Markdown syntax: [name](url "file:mime:size")
const FILE_MD_REGEX = /^\[([^\]]+)\]\(([^\s)]+) "file:([^:"]*):(\d+)"\)/

export const File = Node.create({
  name: 'file',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      url: { default: '' },
      name: { default: '' },
      size: { default: 0 },
      mime: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-file-name]',
        getAttrs: (element) => ({
          url: element.getAttribute('href') ?? '',
          name: element.getAttribute('data-file-name') ?? '',
          size: parseInt(element.getAttribute('data-file-size') ?? '0', 10),
          mime: element.getAttribute('data-file-mime') ?? '',
        }),
      },
    ]
  },

  renderHTML({ node }) {
    const { url, name, size, mime } = node.attrs
    return [
      'a',
      {
        href: url,
        'data-file-name': name,
        'data-file-size': size,
        'data-file-mime': mime,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      name,
    ]
  },

  renderText({ node }) {
    return node.attrs.name
  },

  markdownTokenizer: {
    name: 'file',
    level: 'inline',
    start: (src: string) => src.indexOf('['),
    tokenize(src: string) {
      const match = FILE_MD_REGEX.exec(src)
      if (!match) return undefined
      return {
        type: 'file',
        raw: match[0],
        name: match[1],
        url: match[2],
        mime: match[3],
        size: parseInt(match[4], 10),
      }
    },
  },

  parseMarkdown(token, helpers) {
    return helpers.createNode('file', {
      url: token.url,
      name: token.name,
      size: token.size,
      mime: token.mime,
    })
  },

  renderMarkdown(node) {
    const { url, name, size, mime } = node.attrs ?? {}
    return `[${name}](${url} "file:${mime}:${size}")`
  },
})
