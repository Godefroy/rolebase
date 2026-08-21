import { SearchTypes } from '@rolebase/shared/model/search'

export type SearchItem = {
  id: string
  type: SearchTypes
  text: string
  title: string
  circleId?: string
  picture?: string
  date?: string
}

// Search types that can be used as a filter (they have an icon and a label)
export type SearchFilterType =
  | SearchTypes.Member
  | SearchTypes.Circle
  | SearchTypes.Thread
  | SearchTypes.Meeting
  | SearchTypes.Task
  | SearchTypes.Decision
