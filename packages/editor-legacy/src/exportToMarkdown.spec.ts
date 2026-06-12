import { $createCodeNode } from '@lexical/code'
import { $createHashtagNode } from '@lexical/hashtag'
import { createHeadlessEditor } from '@lexical/headless'
import { $createLinkNode } from '@lexical/link'
import { $createListItemNode, $createListNode } from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  TableCellHeaderStates,
} from '@lexical/table'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  LexicalEditor,
} from 'lexical'
import { describe, expect, it } from 'vitest'
import { exportToMarkdown } from './exportToMarkdown'
import nodes from './nodes'
import { $createCollapsibleContainerNode } from './nodes/CollapsibleContainerNode'
import { $createCollapsibleContentNode } from './nodes/CollapsibleContentNode'
import { $createCollapsibleTitleNode } from './nodes/CollapsibleTitleNode'
import { $createFigmaNode } from './nodes/FigmaNode'
import { $createFileNode } from './nodes/FileNode'
import { $createHorizontalRuleNode } from './nodes/HorizontalRuleNode'
import { $createImageNode } from './nodes/ImageNode'
import { $createKeywordNode } from './nodes/KeywordNode'
import { $createMentionNode, MentionEntities } from './nodes/MentionNode'
import { $createTweetNode } from './nodes/TweetNode'
import { $createYouTubeNode } from './nodes/YouTubeNode'

// Builds a serialized Lexical editor state (same JSON as stored in DB)
function buildState(builder: (editor: LexicalEditor) => void): string {
  const editor = createHeadlessEditor({
    nodes: [...nodes],
    onError: (error) => {
      throw error
    },
  })
  editor.update(() => builder(editor), { discrete: true })
  return JSON.stringify(editor.getEditorState().toJSON())
}

function $paragraph(text: string) {
  const paragraph = $createParagraphNode()
  paragraph.append($createTextNode(text))
  return paragraph
}

describe('exportToMarkdown', () => {
  it('returns markdown values untouched', () => {
    expect(exportToMarkdown('Hello **world**')).toBe('Hello **world**')
    expect(exportToMarkdown('')).toBe('')
  })

  it('returns invalid JSON untouched', () => {
    expect(exportToMarkdown('{invalid')).toBe('{invalid')
  })

  it('exports empty documents as empty string', () => {
    expect(
      exportToMarkdown(
        '{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}'
      )
    ).toBe('')
  })

  it('exports paragraphs and text formats', () => {
    const state = buildState(() => {
      const paragraph = $createParagraphNode()
      paragraph.append(
        $createTextNode('Hello '),
        $createTextNode('bold').setFormat('bold'),
        $createTextNode(' '),
        $createTextNode('italic').setFormat('italic'),
        $createTextNode(' '),
        $createTextNode('strike').setFormat('strikethrough'),
        $createTextNode(' '),
        $createTextNode('code').setFormat('code')
      )
      $getRoot().append(paragraph, $paragraph('Second paragraph'))
    })
    expect(exportToMarkdown(state)).toBe(
      'Hello **bold** *italic* ~~strike~~ `code`\n\nSecond paragraph'
    )
  })

  it('exports headings', () => {
    const state = buildState(() => {
      const h1 = $createHeadingNode('h1')
      h1.append($createTextNode('Title'))
      const h2 = $createHeadingNode('h2')
      h2.append($createTextNode('Subtitle'))
      $getRoot().append(h1, h2)
    })
    expect(exportToMarkdown(state)).toBe('# Title\n\n## Subtitle')
  })

  it('exports bullet, numbered and check lists', () => {
    const state = buildState(() => {
      const bullets = $createListNode('bullet')
      const item1 = $createListItemNode()
      item1.append($createTextNode('one'))
      const item2 = $createListItemNode()
      item2.append($createTextNode('two'))
      bullets.append(item1, item2)

      const numbers = $createListNode('number')
      const item3 = $createListItemNode()
      item3.append($createTextNode('first'))
      numbers.append(item3)

      const checks = $createListNode('check')
      const item4 = $createListItemNode(true)
      item4.append($createTextNode('done'))
      const item5 = $createListItemNode(false)
      item5.append($createTextNode('todo'))
      checks.append(item4, item5)

      $getRoot().append(bullets, numbers, checks)
    })
    expect(exportToMarkdown(state)).toBe(
      '- one\n- two\n\n1. first\n\n- [x] done\n- [ ] todo'
    )
  })

  it('exports quotes and code blocks', () => {
    const state = buildState(() => {
      const quote = $createQuoteNode()
      quote.append($createTextNode('quoted'))
      const code = $createCodeNode('js')
      code.append($createTextNode('const a = 1'))
      $getRoot().append(quote, code)
    })
    expect(exportToMarkdown(state)).toBe('> quoted\n\n```js\nconst a = 1\n```')
  })

  it('exports links', () => {
    const state = buildState(() => {
      const paragraph = $createParagraphNode()
      const link = $createLinkNode('https://example.com')
      link.append($createTextNode('a link'))
      paragraph.append($createTextNode('See '), link)
      $getRoot().append(paragraph)
    })
    expect(exportToMarkdown(state)).toBe('See [a link](https://example.com)')
  })

  it('exports horizontal rules', () => {
    const state = buildState(() => {
      $getRoot().append(
        $paragraph('above'),
        $createHorizontalRuleNode(),
        $paragraph('below')
      )
    })
    expect(exportToMarkdown(state)).toBe('above\n\n***\n\nbelow')
  })

  it('exports images', () => {
    const state = buildState(() => {
      const paragraph = $createParagraphNode()
      paragraph.append(
        $createImageNode({ src: 'https://example.com/img.png', alt: 'My image' })
      )
      $getRoot().append(paragraph)
    })
    expect(exportToMarkdown(state)).toBe('![My image](https://example.com/img.png)')
  })

  it('exports mentions', () => {
    const state = buildState(() => {
      const paragraph = $createParagraphNode()
      paragraph.append(
        $createTextNode('Hey '),
        $createMentionNode(
          MentionEntities.Member,
          'b1f1e1a0-0000-0000-0000-000000000000',
          'Jane Doe'
        ),
        $createTextNode(' !')
      )
      $getRoot().append(paragraph)
    })
    expect(exportToMarkdown(state)).toBe(
      'Hey [@Jane Doe](rolebase://member/b1f1e1a0-0000-0000-0000-000000000000) !'
    )
  })

  it('exports files', () => {
    const state = buildState(() => {
      const paragraph = $createParagraphNode()
      paragraph.append(
        $createFileNode({
          url: 'https://example.com/report.pdf',
          name: 'report.pdf',
          size: 12345,
          mime: 'application/pdf',
        })
      )
      $getRoot().append(paragraph)
    })
    expect(exportToMarkdown(state)).toBe(
      '[report.pdf](https://example.com/report.pdf "file:application/pdf:12345")'
    )
  })

  it('exports files and images inserted at root level', () => {
    const state = buildState(() => {
      $getRoot().append(
        $createFileNode({
          url: 'https://example.com/report.pdf',
          name: 'report.pdf',
          size: 12345,
          mime: 'application/pdf',
        }) as any,
        $createImageNode({
          src: 'https://example.com/img.png',
          alt: 'My image',
        }) as any
      )
    })
    expect(exportToMarkdown(state)).toBe(
      '[report.pdf](https://example.com/report.pdf "file:application/pdf:12345")\n\n![My image](https://example.com/img.png)'
    )
  })

  it('exports table cells containing multiple paragraphs on a single line', () => {
    const state = buildState(() => {
      const table = $createTableNode()
      const row = $createTableRowNode()
      const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS)
      cell.append($paragraph('blop'), $paragraph('sdfsdf'))
      const cell2 = $createTableCellNode(TableCellHeaderStates.NO_STATUS)
      cell2.append($paragraph('simple'))
      row.append(cell, cell2)
      table.append(row)
      $getRoot().append(table)
    })
    expect(exportToMarkdown(state)).toBe('| blop sdfsdf | simple |')
  })

  it('exports YouTube, Figma and Tweet embeds as URLs', () => {
    const state = buildState(() => {
      $getRoot().append(
        $createYouTubeNode('dQw4w9WgXcQ'),
        $createFigmaNode('aBcDeF123'),
        $createTweetNode('1234567890')
      )
    })
    expect(exportToMarkdown(state)).toBe(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ\n\n' +
        'https://www.figma.com/file/aBcDeF123\n\n' +
        'https://twitter.com/i/status/1234567890'
    )
  })

  it('exports collapsible sections as <details>', () => {
    const state = buildState(() => {
      const container = $createCollapsibleContainerNode(true)
      const title = $createCollapsibleTitleNode()
      title.append($createTextNode('More info'))
      const content = $createCollapsibleContentNode()
      content.append($paragraph('Hidden content'))
      const list = $createListNode('bullet')
      const item = $createListItemNode()
      item.append($createTextNode('hidden item'))
      list.append(item)
      content.append(list)
      container.append(title, content)
      $getRoot().append(container)
    })
    expect(exportToMarkdown(state)).toBe(
      '<details open>\n<summary>More info</summary>\n\nHidden content\n\n- hidden item\n\n</details>'
    )
  })

  it('exports tables with header row', () => {
    const state = buildState(() => {
      const table = $createTableNode()
      const headerRow = $createTableRowNode()
      for (const text of ['Name', 'Age']) {
        const cell = $createTableCellNode(TableCellHeaderStates.ROW)
        cell.append($paragraph(text))
        headerRow.append(cell)
      }
      const row = $createTableRowNode()
      for (const text of ['Jane', '30']) {
        const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS)
        cell.append($paragraph(text))
        row.append(cell)
      }
      table.append(headerRow, row)
      $getRoot().append(table)
    })
    expect(exportToMarkdown(state)).toBe(
      '| Name | Age |\n| --- | --- |\n| Jane | 30 |'
    )
  })

  it('exports keywords and hashtags as plain text', () => {
    const state = buildState(() => {
      const paragraph = $createParagraphNode()
      paragraph.append(
        $createKeywordNode('congrats'),
        $createTextNode(' '),
        $createHashtagNode('#topic')
      )
      $getRoot().append(paragraph)
    })
    expect(exportToMarkdown(state)).toBe('congrats #topic')
  })
})
