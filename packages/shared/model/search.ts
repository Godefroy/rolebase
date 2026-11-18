// Objects stored in Algolia

/* 
Date needs to be Unix timestamp for Algolia search to be able to filter/sort
https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/in-depth/what-is-in-a-record/#dates 
*/

export interface SearchDoc {
  objectID: string // Mandatory Algolia field
  boost: number
  orgId: string
  type: SearchTypes
  title: string
  description: string
}

export enum SearchTypes {
  CreateAction = 'CreateAction',
  PickCircle = 'PickCircle',
  Member = 'Member',
  Role = 'Role',
  Circle = 'Circle',
  Thread = 'Thread',
  Meeting = 'Meeting',
  Task = 'Task',
  Decision = 'Decision',
}

export interface AlgoliaConfig {
  appId: string
  apiKey: string
  indexName: string
  validUntil: number // Unix timestamp (seconds) when apiKey expires
}
