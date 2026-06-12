import { describe, expect, it } from 'vitest'
import { searchEmojis } from './emojiList'

describe('searchEmojis', () => {
  it('ranks exact id matches first', () => {
    const results = searchEmojis('fire')
    expect(results[0].id).toBe('fire')
  })

  it('ranks id prefix matches before keyword matches', () => {
    const results = searchEmojis('hear')
    const ids = results.map((item) => item.id)
    // All id matches (heart, hear_no_evil…) must come before
    // emojis that only match through their keywords
    const firstKeywordOnly = ids.findIndex((id) => !id.includes('hear'))
    const lastIdMatch = ids.reduce(
      (last, id, index) => (id.startsWith('hear') ? index : last),
      -1
    )
    expect(lastIdMatch).toBeGreaterThanOrEqual(0)
    if (firstKeywordOnly !== -1) {
      expect(lastIdMatch).toBeLessThan(firstKeywordOnly)
    }
  })

  it('returns empty array when nothing matches', () => {
    expect(searchEmojis('zzzzzzzz')).toEqual([])
  })

  it('limits the number of results', () => {
    expect(searchEmojis('a', 5)).toHaveLength(5)
  })
})
