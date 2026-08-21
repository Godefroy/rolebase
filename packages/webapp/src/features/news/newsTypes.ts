import { SearchTypes } from '@rolebase/shared/model/search'

// News types are a subset of search types, so that the news feed can reuse
// the search type filter (SearchTypeMenu)
export const newsTypes = [
  SearchTypes.Thread,
  SearchTypes.Meeting,
  SearchTypes.Decision,
] as const

export type NewsType = (typeof newsTypes)[number]

// Column of the news view holding the id of each type
export const newsTypeColumns = {
  [SearchTypes.Thread]: 'threadId',
  [SearchTypes.Meeting]: 'meetingId',
  [SearchTypes.Decision]: 'decisionId',
} as const
