import { useContext } from 'react'
import { ItemCardContext } from '../contexts/ItemCardContext'
import { getItemCardProps, ItemCardOptions } from '../utils/itemCardProps'

// Item card props, with the style set by the closest ItemCardContext
export default function useItemCardProps(options: ItemCardOptions = {}) {
  const { bordered } = useContext(ItemCardContext)
  return getItemCardProps({ bordered, ...options })
}
