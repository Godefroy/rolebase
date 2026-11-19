import { describe, expect, it } from 'vitest'
import { Doc } from 'yjs'
import { jsonToMd, mdToJson } from '../markdown/manager'
import { getYDocMarkdown, setYDocMarkdown } from './yDoc'

function throughYDoc(markdown: string): string {
  const doc = new Doc()
  setYDocMarkdown(doc, markdown)
  return getYDocMarkdown(doc)
}

describe('setYDocMarkdown / getYDocMarkdown', () => {
  it('gives the same markdown as the editor serialization', () => {
    const md = [
      '# Title',
      'Hello **bold** [@Alice](rolebase://member/0b6f3c2e-1d4a-4b8e-9f2a-3c5d7e9f1a2b)',
      '- [x] done\n- [ ] todo',
      '| a | b |\n| --- | --- |\n| 1 | 2 |',
      '[doc.pdf](https://example.com/doc.pdf "file:application/pdf:1234")',
      '<details>\n<summary>More</summary>\n\nHidden\n\n</details>',
      '```js\nconst a = 1\n```',
    ].join('\n\n')
    expect(throughYDoc(md)).toBe(jsonToMd(mdToJson(md)))
  })

  it('returns an empty string for an empty document', () => {
    expect(throughYDoc('')).toBe('')
    expect(getYDocMarkdown(new Doc())).toBe('')
  })
})
