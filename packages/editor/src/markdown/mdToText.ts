import { JSONContent } from '@tiptap/core'
import { mdToJson } from './manager'

const inlineTypes = ['text', 'mention', 'file', 'hardBreak']

function isInline(node: JSONContent): boolean {
  return inlineTypes.includes(node.type ?? '')
}

function nodeToText(node: JSONContent): string {
  switch (node.type) {
    case 'text':
      return node.text ?? ''
    case 'mention':
      return `@${node.attrs?.label ?? node.attrs?.id ?? ''}`
    case 'file':
      return node.attrs?.name ?? ''
    case 'youtube':
      return node.attrs?.src ?? ''
    case 'hardBreak':
      return '\n'
  }

  if (!node.content) return ''

  // Join inline children without separator, block children with newlines
  const separator = node.content.some(isInline) ? '' : '\n'
  return node.content
    .map(nodeToText)
    .filter((text) => text !== '')
    .join(separator)
}

// Extract plain text from a markdown string (for search indexing, AI, etc.)
export function mdToText(markdown: string): string {
  if (!markdown) return ''
  try {
    return nodeToText(mdToJson(markdown))
  } catch (error) {
    return markdown
  }
}
