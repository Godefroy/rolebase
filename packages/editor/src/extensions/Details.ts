import {
  Details as TiptapDetails,
  DetailsContent,
  DetailsSummary,
} from '@tiptap/extension-details'

// Markdown syntax:
// <details open>
// <summary>Title</summary>
//
// Content
//
// </details>
const DETAILS_MD_REGEX =
  /^<details( open)?>\s*\n<summary>([^\n]*)<\/summary>\s*\n([\s\S]*?)\n<\/details>(?:\n+|$)/

export const Details = TiptapDetails.extend({
  markdownTokenizer: {
    name: 'details',
    level: 'block',
    start: (src: string) => src.indexOf('<details'),
    tokenize(src: string, tokens, lexer) {
      const match = DETAILS_MD_REGEX.exec(src)
      if (!match) return undefined
      return {
        type: 'details',
        raw: match[0],
        open: !!match[1],
        summary: match[2],
        tokens: lexer.blockTokens(match[3].trim()),
      }
    },
  },

  parseMarkdown(token, helpers) {
    const summaryContent = helpers.tokenizeInline
      ? helpers.parseInline(helpers.tokenizeInline(token.summary ?? ''))
      : [helpers.createTextNode(token.summary ?? '')]
    return helpers.createNode('details', { open: token.open ?? false }, [
      helpers.createNode('detailsSummary', {}, summaryContent),
      helpers.createNode(
        'detailsContent',
        {},
        helpers.parseChildren(token.tokens ?? [])
      ),
    ])
  },

  renderMarkdown(node, helpers) {
    const summaryNode = node.content?.find(
      (child) => child.type === 'detailsSummary'
    )
    const contentNode = node.content?.find(
      (child) => child.type === 'detailsContent'
    )
    const summary = summaryNode?.content
      ? helpers.renderChildren(summaryNode.content)
      : ''
    const content = contentNode?.content
      ? helpers.renderChildren(contentNode.content, '\n\n')
      : ''
    return `<details${node.attrs?.open ? ' open' : ''}>\n<summary>${summary}</summary>\n\n${content}\n\n</details>`
  },
})

export { DetailsContent, DetailsSummary }
