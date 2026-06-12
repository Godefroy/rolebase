import { describe, expect, it } from 'vitest'
import { isEmptyMarkdown } from './markdown/isEmptyMarkdown'
import { jsonToMd, mdToJson } from './markdown/manager'
import { mdToHtml } from './markdown/mdToHtml'
import { mdToText } from './markdown/mdToText'

// Serialize(parse(md)) must be a fixed point: applying it twice
// gives the same result, so saves are stable.
function roundtrip(markdown: string): string {
  return jsonToMd(mdToJson(markdown))
}

function expectStable(markdown: string) {
  const once = roundtrip(markdown)
  expect(roundtrip(once)).toBe(once)
  return once
}

// Find all nodes of a type in a JSON document
function findNodes(json: any, type: string): any[] {
  const result: any[] = []
  const walk = (node: any) => {
    if (node.type === type) result.push(node)
    node.content?.forEach(walk)
  }
  walk(json)
  return result
}

describe('mdToJson / jsonToMd', () => {
  it('round-trips basic markdown', () => {
    const md = '# Title\n\nHello **bold** *italic* ~~strike~~ `code`'
    expect(expectStable(md)).toBe(md)
  })

  it('round-trips lists and checklists', () => {
    const md = '- one\n- two\n\n1. first\n\n- [x] done\n- [ ] todo'
    const result = expectStable(md)
    expect(result).toContain('- one')
    expect(result).toContain('1. first')
    expect(result).toContain('- [x] done')
    expect(result).toContain('- [ ] todo')
  })

  it('round-trips quotes and code blocks', () => {
    const md = '> quoted\n\n```js\nconst a = 1\n```'
    expect(expectStable(md)).toBe(md)
  })

  it('round-trips links', () => {
    const md = 'See [a link](https://example.com)'
    expect(expectStable(md)).toBe(md)
  })

  it('round-trips images', () => {
    const md = '![My image](https://example.com/img.png)'
    expect(expectStable(md)).toBe(md)
  })

  it('parses and serializes mentions losslessly', () => {
    const md =
      'Hey [@Jane Doe](rolebase://member/b1f1e1a0-0000-0000-0000-000000000000) !'
    const json = mdToJson(md)
    const mentions = findNodes(json, 'mention')
    expect(mentions).toHaveLength(1)
    expect(mentions[0].attrs).toMatchObject({
      id: 'b1f1e1a0-0000-0000-0000-000000000000',
      label: 'Jane Doe',
      entity: 'member',
    })
    expect(expectStable(md)).toBe(md)
  })

  it('parses and serializes files losslessly', () => {
    const md =
      '[report.pdf](https://example.com/report.pdf "file:application/pdf:12345")'
    const json = mdToJson(md)
    const files = findNodes(json, 'file')
    expect(files).toHaveLength(1)
    expect(files[0].attrs).toMatchObject({
      url: 'https://example.com/report.pdf',
      name: 'report.pdf',
      size: 12345,
      mime: 'application/pdf',
    })
    expect(expectStable(md)).toBe(md)
  })

  it('parses bare YouTube URLs as embeds', () => {
    const md = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const json = mdToJson(md)
    const videos = findNodes(json, 'youtube')
    expect(videos).toHaveLength(1)
    expect(videos[0].attrs.src).toBe(md)
    expect(expectStable(md)).toBe(md)
  })

  it('keeps inline YouTube links as links', () => {
    const md =
      'Watch [this](https://www.youtube.com/watch?v=dQw4w9WgXcQ) please'
    const json = mdToJson(md)
    expect(findNodes(json, 'youtube')).toHaveLength(0)
  })

  it('parses and serializes collapsible sections', () => {
    const md =
      '<details open>\n<summary>More info</summary>\n\nHidden content\n\n- hidden item\n\n</details>'
    const json = mdToJson(md)
    const details = findNodes(json, 'details')
    expect(details).toHaveLength(1)
    expect(details[0].attrs.open).toBe(true)
    const summary = findNodes(json, 'detailsSummary')
    expect(summary).toHaveLength(1)
    const content = findNodes(json, 'detailsContent')
    expect(content).toHaveLength(1)
    expect(findNodes(content[0], 'listItem')).toHaveLength(1)
    expect(expectStable(md)).toBe(md)
  })

  it('round-trips tables with header row', () => {
    const md = '| Name | Age |\n| --- | --- |\n| Jane | 30 |'
    const json = mdToJson(md)
    expect(findNodes(json, 'table')).toHaveLength(1)
    expect(findNodes(json, 'tableHeader')).toHaveLength(2)
    expect(findNodes(json, 'tableCell')).toHaveLength(2)
    expectStable(md)
  })

  it('round-trips horizontal rules', () => {
    const result = expectStable('above\n\n***\n\nbelow')
    expect(findNodes(mdToJson(result), 'horizontalRule')).toHaveLength(1)
  })

  it('round-trips a kitchen-sink document', () => {
    const md = [
      '# Title',
      '',
      'Hello **bold** with [@Jane](rolebase://member/abc-123) and [a link](https://example.com)',
      '',
      '- [ ] todo item',
      '',
      '<details>',
      '<summary>Collapsed</summary>',
      '',
      'Inner paragraph',
      '',
      '</details>',
      '',
      '[doc.pdf](https://example.com/doc.pdf "file:application/pdf:42")',
    ].join('\n')
    const result = expectStable(md)
    const json = mdToJson(result)
    expect(findNodes(json, 'mention')).toHaveLength(1)
    expect(findNodes(json, 'file')).toHaveLength(1)
    expect(findNodes(json, 'details')).toHaveLength(1)
    expect(findNodes(json, 'taskItem')).toHaveLength(1)
  })
})

describe('mdToText', () => {
  it('extracts plain text from markdown', () => {
    expect(mdToText('# Title\n\nHello **bold**')).toBe('Title\nHello bold')
  })

  it('renders mentions and files as text', () => {
    expect(
      mdToText(
        'Hey [@Jane Doe](rolebase://member/abc) !\n\n[doc.pdf](https://x.co/doc.pdf "file:application/pdf:42")'
      )
    ).toBe('Hey @Jane Doe !\ndoc.pdf')
  })

  it('returns empty string for empty markdown', () => {
    expect(mdToText('')).toBe('')
  })
})

describe('mdToHtml', () => {
  it('renders markdown to HTML', () => {
    const html = mdToHtml('# Title\n\nHello **bold**')
    expect(html).toContain('<h1>Title</h1>')
    expect(html).toContain('<strong>bold</strong>')
  })

  it('renders mentions and files', () => {
    const html = mdToHtml(
      'Hey [@Jane](rolebase://member/abc) - [doc.pdf](https://x.co/doc.pdf "file:application/pdf:42")'
    )
    expect(html).toContain('Jane')
    expect(html).toContain('doc.pdf')
  })
})

describe('isEmptyMarkdown', () => {
  it('detects empty values', () => {
    expect(isEmptyMarkdown('')).toBe(true)
    expect(isEmptyMarkdown(undefined)).toBe(true)
    expect(isEmptyMarkdown(null)).toBe(true)
    expect(isEmptyMarkdown('  \n\n  ')).toBe(true)
    expect(isEmptyMarkdown('&nbsp;')).toBe(true)
    expect(isEmptyMarkdown('Hello')).toBe(false)
  })
})
