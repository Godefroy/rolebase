import { createContext } from 'react'

export interface ItemCardContextValue {
  // Cards get a border in addition to their shadow
  bordered?: boolean
}

// Style of the item cards (task, thread, meeting, decision) in a part of the app
export const ItemCardContext = createContext<ItemCardContextValue>({})
